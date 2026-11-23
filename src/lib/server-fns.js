import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { z } from "zod";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
// Dynamic free router: OpenRouter picks whichever free model is available.
const MODEL = "openrouter/free";
const MAX_RETRIES = 2;
const MAX_WAIT_SECONDS = 8;

const inputSchema = z.object({
  email: z.string().trim().min(1).max(8000),
  instructions: z.string().trim().min(1).max(2000),
  tone: z.enum(["professional", "friendly", "casual", "formal"]),
  length: z.enum(["short", "medium", "detailed"]),
  language: z.enum(["english", "indonesian"]),
});

const TONE_GUIDE = {
  professional: "Polished and businesslike: courteous, direct, no slang.",
  friendly: "Warm and personable, like writing to someone you like working with.",
  casual: "Relaxed and conversational, short sentences, everyday words.",
  formal: "Formal and respectful: complete sentences, no contractions, no small talk.",
};

const LENGTH_GUIDE = {
  // Generous budgets: free routers often pick reasoning models whose hidden
  // tokens count against max_tokens and would otherwise leave an empty reply.
  short: { words: "50-80 words", tokens: 1200 },
  medium: { words: "110-160 words", tokens: 1600 },
  detailed: { words: "200-280 words", tokens: 2400 },
};

const LANGUAGE_GUIDE = {
  english: "English",
  indonesian: "Bahasa Indonesia (natural Indonesian, not a translation)",
};

const SYSTEM_PROMPT = `You are ReplyGen, an assistant that writes email replies for freelancers and small business owners.

Write the reply the user would send. Rules:
- Output only the email body. No subject line, no commentary, no markdown, no surrounding quotation marks.
- Answer what the sender actually asked, in the order that makes sense for them.
- Sound like a competent person writing quickly: plain, natural sentences, no corporate filler, no "I hope this email finds you well", no emoji unless the original email uses them.
- Never invent facts the user did not give you: prices, dates, names, links, attachments or promises. If a detail is missing, write around it naturally instead of leaving placeholders like [date].
- Use a greeting and a sign-off that fit the tone. Address the sender by their first name when it appears in the original email.
- Match the requested tone, length and language exactly.`;

function buildPrompt({ email, instructions, tone, length, language }) {
  return `${SYSTEM_PROMPT}

<original_email>
${email}
</original_email>

What I want to say: ${instructions}
Tone: ${TONE_GUIDE[tone]}
Length: ${LENGTH_GUIDE[length].words}
Language: ${LANGUAGE_GUIDE[language]}

Write my reply now.`;
}

function extractText(payload) {
  const content = payload?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === "string" ? part : part?.text || ""))
      .join("")
      .trim();
  }
  return "";
}

function providerDetail(payload) {
  const meta = payload?.error?.metadata || {};
  const provider = meta.provider_name || payload?.provider || "";
  const raw = typeof meta.raw === "string" ? meta.raw.slice(0, 160) : "";
  return [provider, raw].filter(Boolean).join(" — ");
}

function friendlyError(status, payload, retryAfter) {
  const apiMessage = payload?.error?.message || "";
  const detail = providerDetail(payload);

  if (status === 401 || status === 403) {
    return "OpenRouter rejected the API key. Replace the OPENROUTER_API_KEY Worker secret and try again.";
  }
  if (status === 402) {
    return "OpenRouter is asking for paid credits for this request. ReplyGen only uses free models, so nothing was charged — try again in a few minutes.";
  }
  if (status === 429) {
    const wait = retryAfter > 0 ? ` Try again in about ${retryAfter}s.` : " Try again in a minute.";
    return `Every free provider is busy right now (HTTP 429 rate limit).${wait}${
      detail ? ` Provider detail: ${detail}.` : ""
    }`;
  }
  if (status === 404) {
    return "No free model is available through the router right now. Please try again shortly.";
  }
  if (status >= 500) {
    return "OpenRouter is temporarily unavailable. Please try again in a moment.";
  }
  if (apiMessage) {
    return `OpenRouter rejected the request: ${apiMessage}`;
  }
  return "The reply couldn't be written. Please try again.";
}

export const generateEmailReply = createServerFn({ method: "POST" })
  .validator((data) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return {
        ok: false,
        error:
          "The OpenRouter API key isn't set yet. Add OPENROUTER_API_KEY as a Worker secret to start generating replies.",
      };
    }

    const prompt = buildPrompt(data);

    const send = (maxTokens) =>
      fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${apiKey}`,
          "X-Title": "ReplyGen AI",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: maxTokens,
          temperature: 0.7,
          messages: [{ role: "user", content: prompt }],
        }),
      });

    try {
      let maxTokens = LENGTH_GUIDE[data.length].tokens;
      let response = await send(maxTokens);
      let payload = await response.json().catch(() => null);
      let retryAfter = Number(response.headers.get("retry-after")) || 0;
      let attempt = 0;
      let reply = "";

      // At most one retry: on a 429 with a short Retry-After, or when the router
      // returned an empty body and should pick another free model. Never a loop.
      while (true) {
        if (response.ok) {
          reply = extractText(payload);
          if (reply) break;
        } else if (response.status !== 429 || retryAfter > MAX_WAIT_SECONDS) {
          break;
        }

        if (attempt >= MAX_RETRIES) break;

        const waitMs = response.ok ? 0 : retryAfter > 0 ? retryAfter * 1000 : 2000;
        if (waitMs) await new Promise((resolve) => setTimeout(resolve, waitMs));
        attempt += 1;
        // An empty 200 that stopped on the token limit means a reasoning model
        // spent the whole budget thinking, so give the retry twice the room.
        if (response.ok && payload?.choices?.[0]?.finish_reason === "length") maxTokens *= 2;
        response = await send(maxTokens);
        payload = await response.json().catch(() => null);
        retryAfter = Number(response.headers.get("retry-after")) || 0;
      }

      const usedModel = payload?.model || "";

      if (!response.ok) {
        console.log("[replygen] openrouter failure", {
          status: response.status,
          model: usedModel || MODEL,
          error: payload?.error?.message || null,
          detail: providerDetail(payload) || null,
          retryAfter: retryAfter || null,
          attempts: attempt + 1,
        });
        return { ok: false, error: friendlyError(response.status, payload, retryAfter) };
      }

      if (!reply) {
        console.log("[replygen] openrouter empty reply", {
          status: response.status,
          model: usedModel || MODEL,
          finishReason: payload?.choices?.[0]?.finish_reason || null,
          attempts: attempt + 1,
        });
        return {
          ok: false,
          error:
            "The free models returned nothing usable this time. Press Generate again — the router picks a different model on each try.",
        };
      }

      console.log("[replygen] openrouter success", {
        status: response.status,
        model: usedModel || MODEL,
        chars: reply.length,
      });

      return { ok: true, reply, model: usedModel || MODEL };
    } catch (err) {
      console.log("[replygen] openrouter request error", { message: err?.message || "unknown" });
      return {
        ok: false,
        error: "Couldn't reach OpenRouter. Check the connection and try again.",
        detail: err?.message,
      };
    }
  });

export const getReplyStatus = createServerFn({ method: "GET" }).handler(async () => {
  return { configured: Boolean(env.OPENROUTER_API_KEY) };
});
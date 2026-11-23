import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { generateEmailReply, getReplyStatus } from "@/lib/server-fns";
import TopBar from "@/components/TopBar";
import InputStudio from "@/components/InputStudio";
import OutputStage from "@/components/OutputStage";
import MobileReplySheet from "@/components/MobileReplySheet";
import GenerateButton from "@/components/GenerateButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { countWords } from "@/lib/text";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReplyGen AI — Email replies written in seconds" },
      {
        name: "description",
        content:
          "Paste an email, say what you want to say, and get a ready-to-send reply in your tone, length and language.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const isMobile = useIsMobile();
  const [email, setEmail] = useState("");
  const [instructions, setInstructions] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [language, setLanguage] = useState("english");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [status, setStatus] = useState(undefined);
  const [model, setModel] = useState("");

  const generate = useServerFn(generateEmailReply);
  const checkStatus = useServerFn(getReplyStatus);

  const canGenerate = email.trim().length > 0 && instructions.trim().length > 0;

  useEffect(() => {
    checkStatus()
      .then((result) => setStatus(result?.configured ? "ready" : "missing"))
      .catch(() => setStatus(undefined));
  }, []);

  async function handleGenerate() {
    if (!canGenerate || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await generate({ data: { email, instructions, tone, length, language } });
      if (result?.ok) {
        setReply(result.reply);
        setModel(result.model || "");
        if (isMobile) setSheetOpen(true);
      } else {
        setError(result?.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError(err?.message || "Couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#09090B]">
      <TopBar status={status} model={model} />

      <main className="mx-auto flex w-full max-w-[1440px] flex-col px-4 pb-28 pt-6 sm:px-6 lg:h-[calc(100vh-3.5rem)] lg:pb-6 lg:pt-7">
        <div className="mb-5 lg:mb-6">
          <h1 className="font-display text-[26px] font-bold leading-[1.15] tracking-tight text-[#09090B] sm:text-[32px]">
            Write the reply you&rsquo;d actually send.
          </h1>
          <p className="mt-1.5 max-w-xl text-[13.5px] leading-6 text-[#71717A]">
            Paste the email, describe what you want to say, and the model drafts it in your tone. You
            edit it, then send it yourself.
          </p>
        </div>

        <div className="grid flex-1 gap-6 lg:min-h-0 lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)]">
          <InputStudio
            email={email}
            setEmail={setEmail}
            instructions={instructions}
            setInstructions={setInstructions}
            tone={tone}
            setTone={setTone}
            length={length}
            setLength={setLength}
            language={language}
            setLanguage={setLanguage}
            onGenerate={handleGenerate}
            loading={loading}
            error={error}
          />
          <div className="hidden lg:block lg:min-h-0">
            <OutputStage
              reply={reply}
              setReply={setReply}
              loading={loading}
              onRegenerate={handleGenerate}
            />
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E4E4E7] bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        {reply && !sheetOpen && (
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="mb-2 flex min-h-[40px] w-full items-center justify-center gap-2 rounded-[10px] border border-[#E4E4E7] bg-white text-[13px] font-medium text-[#3F3F46]"
          >
            View reply · {countWords(reply)} words
          </button>
        )}
        <GenerateButton onClick={handleGenerate} loading={loading} disabled={!canGenerate} />
      </div>

      {isMobile && (
        <MobileReplySheet
          open={sheetOpen && !!reply}
          onOpenChange={setSheetOpen}
          reply={reply}
          setReply={setReply}
          loading={loading}
          onRegenerate={handleGenerate}
        />
      )}
    </div>
  );
}
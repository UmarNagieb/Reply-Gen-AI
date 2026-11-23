import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import SegmentedControl from "@/components/SegmentedControl";
import GenerateButton from "@/components/GenerateButton";

const field =
  "w-full rounded-[10px] border border-[#E4E4E7] bg-white px-3.5 py-3 text-[14px] leading-6 text-[#09090B] placeholder:text-[#A1A1AA] transition-colors hover:border-[#D4D4D8] focus:border-[#4F46E5] focus:outline-none focus:ring-4 focus:ring-[#EEF2FF]";

const label = "mb-2 block text-[13px] font-semibold text-[#09090B]";

export default function InputStudio({
  email,
  setEmail,
  instructions,
  setInstructions,
  tone,
  setTone,
  length,
  setLength,
  language,
  setLanguage,
  onGenerate,
  loading,
  error,
}) {
  const canGenerate = email.trim().length > 0 && instructions.trim().length > 0;

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (!loading) onGenerate();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onGenerate, loading]);

  return (
    <section className="flex h-full flex-col rounded-[12px] border border-[#E4E4E7] bg-white">
      <div className="flex items-center justify-between border-b border-[#E4E4E7] px-5 py-3.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#71717A]">
          Input studio
        </span>
        <span className="font-mono text-[10px] text-[#A1A1AA]">nothing is stored</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-5 sm:p-6">
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="email-input" className={label}>
              Received email
            </label>
            <span className="mb-2 font-mono text-[10px] text-[#A1A1AA]">{email.length}</span>
          </div>
          <textarea
            id="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            rows={10}
            placeholder={"Paste the email you need to answer…\n\nFrom: sarah@acme.com\nSubject: New project — website refresh\n\nHi, we found your work online and would like a quote for a 5-page site. What's your rate…"}
            className={`${field} min-h-[190px] resize-y font-body`}
          />
        </div>

        <div>
          <label htmlFor="instructions-input" className={label}>
            How should you reply?
          </label>
          <textarea
            id="instructions-input"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
            placeholder="Explain the delay, apologise briefly, promise the invoice by Friday."
            className={`${field} min-h-[84px] resize-y`}
          />
        </div>

        <div className="flex flex-col gap-4">
          <SegmentedControl
            label="Tone"
            value={tone}
            onChange={setTone}
            disabled={loading}
            options={[
              { value: "professional", label: "Professional" },
              { value: "friendly", label: "Friendly" },
              { value: "casual", label: "Casual" },
              { value: "formal", label: "Formal" },
            ]}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <SegmentedControl
              label="Length"
              value={length}
              onChange={setLength}
              disabled={loading}
              options={[
                { value: "short", label: "Short" },
                { value: "medium", label: "Medium" },
                { value: "detailed", label: "Detailed" },
              ]}
            />
            <SegmentedControl
              label="Language"
              value={language}
              onChange={setLanguage}
              disabled={loading}
              options={[
                { value: "english", label: "English" },
                { value: "indonesian", label: "Indonesian" },
              ]}
            />
          </div>
        </div>

      </div>

      {error && (
        <div className="flex shrink-0 items-start gap-2 border-t border-red-200 bg-red-50 px-5 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <p className="text-[13px] leading-5 text-red-700">{error}</p>
        </div>
      )}

      <div className="hidden shrink-0 border-t border-[#E4E4E7] p-5 sm:p-6 lg:block">
        <GenerateButton onClick={onGenerate} loading={loading} disabled={!canGenerate} />
        <p className="mt-2.5 text-center text-[11px] text-[#A1A1AA]">
          ReplyGen drafts only. You review and send it yourself.
        </p>
      </div>
    </section>
  );
}
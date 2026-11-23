const steps = [
  "Paste the email you received",
  "Say how you want to answer",
  "Pick tone, length and language",
];

export default function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-full max-w-[290px] rounded-[10px] border border-[#E4E4E7] bg-[#FAFAFC] p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-[#E4E4E7]" />
          <span className="h-2 w-24 rounded-full bg-[#E4E4E7]" />
        </div>
        <div className="space-y-2">
          <span className="block h-2 w-full rounded-full bg-[#E9E9ED]" />
          <span className="block h-2 w-[92%] rounded-full bg-[#E9E9ED]" />
          <span className="block h-2 w-[78%] rounded-full bg-[#E9E9ED]" />
          <span className="block h-2 w-[86%] rounded-full bg-[#E9E9ED]" />
        </div>
        <div className="mt-4 h-8 w-24 rounded-[8px] bg-[#EEF2FF]" />
      </div>

      <h2 className="mt-6 font-display text-[15px] font-semibold text-[#09090B]">
        Your reply will appear here
      </h2>
      <p className="mt-1.5 max-w-[270px] text-[13px] leading-5 text-[#71717A]">
        The model writes a ready-to-send draft you can edit before you send it.
      </p>

      <ol className="mt-6 w-full max-w-[270px] space-y-2 text-left">
        {steps.map((step, i) => (
          <li key={step} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#E4E4E7] font-mono text-[10px] text-[#71717A]">
              {i + 1}
            </span>
            <span className="text-[13px] leading-5 text-[#52525B]">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
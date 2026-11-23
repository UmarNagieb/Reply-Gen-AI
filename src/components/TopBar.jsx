import { cn } from "@/lib/utils";

export default function TopBar({ status, model }) {
  const dot =
    status === "ready" ? "bg-[#10B981]" : status === "missing" ? "bg-amber-500" : "bg-[#A1A1AA]";
  const label = status === "missing" ? "Add OpenRouter key" : model || "OpenRouter Free Router";

  return (
    <header className="sticky top-0 z-30 border-b border-[#E4E4E7] bg-[#FAFAFC]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-[17px] font-extrabold tracking-tight text-[#09090B]">
            ReplyGen
          </span>
          <span className="font-display text-[17px] font-extrabold tracking-tight text-[#4F46E5]">
            AI
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#E4E4E7] bg-white px-3 py-1.5">
          <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
          <span
            title={model || undefined}
            className="max-w-[240px] truncate font-mono text-[11px] tracking-tight text-[#52525B]"
          >
            {label}
          </span>
        </div>
      </div>
    </header>
  );
}
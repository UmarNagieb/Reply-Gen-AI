import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GenerateButton({ onClick, loading, disabled, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-[12px] bg-[#4F46E5] px-5 text-[15px] font-semibold text-white",
        "shadow-[0_2px_10px_rgba(79,70,229,0.25)] transition-all duration-150 hover:bg-[#4338CA]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/40 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:bg-[#A5B4FC] disabled:shadow-none",
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Writing your reply…
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Generate Reply
          <span className="ml-1 hidden rounded-[5px] border border-white/25 bg-white/15 px-1.5 py-0.5 font-mono text-[10px] font-normal sm:inline">
            ⌘↵
          </span>
        </>
      )}
    </button>
  );
}
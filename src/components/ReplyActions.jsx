import { useState } from "react";
import { Check, Copy, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ReplyActions({ reply, onRegenerate, loading, className }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
      toast.success("Reply copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed — select the text and copy it manually.");
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "flex min-h-[38px] items-center gap-1.5 rounded-[9px] border px-3 text-[13px] font-medium transition-colors",
          copied
            ? "border-[#10B981]/30 bg-[#10B981]/10 text-[#059669]"
            : "border-[#E4E4E7] bg-white text-[#3F3F46] hover:border-[#D4D4D8] hover:text-[#09090B]"
        )}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy Response"}
      </button>
      <button
        type="button"
        onClick={onRegenerate}
        disabled={loading}
        className="flex min-h-[38px] items-center gap-1.5 rounded-[9px] bg-[#EEF2FF] px-3 text-[13px] font-medium text-[#4F46E5] transition-colors hover:bg-[#E0E7FF] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <RefreshCw className="h-3.5 w-3.5" />
        )}
        Regenerate
      </button>
    </div>
  );
}
import EmptyState from "@/components/EmptyState";
import GeneratingState from "@/components/GeneratingState";
import ReplyActions from "@/components/ReplyActions";
import ReplyEditor from "@/components/ReplyEditor";
import { countWords } from "@/lib/text";

export default function OutputStage({ reply, setReply, loading, onRegenerate }) {
  return (
    <section className="flex h-full min-h-[520px] flex-col overflow-hidden rounded-[12px] border border-[#E4E4E7] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[#E4E4E7] px-4 py-2.5 sm:px-5">
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.16em] text-[#71717A] sm:inline">
          Output stage
        </span>
        <div className="flex flex-1 items-center justify-end gap-3">
          <span className="font-mono text-[10px] text-[#A1A1AA]">
            {reply ? `${countWords(reply)} words` : "idle"}
          </span>
          {reply && (
            <ReplyActions reply={reply} onRegenerate={onRegenerate} loading={loading} />
          )}
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col">
        {loading && !reply ? (
          <GeneratingState />
        ) : reply ? (
          <ReplyEditor reply={reply} setReply={setReply} />
        ) : (
          <EmptyState />
        )}
      </div>
    </section>
  );
}
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import ReplyActions from "@/components/ReplyActions";
import ReplyEditor from "@/components/ReplyEditor";
import { countWords } from "@/lib/text";

export default function MobileReplySheet({ open, onOpenChange, reply, setReply, loading, onRegenerate }) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[88vh] rounded-t-[16px] border-[#E4E4E7] bg-white p-0">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-[#E4E4E7] px-5 py-3">
            <DrawerTitle className="font-display text-[14px] font-semibold text-[#09090B]">
              Your reply
            </DrawerTitle>
            <span className="font-mono text-[10px] text-[#A1A1AA]">{countWords(reply)} words</span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <ReplyEditor reply={reply} setReply={setReply} className="min-h-full" />
          </div>

          <div className="border-t border-[#E4E4E7] bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <ReplyActions
              reply={reply}
              onRegenerate={onRegenerate}
              loading={loading}
              className="[&>button]:flex-1 [&>button]:justify-center"
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
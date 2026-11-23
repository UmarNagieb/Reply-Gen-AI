import { cn } from "@/lib/utils";

export default function ReplyEditor({ reply, setReply, className }) {
  return (
    <textarea
      value={reply}
      onChange={(e) => setReply(e.target.value)}
      spellCheck
      aria-label="Generated reply — edit freely"
      className={cn(
        "h-full w-full resize-none border-0 bg-transparent px-5 py-4 text-[15px] leading-7 text-[#09090B]",
        "placeholder:text-[#A1A1AA] focus:outline-none",
        className
      )}
    />
  );
}
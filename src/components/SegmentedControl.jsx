import { cn } from "@/lib/utils";

export default function SegmentedControl({ label, value, options, onChange, disabled }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#71717A]">{label}</p>
      <div
        role="group"
        aria-label={label}
        className="flex gap-1 rounded-[12px] border border-[#E4E4E7] bg-[#FAFAFC] p-1"
      >
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() => onChange(opt.value)}
              className={cn(
                "min-h-[38px] flex-1 rounded-[8px] px-2 text-[13px] font-medium transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/40",
                active
                  ? "border border-[#E4E4E7] bg-white text-[#09090B] shadow-[0_1px_2px_rgba(9,9,11,0.06)]"
                  : "border border-transparent text-[#71717A] hover:border-[#D4D4D8] hover:text-[#09090B]",
                disabled && "cursor-not-allowed opacity-60"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
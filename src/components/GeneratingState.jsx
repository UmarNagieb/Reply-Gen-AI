export default function GeneratingState() {
  return (
    <div className="flex h-full flex-col justify-center px-6 py-10" aria-live="polite">
      <div className="mx-auto w-full max-w-[320px] space-y-2.5">
        {["w-full", "w-[88%]", "w-[94%]", "w-[72%]", "w-[90%]", "w-[64%]"].map((w, i) => (
          <span
            key={i}
            className={`block h-2.5 ${w} animate-pulse rounded-full bg-[#EEF2FF]`}
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
      <p className="mt-8 text-center font-mono text-[11px] tracking-wide text-[#71717A]">
        drafting your reply…
      </p>
    </div>
  );
}
type StickyHeaderProps = { question: string };
export default function StickyHeader({ question }: StickyHeaderProps) {
  return (
    <div className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/3 py-3 px-3 border-b border-white/10 shadow-[0_6px_16px_rgba(0,0,0,0.25)]">
      <h3 className="font-semibold text-lg tracking-wide fade-in">{question}</h3>
    </div>
  );
}

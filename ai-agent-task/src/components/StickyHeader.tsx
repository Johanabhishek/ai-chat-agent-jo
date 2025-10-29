type StickyHeaderProps = { question: string };
export default function StickyHeader({ question }: StickyHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-background py-2 px-1 border-b border-gray-800 shadow-sm">
      <h3 className="font-semibold text-lg">{question}</h3>
    </div>
  );
}

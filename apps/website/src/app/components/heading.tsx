/**
 * The page's heading voice: a statement in full ink and its answer in the
 * muted ink, with each word rising from behind its own baseline.
 */
export default function Heading({
  as: Tag = "h2",
  lead,
  rest,
  className,
}: {
  as?: "h1" | "h2";
  lead: string;
  rest: string;
  className?: string;
}) {
  const leadWords = lead.split(" ");
  const restWords = rest.split(" ");
  const word = (text: string, index: number, muted: boolean) => (
    <span key={`${text}-${index}`}>
      <span className="word">
        <span
          className={muted ? "text-muted" : undefined}
          style={{ "--i": index } as React.CSSProperties}
        >
          {text}
        </span>
      </span>{" "}
    </span>
  );
  return (
    <Tag className={className} data-reveal="words">
      {/* Each sentence stays whole, so a wrap falls between them first. */}
      <span className="inline-block">
        {leadWords.map((text, index) => word(text, index, false))}
      </span>{" "}
      <span className="inline-block">
        {restWords.map((text, index) =>
          word(text, index + leadWords.length, true),
        )}
      </span>
    </Tag>
  );
}

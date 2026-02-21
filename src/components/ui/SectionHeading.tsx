import "./SectionHeading.css";

interface SectionHeadingProps {
  title: string;
  highlight?: string;         // word(s) to render in accent cyan
  highlightPosition?: "before" | "after"; // highlight before or after plain title
  description?: string;
  className?: string;
}

export default function SectionHeading({
  title,
  highlight,
  highlightPosition = "after",
  description,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`section-heading ${className}`}>
      <h2 className="section-heading__title">
        {highlight && highlightPosition === "before" && (
          <span className="section-heading__highlight">{highlight} </span>
        )}
        {title}
        {highlight && highlightPosition === "after" && (
          <> <span className="section-heading__highlight">{highlight}</span></>
        )}
      </h2>

      <div className="section-heading__divider">
        <span className="section-heading__divider-bar" />
      </div>

      {description && (
        <p className="section-heading__description">{description}</p>
      )}
    </div>
  );
}

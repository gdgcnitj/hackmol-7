import Image from "next/image";
import "./SectionHeading.css";
import ornament from "../../../public/images/SponserOrnament.png";
import type { SectionHeadingProps } from "@/types";

export default function SectionHeading({
  title,
  highlight,
  highlightPosition = "after",
  description,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`section-heading__wrapper ${className}`}>
      {/* Corner ornaments — shown automatically in every section */}
      <Image
        src="/images/timelineLeftBorder.png"
        alt=""
        width={130}
        height={130}
        className="section-heading__corner section-heading__corner--left"
        aria-hidden="true"
      />
      <Image
        src="/images/timelineRightBorder.png"
        alt=""
        width={130}
        height={130}
        className="section-heading__corner section-heading__corner--right"
        aria-hidden="true"
      />

      <div className="section-heading">
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
          <Image
            src={ornament}
            alt=""
            className="section-heading__divider-ornament"
            width={120}
            height={24}
          />
        </div>

        {description && (
          <p className="section-heading__description">{description}</p>
        )}
      </div>
    </div>
  );
}

import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import "./timeline.css";

const timelineData = [
  {
    title: "THE ABYSS",
    description: "Brief Description",
    date: "March 5, 2026",
  },
  {
    title: "THE ABYSS",
    description: "Brief Description",
    date: "March 5, 2026",
  },
  {
    title: "THE ABYSS",
    description: "Brief Description",
    date: "March 5, 2026",
  },
  {
    title: "THE ABYSS",
    description: "Brief Description",
    date: "March 5, 2026",
  },
  {
    title: "THE ABYSS",
    description: "Brief Description",
    date: "March 5, 2026",
  },
];

export default function Timeline() {
  return (
    <section className="timeline-section" id="timeline">
      <div className="timeline-heading">
        <Image
          src="/images/timelineLeftBorder.png"
          alt=""
          width={130}
          height={130}
          className="timeline-corner-left"
        />
        <SectionHeading
          title="HACKATHON"
          highlight="TIMELINE"
          highlightPosition="after"
          description="Follow the journey through each milestone as the event unfolds."
          className="timeline-section-heading"
        />
        <Image
          src="/images/timelineRightBorder.png"
          alt=""
          width={130}
          height={130}
          className="timeline-corner-right"
        />
      </div>

      <div className="timeline-content">
        <div className="timeline-grid">
          <div className="timeline-character">
            <div className="timeline-character-vines">
              <Image
                src="/images/timelineVines.png"
                alt=""
                width={800}
                height={800}
                priority
              />
            </div>
            <div className="timeline-character-vessel">
              <Image
                src="/images/timelinePureVessel.png"
                alt="Pure Vessel character"
                width={800}
                height={800}
                priority
              />
            </div>
          </div>

          <div className="timeline-right">
            <div className="timeline-subheading">
              <Image
                src="/images/timelineTextBorderLeft.png"
                alt=""
                width={40}
                height={14}
                className="timeline-subheading-left"
              />
              <h3 className="timeline-subheading-title">TIMELINE</h3>
              <Image
                src="/images/timelineTextBorderRight.png"
                alt=""
                width={40}
                height={14}
                className="timeline-subheading-right"
              />
            </div>

            <div className="timeline-cards">
              {timelineData.map((item, index) => (
                <div key={index} className="timeline-card">
                  <div className="timeline-card-bullet">
                    <Image
                      src={
                        index % 2
                          ? "/images/timelineBulletBlue.png"
                          : "/images/timelineBulletWhite.png"
                      }
                      alt=""
                      width={30}
                      height={30}
                    />
                  </div>

                  <div className="timeline-card-text">
                    <span className="timeline-card-title">{item.title}</span>
                    <span className="timeline-card-desc">
                      {item.description}
                    </span>
                  </div>

                  <span className="timeline-card-date">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

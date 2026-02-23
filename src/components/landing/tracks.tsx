import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { 
  FaLeaf, 
  FaTractor, 
  FaHeartbeat, 
  FaBrain, 
  FaGraduationCap, 
  FaShieldAlt, 
  FaNetworkWired,
} from "react-icons/fa";
import { SiBlockchaindotcom } from "react-icons/si";
import type { TrackData } from "@/types";
import { tracksData, innovationAreas } from "@/data/tracks";
import "./tracks.css";

/** Map icon names (from data layer) to actual React icon components */
const iconMap: Record<string, React.ReactNode> = {
  FaLeaf: <FaLeaf />,
  SiBlockchaindotcom: <SiBlockchaindotcom />,
  FaTractor: <FaTractor />,
  FaHeartbeat: <FaHeartbeat />,
  FaBrain: <FaBrain />,
  FaGraduationCap: <FaGraduationCap />,
  FaShieldAlt: <FaShieldAlt />,
  FaNetworkWired: <FaNetworkWired />,
};

function TrackCard({ track }: { track: TrackData }) {
  const cardClass =
    track.variant === "center"
      ? "tracks-card tracks-card--center"
      : "tracks-card tracks-card--side";

  return (
    <div className={cardClass}>
      <div className="tracks-card-header">
        <h3 className="tracks-card-name">{track.name}</h3>
      </div>

      <div className="tracks-card-separator-wrap">
        <Image
          src="/images/tracksCardSeperator.png"
          alt=""
          width={500}
          height={16}
          className="tracks-card-separator"
        />
      </div>

      <div className="tracks-card-body">
        <div className="tracks-card-overlay">
          <Image
            src={track.image}
            alt=""
            width={280}
            height={400}
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
          />
        </div>

        <div className="tracks-card-content">
          <p className="tracks-card-description">{track.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function Tracks() {
  return (
    <section className="tracks-section" id="tracks">
      <SectionHeading
        title="HACKATHON"
        highlight="TRACKS"
        highlightPosition="after"
        description="Three legendary paths forged in the Hollow. Choose your arena and prove your worth."
      />

      <div className="tracks-cards">
        {tracksData.map((track, i) => (
          <TrackCard key={i} track={track} />
        ))}
      </div>

      <div className="tracks-innovation">
        <h3 className="tracks-innovation-title">AREAS OF INNOVATION</h3>
        <p className="tracks-innovation-subtitle">
          Participants may build solutions in (but not limited to):
        </p>
        
        <div className="tracks-innovation-grid">
          {innovationAreas.map((area, i) => (
            <div key={i} className="tracks-innovation-item">
              <div className="tracks-innovation-icon">{iconMap[area.iconName]}</div>
              <span className="tracks-innovation-name">{area.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
  FaCrown,
  FaRocket,
  FaCode,
  FaGift,
} from "react-icons/fa";
import { SiBlockchaindotcom } from "react-icons/si";
import type { TrackData, SpecialTrackData } from "@/types";
import { tracksData, innovationAreas, hackerRankTrack } from "@/data/tracks";
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
  FaCrown: <FaCrown />,
  FaRocket: <FaRocket />,
  FaCode: <FaCode />,
  FaGift: <FaGift />,
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
          src="/assets/tracks/tracksCardSeperator.png"
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

function SpecialTrackCard({ track }: { track: SpecialTrackData }) {
  return (
    <div className="tracks-special-card">
      <div className="tracks-special-header">
        <span className="tracks-special-badge">{track.badge}</span>
        <h3 className="tracks-special-name">{track.name}</h3>
        <p className="tracks-special-organizer">
          In collaboration with{" "}
          <a
            href={track.organizerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tracks-special-organizer-link"
          >
            <strong>{track.organizerName}</strong>
          </a>
        </p>
      </div>

      <div className="tracks-special-body">
        <p className="tracks-special-description">{track.description}</p>

        <div className="tracks-special-rewards">
          <h4 className="tracks-special-rewards-title">
            Rewards for Top 3 Performers
          </h4>
          <div className="tracks-special-rewards-grid">
            {track.rewards.map((reward, i) => (
              <a
                key={i}
                href={reward.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tracks-special-reward-item"
              >
                <div className="tracks-special-reward-icon">
                  {iconMap[reward.iconName]}
                </div>
                <div className="tracks-special-reward-text">
                  <div className="tracks-special-reward-title">{reward.title}</div>
                  {reward.amount && (
                    <div className="tracks-special-reward-amount">{reward.amount}</div>
                  )}
                  <div className="tracks-special-reward-desc">{reward.description}</div>
                </div>
              </a>
            ))}
          </div>
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

      <div className="tracks-special-wrapper">
        <SpecialTrackCard track={hackerRankTrack} />
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

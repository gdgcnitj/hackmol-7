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
import "./tracks.css";

interface InnovationArea {
  name: string;
  icon: React.ReactNode;
}

interface TrackData {
  name: string;
  image: string;
  variant: "side" | "center";
  description: string;
}

const innovationAreas: InnovationArea[] = [
  { name: "Green Technology", icon: <FaLeaf /> },
  { name: "Blockchain / Web3", icon: <SiBlockchaindotcom /> },
  { name: "Agriculture & Rural Tech", icon: <FaTractor /> },
  { name: "MedTech / Healthcare", icon: <FaHeartbeat /> },
  { name: "AI & Machine Learning", icon: <FaBrain /> },
  { name: "Smart Education", icon: <FaGraduationCap /> },
  { name: "Cybersecurity", icon: <FaShieldAlt /> },
  { name: "Internet of Things (IoT)", icon: <FaNetworkWired /> },
];

const tracksData: TrackData[] = [
  {
    name: "FRESHER'S TRACK",
    image: "/images/tracksFreshersTrack.png",
    variant: "side",
    description: "Exclusively for first-year students. Take your first step into the world of hackathons and showcase your innovative ideas.",
  },
  {
    name: "MAIN TRACK",
    image: "/images/tracksMainTrack.png",
    variant: "center",
    description: "Open to all participants. Compete with the best minds and build groundbreaking solutions that push the boundaries of innovation.",
  },
  {
    name: "WOMEN'S TRACK",
    image: "/images/tracksWomenTrack.png",
    variant: "side",
    description: "Empowering women in tech. Dedicated track for all-women teams to create impactful solutions and lead the change.",
  },
];

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
        description="Choose your path. Three distinct tracks — each one a trial forged for a different kind of builder."
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
              <div className="tracks-innovation-icon">{area.icon}</div>
              <span className="tracks-innovation-name">{area.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

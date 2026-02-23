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
    name: "THE RISING LANTERNS",
    image: "/images/tracksFreshersTrack.png",
    variant: "side",
    description: "Built especially for first-year students and beginners stepping into their first major hackathon. The Rising Lanterns track encourages learning, experimentation, and bold first attempts at innovation.",
  },
  {
    name: "THE DEEPFORGE ARENA",
    image: "/images/tracksMainTrack.png",
    variant: "center",
    description: "The ultimate battleground for seasoned builders and ambitious teams. The Deepforge Arena is where powerful ideas are transformed into impactful solutions across all major themes. Teams will be judged on innovation, technical depth, scalability, design, and real-world impact.",
  },
  {
    name: "THE QUEEN'S VANGUARD",
    image: "/images/tracksWomenTrack.png",
    variant: "side",
    description: "Dedicated to empowering and spotlighting women innovators in tech. The Queen's Vanguard honors teams with strong women representation who build impactful, creative, and technically sound solutions.",
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
              <div className="tracks-innovation-icon">{area.icon}</div>
              <span className="tracks-innovation-name">{area.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

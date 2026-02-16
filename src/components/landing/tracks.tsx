import Image from "next/image";
import "./tracks.css";

interface TrackData {
  name: string;
  image: string;
  variant: "side" | "center";
  prizes: { label: string; amount: string }[];
  bullets: { title: string; items: string[] };
}

const tracksData: TrackData[] = [
  {
    name: "FRESHER'S TRACK",
    image: "/images/tracksFreshersTrack.png",
    variant: "side",
    prizes: [
      { label: "WINNER", amount: "10,000" },
      { label: "1ST RUNNER UP", amount: "5000" },
      { label: "2ND RUNNER UP", amount: "3000" },
    ],
    bullets: {
      title: "Hollow Knight",
      items: [
        "Best Duo Of Hallownest",
        "Void & Light Champions",
        "Pure Bond Award",
        "Unbreakable Soul Pair",
        "Dreambound Duo",
        "Eternal Flame Of The Abyss",
        "Partners Of The Pale Light",
      ],
    },
  },
  {
    name: "MAIN TRACK",
    image: "/images/tracksMainTrack.png",
    variant: "center",
    prizes: [
      { label: "WINNER", amount: "50,000" },
      { label: "1ST RUNNER UP", amount: "30,000" },
      { label: "2ND RUNNER UP", amount: "30,000" },
    ],
    bullets: {
      title: "Hollow Knight",
      items: [
        "Best Duo Of Hallownest",
        "Void & Light Champions",
        "Pure Bond Award",
        "Unbreakable Soul Pair",
        "Dreambound Duo",
        "Eternal Flame Of The Abyss",
        "Partners Of The Pale Light",
      ],
    },
  },
  {
    name: "WOMEN'S TRACK",
    image: "/images/tracksWomensTrack.png",
    variant: "side",
    prizes: [
      { label: "WINNER", amount: "10,000" },
      { label: "1ST RUNNER UP", amount: "5000" },
      { label: "2ND RUNNER UP", amount: "3000" },
    ],
    bullets: {
      title: "Hollow Knight",
      items: [
        "Best Duo Of Hallownest",
        "Void & Light Champions",
        "Pure Bond Award",
        "Unbreakable Soul Pair",
        "Dreambound Duo",
        "Eternal Flame Of The Abyss",
        "Partners Of The Pale Light",
      ],
    },
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
          <div className="tracks-prizes">
            {track.prizes.map((prize, i) => (
              <div key={i} className="tracks-prize-item">
                <div className="tracks-prize-label">{prize.label}</div>
                <div className="tracks-prize-amount">
                  <Image
                    src="/images/tracksBerries.png"
                    alt="geo"
                    width={22}
                    height={22}
                  />
                  <span>{prize.amount}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="tracks-awards">
            <div className="tracks-awards-title">{track.bullets.title}</div>
            <ul className="tracks-awards-list">
              {track.bullets.items.map((award, i) => (
                <li key={i}>{award}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Tracks() {
  return (
    <section className="tracks-section">
      <div className="tracks-heading">
        <h2 className="tracks-heading-title">
          <span className="highlight">Main</span> Tracks
        </h2>
        <div className="tracks-heading-rule" />
      </div>

      <div className="tracks-cards">
        {tracksData.map((track, i) => (
          <TrackCard key={i} track={track} />
        ))}
      </div>
    </section>
  );
}

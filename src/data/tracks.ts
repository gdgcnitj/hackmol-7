import type { TrackData, InnovationArea } from "@/types";

export const tracksData: TrackData[] = [
  {
    name: "THE RISING LANTERNS",
    image: "/images/tracksFreshersTrack.png",
    variant: "side",
    description:
      "Built especially for first-year students and beginners stepping into their first major hackathon. The Rising Lanterns track encourages learning, experimentation, and bold first attempts at innovation.",
  },
  {
    name: "THE DEEPFORGE ARENA",
    image: "/images/tracksMainTrack.png",
    variant: "center",
    description:
      "The ultimate battleground for seasoned builders and ambitious teams. The Deepforge Arena is where powerful ideas are transformed into impactful solutions across all major themes. Teams will be judged on innovation, technical depth, scalability, design, and real-world impact.",
  },
  {
    name: "THE QUEEN'S VANGUARD",
    image: "/images/tracksWomenTrack.png",
    variant: "side",
    description:
      "Dedicated to empowering and spotlighting women innovators in tech. The Queen's Vanguard honors teams with strong women representation who build impactful, creative, and technically sound solutions.",
  },
];

export const innovationAreas: InnovationArea[] = [
  { name: "Green Technology",            iconName: "FaLeaf" },
  { name: "Blockchain / Web3",           iconName: "SiBlockchaindotcom" },
  { name: "Agriculture & Rural Tech",    iconName: "FaTractor" },
  { name: "MedTech / Healthcare",        iconName: "FaHeartbeat" },
  { name: "AI & Machine Learning",       iconName: "FaBrain" },
  { name: "Smart Education",             iconName: "FaGraduationCap" },
  { name: "Cybersecurity",               iconName: "FaShieldAlt" },
  { name: "Internet of Things (IoT)",    iconName: "FaNetworkWired" },
];

import type { TrackData, InnovationArea, SpecialTrackData } from "@/types";

export const tracksData: TrackData[] = [
  {
    name: "THE RISING LANTERNS",
    image: "/assets/tracks/tracksFreshersTrack.png",
    variant: "side",
    description:
      "Built especially for first-year students and beginners stepping into their first major hackathon. The Rising Lanterns track encourages learning, experimentation, and bold first attempts at innovation.",
  },
  {
    name: "THE DEEPFORGE ARENA",
    image: "/assets/tracks/tracksMainTrack.png",
    variant: "center",
    description:
      "The ultimate battleground for seasoned builders and ambitious teams. The Deepforge Arena is where powerful ideas are transformed into impactful solutions across all major themes. Teams will be judged on innovation, technical depth, scalability, design, and real-world impact.",
  },
  {
    name: "THE QUEEN'S VANGUARD",
    image: "/assets/tracks/tracksWomenTrack.png",
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

export const hackerRankTrack: SpecialTrackData = {
  name: "HACKERRANK CODING CHALLENGE TRACK",
  badge: "SPECIAL TRACK",
  organizerName: "HackerRank",
  organizerUrl: "https://www.hackerrank.com",
  description:
    "HackMOL 7.0 is excited to introduce the HackerRank Coding Challenge Track, organized in collaboration with HackerRank. This special track gives participants the opportunity to experience a real-world coding assessment environment similar to the ones used by leading tech companies during technical hiring. Participants will solve algorithmic and programming challenges designed to test problem-solving ability, logical thinking, and coding efficiency, sharpening competitive programming skills while gaining exposure to industry-level assessments.",
  rewards: [
    {
      title: "HackerRank Infinity Plan (1 Year)",
      amount: "$300 / person",
      description:
        "One year of access to the HackerRank Infinity Plan, providing premium coding practice and interview preparation resources.",
      iconName: "FaCrown",
      url: "https://www.hackerrank.com",
    },
    {
      title: "6-Month Access to JoinSecret",
      amount: "Up to $500,000 in credits",
      description:
        "Six months of access to 1500+ developer and startup tools including Notion AI, Google Workspace, Zoom, AWS credits, and more.",
      iconName: "FaRocket",
      url: "https://www.joinsecret.com",
    },
    {
      title: "HackerRank Mock Interview Credits",
      description:
        "Exclusive mock interview credits to help participants practice technical interviews and strengthen their coding interview skills.",
      iconName: "FaCode",
      url: "https://www.hackerrank.com",
    },
    {
      title: "Official HackerRank Merchandise",
      description:
        "Special HackerRank merchandise awarded to the top three performers as recognition for their achievement.",
      iconName: "FaGift",
      url: "https://www.hackerrank.com",
    },
  ],
};

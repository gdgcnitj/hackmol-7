import type { PersonData } from "@/types";

export const judgesData: PersonData[] = [
  {
    name: "TO BE ANNOUNCED",
    designation: "SDE @Microsoft",
    category: "JUDGE",
    image: "/images/hackmol_logo.png",
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "TO BE ANNOUNCED",
    designation: "Product Manager @Google",
    category: "JUDGE",
    image: "/images/hackmol_logo.png",
    linkedin: "#",
    instagram: "#",
  },
  {
    name: "TO BE ANNOUNCED",
    designation: "Tech Lead @Amazon",
    category: "JUDGE",
    image: "/images/hackmol_logo.png",
    linkedin: "#",
    instagram: "#",
  },
];

export const mentorsData: PersonData[] = Array.from({ length: 5 }, () => ({
  name: "TO BE ANNOUNCED",
  designation: "Senior Engineer @Meta",
  category: "MENTOR" as const,
  image: "/images/hackmol_logo.png",
  linkedin: "#",
  instagram: "#",
}));

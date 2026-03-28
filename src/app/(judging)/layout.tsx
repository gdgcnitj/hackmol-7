import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HackMol 7.0 - Judging Panel",
  description: "HackMol 7.0 Judging and Scoring Panel",
  robots: { index: false, follow: false },
};

export default function JudgingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="judging-root">{children}</div>;
}

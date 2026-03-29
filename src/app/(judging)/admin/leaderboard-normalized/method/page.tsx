import Link from "next/link";

export default function NormalizationMethodPage() {
  return (
    <div>
      <h1 className="admin-page-title">Normalization Method</h1>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-card-title">Why Normalization</div>
        <p style={{ marginTop: 8, color: "rgba(255,255,255,0.78)", lineHeight: 1.6 }}>
          Different evaluators can be naturally strict or lenient. Normalization adjusts
          each evaluator&apos;s scoring scale so the leaderboard reflects relative team
          performance more fairly across mentors and judges.
        </p>
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-card-title">Current Method Applied</div>
        <ol style={{ margin: "10px 0 0", paddingLeft: 18, color: "rgba(255,255,255,0.82)", lineHeight: 1.7 }}>
          <li>Compute each submission raw weighted total (0-100) using rubric weights.</li>
          <li>Within each round, compute evaluator-specific mean and standard deviation.</li>
          <li>Convert raw total to z-score: z = (raw - evaluatorMean) / evaluatorStdDev.</li>
          <li>Clamp z to [-2, 2] to reduce extreme influence.</li>
          <li>Map clamped z to 0-100 normalized scale: normalized = ((z + 2) / 4) * 100.</li>
          <li>If evaluator standard deviation is near zero, use neutral normalized score 50.</li>
          <li>Average normalized totals per team per round.</li>
          <li>Compute final score using unchanged round weights: Mentor1 20%, Mentor2 20%, Judging 60%.</li>
        </ol>
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-card-title">What The Numbers Mean</div>
        <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "rgba(255,255,255,0.82)", lineHeight: 1.7 }}>
          <li>A team above 50 in a round performed above the evaluator-normalized center.</li>
          <li>Rank Delta shows movement from raw rank to normalized rank.</li>
          <li>Bias labels (Strict/Neutral/Lenient) indicate evaluator tendency against round mean.</li>
        </ul>
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-card-title">Limitations</div>
        <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "rgba(255,255,255,0.82)", lineHeight: 1.7 }}>
          <li>Small evaluator sample sizes can make normalization less stable.</li>
          <li>If one evaluator gives nearly identical scores, fallback to neutral 50 is used.</li>
          <li>Normalization improves fairness but does not replace rubric quality and assignment discipline.</li>
        </ul>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href="/admin/leaderboard-normalized" className="admin-btn admin-btn-primary">
          Back To Normalized Leaderboard
        </Link>
        <Link href="/admin/leaderboard" className="admin-btn admin-btn-primary">
          View Raw Leaderboard
        </Link>
      </div>
    </div>
  );
}
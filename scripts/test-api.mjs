const BASE = "http://localhost:3000";

async function test() {
  // 1. Admin login
  const loginRes = await fetch(`${BASE}/api/auth/admin-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "Admin@HackMol7#2026" }),
  });
  const cookie = loginRes.headers.get("set-cookie");
  console.log("1. Admin login:", cookie ? "OK (cookie set)" : "FAIL");

  const headers = { Cookie: cookie };

  // 2. Create a judge
  const createRes = await fetch(`${BASE}/api/admin/judges`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ username: "judge1", name: "Test Judge 1", password: "Judge1@Test2026", role: "JUDGE" }),
  });
  const judge = await createRes.json();
  console.log("2. Create judge:", judge.inviteLink ? "OK" : "FAIL", judge.error || "");

  // 3. List judges
  const listRes = await fetch(`${BASE}/api/admin/judges`, { headers });
  const judges = await listRes.json();
  console.log("3. Judges count:", judges.length);

  // 4. Get teams
  const teamsRes = await fetch(`${BASE}/api/admin/teams`, { headers });
  const teams = await teamsRes.json();
  console.log("4. Teams count:", teams.length);

  // 5. Get rounds
  const roundsRes = await fetch(`${BASE}/api/admin/rounds`, { headers });
  const rounds = await roundsRes.json();
  console.log("5. Rounds:", rounds.map((r) => `${r.name} (active:${r.isActive})`));

  // 6. Activate a round
  const round = rounds.find((r) => r.type === "MENTOR_1");
  const activateRes = await fetch(`${BASE}/api/admin/rounds`, {
    method: "PATCH",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ id: round.id, isActive: true }),
  });
  const activated = await activateRes.json();
  console.log("6. Activate round:", activated.isActive ? "OK" : "FAIL");

  // 7. Activate invite (simulate judge clicking invite link)
  const activateInviteRes = await fetch(`${BASE}/api/auth/activate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: judge.inviteToken }),
  });
  const activateInvite = await activateInviteRes.json();
  console.log("7. Activate invite:", activateInvite.success ? "OK" : "FAIL", activateInvite.error || "");

  // 8. Judge login
  const judgeLoginRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: judge.inviteToken,
      username: "judge1",
      password: "Judge1@Test2026",
    }),
  });
  const judgeCookie = judgeLoginRes.headers.get("set-cookie");
  const judgeLogin = await judgeLoginRes.json();
  console.log("8. Judge login:", judgeLogin.success ? "OK" : "FAIL", judgeLogin);

  // 9. Get judge teams
  const judgeHeaders = { Cookie: judgeCookie };
  const judgeTeamsRes = await fetch(`${BASE}/api/judge/teams`, {
    headers: judgeHeaders,
  });
  const judgeTeams = await judgeTeamsRes.json();
  console.log("9. Judge teams:", judgeTeams.teams ? `${judgeTeams.teams.length} teams` : judgeTeams);

  // 10. Submit a score
  if (judgeTeams.teams && judgeTeams.teams.length > 0) {
    const team = judgeTeams.teams[0];
    const activeRoundId = judgeTeams.activeRound.id;
    const scoreRes = await fetch(`${BASE}/api/judge/scores`, {
      method: "POST",
      headers: { ...judgeHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId: team.id,
        roundId: activeRoundId,
        technical: 8,
        innovation: 7,
        impact: 9,
        demo: 6,
        presentation: 8,
        notes: "Good project overall",
      }),
    });
    const score = await scoreRes.json();
    console.log("10. Submit score:", score.scoreId || score.success ? "OK" : "FAIL", score.error || "");

    // 11. Get score for team
    const getScoreRes = await fetch(`${BASE}/api/judge/scores/${team.id}`, {
      headers: judgeHeaders,
    });
    const getScore = await getScoreRes.json();
    console.log("11. Get score:", getScore.score ? "OK" : "FAIL", getScore.score ? `tech=${getScore.score.technical}` : "");
  }

  // 12. Leaderboard
  const leaderboardRes = await fetch(`${BASE}/api/admin/leaderboard`, {
    headers,
  });
  const leaderboard = await leaderboardRes.json();
  console.log("12. Leaderboard:", Array.isArray(leaderboard) ? `${leaderboard.length} entries` : leaderboard);

  console.log("\nAll tests complete!");
}

test().catch(console.error);

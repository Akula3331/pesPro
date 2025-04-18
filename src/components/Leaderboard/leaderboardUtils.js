export function calculateLeaderboard(teams, matches, sortType, matchTypeFilter) {
    const teamStats = teams.map((team) => {
      const teamMatches = matches.filter((match) => {
        const isRelevantMatch =
          match.homeTeam === team.id || match.awayTeam === team.id;
  
        const isMatchTypeOk =
          matchTypeFilter === "all" || match.matchType === matchTypeFilter;
  
        return isRelevantMatch && isMatchTypeOk;
      });
  
      let wins = 0;
      let losses = 0;
      let draws = 0;
      let played = 0;
      let points = 0;
      let goalsScored = 0;
      let goalsConceded = 0;
  
      teamMatches.forEach((match) => {
        played++;
        const isHome = match.homeTeam === team.id;
        const teamScore = isHome ? match.homeScore : match.awayScore;
        const opponentScore = isHome ? match.awayScore : match.homeScore;
  
        if (teamScore === opponentScore && match.penalty) {
          const teamPenaltyScore = isHome
            ? match.penalty.homeTeamPenalties
            : match.penalty.awayTeamPenalties;
          const opponentPenaltyScore = isHome
            ? match.penalty.awayTeamPenalties
            : match.penalty.homeTeamPenalties;
  
          if (teamPenaltyScore > opponentPenaltyScore) {
            wins++;
            points += 3;
          } else {
            losses++;
          }
        } else if (teamScore > opponentScore) {
          wins++;
          points += 3;
        } else if (teamScore < opponentScore) {
          losses++;
        } else {
          draws++;
          points += 1;
        }
  
        goalsScored += teamScore;
        goalsConceded += opponentScore;
      });
  
      const goalDifference = goalsScored - goalsConceded;
      const rating = played ? (wins / played) * 100 : 0;
  
      return {
        id: team.id,
        name: team.name,
        wins,
        losses,
        draws,
        played,
        points,
        goalsScored,
        goalsConceded,
        goalDifference,
        rating: rating.toFixed(2),
      };
    });
  
    const filteredStats = teamStats.filter((team) => team.played >= 2);
  
    const sortedStats = [...filteredStats].sort((a, b) => {
      if (sortType === "points") return b.points - a.points;
      if (sortType === "wins") return b.wins - a.wins;
      if (sortType === "losses") return b.losses - a.losses;
      if (sortType === "played") return b.played - a.played;
      if (sortType === "goalsScored") return b.goalsScored - a.goalsScored;
      if (sortType === "goalsConceded") return b.goalsConceded - a.goalsConceded;
      if (sortType === "goalDifference") return b.goalDifference - a.goalDifference;
      if (sortType === "rating") return b.rating - a.rating;
      return 0;
    });
  
    const leaderboardWithRanks = [];
    let rank = 1;
    let prevValue = null;
  
    sortedStats.forEach((team) => {
      const value =
        sortType === "points"
          ? team.points
          : sortType === "wins"
          ? team.wins
          : sortType === "losses"
          ? team.losses
          : sortType === "played"
          ? team.played
          : sortType === "goalsScored"
          ? team.goalsScored
          : sortType === "goalsConceded"
          ? team.goalsConceded
          : sortType === "goalDifference"
          ? team.goalDifference
          : team.rating;
  
      if (prevValue !== null && prevValue === value) {
        leaderboardWithRanks.push({
          ...team,
          rank: leaderboardWithRanks[leaderboardWithRanks.length - 1].rank,
        });
      } else {
        leaderboardWithRanks.push({ ...team, rank });
        rank++;
      }
  
      prevValue = value;
    });
  
    return leaderboardWithRanks.slice(0, 10);
  }
  
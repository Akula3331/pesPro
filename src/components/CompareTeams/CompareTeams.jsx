import React, { useEffect, useState } from "react";
import cls from "./CompareTeams.module.scss";
import EdgeToCenterProgressBar from './../UI/EdgeToCenterProgressBar/EdgeToCenterProgressBar';

const CompareTeams = ({ teams, matches, onReset }) => {
  const [teamA, teamB] = teams;

  const getTeamStats = (team) => {
    const teamMatches = matches.filter(
      (match) => match.homeTeam === team.id || match.awayTeam === team.id
    );

    let wins = 0, losses = 0, draws = 0, played = 0, points = 0, goalsScored = 0, goalsConceded = 0;

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
    const rating = played ? ((wins + draws * 0.5) / played) * 100 : 0;

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
      rating: parseFloat(rating.toFixed(1))
    };
  };

  const statsA = getTeamStats(teamA);
  const statsB = getTeamStats(teamB);

  const params = [
    { label: "Победы", key: "wins" },
    { label: "Поражения", key: "losses" },
    { label: "Ничьи", key: "draws" },
    { label: "Сыграно", key: "played" },
    { label: "Забито голов", key: "goalsScored" },
    { label: "Пропущено", key: "goalsConceded" },
    { label: "Разница мячей", key: "goalDifference" },
    { label: "Очки", key: "points" },
    { label: "Рейтинг", key: "rating" }
  ];

  let scoreA = 0;
  let scoreB = 0;
  params.forEach(({ key }) => {
    const v1 = statsA[key];
    const v2 = statsB[key];

    if (["losses", "goalsConceded", "draws"].includes(key)) {
      if (v1 < v2) scoreA++;
      else if (v2 < v1) scoreB++;
    } else {
      if (v1 > v2) scoreA++;
      else if (v2 > v1) scoreB++;
    }
  });

  const teamLeft = scoreA >= scoreB ? statsA : statsB;
  const teamRight = scoreA >= scoreB ? statsB : statsA;
  const scoreLeft = scoreA >= scoreB ? scoreA : scoreB;
  const scoreRight = scoreA >= scoreB ? scoreB : scoreA;

  const [visibleIndexes, setVisibleIndexes] = useState([]);

  useEffect(() => {
    const timeouts = [];
    params.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleIndexes((prev) => [...prev, index]);
      }, 100 * index);
      timeouts.push(timeout);
    });
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className={`${cls.modalWrapper} ${cls.show}`}>
      <div className={cls.container}>
        <h2 className={cls.subtitle}>Сравнение команд</h2>

        <div className={cls.teamNamesRow}>
          <div className={cls.teamBlock}>
            <span className={scoreLeft > scoreRight ? cls.winner : cls.loser}>
              {teamLeft.name} {scoreLeft > scoreRight && "🏆"}
            </span>
            <div className={scoreLeft > scoreRight ? cls.winner : cls.loser}>{scoreLeft}</div>
          </div>

          <div className={cls.teamBlock}>
            <span className={scoreRight > scoreLeft ? cls.winner : cls.loser}>
              {teamRight.name} {scoreRight > scoreLeft && "🏆"}
            </span>
            <div className={scoreRight > scoreLeft ? cls.winner : cls.loser}>{scoreRight}</div>
          </div>
        </div>

        {params.map((param, index) => (
          <div
            key={param.key}
            className={`${cls.statRow} ${visibleIndexes.includes(index) ? cls.show : ""}`}
          >
            <EdgeToCenterProgressBar
              value1={teamLeft[param.key]}
              value2={teamRight[param.key]}
              label={param.label}
              winsHigherBetter={!["losses", "goalsConceded", "draws"].includes(param.key)}
              index={index}
            />
          </div>
        ))}

        <div style={{ textAlign: 'center' }}>
          <button onClick={onReset} className={cls.resetButton}>
            Сбросить сравнение
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareTeams;

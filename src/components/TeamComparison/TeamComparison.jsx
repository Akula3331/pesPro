import React from "react";
import cls from "./TeamComparison.module.scss";

const TeamComparison = ({ selectedTeams, leaderboard }) => {
  if (selectedTeams.length !== 2) return null;

  const getStats = (id) => leaderboard.find((team) => team.id === id);
  const team1 = getStats(selectedTeams[0]);
  const team2 = getStats(selectedTeams[1]);

  if (!team1 || !team2) return null;

  const statsKeys = [
    "points", "wins", "losses", "played",
    "goalsScored", "goalsConceded", "goalDifference", "rating",
  ];

  const columnHeaders = {
    points: "Очки",
    wins: "Победы",
    losses: "Поражения",
    played: "Сыграно",
    goalsScored: "Забито",
    goalsConceded: "Пропущено",
    goalDifference: "Разница мячей",
    rating: "Рейтинг (%)",
  };

  return (
    <div className={cls.comparisonBlock}>
      <h2>Сравнение команд</h2>
      <div className={cls.comparisonGrid}>
        {statsKeys.map((key) => (
          <div key={key} className={cls.comparisonRow}>
            <div>{team1.name}: {team1[key]}</div>
            <div><strong>{columnHeaders[key]}</strong></div>
            <div>{team2.name}: {team2[key]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamComparison;

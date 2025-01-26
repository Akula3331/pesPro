import React, { useState, useEffect } from "react";
import cls from "./LeagueList.module.scss";

const LeagueList = () => {
  const [teams, setTeams] = useState([]);
  const [currentLeague, setCurrentLeague] = useState(null);
  const [matches, setMatches] = useState([]);
  const [teamStats, setTeamStats] = useState([]);

  // Функция для разбивки матчей на этапы по 6 матчей
  const groupMatchesIntoStages = (matches, matchesPerStage = 6) => {
    const stages = [];
    for (let i = 0; i < matches.length; i += matchesPerStage) {
      stages.push(matches.slice(i, i + matchesPerStage));
    }
    return stages;
  };

  useEffect(() => {
    fetch("/teams.json")
      .then((response) => response.json())
      .then((data) => {
        setTeams(data);
      });
  }, []);

  useEffect(() => {
    fetch("/league.json")
      .then((response) => response.json())
      .then((data) => {
        const league = data.leagues[0]; // Выбираем первую лигу
        setCurrentLeague(league);
        setMatches(league.matches || []);
      });
  }, []);

  useEffect(() => {
    if (currentLeague && matches.length > 0) {
      const calculateStats = () => {
        const stats = currentLeague.teams.map((teamId) => {
          const teamMatches = matches.filter(
            (match) => {
              const homeScore = Number(match.homeScore);
              const awayScore = Number(match.awayScore);

              return (
                (match.homeTeam === teamId || match.awayTeam === teamId) &&
                !isNaN(homeScore) &&
                !isNaN(awayScore)
              );
            }
          );

          let wins = 0, losses = 0, draws = 0, goalsScored = 0, goalsConceded = 0, points = 0;

          teamMatches.forEach((match) => {
            const isHome = match.homeTeam === teamId;
            const teamScore = isHome ? match.homeScore : match.awayScore;
            const opponentScore = isHome ? match.awayScore : match.homeScore;

            goalsScored += teamScore;
            goalsConceded += opponentScore;

            if (teamScore > opponentScore) {
              wins++;
              points += 3;
            } else if (teamScore < opponentScore) {
              losses++;
            } else {
              draws++;
              points += 1;
            }
          });

          const goalDifference = goalsScored - goalsConceded;

          return {
            id: teamId,
            played: teamMatches.length,
            wins,
            losses,
            draws,
            goalsScored,
            goalsConceded,
            goalDifference,
            points,
          };
        });

        stats.sort((a, b) => {
          if (b.points === a.points) {
            return b.goalDifference - a.goalDifference;
          }
          return b.points - a.points;
        });

        setTeamStats(stats);
      };

      calculateStats();
    }
  }, [currentLeague, matches]);

  const getTeamNameById = (id) => {
    const team = teams.find((team) => team.id === id);
    return team ? team.name : "Unknown Team";
  };

  // Разбиваем матчи на этапы по 6 матчей
  const stages = groupMatchesIntoStages(matches);

  return (
    <div className={cls.tableContainer}>
      <h1>Таблица Лиги</h1>
      <div className={cls.tableWrapper}>
        <div className={cls.scrollContainer}>
          <div className={cls.title}>
            <p className={cls.name}>Команда</p>
            <p className={cls.subtitle}>И</p>
            <p className={cls.subtitle}>В</p>
            <p className={cls.subtitle}>Н</p>
            <p className={cls.subtitle}>П</p>
            <p className={cls.subtitle}>О</p>
            <p className={cls.subtitle}>ЗМ</p>
            <p className={cls.subtitle}>ПМ</p>
            <p className={cls.subtitle}>РМ</p>
          </div>
          {teamStats.map((team, index) => (
            <div className={cls.point} key={team.id}>
              <p className={cls.name}>
                <span>{index + 1}</span> {getTeamNameById(team.id)}
              </p>
              <p className={cls.pointText}>{team.played}</p>
              <p className={cls.pointText}>{team.wins}</p>
              <p className={cls.pointText}>{team.draws}</p>
              <p className={cls.pointText}>{team.losses}</p>
              <p className={cls.pointText}>{team.points}</p>
              <p className={cls.pointText}>{team.goalsScored}</p>
              <p className={cls.pointText}>{team.goalsConceded}</p>
              <p className={cls.pointText}>{team.goalDifference}</p>
            </div>
          ))}
        </div>
      </div>

      <h2>История матчей</h2>
      <div className={cls.historyCon}>
        {stages.map((stage, stageIndex) => (
          <div key={stageIndex} className={cls.stage}>
            <h3>Этап {stageIndex + 1}</h3>
            {stage.map((match) => (
              <div className={cls.matchBlock} key={match.id}>
                <p className={cls.matchName}>{getTeamNameById(match.homeTeam)}</p>
                <div className={cls.pointScore}>
                  <p className={cls.date}>
                    {match.date.split("").reduce((acc, char, index) => {
                      if (index === 2 || index === 4) {
                        acc += ".";
                      }
                      acc += char;
                      return acc;
                    }, "")}
                  </p>
                  <p>
                    {match.homeScore} - {match.awayScore}
                  </p>
                </div>
                <p className={cls.matchName}>{getTeamNameById(match.awayTeam)}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeagueList;

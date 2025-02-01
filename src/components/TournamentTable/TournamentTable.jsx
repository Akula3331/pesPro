import React, { useState, useEffect } from "react";
import cls from "./TournamentTable.module.scss";

function TournamentTable() {
  const [tournaments, setTournaments] = useState([]);
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загрузка данных из всех файлов
        const [tournamentResponse, matchResponse, teamResponse] =
          await Promise.all([
            fetch("/tournamentsSeason.json"),
            fetch("/matches.json"),
            fetch("/teams.json"),
          ]);

        const [tournamentData, matchData, teamData] = await Promise.all([
          tournamentResponse.json(),
          matchResponse.json(),
          teamResponse.json(),
        ]);

        setTournaments(tournamentData.tournaments);
        setMatches(matchData);
        setTeams(teamData);

        setLoading(false);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTeamById = (id) => {
    return teams.find((team) => team.id === id) || { name: "", icon: "" };
  };

  const getMatchById = (id) => {
    return matches.find((match) => match.id === id) || null;
  };

  if (loading) {
    return <p>Загрузка данных...</p>;
  }

  return (
    <div className={cls.tournamentTable}>
      <div className={cls.matches}>
        {tournaments.map((tournament) => (
          <div key={tournament.id} className={cls.tournament}>
            <h2 className={cls.tournamentName}>{tournament.name}</h2>
            <div className={cls.date}>
              <span>{tournament.date}</span>
            </div>
            {tournament.stages.map((stage, index) => (
              <div key={index} className={cls.stage}>
                <h3 className={cls.stageName}>{stage.stageName}</h3>
                <div className={cls.matchesList}>
                  {stage.matchIds.map((matchId) => {
                    const match = getMatchById(matchId);
                    if (!match) return null;

                    const homeTeam = getTeamById(match.homeTeam);
                    const awayTeam = getTeamById(match.awayTeam);

                    return (
                      <div key={match.id} className={cls.match}>
                        <div className={cls.column}>
                          <div className={cls.team}>
                            {homeTeam.icon && (
                              <img
                                src={homeTeam.icon}
                                alt={homeTeam.name}
                                className={cls.teamIcon}
                              />
                            )}
                            <span className={cls.teamName}>
                              {homeTeam.name || "Команда отсутствует"}
                            </span>
                          </div>
                        </div>
                        <div className={cls.matchResult}>
                          <div className={cls.score}>
                            {match.homeScore} - {match.awayScore}
                            {match.penalty && (
                            <div className={cls.penalty}>
                              <span>
                                {match.penalty.homeTeamPenalties} -{" "}
                                {match.penalty.awayTeamPenalties}
                              </span>
                            </div>
                          )}
                          </div>
                         
                        </div>
                        <div className={cls.column}>
                          <div className={cls.team}>
                            {awayTeam.icon && (
                              <img
                                src={awayTeam.icon}
                                alt={awayTeam.name}
                                className={cls.teamIcon}
                              />
                            )}
                            <span className={cls.teamName}>
                              {awayTeam.name || "Команда отсутствует"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TournamentTable;

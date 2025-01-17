import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Для получения ID турнира из URL
import cls from './TournamentList.module.scss';

const TournamentList = () => {
  const { tournamentId } = useParams(); // Получаем ID турнира из URL
  const [tournament, setTournament] = useState(null); // Данные о турнире
  const [teams, setTeams] = useState([]); // Данные о командах
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tournamentResponse = await fetch('/tournaments.json');
        const tournamentData = await tournamentResponse.json();
        const selectedTournament = tournamentData.tournaments.find(
          (tournament) => tournament.id === parseInt(tournamentId)
        );
        setTournament(selectedTournament);

        const teamResponse = await fetch('/teams.json');
        const teamData = await teamResponse.json();
        setTeams(teamData);

        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [tournamentId]); // Перезагружаем данные при изменении tournamentId

  if (loading) {
    return <p>Загрузка турнира...</p>;
  }

  if (!tournament) {
    return <p>Турнир не найден.</p>;
  }

  const getTeamById = (id) => {
    return teams.find((team) => team.id === id) || { name: 'Неизвестная команда', icon: '' };
  };

  const getStageBackground = (stageName) => {
    switch (stageName) {
      case 'Групповой этап':
        return cls.groupStage;
      case 'Четвертьфинал':
        return cls.quarterFinal;
      case 'Полуфинал':
        return cls.semiFinal;
      case 'Финал':
        return cls.final;
      default:
        return ''; // Без фона для остальных стадий
    }
  };

  return (
    <div className={cls.tournamentTable}>
      <h1 className={cls.title}>{tournament.name}</h1>
      <div className={cls.date}>
        <span>{tournament.date}</span>
      </div>

      {tournament.stages.map((stage, index) => (
        <div key={index}>
          <h3 className={cls.stageName}>{stage.stageName}</h3>
          <div className={cls.matchesList}>
            {stage.matches.map((match) => {
              const homeTeam = getTeamById(match.homeTeam);
              const awayTeam = getTeamById(match.awayTeam);

              return (
                <div key={match.id} className={`${cls.match} ${getStageBackground(stage.stageName)}`}>
                  <div className={cls.column}>
                    <div className={cls.team}>
                      <img src={homeTeam.icon} alt={homeTeam.name} className={cls.teamIcon} />
                      <span className={cls.teamName}>{homeTeam.name}</span>
                    </div>
                  </div>
                  {match.homeScore !== null && match.awayScore !== null && (
                    <div className={cls.matchResult}>
                      <span>
                        {match.homeScore} - {match.awayScore}
                      </span>
                      {match.penalty && (
                        <div className={cls.penalty}>
                          <span>
                            {match.penalty.homeTeamPenalties} - {match.penalty.awayTeamPenalties}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={cls.column}>
                    <div className={cls.team}>
                      <img src={awayTeam.icon} alt={awayTeam.name} className={cls.teamIcon} />
                      <span className={cls.teamName}>{awayTeam.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {tournament.champion && (
        <div className={cls.championBlock}>
          <h3>Чемпион турнира</h3>
          <div className={cls.champion}>
            <img
              src={getTeamById(tournament.champion.teamId).icon}
              alt={getTeamById(tournament.champion.teamId).name}
              className={cls.teamIcon}
            />
            <span>{getTeamById(tournament.champion.teamId).name}</span>
          </div>
        </div>
      )}

      {tournament.winners && tournament.winners.length > 0 && (
        <div className={cls.winnersBlock}>
          <h3>Победители турнира</h3>
          {tournament.winners.map((winner, index) => (
            <div key={index} className={cls.winner}>
              <img
                src={getTeamById(winner.teamId).icon}
                alt={getTeamById(winner.teamId).name}
                className={cls.teamIcon}
              />
              <span>{getTeamById(winner.teamId).name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentList;

import React, { useState, useEffect } from 'react';
import cls from './TeamProfile.module.scss';
import ProfileHistoryMatch from '../ProfileHistoryMatch/ProfileHistoryMatch';
import { useParams } from 'react-router-dom';

const TeamProfile = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [teams, setTeams] = useState([]); // Состояние для списка всех команд
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    draws: 0,
    played: 0,
    rating: 0,
  });

  useEffect(() => {
    // Загружаем список всех команд
    fetch('/teams.json')
      .then((response) => response.json())
      .then((data) => {
        setTeams(data); // Сохраняем список команд
        const teamData = data.find((team) => team.id === parseInt(teamId));
        setTeam(teamData);
      });

    // Загружаем список матчей
    fetch('/matches.json')
      .then((response) => response.json())
      .then((data) => {
        setMatches(data);
      });
  }, [teamId]);

  useEffect(() => {
    if (!team || !matches.length) return;

    let wins = 0;
    let losses = 0;
    let draws = 0;
    let played = 0;

    const teamMatches = matches.filter(
      (match) => match.homeTeam === team.id || match.awayTeam === team.id
    );

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
        } else {
          losses++;
        }
      } else if (teamScore > opponentScore) {
        wins++;
      } else if (teamScore < opponentScore) {
        losses++;
      } else {
        draws++;
      }
    });

    const rating = (wins / played) * 100;

    setStats({
      wins,
      losses,
      draws,
      played,
      rating: isNaN(rating) ? 0 : rating,
    });
  }, [matches, team]);

  if (!team) {
    return <p>Загрузка данных о команде...</p>;
  }

  const achievements = team.achievements;

  return (
    <div className={cls.profileContainer}>
      <div className={cls.container}>
        <div className={cls.blockIcon}>
          <img className={cls.icon} src={team.icon} alt="" />
          <h1>{team.name}</h1>
        </div>
        <div className={cls.block}>
          <div className={cls.stats}>
            <h2>Статистика</h2>
            <p>Сыграно игр: {stats.played}</p>
            <p>Победы: {stats.wins}</p>
            <p>Поражения: {stats.losses}</p>
            <p>Ничьи: {stats.draws}</p>
            <p>Рейтинг: {stats.rating.toFixed(2)}</p>
          </div>

          {/* Проверяем, если у команды есть достижения */}
          {achievements && (
            <div className={cls.titul}>
              <h2>Достижения</h2>
              {achievements.tournamentChampion && (
                <p>
                  <strong>Чемпион турнира: </strong>
                  {achievements.tournamentChampion} раз
                </p>
              )}
              {achievements.leagueWinner && (
                <p>
                  <strong>Победитель лиги: </strong>
                  {achievements.leagueWinner} раз
                </p>
              )}
              {achievements.cups && (
                <p>
                  <strong>Кубки: </strong>
                  {achievements.cups} раз
                </p>
              )}
              {achievements.tournamentWinner && (
                <p>
                  <strong>Победитель турнира: </strong>
                  {achievements.tournamentWinner} раз
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Передаем все данные о матчах и командах в компонент истории матчей */}
      <ProfileHistoryMatch
        matches={matches}
        teams={teams} // передаем полный список команд
        teamId={teamId}
      />
    </div>
  );
};

export default TeamProfile;

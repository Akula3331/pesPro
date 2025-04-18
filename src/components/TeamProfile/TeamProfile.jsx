import React, { useState, useEffect } from 'react';
import cls from "./TeamProfile.module.scss";
import ProfileHistoryMatch from "../ProfileHistoryMatch/ProfileHistoryMatch";
import { useParams } from "react-router-dom";
import TeamStatsGraph from '../UI/TeamStatsGraph/TeamStatsGraph';

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
  const [league, setLeague] = useState(null);

  useEffect(() => {
    // Загружаем список всех команд
    fetch("/teams.json")
      .then((response) => response.json())
      .then((data) => {
        setTeams(data); // Сохраняем список команд
        const teamData = data.find((team) => team.id === parseInt(teamId));
        setTeam(teamData);
      });

    // Загружаем список матчей
    fetch("/matches.json")
      .then((response) => response.json())
      .then((data) => {
        setMatches(data);
      });

    // Загружаем лиги
    fetch("/leagueId.json")
      .then((response) => response.json())
      .then((data) => {
        const leagueData = data.find((league) => league.id === team?.leagueId);
        setLeague(leagueData); // Устанавливаем информацию о лиге
      });
  }, [teamId, team?.leagueId]);

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

    const rating = ((wins + draws * 0.5) / played) * 100;

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

  // Функция для подсчета всех достижений
  const calculateTotalAchievements = (achievements) => {
    let total = 0;
    if (achievements.tournamentChampion) total += achievements.tournamentChampion.length;
    if (achievements.leagueWinner) total += achievements.leagueWinner.length;
    if (achievements.cups) total += achievements.cups.length;
    if (achievements.tournamentWinner) total += achievements.tournamentWinner.length;
    return total;
  };

  // Функция для отображения сезонов
  const renderSeasons = (value) => {
    if (!value) return null; // Если пусто, ничего не выводим
  
    const seasons = Array.isArray(value)
      ? value.map((v) => `S${v}`) // Для чисел добавляем "S" перед числом
      : String(value).split(",").map((v) => `S${v.trim()}`); // Если строка, преобразуем её в массив
  
    return seasons.join(", ");
  };

  return (
    <div className={cls.profileContainer}>
      <div className={cls.container}>
        <div className={cls.blockIcon}>
          <img className={cls.icon} src={team.icon} alt="" />
          <div className={cls.leagueCon}>
          <h1 className={cls.title}>{team.name}</h1>
            
          {/* Отображаем лигу */}
          {league && (
            <p className={cls.league}>
              Лига: <strong>{league.name}</strong>
            </p>
          )}

          {/* Владельцы команды */}
          {team.owners && team.owners.length > 0 && (
            <p><strong>Владельцы: </strong>{team.owners.join(", ")}</p>
          )}
          </div>
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
              <p><strong>Всего достижений: </strong>{calculateTotalAchievements(achievements)}</p>
              {achievements.tournamentChampion && (
                <p>
                  <strong>Чемпион турнира: </strong>
                  {renderSeasons(achievements.tournamentChampion)}
                </p>
              )}
              {achievements.leagueWinner && (
                <p>
                  <strong>Победитель лиги: </strong>
                  {renderSeasons(achievements.leagueWinner)}
                </p>
              )}
              {achievements.cups && (
                <p>
                  <strong>Кубки: </strong>
                  {renderSeasons(achievements.cups)}
                </p>
              )}
              {achievements.tournamentWinner && (
                <p>
                  <strong>Финалист турнира: </strong>
                  {renderSeasons(achievements.tournamentWinner)}
                </p>
              )}
            </div>
          )}

        </div>
        <TeamStatsGraph matches={matches} teamId={team.id} />

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

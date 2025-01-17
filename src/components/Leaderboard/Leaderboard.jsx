import React, { useState, useEffect } from 'react';
import cls from './Leaderboard.module.scss';

const Leaderboard = () => {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [sortType, setSortType] = useState('wins');  // Состояние для текущего типа сортировки

  // Загружаем данные о командах
  useEffect(() => {
    fetch('/teams.json')
      .then((response) => response.json())
      .then((data) => {
        setTeams(data); // Сохраняем все команды
      });
  }, []);

  // Загружаем данные о матчах
  useEffect(() => {
    fetch('/matches.json')
      .then((response) => response.json())
      .then((data) => {
        setMatches(data); // Сохраняем все матчи
      });
  }, []);

  // Подсчет статистики для всех команд
  useEffect(() => {
    const teamStats = teams.map((team) => {
      const teamMatches = matches.filter(
        (match) => match.homeTeam === team.id || match.awayTeam === team.id
      );

      let wins = 0;
      let losses = 0;
      let draws = 0;
      let played = teamMatches.length;
      let points = 0;
      let goalsScored = 0; // Общее количество забитых голов
      let goalsConceded = 0; // Общее количество пропущенных голов

      teamMatches.forEach((match) => {
        const isHome = match.homeTeam === team.id;
        const teamScore = isHome ? match.homeScore : match.awayScore;
        const opponentScore = isHome ? match.awayScore : match.homeScore;
        const teamPenalties = isHome ? match.penalty?.homeTeamPenalties : match.penalty?.awayTeamPenalties;
        const opponentPenalties = isHome ? match.penalty?.awayTeamPenalties : match.penalty?.homeTeamPenalties;

        // Если есть пенальти, то считаем победу или поражение
        if (match.penalty) {
          if (teamPenalties > opponentPenalties) {
            wins++;
            points += 3; // Победа (3 очка)
          } else {
            losses++;
            points += 0; // Поражение (0 очков)
          }
        }
        // Если нет пенальти, то считаем ничью
        else if (teamScore === opponentScore) {
          draws++;
          points += 1; // Ничья (1 очко)
        }
        // В остальных случаях определяем победу или поражение
        else if (teamScore > opponentScore) {
          wins++;
          points += 3; // Победа (3 очка)
        } else {
          losses++;
          points += 0; // Поражение (0 очков)
        }

        // Добавляем голы
        goalsScored += teamScore;
        goalsConceded += opponentScore;
      });

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
      };
    });

    // Фильтруем команды, у которых сыграно хотя бы 2 игры
    const filteredStats = teamStats.filter((team) => team.played >= 2);

    // Сортируем по выбранному типу сортировки
    const sortedStats = [...filteredStats].sort((a, b) => {
      if (sortType === 'points') {
        return b.points - a.points; // Сортировка по очкам
      } else if (sortType === 'wins') {
        return b.wins - a.wins;
      } else if (sortType === 'losses') {
        return b.losses - a.losses;
      } else if (sortType === 'played') {
        return b.played - a.played;
      } else if (sortType === 'goalsScored') {
        return b.goalsScored - a.goalsScored;
      } else if (sortType === 'goalsConceded') {
        return b.goalsConceded - a.goalsConceded;
      }
      return 0;
    });

    // Добавляем одинаковые места для команд с одинаковыми очками
    const leaderboardWithRanks = [];
    let rank = 1; // Начальный рейтинг
    let prevPoints = null; // Предыдущие очки

    // Присваиваем одинаковые места командам с одинаковыми очками
    sortedStats.forEach((team, index) => {
      if (prevPoints !== null && prevPoints === team.points) {
        // Если очки одинаковые с предыдущей командой, то оставляем тот же ранг
        leaderboardWithRanks.push({ ...team, rank: leaderboardWithRanks[leaderboardWithRanks.length - 1].rank });
      } else {
        // Если очки отличаются, увеличиваем ранг
        leaderboardWithRanks.push({ ...team, rank });
        rank++;
      }

      prevPoints = team.points; // Обновляем предыдущие очки
    });

    // Отображаем только 10 команд
    setLeaderboard(leaderboardWithRanks.slice(0, 10));
  }, [teams, matches, sortType]);

  return (
    <div>
      <h1>Таблица лидеров</h1>
      <div className={cls.sortContainer}>
        {/* Кнопки для сортировки */}
        <button onClick={() => setSortType('points')}>По очкам</button>
        <button onClick={() => setSortType('wins')}>По победам</button>
        <button onClick={() => setSortType('losses')}>По поражениям</button>
        <button onClick={() => setSortType('goalsScored')}>По забитым голам</button>
        <button onClick={() => setSortType('goalsConceded')}>По пропущенным голам</button>
        <button onClick={() => setSortType('played')}>По сыгранным играм</button>
      </div>
      <div className={cls.tableContainer}>
        <table className={cls.leaderboardTable}>
          <thead>
            <tr>
              <th>Место</th>
              <th>Команда</th>
              <th>Сыграно</th>
              <th>Победы</th>
              <th>Поражения</th>
              <th>Ничьи</th>
              <th>Забито</th>
              <th>Пропущено</th>
              <th>Очки</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((team) => (
              <tr key={team.id}>
                <td>{team.rank}</td> {/* Место с учетом одинаковых очков */}
                <td>{team.name}</td>
                <td>{team.played}</td>
                <td>{team.wins}</td>
                <td>{team.losses}</td>
                <td>{team.draws}</td>
                <td>{team.goalsScored}</td>
                <td>{team.goalsConceded}</td>
                <td>{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;

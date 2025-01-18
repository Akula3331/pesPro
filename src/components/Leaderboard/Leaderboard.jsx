import React, { useState, useEffect } from 'react';
import cls from './Leaderboard.module.scss';

const Leaderboard = () => {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [sortType, setSortType] = useState('wins');

  useEffect(() => {
    fetch('/teams.json')
      .then((response) => response.json())
      .then((data) => {
        setTeams(data);
      });
  }, []);

  useEffect(() => {
    fetch('/matches.json')
      .then((response) => response.json())
      .then((data) => {
        setMatches(data);
      });
  }, []);

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
      let goalsScored = 0;
      let goalsConceded = 0;

      teamMatches.forEach((match) => {
        const isHome = match.homeTeam === team.id;
        const teamScore = isHome ? match.homeScore : match.awayScore;
        const opponentScore = isHome ? match.awayScore : match.homeScore;

        if (teamScore === opponentScore) {
          draws++;
          points += 1;
        } else if (teamScore > opponentScore) {
          wins++;
          points += 3;
        } else {
          losses++;
        }

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

    const filteredStats = teamStats.filter((team) => team.played >= 2);

    const sortedStats = [...filteredStats].sort((a, b) => {
      if (sortType === 'points') {
        return b.points - a.points;
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

    const leaderboardWithRanks = [];
    let rank = 1;
    let prevPoints = null;

    sortedStats.forEach((team) => {
      if (prevPoints !== null && prevPoints === team.points) {
        leaderboardWithRanks.push({ ...team, rank: leaderboardWithRanks[leaderboardWithRanks.length - 1].rank });
      } else {
        leaderboardWithRanks.push({ ...team, rank });
        rank++;
      }

      prevPoints = team.points;
    });

    setLeaderboard(leaderboardWithRanks.slice(0, 10));
  }, [teams, matches, sortType]);

  return (
    <div>
      <h1>Таблица лидеров</h1>
      <div className={cls.sortContainer}>
        <button onClick={() => setSortType('points')}>По очкам</button>
        <button onClick={() => setSortType('wins')}>По победам</button>
        <button onClick={() => setSortType('losses')}>По поражениям</button>
        <button onClick={() => setSortType('goalsScored')}>По забитым голам</button>
        <button onClick={() => setSortType('goalsConceded')}>По пропущенным голам</button>
        <button onClick={() => setSortType('played')}>По сыгранным играм</button>
      </div>
      <div className={cls.gridContainer}>
        {/* Шапка таблицы */}
        <div className={cls.gridHeader}>
          <div>Место</div>
          <div>Команда</div>
          <div>Сыграно</div>
          <div>Победы</div>
          <div>Поражения</div>
          <div>Ничьи</div>
          <div>Забито</div>
          <div>Пропущено</div>
          <div>Очки</div>
        </div>
        {/* Список команд */}
        {leaderboard.map((team) => (
          <div key={team.id} className={cls.gridRow}>
            <div>{team.rank}</div>
            <div>{team.name}</div>
            <div>{team.played}</div>
            <div>{team.wins}</div>
            <div>{team.losses}</div>
            <div>{team.draws}</div>
            <div>{team.goalsScored}</div>
            <div>{team.goalsConceded}</div>
            <div>{team.points}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;

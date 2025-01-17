import React, { useState, useEffect } from 'react';
import cls from './HistoryPage.module.scss';
import MatchHistory from './../../components/MatchHistory/MatchHistory';  // Импортируем MatchHistory

const HistoryPage = () => {
  const [matches, setMatches] = useState([]);  // Данные о матчах
  const [teams, setTeams] = useState([]);  // Данные о командах

  // Загружаем данные о матчах и командах
  useEffect(() => {
    const fetchData = async () => {
      const matchResponse = await fetch('/matches.json'); // Данные о матчах
      const matchData = await matchResponse.json();
      setMatches(matchData); // Сохраняем матчи

      const teamResponse = await fetch('/teams.json'); // Данные о командах
      const teamData = await teamResponse.json();
      setTeams(teamData); // Сохраняем команды
    };

    fetchData(); // Загружаем данные
  }, []); // Загружаем только один раз при монтировании компонента

  return (
    <div className={cls.container}>
      {/* Передаем данные в MatchHistory */}
      <MatchHistory
        matches={matches}
        teams={teams}
      />
    </div>
  );
};

export default HistoryPage;

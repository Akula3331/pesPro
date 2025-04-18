import React, { useState } from 'react';
import cls from './TeamSelector.module.scss';

const TeamSelector = ({ teams, onSelectTeams }) => {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');

  const sortedTeams = [...teams].sort((a, b) => a.name.localeCompare(b.name));

  const handleCompareClick = () => {
    if (team1 && team2 && team1 !== team2) {
      const selectedTeam1 = teams.find((t) => t.id === team1);
      const selectedTeam2 = teams.find((t) => t.id === team2);
      onSelectTeams([selectedTeam1, selectedTeam2]);
    }
  };

  const handleReset = () => {
    setTeam1('');
    setTeam2('');
    onSelectTeams([]); // или null/null, зависит от реализации
  };

  return (
    <div className={cls.teamSelector}>
      <h2>Выберите команды для сравнения</h2>

      <div className={cls.selector}>
        <select value={team1} onChange={(e) => setTeam1(e.target.value)}>
          <option value="">Первая команда</option>
          {sortedTeams.map((team) => (
            <option key={team.id} value={team.id} disabled={team.id === team2}>
              {team.name}
            </option>
          ))}
        </select>

        <select value={team2} onChange={(e) => setTeam2(e.target.value)}>
          <option value="">Вторая команда</option>
          {sortedTeams.map((team) => (
            <option key={team.id} value={team.id} disabled={team.id === team1}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      <div className={cls.buttonRow}>
        <button onClick={handleCompareClick} disabled={!team1 || !team2 || team1 === team2}>
          Сравнить
        </button>
        <button onClick={handleReset} className={cls.resetButton}>
          Сбросить
        </button>
      </div>
    </div>
  );
};

export default TeamSelector;

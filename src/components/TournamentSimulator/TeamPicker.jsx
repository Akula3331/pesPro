import React, { useState } from 'react';
import cls from './TeamPicker.module.scss';

const TeamPicker = ({ teams, maxTeams, selectedTeams, setSelectedTeams, onStart }) => {
  const [toast, setToast] = useState('');

  const handleToggle = (team) => {
    const isSelected = selectedTeams.includes(team);
    if (isSelected) {
      setSelectedTeams(selectedTeams.filter((t) => t !== team));
    } else {
      if (selectedTeams.length < maxTeams) {
        setSelectedTeams([...selectedTeams, team]);
      } else {
        setToast(`Можно выбрать только ${maxTeams} команд`);
        setTimeout(() => setToast(''), 2000); // убираем через 2 секунды
      }
      
    }
  };

  return (
    <div className={cls.con}>
      <p className={cls.number}>Выбрано: {selectedTeams.length} из {maxTeams}</p>
      <div className={cls.block}>
        {teams.map((team) => (
          <div
            key={team.id}
            className={`${cls.item} ${selectedTeams.includes(team) ? cls.selected : ''}`}
            onClick={() => handleToggle(team)}
          >
            <img className={cls.icon} src={team.icon} alt={team.name} />
          </div>
        ))}
      </div>

      {selectedTeams.length === maxTeams && (
        <button className={cls.button} onClick={onStart} >
          Начать турнир
        </button>
      )}
      {toast && <div className={cls.toast}>{toast}</div>}

    </div>
  );
};

export default TeamPicker;

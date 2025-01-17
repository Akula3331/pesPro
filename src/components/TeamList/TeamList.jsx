import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Для ссылок на профили команд
import cls from './TeamList.module.scss';

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [matchCounts, setMatchCounts] = useState({}); // Для хранения количества матчей каждой команды

  useEffect(() => {
    // Загружаем данные о командах
    fetch('/teams.json')
      .then((response) => response.json())
      .then((data) => {
        // Сортируем команды по алфавиту
        const sortedTeams = data.sort((a, b) => a.name.localeCompare(b.name));
        setTeams(sortedTeams);
      });

    // Загружаем данные о матчах
    fetch('/matches.json')
      .then((response) => response.json())
      .then((matches) => {
        const counts = {};

        matches.forEach((match) => {
          const { homeTeam, awayTeam } = match;

          // Увеличиваем счётчик для домашней команды
          counts[homeTeam] = (counts[homeTeam] || 0) + 1;

          // Увеличиваем счётчик для гостевой команды
          counts[awayTeam] = (counts[awayTeam] || 0) + 1;
        });

        setMatchCounts(counts); // Сохраняем количество матчей в состояние
      });
  }, []);

  return (
    <div className={cls.container}>
      <h1 className={cls.title}>Список команд</h1>
      <div className={cls.block}>
        {teams.map((team) => (
          <div key={team.id} className={cls.teamItem}>
            <Link className={cls.linkCon} to={`/team/${team.id}`}>
              <img
                src={team.icon} // Путь к эмблеме команды
                alt={`${team.name} logo`}
                className={cls.teamIcon} // Класс для стилизации иконки
              />
              <p className={cls.link}>{team.name}</p>
              <p className={cls.matchCount}>
               {matchCounts[team.id] || 0}
            </p>
            </Link>
            {/* Отображение количества сыгранных матчей */}
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamList;

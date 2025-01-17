import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cls from './ProfileHistoryMatch.module.scss';
import CustomSelect from '../CustomSelect/CustomSelect';

const ProfileHistoryMatch = ({ matches, teams, teamId }) => {
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedTournament, setSelectedTournament] = useState('all');

  const convertDate = (dateStr) => {
    const day = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4);
    const year = `20${dateStr.substring(4, 6)}`;
    const formattedDate = `${year}-${month}-${day}`;
    return new Date(formattedDate);
  };

  const filteredMatches = matches.filter((match) => {
    // Фильтрация по турнирам
    const tournamentFilter = 
      selectedTournament === "all" ||
      (Array.isArray(selectedTournament) 
        ? selectedTournament.includes(match.matchType)  // Для Кубков проверяем принадлежность к массиву
        : match.matchType === selectedTournament); // Для других типов сравнение по значению

    // Фильтрация по выбранной команде
    return tournamentFilter && 
      (match.homeTeam === parseInt(teamId) || match.awayTeam === parseInt(teamId));
  });

  const sortedMatches = filteredMatches.sort((a, b) => {
    const idA = a.id;
    const idB = b.id;
    return sortOrder === "asc" ? idA - idB : idB - idA;
  });

  const getTeamNameById = (id) => {
    const team = teams.find((team) => team.id === id);
    return team ? team.name : 'Unknown Team';
  };

  const tournamentOptions = [
    { value: "all", label: "Все турниры" },
    { value: "tournament", label: "Турнирные" },
    { value: "regular", label: "Дружеские" },
    { value: "league", label: "Лига" },
    { value: ["cup", "englandCup", "spainCup", "franceCup", "italyCup", "germanyCup", "portugalCup"], label: "Кубки" }, 
  ];

  const sortOptions = [
    { value: "desc", label: "По убыванию" },
    { value: "asc", label: "По возрастанию" },
  ];

  const handleTournamentChange = (value) => {
    // Если выбран "Кубки", то назначаем массив значений
    if (value === "cup") {
      setSelectedTournament([
        "cup", "englandCup", "spainCup", "franceCup", 
        "italyCup", "germanyCup", "portugalCup"
      ]);
    } else {
      setSelectedTournament(value);
    }
  };

  return (
    <div className={cls.container}>
      <h1>История матчей</h1>

      <div className={cls.filters}>
        <CustomSelect
          options={tournamentOptions}
          selectedOption={selectedTournament}
          onChange={handleTournamentChange} // Используем новый обработчик
        />
        <CustomSelect
          options={sortOptions}
          selectedOption={sortOrder}
          onChange={setSortOrder}
        />
      </div>

      <div className={cls.con}>
        {sortedMatches.length === 0 ? (
          <p>Нет матчей для выбранных фильтров.</p>
        ) : (
          sortedMatches.map((match) => {
            const homeTeam = getTeamNameById(match.homeTeam);
            const awayTeam = getTeamNameById(match.awayTeam);

            return (
              <div
                key={match.id}
                className={`${cls.block} ${cls[match.matchType]}`}
              >
                
                <div className={cls.matchDetails}>
                  <Link to={`/team/${match.homeTeam}`} className={cls.teamName}>
                    {homeTeam}
                  </Link>
                  <span className={cls.score}>
                  <p className={cls.date}>
                      {match.date.split("").reduce((acc, char, index) => {
                        if (index === 2 || index === 4) {
                          acc += ".";
                        }
                        acc += char;
                        return acc;
                      }, "")}
                    </p>
                    {match.homeScore} - {match.awayScore}
                    {match.penalty && (
                      <div className={cls.penalty}>
                        {match.penalty.homeTeamPenalties} -{' '}
                        {match.penalty.awayTeamPenalties}
                      </div>
                    )}
                  </span>
                  <Link to={`/team/${match.awayTeam}`} className={cls.teamName}>
                    {awayTeam}
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProfileHistoryMatch;

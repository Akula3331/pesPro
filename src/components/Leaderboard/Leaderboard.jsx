import React, { useState, useEffect } from "react";
import cls from "./Leaderboard.module.scss";
import CustomSelect from "../CustomSelect/CustomSelect";
import { calculateLeaderboard } from "./leaderboardUtils"; // импортируем логику подсчёта

const Leaderboard = () => {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [sortType, setSortType] = useState("wins");
  const [matchTypeFilter, setMatchTypeFilter] = useState("all"); // 👈 добавили фильтр по типу матча

  useEffect(() => {
    fetch("/teams.json")
      .then((response) => response.json())
      .then((data) => {
        setTeams(data);
      });
  }, []);

  useEffect(() => {
    fetch("/matches.json")
      .then((response) => response.json())
      .then((data) => {
        setMatches(data);
      });
  }, []);

  useEffect(() => {
    if (!teams.length || !matches.length) return;

    // Подсчёт и сортировка таблицы
    const result = calculateLeaderboard(teams, matches, sortType, matchTypeFilter);
    setLeaderboard(result);
  }, [teams, matches, sortType, matchTypeFilter]); // 👈 добавили зависимость

  const columns = {
    points: ["rank", "name", "points"],
    wins: ["rank", "name", "wins"],
    losses: ["rank", "name", "losses"],
    played: ["rank", "name", "played"],
    goalsScored: ["rank", "name", "goalsScored"],
    goalsConceded: ["rank", "name", "goalsConceded"],
    goalDifference: ["rank", "name", "goalDifference"],
    rating: ["rank", "name", "rating"],
  };

  const columnHeaders = {
    rank: "Место",
    name: "Команда",
    points: "Очки",
    wins: "Победы",
    losses: "Поражения",
    played: "Сыграно",
    goalsScored: "Забито",
    goalsConceded: "Пропущено",
    goalDifference: "Разница мячей",
    rating: "Рейтинг (%)",
  };

  return (
    <div className={cls.container}>
      <h1 className={cls.title}>Таблица лидеров</h1>

      {/* 🔽 Фильтр по типу матча */}
      <div className={cls.filterContainer}>
        <CustomSelect
          options={[
            { value: "all", label: "Все" },
            { value: "tournament", label: "Турнир" },
            { value: "league", label: "Лига" },
            { value: "regular", label: "Товарищеский" },
          ]}
          selectedOption={matchTypeFilter}
          onChange={setMatchTypeFilter}
        />
      </div>

      {/* 🔽 Кнопки сортировки */}
      <div className={cls.sortContainer}>
        <button className={cls.button} onClick={() => setSortType("points")}>О</button>
        <button className={cls.button} onClick={() => setSortType("wins")}>В</button>
        <button className={cls.button} onClick={() => setSortType("losses")}>П</button>
        <button className={cls.button} onClick={() => setSortType("goalsScored")}>ЗМ</button>
        <button className={cls.button} onClick={() => setSortType("goalsConceded")}>ПМ</button>
        <button className={cls.button} onClick={() => setSortType("goalDifference")}>РМ</button>
        <button className={cls.button} onClick={() => setSortType("played")}>И</button>
        <button className={cls.button} onClick={() => setSortType("rating")}>Р</button>
      </div>

      <div className={cls.gridContainer}>
        <div className={cls.gridHeader}>
          {columns[sortType].map((column) => (
            <div key={column}>{columnHeaders[column]}</div>
          ))}
        </div>
        {leaderboard.map((team) => (
          <div key={team.id} className={cls.gridRow}>
            {columns[sortType].map((column) => (
              <div className={cls.rowItem} key={column}>
                {team[column]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;

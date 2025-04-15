import React, { useState } from "react";
import { Link } from "react-router-dom";
import cls from "./ProfileHistoryMatch.module.scss";
import CustomSelect from "../CustomSelect/CustomSelect";

const ProfileHistoryMatch = ({ matches, teams, teamId }) => {
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedTournament, setSelectedTournament] = useState("all");
  const [goalDifferenceFilter, setGoalDifferenceFilter] = useState("");
  const [teamNameFilter, setTeamNameFilter] = useState("");
  const [matchLimit, setMatchLimit] = useState(25);

  const formatDate = (dateInput) => {
    const dateString = String(dateInput).padStart(6, "0");
    if (dateString.length !== 6) return "Неизвестная дата";
  
    const day = dateString.slice(0, 2);
    const month = dateString.slice(2, 4);
    const year = "20" + dateString.slice(4, 6); // <- тут важный момент
  
    const date = new Date(`${year}-${month}-${day}`);
    return isNaN(date.getTime()) ? "Неверная дата" : date.toLocaleDateString("ru-RU");
  };
  

  const getTeamNameById = (id) => {
    const team = teams.find((team) => team.id === id);
    return team ? team.name : "Неизвестная команда";
  };

  const cupImages = {
    englandCup: "/image/england.svg",
    spainCup: "/image/spain.svg",
    franceCup: "/image/france.svg",
    italyCup: "/image/italy.svg",
    germanyCup: "/image/germany.svg",
    portugalCup: "/image/portugal.svg",
    asiaCup: "/image/saudi.svg",
    europeCup: "/image/europe.svg",
    brazilCup: "/image/brazil.svg",
    netherlandCup: "/image/netherland.svg",
    usaCup: "/image/usa.svg",
    turkeyCup: "/image/turkey.svg",
    russiaCup: "/image/russia.svg",
  };

  const getCupImage = (matchType) => cupImages[matchType] || null;

  const filterMatches = () => {
    return matches.filter((match) => {
      const isTeamInMatch =
        match.homeTeam === parseInt(teamId) || match.awayTeam === parseInt(teamId);

      const tournamentFilter =
        selectedTournament === "all" ||
        (Array.isArray(selectedTournament)
          ? selectedTournament.includes(match.matchType)
          : match.matchType === selectedTournament);

      const teamFilter =
        teamNameFilter === "" ||
        teams
          .filter((team) =>
            team.name.toLowerCase().includes(teamNameFilter.toLowerCase())
          )
          .some(
            (team) => team.id === match.homeTeam || team.id === match.awayTeam
          );

      const goalDifferenceValid =
        goalDifferenceFilter === "" ||
        Math.abs(match.homeScore - match.awayScore) ===
          parseInt(goalDifferenceFilter);

      return isTeamInMatch && tournamentFilter && teamFilter && goalDifferenceValid;
    });
  };

  const sortedMatches = filterMatches().sort((a, b) => {
    return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
  });

  const limitedMatches = sortedMatches.slice(0, matchLimit);

  const tournamentOptions = [
    { value: "all", label: "Все турниры" },
    { value: "tournament", label: "Турнирные" },
    { value: "regular", label: "Дружеские" },
    { value: "league", label: "Лига" },
    {
      value: [
        "cup",
        "englandCup",
        "spainCup",
        "franceCup",
        "italyCup",
        "germanyCup",
        "portugalCup",
        "argentinaCup",
        "russiaCup",
        "turkeyCup",
        "usaCup",
        "netherlandCup",
        "brazilCup",
        "europeCup",
        "asiaCup",
      ],
      label: "Кубки",
    },
  ];

  const sortOptions = [
    { value: "desc", label: "По убыванию" },
    { value: "asc", label: "По возрастанию" },
  ];

  return (
    <div className={cls.container}>
      <h1>История матчей</h1>

      <div className={cls.filters}>
        <CustomSelect
          options={tournamentOptions}
          selectedOption={selectedTournament}
          onChange={setSelectedTournament}
        />
        <CustomSelect
          options={sortOptions}
          selectedOption={sortOrder}
          onChange={setSortOrder}
        />
        <input
          type="text"
          placeholder="Поиск по названию команды"
          className={cls.teamSearch}
          value={teamNameFilter}
          onChange={(e) => setTeamNameFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Разница голов"
          className={cls.goalDifference}
          value={goalDifferenceFilter}
          onChange={(e) => setGoalDifferenceFilter(e.target.value)}
        />
        <input
          type="number"
          placeholder="Количество матчей"
          className={cls.matchLimit}
          value={matchLimit}
          onChange={(e) => setMatchLimit(Number(e.target.value))}
        />
      </div>

      <div className={cls.con}>
        {limitedMatches.length === 0 ? (
          <p>Нет матчей для выбранных фильтров.</p>
        ) : (
          limitedMatches.map((match) => {
            const homeTeam = getTeamNameById(match.homeTeam);
            const awayTeam = getTeamNameById(match.awayTeam);
            const cupImage = getCupImage(match.matchType);

            return (
              <div
                key={match.id}
                className={`${cls.block} ${cls[match.matchType]}`}
              >
                <div className={cls.matchDetails}>
                  {cupImage && (
                    <img
                      className={cls.cupImage}
                      src={cupImage}
                      alt="Cup Logo"
                    />
                  )}
                  <Link to={`/team/${match.homeTeam}`} className={cls.teamName}>
                    {homeTeam}
                  </Link>
                  <span className={cls.score}>
                    <p className={cls.date}>{formatDate(match.date)}</p>
                    {match.homeScore} - {match.awayScore}
                    {match.penalty && (
                      <div className={cls.penalty}>
                        {match.penalty.homeTeamPenalties} -{" "}
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

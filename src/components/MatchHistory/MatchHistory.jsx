import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cls from "./MatchHistory.module.scss";
import CustomSelect from "../CustomSelect/CustomSelect";

const MatchHistory = ({ teamId }) => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedTournament, setSelectedTournament] = useState("all");
  const [teamNameFilter, setTeamNameFilter] = useState(""); // Фильтр по названию команды
  const [goalDifferenceFilter, setGoalDifferenceFilter] = useState(""); // Фильтр по разнице голов
  const [matchLimit, setMatchLimit] = useState(25); // Лимит количества матчей

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchResponse = await fetch("/matches.json");
        const matchData = await matchResponse.json();
        setMatches(matchData);

        const teamResponse = await fetch("/teams.json");
        const teamData = await teamResponse.json();
        setTeams(teamData);
      } catch (error) {
        console.error("Ошибка при загрузке данных", error);
      }
    };

    fetchData();
  }, []);

  const filterMatches = () => {
    return matches.filter((match) => {
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

      const goalDifferenceFilterValid =
        goalDifferenceFilter === "" ||
        Math.abs(match.homeScore - match.awayScore) ===
          parseInt(goalDifferenceFilter);

      return tournamentFilter && teamFilter && goalDifferenceFilterValid;
    });
  };

  const sortedMatches = filterMatches().sort((a, b) => {
    const idA = a.id;
    const idB = b.id;
    return sortOrder === "asc" ? idA - idB : idB - idA;
  });

  const limitedMatches = sortedMatches.slice(0, matchLimit);

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
    argentinaCup: "/image/argentina.svg",
  };

  const getCupImage = (matchType) => cupImages[matchType] || null;

  const formatDate = (dateInput) => {
    const dateString = String(dateInput).padStart(6, "0");
    if (dateString.length !== 6) return "Неизвестная дата";
  
    const day = dateString.slice(0, 2);
    const month = dateString.slice(2, 4);
    const year = "20" + dateString.slice(4, 6); // <- тут важный момент
  
    const date = new Date(`${year}-${month}-${day}`);
    return isNaN(date.getTime()) ? "Неверная дата" : date.toLocaleDateString("ru-RU");
  };
  
  const tournamentOptions = [
    { value: "all", label: "Все матчи" },
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

  const cupTypes = [
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
  ];
  
  const sortOptions = [
    { value: "desc", label: "Убывание" },
    { value: "asc", label: "Возрастание" },
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
                className={`${cls.block}  ${cls[match.matchType]} ${cupTypes.includes(match.matchType) ? cls.cupBlock : ""}`}
              >
                
                <div className={cls.matchDetails}>
                  {cupImage && (
                    <img
                      src={cupImage}
                      alt={match.matchType}
                      className={cls.cupImage}
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

export default MatchHistory;

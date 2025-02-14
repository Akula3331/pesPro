import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cls from "./TournamentPage.module.scss";
import CountryCup from "../../components/CountryCup/CountryCup"; // Импортируем CountryCup

const TournamentPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [loadingLeagues, setLoadingLeagues] = useState(true);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Загрузка данных турниров
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch("/tournaments.json");
        if (!response.ok) throw new Error("Ошибка при загрузке турниров");
        const data = await response.json();
        setTournaments(data.tournaments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTournaments(false);
      }
    };

    fetchTournaments();
  }, []);

  // Загрузка данных лиг
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await fetch("/league.json");
        if (!response.ok) {
          throw new Error(
            `Ошибка: ${response.status} - ${response.statusText}`
          );
        }
        const data = await response.json();
        setLeagues(data.leagues || []);
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
        setError("Ошибка при загрузке данных");
      } finally {
        setLoadingLeagues(false);
      }
    };

    fetchLeagues();
  }, []);

  // Загрузка данных для CountryCup
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cupResponse = await fetch("/cup.json");
        const cupData = await cupResponse.json();
        setCountries(cupData.countries);

        const teamResponse = await fetch("/teams.json");
        const teamData = await teamResponse.json();
        setTeams(teamData);

        const matchResponse = await fetch("/matches.json");
        const matchData = await matchResponse.json();
        setMatches(matchData);

        setLoading(false);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Функция для получения названия команды по её ID
  const getTeamById = (id) => {
    return (
      teams.find((team) => team.id === id) || {
        name: "Неизвестная команда",
        icon: "",
      }
    );
  };

  // Функция для получения матча по его ID
  const getMatchById = (id) => {
    return matches.find((match) => match.id === id);
  };

  // Функция для получения даты матча по ID в формате "дд.мм.гг"
  const getMatchDate = (matchId) => {
    const match = getMatchById(matchId);
    if (match) {
      const date = match.date;
      return `${date.slice(0, 2)}.${date.slice(2, 4)}.${date.slice(4, 6)}`;
    }
    return "Дата не найдена";
  };

  // Обработка состояния загрузки и ошибок
  if (loadingTournaments || loadingLeagues || loading)
    return <p>Загрузка данных...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className={cls.tournamentPage}>
      <h1 className={cls.glavTitle}>История турниров и лиг</h1>

      <div className={cls.sectionCon}>
        {/* История турниров */}
        <section>
          <h2 className={cls.sectionTitle}>Турниры</h2>
          {tournaments.length === 0 ? (
            <p>Турниров пока нет.</p>
          ) : (
            <div className={cls.grid}>
              {tournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className={cls.card}
                  onClick={() => navigate(`/tournament/${tournament.id}`)}
                >
                  <h3 className={cls.cardTitle}>S{tournament.id}</h3>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* История лиг */}
        <section>
          <h2 className={cls.sectionTitle}>Лиги</h2>
          {leagues.length === 0 ? (
            <p>Лиг пока нет.</p>
          ) : (
            <div className={cls.grid}>
              {leagues.map((league) => (
                <div
                  key={league.id}
                  className={cls.card}
                  onClick={() => navigate(`/league/${league.id}`)}
                >
                  <h3 className={cls.cardTitle}>S{league.id}</h3>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Кубки стран и чемпионаты */}
      <h2 className={cls.sectionTitle}>Чемпионаты Стран</h2>
      <CountryCup
        countries={countries}
        setSelectedCountry={setSelectedCountry}
        selectedCountry={selectedCountry}
        matches={matches}
        teams={teams}
      />
    </div>
  );
};

export default TournamentPage;

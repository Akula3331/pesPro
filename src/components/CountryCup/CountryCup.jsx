import React, { useState, useEffect } from 'react';
import cls from './CountryCup.module.scss';

function CountryCup() {
  const [countries, setCountries] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загрузка данных из JSON файлов
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем данные о странах с их кубками и сезонами
        const cupResponse = await fetch('/cup.json');
        const cupData = await cupResponse.json();
        setCountries(cupData.countries);

        // Загружаем данные о командах
        const teamResponse = await fetch('/teams.json');
        const teamData = await teamResponse.json();
        setTeams(teamData);

        setLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Функция для получения названия команды по её ID
  const getTeamById = (id) => {
    return teams.find((team) => team.id === id) || { name: 'Неизвестная команда', icon: '' };
  };

  // Фильтрация сезонов по выбранной стране
  const filteredSeasons = selectedCountry
    ? selectedCountry.seasons
    : [];

  // Отображаем информацию, если данные загружены
  if (loading) {
    return <p>Загрузка данных...</p>;
  }

  return (
    <div className={cls.container}>
      <h1 className={cls.title}>Кубки разных стран</h1>

      {/* Иконки флагов для выбора страны */}
      <div className={cls.flagContainer}>
        {countries.map((country) => (
          <img
            key={country.name}
            src={country.flag}
            alt={country.name}
            className={cls.flagIcon}
            onClick={() => setSelectedCountry(country)}
          />
        ))}
      </div>

      {/* Отображаем кубки для выбранной страны */}
      {selectedCountry && filteredSeasons.length === 0 && <p>Нет кубков для выбранной страны.</p>}

      {filteredSeasons.map((season) => (
        <div key={season.season} className={cls.seasonBlock}>
          <h2 className={cls.blockTitle}>Сезон {season.season}</h2>
          <p className={cls.data}>Дата: {season.date}</p>

          {season.matches.map((match) => {
            // Получаем информацию о командах, включая их название и иконку
            const homeTeam = getTeamById(match.homeTeam);
            const awayTeam = getTeamById(match.awayTeam);

            return (
              <div key={match.id} className={cls.match}>
                <div className={cls.matchDetails}>
                  <div className={cls.team}>
                    {/* Отображаем иконку и название домашней команды */}
                    <img src={homeTeam.icon} alt={homeTeam.name} className={cls.teamIcon} />
                    <p className={cls.name}>{homeTeam.name}</p>
                  </div>
                  <div className={cls.matchScore}>
                    <span className={cls.score}>{match.homeScore} - {match.awayScore}</span>
                    {match.penalty && (
                      <div className={cls.penalty}>
                        <p>
                          {match.penalty.homeTeamPenalties} - {match.penalty.awayTeamPenalties}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={cls.team}>
                    {/* Отображаем иконку и название гостевой команды */}
                    <img src={awayTeam.icon} alt={awayTeam.name} className={cls.teamIcon} />
                    <p className={cls.name}>{awayTeam.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default CountryCup;

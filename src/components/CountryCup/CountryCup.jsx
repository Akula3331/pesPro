import React, { useState, useEffect } from 'react';
import cls from './CountryCup.module.scss';

// Массив с флагами стран (можно использовать реальные URL-адреса изображений флагов)
const countryFlags = {
  england: '/path/to/england-flag.png',
  spain: '/path/to/spain-flag.png',
  france: '/path/to/france-flag.png',
  germany: '/path/to/germany-flag.png',
  italy: '/path/to/italy-flag.png',
  brazil: '/path/to/brazil-flag.png',
};

function CountryCup() {
  const [seasons, setSeasons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загрузка данных из JSON файлов
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем данные о кубках
        const cupResponse = await fetch('/cup.json');
        const cupData = await cupResponse.json();
        setSeasons(cupData.seasons);

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

  // Получаем команду по ID
  const getTeamById = (id) => {
    return teams.find((team) => team.id === id) || { name: 'Неизвестная команда' };
  };

  // Фильтрация сезонов по выбранной стране
  const filteredSeasons = selectedCountry
    ? seasons.filter((season) =>
        season.matches.some((match) => match.matchType === `${selectedCountry}Cup`)
      )
    : seasons;

  // Отображаем информацию, если данные загружены
  if (loading) {
    return <p>Загрузка данных...</p>;
  }

  return (
    <div className={cls.container}>
      <h1>Кубки разных стран</h1>

      {/* Иконки флагов для выбора страны */}
      <div className={cls.flagContainer}>
        {Object.keys(countryFlags).map((country) => (
          <img
            key={country}
            src={countryFlags[country]}
            alt={country}
            className={cls.flagIcon}
            onClick={() => setSelectedCountry(country)}
          />
        ))}
      </div>

      {/* Отображаем кубки для выбранной страны */}
      {filteredSeasons.length === 0 && <p>Нет кубков для выбранной страны.</p>}

      {filteredSeasons.map((season) => (
        <div key={season.season} className={cls.seasonBlock}>
          <h2>Сезон {season.season}</h2>
          <p>Дата: {season.date}</p>
          
          {season.matches.map((match) => {
            const homeTeam = getTeamById(match.homeTeam);
            const awayTeam = getTeamById(match.awayTeam);

            return (
              <div key={match.id} className={cls.match}>
                <div className={cls.matchDetails}>
                  <div className={cls.team}>
                    <h3>{homeTeam.name}</h3>
                    <span>({match.homeScore})</span>
                  </div>
                  <div className={cls.matchScore}>
                    <span>VS</span>
                  </div>
                  <div className={cls.team}>
                    <h3>{awayTeam.name}</h3>
                    <span>({match.awayScore})</span>
                  </div>
                </div>

                {/* Если матч с пенальти, показываем информацию о пенальти */}
                {match.penalty && (
                  <div className={cls.penalty}>
                    <p>
                      Пенальти: {match.penalty.homeTeamPenalties} - {match.penalty.awayTeamPenalties}
                    </p>
                  </div>
                )}
                <p>Тип матча: {match.matchType}</p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default CountryCup;

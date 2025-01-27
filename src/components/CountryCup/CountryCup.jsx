import React, { useState, useEffect } from 'react';
import cls from './CountryCup.module.scss';

function CountryCup() {
  const [countries, setCountries] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
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

        // Загружаем данные о матчах
        const matchResponse = await fetch('/matches.json');
        const matchData = await matchResponse.json();
        setMatches(matchData);

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

  // Функция для получения матча по его ID
  const getMatchById = (id) => {
    return matches.find((match) => match.id === id);
  };

  // Функция для получения даты матча по ID в формате "дд.мм.гг"
  const getMatchDate = (matchId) => {
    const match = getMatchById(matchId);
    if (match) {
      const date = match.date;
      // Форматируем дату, добавляем точки между цифрами
      return `${date.slice(0, 2)}.${date.slice(2, 4)}.${date.slice(4, 6)}`;
    }
    return 'Дата не найдена'; // Возвращаем сообщение, если матч не найден
  };

  // Если данные загружаются
  if (loading) {
    return <p>Загрузка данных...</p>;
  }

  return (
    <div className={cls.container}>
      <h1 className={cls.title}>Кубки стран</h1>

      {/* Флаги для выбора страны */}
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

      {/* Отображение сезонов и матчей для выбранной страны */}
      {selectedCountry && (
        <div className={cls.countryDetails}>
          <h2 className={cls.countryName}>{selectedCountry.name}</h2>
          {selectedCountry.seasons.map((season, index) => {
            const seasonNumber = index + 1; // Генерируем номер сезона на основе индекса

            return (
              <div key={seasonNumber} className={cls.seasonBlock}>
                <h3 className={cls.blockTitle}>Сезон {seasonNumber}</h3>

                {/* Получаем дату из первого матча сезона и форматируем её */}
                <p className={cls.data}>Дата: {getMatchDate(season.matchIds[0])}</p>

                {season.matchIds.length === 0 ? (
                  <p className={cls.noMatches}>Нет матчей в этом сезоне.</p>
                ) : (
                  season.matchIds.map((matchId) => {
                    const match = getMatchById(matchId); // Извлекаем матч по ID

                    if (!match) {
                      return <p key={matchId}>Матч не найден!</p>;
                    }

                    const homeTeam = getTeamById(match.homeTeam);
                    const awayTeam = getTeamById(match.awayTeam);

                    return (
                      <div key={match.id} className={cls.match}>
                        <div className={cls.matchDetails}>
                          <div className={cls.team}>
                            <img
                              src={homeTeam.icon}
                              alt={homeTeam.name}
                              className={cls.teamIcon}
                            />
                            <p className={cls.name}>{homeTeam.name}</p>
                          </div>
                          <div className={cls.matchScore}>
                            <span className={cls.score}>
                              {match.homeScore} - {match.awayScore}
                            </span>
                            {match.penalty && (
                              <div className={cls.penalty}>
                                <p>
                                  Пенальти: {match.penalty.homeTeamPenalties} -{' '}{match.penalty.awayTeamPenalties}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className={cls.team}>
                            <img
                              src={awayTeam.icon}
                              alt={awayTeam.name}
                              className={cls.teamIcon}
                            />
                            <p className={cls.name}>{awayTeam.name}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CountryCup;

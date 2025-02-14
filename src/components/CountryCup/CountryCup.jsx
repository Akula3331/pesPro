import React from "react";
import cls from "./CountryCup.module.scss";

const CountryCup = ({ countries, setSelectedCountry, selectedCountry, matches, teams }) => {

  // Функция для получения команды по ID
  const getTeamById = (id) => {
    return (
      teams.find((team) => team.id === id) || {
        name: "Неизвестная команда",
        icon: "",
      }
    );
  };

  // Функция для получения матча по ID
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

  return (
    <div className={cls.cupCon}>
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

      <div className={cls.matchCon}>
        {selectedCountry && (
          <div className={cls.countryDetails}>
            <h2 className={cls.countryName}>{selectedCountry.name}</h2>

            {/* Перебираем все сезоны страны */}
            {selectedCountry.seasons.map((season, index) => {
              return (
                <div key={index} className={cls.seasonBlock}>
                  {/* Если в сезоне нет матчей, показываем сообщение */}
                  {season.matchIds.length === 0 ? (
                    <p className={cls.noMatches}>Нет матчей в этом сезоне.</p>
                  ) : (
                    season.matchIds.map((matchId, matchIndex) => {
                      const match = getMatchById(matchId);

                      if (!match) {
                        return <p key={matchId}>Матч не найден!</p>;
                      }

                      const homeTeam = getTeamById(match.homeTeam);
                      const awayTeam = getTeamById(match.awayTeam);

                      return (
                        <div key={match.id} className={cls.match}>
                          <h3 className={cls.blockTitle}>
                            {/* Присваиваем уникальный номер сезона для каждого матча */}
                            S{matchIndex + 1}
                          </h3>
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
                              <p className={cls.data}>
                                {getMatchDate(matchId)}
                              </p>
                              <span className={cls.score}>
                                {match.homeScore} - {match.awayScore}
                              </span>
                              {match.penalty && (
                                <div className={cls.penalty}>
                                  <p>
                                    {match.penalty.homeTeamPenalties} -{" "}
                                    {match.penalty.awayTeamPenalties}
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
    </div>
  );
};

export default CountryCup;

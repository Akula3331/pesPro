import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Для получения параметра из URL
import cls from './LeagueList.module.scss'; // Импорт стилей

const LeagueList = () => {
  const { leagueId } = useParams(); // Получаем ID лиги из параметров маршрута
  const [teams, setTeams] = useState([]);
  const [currentLeague, setCurrentLeague] = useState(null);
  const [matches, setMatches] = useState([]);
  const [teamStats, setTeamStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загружаем данные о командах
  useEffect(() => {
    fetch('/teams.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных о командах');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Данные команд:', data); // Логируем данные о командах
        setTeams(data);
      })
      .catch((error) => {
        console.error(error); // Логируем ошибку, если она возникла
      });
  }, []);

  // Загружаем данные о лиге
  useEffect(() => {
    if (!leagueId) {
      setLoading(false);
      return;
    }

    fetch('/league.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных о лиге');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Данные лиги:', data); // Логируем данные о лиге
        const league = data.leagues.find((league) => league.id === parseInt(leagueId));
        if (league) {
          setCurrentLeague(league);
          setMatches(league.matches);
        } else {
          console.log('Лига не найдена');
        }
        setLoading(false); // Завершаем загрузку данных
      })
      .catch((error) => {
        console.error(error); // Логируем ошибку, если она возникла
        setLoading(false);
      });
  }, [leagueId]);

  // Подсчет статистики для выбранной лиги
  useEffect(() => {
    if (currentLeague && matches.length > 0) {
      const calculateStats = () => {
        const stats = currentLeague.teams.map((teamId) => {
          const teamMatches = matches.filter(
            (match) => match.homeTeam === teamId || match.awayTeam === teamId
          );

          let wins = 0;
          let losses = 0;
          let draws = 0;
          let goalsScored = 0;
          let goalsConceded = 0;
          let points = 0;

          teamMatches.forEach((match) => {
            const isHome = match.homeTeam === teamId;
            const teamScore = isHome ? match.homeScore : match.awayScore;
            const opponentScore = isHome ? match.awayScore : match.homeScore;

            if (teamScore === "" || opponentScore === "") {
              return;
            }

            goalsScored += teamScore;
            goalsConceded += opponentScore;

            if (teamScore > opponentScore) {
              wins++;
              points += 3;
            } else if (teamScore < opponentScore) {
              losses++;
            } else {
              draws++;
              points += 1;
            }
          });

          return {
            id: teamId,
            played: teamMatches.length,
            wins,
            losses,
            draws,
            goalsScored,
            goalsConceded,
            points,
          };
        });

        setTeamStats(stats);
      };

      calculateStats();
    }
  }, [currentLeague, matches]);

  const getTeamNameById = (id) => {
    const team = teams.find((team) => team.id === id);
    return team ? team.name : "Неизвестная команда";
  };

  if (loading) {
    return <p>Загрузка данных...</p>;
  }

  if (!currentLeague) {
    return <p>Лига не найдена.</p>;
  }

  return (
    <div className={cls.tableContainer}>
      <h1>{currentLeague.name} - Таблица Лиги</h1>
      <div className={cls.tableWrapper}>
        <div>
          <div className={cls.title}>
            <p className={cls.name}>Команда</p>
            <p className={cls.subtitle}>С</p>
            <p className={cls.subtitle}>В</p>
            <p className={cls.subtitle}>П</p>
            <p className={cls.subtitle}>Н</p>
            <p className={cls.subtitle}>Г</p>
            <p className={cls.subtitle}>Очки</p>
          </div>

          <div>
            {teamStats.map((team) => (
              <div className={cls.point} key={team.id}>
                <p className={cls.name}>{getTeamNameById(team.id)}</p>
                <p className={cls.pointText}>{team.played}</p>
                <p className={cls.pointText}>{team.wins}</p>
                <p className={cls.pointText}>{team.losses}</p>
                <p className={cls.pointText}>{team.draws}</p>
                <p className={cls.pointText}>{team.goalsScored}/{team.goalsConceded}</p>
                <p className={cls.pointText}>{team.points}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2>История матчей</h2>
      <table>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Команда Дома</th>
            <th>Команда Гостя</th>
            <th>Счет</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.id}>
              <td>{match.date}</td>
              <td>{getTeamNameById(match.homeTeam)}</td>
              <td>{getTeamNameById(match.awayTeam)}</td>
              <td>{match.homeScore ? `${match.homeScore} - ${match.awayScore}` : "Не завершен"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeagueList;

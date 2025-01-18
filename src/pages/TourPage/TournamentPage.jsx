import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cls from './TournamentPage.module.scss';

const TournamentPage = () => {
  const [tournaments, setTournaments] = useState([]); // Инициализируем как пустой массив
  const [leagues, setLeagues] = useState([]); // Инициализируем как пустой массив
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [loadingLeagues, setLoadingLeagues] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Загрузка данных турниров
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch('/tournaments.json');
        if (!response.ok) throw new Error('Ошибка при загрузке турниров');
        const data = await response.json();
        setTournaments(data.tournaments || []); // Убедитесь, что data.tournaments всегда массив
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
        const response = await fetch('/league.json');
        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setLeagues(data.leagues || []);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setError('Ошибка при загрузке данных');
      } finally {
        setLoadingLeagues(false);
      }
    };

    fetchLeagues();
  }, []);

  // Обработка состояния загрузки и ошибок
  if (loadingTournaments || loadingLeagues) return <p>Загрузка данных...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className={cls.tournamentPage}>
      <h1 className={cls.title}>История турниров и лиг</h1>

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
                <h3 className={cls.cardTitle}>{tournament.name}</h3>
                <p className={cls.cardDate}>{tournament.date}</p>
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
                <h3 className={cls.cardTitle}>Лига {league.id}</h3>
                <p className={cls.cardSubtitle}>Детали...</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TournamentPage;

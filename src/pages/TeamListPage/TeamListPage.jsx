import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import cls from './TeamListPage.module.scss';
import CustomSelect from './../../components/CustomSelect/CustomSelect';


function TeamListPage() {
  const [teams, setTeams] = useState([]);
  const [matchCounts, setMatchCounts] = useState({});
  const [sortType, setSortType] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [leagues, setLeagues] = useState({});
  const [selectedLeague, setSelectedLeague] = useState(''); // Состояние для выбранной лиги

  useEffect(() => {
    // Загружаем данные о командах
    fetch('/teams.json')
      .then((response) => response.json())
      .then((data) => {
        setTeams(data); 
      });

    // Загружаем данные о матчах
    fetch('/matches.json')
      .then((response) => response.json())
      .then((matches) => {
        const counts = {};
        matches.forEach((match) => {
          const { homeTeam, awayTeam } = match;
          counts[homeTeam] = (counts[homeTeam] || 0) + 1;
          counts[awayTeam] = (counts[awayTeam] || 0) + 1;
        });
        setMatchCounts(counts); 
      });

    // Загружаем данные о лигах
    fetch('/leagueId.json')
      .then((response) => response.json())
      .then((leagueData) => {
        const leagues = {};
        leagueData.forEach((league) => {
          leagues[league.id] = league.name; // Сохраняем лиги в объект
        });
        setLeagues(leagues); 
      });
  }, []);

  // Фильтруем команды по выбранной лиге
  const filteredTeams = teams
    .filter((team) => {
      if (!selectedLeague) return true; // Если лига не выбрана, показываем все команды
      return team.leagueId === Number(selectedLeague); // Преобразуем selectedLeague в число для точного сравнения
    })
    .filter((team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) // Поиск по имени команды
    );

  // Функция сортировки
  const sortTeams = (teams) => {
    if (sortType === 'name') {
      return teams.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'matchCount') {
      return teams.sort((a, b) => (matchCounts[b.id] || 0) - (matchCounts[a.id] || 0));
    }
    return teams;
  };

  // Применяем сортировку после фильтрации
  const sortedTeams = sortTeams(filteredTeams);

  // Опции для сортировки
  const sortOptions = [
    { value: 'name', label: 'По имени' },
    { value: 'matchCount', label: 'По количеству матчей' },
  ];

  // Опции для выбора лиги (из списка лиг)
  const leagueOptions = Object.keys(leagues).map((leagueId) => ({
    value: leagueId,
    label: leagues[leagueId],
  }));

  return (
    <div className={cls.container}>
      <h1 className={cls.title}>Список команд</h1>

      {/* Инпут для поиска по имени команды */}
      <div className={cls.sortCon}>
        <input
          id="searchInput"
          type="text"
          value={searchTerm}
          className={cls.search}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Введите имя команды"
        />
        {/* Добавляем CustomSelect для сортировки */}
      <div className={cls.sorting}>
        <CustomSelect
          options={sortOptions}
          selectedOption={sortType}
          onChange={setSortType} // Обновляем состояние сортировки
        />
      </div>

      {/* Добавляем CustomSelect для выбора лиги */}
      <div className={cls.sorting}>
        <CustomSelect
        
          options={[{ value: '', label: 'Все лиги' }, ...leagueOptions]} // Добавляем опцию "Все лиги"
          selectedOption={selectedLeague}
          onChange={setSelectedLeague} // Обновляем состояние выбранной лиги
        />
      </div>
      <div className={cls.blockInfo}>
  <p>Найдено команд: {sortedTeams.length}</p>
</div>
      </div>

      

      <div className={cls.block}>
        {sortedTeams.length === 0 ? (
          <p>Нет команд для отображения</p> // Сообщение, если нет команд, соответствующих фильтрам
        ) : (
          sortedTeams.map((team) => (
            <div key={team.id} className={cls.teamItem}>
              <Link className={cls.linkCon} to={`/team/${team.id}`}>
                <img
                  src={team.icon}
                  alt={`${team.name} logo`}
                  className={cls.teamIcon}
                />
                <p className={cls.link}>{team.name}</p>
                <p className={cls.matchCount}>
                  {matchCounts[team.id] || 0}
                </p>
                 </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TeamListPage;


import cls from './App.module.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MatchHistory from './../components/MatchHistory/MatchHistory';
import TeamProfile from '../components/TeamProfile/TeamProfile';
import TeamList from '../components/TeamList/TeamList';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import MainPages from '../pages/MainPages/MainPages';
import TeamListPage from '../pages/TeamListPage/TeamListPage';
import Header from '../components/Header/Header';
import HistoryPage from '../pages/HistoryPage/HistoryPage';
import TournamentPage from '../pages/TourPage/TournamentPage';
import TournamentList from '../components/TournamentList/TournamentList';
import LeagueTable from '../components/LeagueTable/LeagueTable';
import TournamentTable from '../components/TournamentTable/TournamentTable';
import LeagueList from '../components/LeagueList/LeagueList';
import CountryCup from '../components/CountryCup/CountryCup';


const App = () => {
  return (
    <Router>
      <Header/>

      <div className={cls.App}>
      <Routes>
        
        <Route path="/" element={<MainPages />} />
        <Route path="/teamList" element={<TeamListPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/league" element={<LeagueTable />} />
        <Route path="/tourNow" element={<TournamentTable />} />
        <Route path="/countryCup" element={<CountryCup />}/>
        <Route path="/team/:teamId" element={<TeamProfile />} />
        <Route path="/tournament" element={<TournamentPage />} /> 
        <Route path="/tournament/:tournamentId" element={<TournamentList />} /> 
        <Route path="/league/:leagueId" element={<LeagueList />} />
      </Routes>
      </div>
      
    </Router>
  );
};

export default App;

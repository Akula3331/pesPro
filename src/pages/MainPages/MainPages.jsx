import React from 'react'
import Leaderboard from './../../components/Leaderboard/Leaderboard';
import TournamentTable from '../../components/TournamentTable/TournamentTable';
import TournamentList from '../../components/TournamentList/TournamentList';
import LeagueTable from '../../components/LeagueTable/LeagueTable';
import MatchHistory from '../../components/MatchHistory/MatchHistory';
import TeamList from '../../components/TeamList/TeamList';
import TeamListPage from '../TeamListPage/TeamListPage';
import Header from '../../components/Header/Header';
import TournamentPage from '../TourPage/TournamentPage';

function MainPages() {
  return (
    <div>
        <Leaderboard/>
    </div>
  )
}

export default MainPages
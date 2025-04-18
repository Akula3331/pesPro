// src/components/TeamComparison/TeamStatsComparison.js
import React from 'react';
import './TeamStatsComparison.module.scss';

const TeamStatsComparison = ({ team1, team2, team1Stats, team2Stats, comparisonResult }) => {
  return (
    <div className="stats-comparison">
      <div className="comparison-table">
        <table>
          <thead>
            <tr>
              <th>Параметры</th>
              <th>{team1.name}</th>
              <th>{team2.name}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Матчи сыграно</td>
              <td>{team1Stats.played}</td>
              <td>{team2Stats.played}</td>
            </tr>
            <tr>
              <td>Победы</td>
              <td>{team1Stats.wins}</td>
              <td>{team2Stats.wins}</td>
            </tr>
            <tr>
              <td>Поражения</td>
              <td>{team1Stats.losses}</td>
              <td>{team2Stats.losses}</td>
            </tr>
            <tr>
              <td>Ничьи</td>
              <td>{team1Stats.draws}</td>
              <td>{team2Stats.draws}</td>
            </tr>
            <tr>
              <td>Забито</td>
              <td>{team1Stats.goalsScored}</td>
              <td>{team2Stats.goalsScored}</td>
            </tr>
            <tr>
              <td>Пропущено</td>
              <td>{team1Stats.goalsConceded}</td>
              <td>{team2Stats.goalsConceded}</td>
            </tr>
            <tr>
              <td>Разница голов</td>
              <td>{team1Stats.goalDifference}</td>
              <td>{team2Stats.goalDifference}</td>
            </tr>
            <tr>
              <td>Рейтинг</td>
              <td>{team1Stats.rating.toFixed(2)}</td>
              <td>{team2Stats.rating.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>
        {comparisonResult
          ? `${comparisonResult.name} победила!`
          : 'Ничья!'}
      </h3>
    </div>
  );
};

export default TeamStatsComparison;

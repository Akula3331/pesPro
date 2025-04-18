import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TeamStatsGraph = ({ matches, teamId }) => {
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    let score = 0;
    const newGraphData = [];

    matches.forEach((match) => {
      const isTeamInMatch = match.homeTeam === parseInt(teamId) || match.awayTeam === parseInt(teamId);
      if (!isTeamInMatch) return;

      const isHome = match.homeTeam === parseInt(teamId);
      const teamScore = isHome ? match.homeScore : match.awayScore;
      const opponentScore = isHome ? match.awayScore : match.homeScore;

      // Проверка на пенальти при ничье
      if (teamScore === opponentScore && match.penalty) {
        const teamPen = isHome ? match.penalty.homeTeamPenalties : match.penalty.awayTeamPenalties;
        const oppPen = isHome ? match.penalty.awayTeamPenalties : match.penalty.homeTeamPenalties;

        if (teamPen > oppPen) {
          score++; // Победа по пенальти
        } else {
          score--; // Поражение по пенальти
        }
      } else if (teamScore > opponentScore) {
        score++;
      } else if (teamScore < opponentScore) {
        score--;
      }
      // При ничьей без пенальти ничего не меняется

      newGraphData.push(score);
    });

    setGraphData(newGraphData);
  }, [matches, teamId]);

  const chartData = {
    labels: graphData.map((_, i) => `Матч ${i + 1}`),
    datasets: [
      {
        label: 'Прогресс команды',
        data: graphData,
        fill: false,
        borderColor: 'green',
        backgroundColor: 'green',
        tension: 0.2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Позволяет задать высоту вручную
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#333',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#333',
        },
        grid: {
          color: '#eee',
        },
        title: {
          display: true,
          text: 'Матчи',
          color: '#333',
        },
      },
      y: {
        ticks: {
          color: '#333',
        },
        grid: {
          color: '#eee',
        },
        title: {
          display: true,
          text: 'Баланс (победы - поражения)',
          color: '#333',
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: '700px', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center' }}>График формы команды</h2>
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TeamStatsGraph;

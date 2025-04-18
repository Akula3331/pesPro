import React, { useState, useEffect } from "react";
import cls from "./TournamentSimulator.module.scss";

const TournamentSimulator = ({ allTeams, onReset }) => {
  const [teams, setTeams] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [winners, setWinners] = useState([]);
  const [matchAnimations, setMatchAnimations] = useState([]);

  useEffect(() => {
    if (allTeams && allTeams.length > 1) {
      setTeams(allTeams);

      const initialMatches = [];
      for (let i = 0; i < allTeams.length; i += 2) {
        initialMatches.push({
          team1: allTeams[i],
          team2: allTeams[i + 1],
          score: null,
          winner: null,
        });
      }

      setRounds([initialMatches]);
      setCurrentRoundIndex(0);
      setWinners([]);
    }
  }, [allTeams]);

  const simulateRound = () => {
    const currentMatches = rounds[currentRoundIndex].map((match) => {
      const team1Score = Math.floor(Math.random() * 5);
      const team2Score = Math.floor(Math.random() * 5);
      const winner = team1Score >= team2Score ? match.team1 : match.team2;

      return {
        ...match,
        score: `${team1Score} - ${team2Score}`,
        winner,
      };
    });

    const nextWinners = currentMatches.map((m) => m.winner);
    const nextRoundMatches = [];
    for (let i = 0; i < nextWinners.length; i += 2) {
      if (nextWinners[i + 1]) {
        nextRoundMatches.push({
          team1: nextWinners[i],
          team2: nextWinners[i + 1],
          score: null,
          winner: null,
        });
      }
    }

    const updatedRounds = [...rounds];
    updatedRounds[currentRoundIndex] = currentMatches;

    if (nextRoundMatches.length > 0) {
      updatedRounds.push(nextRoundMatches);
    }

    setRounds(updatedRounds);
    setCurrentRoundIndex(currentRoundIndex + 1);
    setWinners(nextWinners);

    // Add animation for the match scores
    setMatchAnimations(currentMatches.map(() => "animated"));
  };

  const getStageName = (roundIndex, totalRounds, matchCount) => {
    const stageMap = {
      1: "Финал",
      2: "Полуфинал",
      4: "1/4 финала",
      8: "1/8 финала",
      16: "1/16 финала",
      32: "1/32 финала",
    };

    return stageMap[matchCount] || `Раунд ${roundIndex + 1}`;
  };

  const isFinal =
    rounds.length > 0 &&
    rounds[rounds.length - 1].length === 1 &&
    rounds[rounds.length - 1][0].winner;

  return (
    <div className={cls.tournamentContainer}>
      <h3 className={cls.title}>Этапы турнира</h3>
      {rounds.map((round, roundIndex) => (
        <div key={roundIndex} className={cls.round}>
          <h2 className={cls.stageTitle}>
            {getStageName(roundIndex, rounds.length, round.length)}
          </h2>
          {round.map((match, idx) => (
            <div
              key={idx}
              className={`${cls.match} ${matchAnimations[idx] || ""} ${
                match.winner ? cls.winner : cls.loser
              }`}
            >
              <span className={cls.teamName}>{match.team1.name}</span>  <strong className={cls.matchScore}>{match.score}</strong>
              <span className={cls.teamName}>{match.team2.name}</span>
             
            </div>
          ))}
        </div>
      ))}

      {!isFinal && (
        <button className={cls.button} onClick={simulateRound}>
          Симулировать раунд
        </button>
      )}

      {isFinal && (
        <div className={cls.winner}>
          <p className={cls.winnerTxt}>🏆 Победитель турнира: {rounds[rounds.length - 1][0].winner.name}</p>
          <div>
            <button className={cls.button} onClick={onReset}>
              Сбросить турнир
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentSimulator;

import React, { useState, useEffect } from "react";
import TournamentSimulator from "../../components/TournamentSimulator/TournamentSimulator";
import TeamPicker from "../../components/TournamentSimulator/TeamPicker";
import CompareTeams from "../../components/CompareTeams/CompareTeams";
import cls from "./ContentPage.module.scss";
import CustomSelect from "./../../components/CustomSelect/CustomSelect";

const ContentPage = () => {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [teamCount, setTeamCount] = useState(4);
  const [step, setStep] = useState(1);

  // Отдельно для турнира
  const [selectedTournamentTeams, setSelectedTournamentTeams] = useState([]);
  const [tournamentStarted, setTournamentStarted] = useState(false);
  const [results, setResults] = useState([]);

  // Отдельно для сравнения
  const [selectedComparisonTeams, setSelectedComparisonTeams] = useState([
    null,
    null,
  ]);
  const [showCompare, setShowCompare] = useState(false);
  const [shouldRenderCompare, setShouldRenderCompare] = useState(false);

  useEffect(() => {
    fetch("/teams.json")
      .then((res) => res.json())
      .then((data) => setTeams(data));

    fetch("/matches.json")
      .then((res) => res.json())
      .then((data) => setMatches(data));
  }, []);

  const handleTeamCountChange = (count) => {
    setTeamCount(count);
    setStep(2);
  };

  const startTournament = () => {
    setTournamentStarted(true);
  };

  const handleResetTournament = () => {
    setSelectedTournamentTeams([]);
    setTournamentStarted(false);
    setResults([]);
    setStep(1);
  };

  const handleCompareToggle = () => {
    if (!showCompare && selectedComparisonTeams.every(Boolean)) {
      setShouldRenderCompare(true);
      setTimeout(() => setShowCompare(true), 50);
    }
  };

  const handleCompareReset = () => {
    setShowCompare(false);
    setTimeout(() => {
      setShouldRenderCompare(false);
      setSelectedComparisonTeams([null, null]);
    }, 300);
  };

  const teamOptions = [...teams]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((team) => ({
    value: team.id,
    label: team.name,
  }));

  return (
    <div className={cls.contentPage}>
  

      {/* Сравнение команд */}

      <div className={cls.selectsWrapper}>
        <h2 className={cls.subtitle}>Сравнение команд</h2>
        <div className={cls.teamsBlock}>
          <CustomSelect
            options={teamOptions}
            selectedOption={selectedComparisonTeams[0]?.id}
            onChange={(value) => {
              const selectedTeam = teams.find((team) => team.id === value);
              setSelectedComparisonTeams([
                selectedTeam,
                selectedComparisonTeams[1],
              ]);
            }}
          />

          <CustomSelect
            options={teamOptions}
            selectedOption={selectedComparisonTeams[1]?.id}
            onChange={(value) => {
              const selectedTeam = teams.find((team) => team.id === value);
              setSelectedComparisonTeams([
                selectedComparisonTeams[0],
                selectedTeam,
              ]);
            }}
          />
        </div>
      </div>

      <button
        className={cls.compareButton}
        onClick={handleCompareToggle}
        disabled={
          selectedComparisonTeams.length !== 2 ||
          selectedComparisonTeams[0]?.id === selectedComparisonTeams[1]?.id
        }
      >
        Сравнить команды
      </button>

      {shouldRenderCompare &&
        showCompare &&
        selectedComparisonTeams.every(Boolean) && (
          <CompareTeams
            teams={selectedComparisonTeams}
            matches={matches}
            onReset={handleCompareReset}
          />
        )}
            {step === 1 && (
        <div className={cls.stepContainer}>
          <h1 className={cls.title}>Симулятор турнира</h1>

          <h2 className={cls.subtitle}>Выберите формат турнира</h2>
          <div className={cls.buttonGroup}>
            {[2, 4, 8, 16, 32].map((count) => (
              <button className={cls.button} key={count} onClick={() => handleTeamCountChange(count)}>
                {count} команд
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && !tournamentStarted && (
        <div>
          <h2 className={cls.subtitle}>Выберите {teamCount} команд</h2>
          <TeamPicker
            teams={teams}
            onTeamsSelected={setSelectedTournamentTeams}
            maxTeams={teamCount}
            selectedTeams={selectedTournamentTeams}
            setSelectedTeams={setSelectedTournamentTeams}
            onStart={startTournament}
          />
        </div>
      )}

      {tournamentStarted && (
        <TournamentSimulator
          allTeams={selectedTournamentTeams}
          onReset={handleResetTournament}
        />
      )}
    </div>
  );
};

export default ContentPage;

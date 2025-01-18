import React, { useState, useEffect } from 'react';
import cls from './TournamentTable.module.scss';

function TournamentTable() {
    const [tournaments, setTournaments] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tournamentResponse = await fetch('/tournamentsSeason.json');
                const tournamentData = await tournamentResponse.json();
                setTournaments(tournamentData.tournaments);

                const teamResponse = await fetch('/teams.json');
                const teamData = await teamResponse.json();
                setTeams(teamData);

                setLoading(false);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getTeamById = (id) => {
        return teams.find((team) => team.id === id) || { name: '', icon: '' };
    };

    const getTeamName = (team) => {
        return team.name ? team.name : 'Команды не дошли до этого этапа';
    };

    const getTeamIcon = (team) => {
        return team.icon ? team.icon : '';
    };

    if (loading) {
        return <p>Загрузка данных...</p>;
    }

    return (
        <div className={cls.tournamentTable}>
            <h1 className={cls.title}>Турнирные матчи</h1>
            <div className={cls.matches}>
                {tournaments.map((tournament) => (
                    <div key={tournament.id} className={cls.tournament}>
                        <h2 className={cls.tournamentName}>{tournament.name}</h2>
                        <div className={cls.date}>
                            <span>{tournament.date}</span>
                        </div>
                        {tournament.stages.map((stage, index) => (
                            <div key={index} className={cls.stage}>
                                <h3 className={cls.stageName}>{stage.stageName}</h3>
                                <div className={cls.matchesList}>
                                    {stage.matches.map((match) => {
                                        const homeTeam = getTeamById(match.homeTeam);
                                        const awayTeam = getTeamById(match.awayTeam);

                                        return (
                                            <div key={match.id} className={cls.match}>
                                                <div className={cls.column}>
                                                    <div className={cls.team}>
                                                        {homeTeam.icon && (
                                                            <img src={homeTeam.icon} alt={homeTeam.name} className={cls.teamIcon} />
                                                        )}
                                                        <span className={cls.teamName}>{getTeamName(homeTeam)}</span>
                                                    </div>
                                                </div>
                                                {match.homeScore !== null && match.awayScore !== null && (
                                                    <div className={cls.matchResult}>
                                                        <p className={cls.score}>{match.homeScore} - {match.awayScore}</p>
                                                        {match.penalty && (
                                                            <div className={cls.penalty}>
                                                                <span> {match.penalty.homeTeamPenalties} - {match.penalty.awayTeamPenalties}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                   
                                                <div className={cls.column}>
                                                    <div className={cls.team}>
                                                        {awayTeam.icon && (
                                                            <img src={awayTeam.icon} alt={awayTeam.name} className={cls.teamIcon} />
                                                        )}
                                                        <span className={cls.teamName}>{getTeamName(awayTeam)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TournamentTable;

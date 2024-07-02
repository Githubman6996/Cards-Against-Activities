import React from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { LOBBY, blacks, className, whites } from "../util.js";
import Profile from "../components/Profile.jsx";
import { ResultsBoard } from "../components/Leaderboard.jsx";
import resultsStyles from "./Results.module.css";
import { BlackCard, WhiteCard } from "../components/Card.jsx";

export default function Results() {
    const auth = useAuth();
    return (
        <div className={resultsStyles.resultsPage}>
            <div className={resultsStyles.resultsContent}>
                <div className={resultsStyles.historyContainer}>
                    <div className={resultsStyles.header}>History</div>
                    <div className={className(resultsStyles.history, "hideScroll")}>
                        {auth.room.history.map((hist, i) => {
                            const scale = `calc(min(32.5vh, (50vw - var(--global) * 15.45 ) / (${hist[2].length} + 1)) * 63 / 88)`;
                            return (
                                <div className={resultsStyles.submission} key={i}>
                                    <Profile id={hist[1]} data={auth.room.userData[hist[1]]} scale={0.7} hover={true} ready={false} />
                                    <div className={resultsStyles.submissionCards} style={{ gap: `calc(var(--global) * 2 / ${hist[2].length})` }}>
                                        <BlackCard size={scale} ind={hist[0]} />
                                        {hist[2].map((card, i) => (
                                            <WhiteCard size={scale} key={card} ind={card} noShadow />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className={className(resultsStyles.leaderboard, "hideScroll")}>
                    <ResultsBoard users={auth.room.users} data={auth.room.userData} host={auth.room.users[auth.room.host]} toLobby={() => auth.setPage(LOBBY)} />
                </div>
            </div>
        </div>
    );
}

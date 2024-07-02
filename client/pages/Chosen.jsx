import React from "react";
import { createElement as e, useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { blacks, whites, parseTime, className } from "../util.js";
import Profile from "../components/Profile.jsx";
import { ChosenBoard } from "../components/Leaderboard.jsx";
import chosenStyles from "./Chosen.module.css";
import { BlackCard, WhiteCard } from "../components/Card.jsx";

export default function Chosen() {
    const auth = useAuth();
    const [timer, setTimer] = useState("1:00");
    const timerRef = useRef();
    useEffect(() => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            let time = Math.max(auth.room.nextTimestamp - Date.now(), 0);
            setTimer(parseTime(time));
        }, 100);
        return () => clearInterval(timerRef.current);
    }, [auth.room?.nextTimestamp]);
    const curHist = auth.room.history[auth.room.history.length - 1];
    const winner = auth.room.userData[curHist[1]];
    return (
        <div className={chosenStyles.chosenPage}>
            <div className={chosenStyles.chosenContent}>
                <ChosenBoard users={auth.room.users} data={auth.room.userData} host={auth.room.users[auth.room.host]} />
                <div className={chosenStyles.chosenResults}>
                    <div className={chosenStyles.chosenCards}>
                        <BlackCard showAnimation scale={40} ind={curHist[0]} />
                        {curHist[2].map((card, i) => {
                            return <WhiteCard showAnimation index={i} key={card} ind={card} scale={40} />;
                        })}
                    </div>
                    <div className={chosenStyles.winner}>
                        <Profile id={curHist[1]} data={winner} ready={false} scale={0.7} hover={false} />
                        <div className={className(chosenStyles.winnerName, "leaderboardName")}>{winner.name}</div>
                    </div>
                    <div className={chosenStyles.timerText}>{timer}</div>
                </div>
            </div>
        </div>
    );
}

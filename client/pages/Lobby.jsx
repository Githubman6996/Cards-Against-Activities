import React from "react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import Profile from "../components/Profile.jsx";
import lobbyStyles from "./Lobby.module.css";
import { className } from "../util.js";

export default function Lobby() {
    const auth = useAuth();
    const [countdown, setCountdown] = useState(-1);
    const [rounds, setRounds] = useState(10);
    const timerRef = useRef();
    const roundTimeout = useRef();

    useEffect(() => {
        setRounds(auth.room?.rounds);
    }, [auth.room?.rounds]);

    useEffect(() => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            let time = auth.room.nextTimestamp - Date.now();
            if (time < 0) setCountdown(-1);
            else setCountdown(Math.floor(time / 1000));
        }, 100);
        return () => {
            clearInterval(timerRef.current);
        };
    }, [auth.room?.nextTimestamp]);

    useEffect(() => {
        clearTimeout(roundTimeout.current);
        if (rounds != auth.room.rounds)
            roundTimeout.current = setTimeout(() => {
                auth.setRounds(rounds);
            }, 1000);
        return () => clearTimeout(roundTimeout.current);
    }, [rounds]);
    return (
        <div className={lobbyStyles.lobbyPage}>
            <div className={lobbyStyles.activityName}>
                <h2 className={lobbyStyles.dropInDev}>DEV</h2>
                <h1>{window.activityName}</h1>
                <span style={{ fontWeight: "500" }}>An activity for terrible people.</span>
            </div>
            <div className={lobbyStyles.lobbyContent}>
                {auth?.room?.users.length ? (
                    <div className={lobbyStyles.usersWrapper}>
                        <div className={lobbyStyles.usersContainer + " hideScroll"}>
                            {auth?.room?.users.map((id, i) => (
                                <Profile id={id} key={id} data={auth.room.userData[id]} winner={i == auth.room.winner} host={i == auth.room.host} hover animationOnRender></Profile>
                            ))}
                        </div>
                        {(auth.room?.users.length || 0) >= 2 && (
                            <div className={lobbyStyles.readyContainer}>
                                {countdown >= 0 && <div className={lobbyStyles.countdownText}>Starting in {countdown}</div>}
                                <div className={className(lobbyStyles.readyButton, auth.room.userData[auth.userId].ready ? " unready" : " ready")} onClick={auth.toggleReady}>
                                    <div className={lobbyStyles.readyFront}>Ready</div>
                                    <div className={lobbyStyles.readyBack}>Unready</div>
                                </div>
                                <div className={lobbyStyles.roundsCount}>
                                    {auth.room.users[auth.room.host] == auth.userId ? (
                                        <>
                                            <input
                                                className={lobbyStyles.roundInput}
                                                value={rounds}
                                                type="number"
                                                min={3}
                                                max={20}
                                                onChange={(e) => isNaN(parseInt(e.target.value)) || setRounds(parseInt(e.target.value))}
                                                style={{ outline: "calc(var(--global) * 0.5) solid " + (rounds != auth.room?.roundsLeft ? "#f88" : "white") }}
                                            />
                                            rounds
                                        </>
                                    ) : (
                                        <div>{auth.room.rounds + " rounds"}</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        style={{
                            color: "white",
                            fontSize: "calc(var(--global) * 8)",
                            fontWeight: "500",
                        }}>
                        Joining...
                    </div>
                )}
            </div>
            <h1 className={lobbyStyles.bottomText}>This activity is for users 18+ only due to its use of mature answers and themes.</h1>
        </div>
    );
}

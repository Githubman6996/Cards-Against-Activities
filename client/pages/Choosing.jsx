import React from "react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { blacks, whites, parseTime, className } from "../util.js";
import Leaderboard from "../components/Leaderboard.jsx";

import choosingStyles from "./Choosing.module.css";

export function Waiting() {
    const auth = useAuth();
    const [timer, setTimer] = useState("1:00");
    const timerRef = useRef();
    useEffect(() => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            let time = auth.room.nextTimestamp - Date.now();
            if (time < 0) setTimer("");
            else setTimer(parseTime(time));
        }, 100);
        return () => clearInterval(timerRef.current);
    }, [auth.room?.nextTimestamp]);
    return (
        <div className={choosingStyles.choosingPage}>
            <div className={choosingStyles.choosingTop}>
                <Leaderboard users={auth.room.users} data={auth.room.userData} host={auth.room.users[auth.room.host]} />
                <div className={className(choosingStyles.submitButtons, "submitButtons")}>{timer.length > 0 && <div className={choosingStyles.timerText}>{timer}</div>}</div>
                <div className="black" style={{ "--size": "calc(1vh * 40 * 63 / 88)" }}>
                    {blacks[auth.room.promptCard]}
                </div>
            </div>
            <div className={choosingStyles.choosingBottom}>
                <div className={className(choosingStyles.deckContainer, "deckContainer hideScroll")} style={{ gap: "calc(var(--global) * " + Math.min(auth.room.needed, 2) + ")" }}>
                    <div className={choosingStyles.numSubmissions}>{`${auth.room.users.reduce((a, b) => a + (b == auth.userId ? 0 : auth.room.userData[b].ready), 0)} / ${auth.room.users.length - 1} Submissions`}</div>
                    {auth.room.users.map(
                        (x) =>
                            auth.room.userData[x].cards?.length > 0 && (
                                <div key={x} className={choosingStyles.cardsContainer}>
                                    {auth.room.userData[x].cards.slice(0, auth.room.needed).map((x) => (
                                        <div className="whiteBack" key={x} style={{ "--size": "calc(1vh * 30 * 63 / 88)", filter: "brightness(0.5)", color: "white" }} />
                                    ))}
                                </div>
                            )
                    )}
                </div>
            </div>
        </div>
    );
}
export function Choosing() {
    const auth = useAuth();
    const [timer, setTimer] = useState("1:00");
    const [selecting, setSelecting] = useState(null);
    const timerRef = useRef();
    const lockedIn = auth.room.userData[auth.userId]?.ready;
    useEffect(() => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            let time = auth.room.nextTimestamp - Date.now();
            if (time < 0) setTimer("");
            else setTimer(parseTime(time));
        }, 100);
        return () => {
            clearInterval(timerRef.current);
        };
    }, [auth.room?.nextTimestamp]);
    return (
        <div className={choosingStyles.choosingPage}>
            <div className={choosingStyles.choosingTop}>
                <Leaderboard users={auth.room.users} data={auth.room.userData} host={auth.room.users[auth.room.host]} />
                <div className={className(choosingStyles.submitButtons, "submitButtons")}>
                    {timer.length > 0 && <div className={choosingStyles.timerText}>{timer}</div>}
                    {selecting && (
                        <div
                            className={className(choosingStyles.submitButton, lockedIn ? "unready" : "ready")}
                            onClick={() => {
                                if (!lockedIn) auth.chooseWinner(selecting);
                                auth?.toggleReady();
                            }}>
                            <div className={choosingStyles.submitFront}>Lock In</div>
                            <div className={choosingStyles.submitBack}>Hol' up</div>
                        </div>
                    )}
                </div>
                <div className="black" style={{ "--size": "calc(1vh * 40 * 63 / 88)" }}>
                    {blacks[auth.room.promptCard]}
                </div>
                {auth.room.userData[selecting]?.cards?.length > 0 &&
                    auth.room.userData[selecting].cards.map((card) => {
                        return (
                            <div className="white" key={card} style={{ "--size": "calc(1vh * 40 * 63 / 88)" }}>
                                {whites[card]}
                            </div>
                        );
                    })}
            </div>
            <div className={choosingStyles.choosingBottom}>
                <div className={className(choosingStyles.deckContainer, "deckContainer hideScroll")} style={{ gap: "calc(var(--global) * " + Math.min(auth.room.needed, 2) + ")" }}>
                    {auth.room.shuffled.map((x) => {
                        return (
                            auth.room.userData[x].cards?.length > 0 && (
                                <div key={x} className={choosingStyles.cardsContainer}>
                                    {x == selecting ? (
                                        <div className={className(choosingStyles.chosen, "whiteButton")}>Chosen</div>
                                    ) : (
                                        !lockedIn && (
                                            <div className={className(choosingStyles.chooseButton, "whiteButton")} onClick={() => setSelecting(x)}>
                                                {"Choose Card" + (auth.room.needed == 1 ? "" : "s")}
                                            </div>
                                        )
                                    )}
                                    {auth.room.userData[x].cards.slice(0, auth.room.needed).map((x) => (
                                        <div className="white" key={x} style={{ "--size": "calc(1vh * 30 * 63 / 88)" }}>
                                            {whites[x]}
                                        </div>
                                    ))}
                                </div>
                            )
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

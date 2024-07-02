import React from "react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { blacks, whites, parseTime, className } from "../util.js";
import Leaderboard from "../components/Leaderboard.jsx";
import gsap from "gsap";
import { BlackCard, WhiteCard } from "../components/Card.jsx";

import pickingStyles from "./Picking.module.css";

export function Picking() {
    const auth = useAuth();
    const [timer, setTimer] = useState("1:00");
    const timerRef = useRef();
    useEffect(() => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            let time = auth.room.nextTimestamp - Date.now();
            if (time < 0) {
                setTimer("");
            } else {
                setTimer(parseTime(time));
            }
        }, 100);
        return () => {
            clearInterval(timerRef.current);
        };
    }, [auth.room?.nextTimestamp]);
    const userReady = auth.room.userData[auth.userId]?.ready;
    return (
        <div className={pickingStyles.pickingPage}>
            <div className={pickingStyles.pickingTop}>
                <Leaderboard users={auth.room.users} data={auth.room.userData} host={auth.room.users[auth.room.host]} />
                <div className={className(pickingStyles.submitButtons, "submitButtons")}>
                    {timer.length > 0 && <div className={pickingStyles.timerText}>{timer}</div>}
                    <div className={pickingStyles.numSubmissions}>{`${auth.room.users.reduce((a, b) => a + auth.room.userData[b].ready, 0)} / ${auth.room.users.length - 1} Submissions`}</div>
                    <div className={className(pickingStyles.readyButton, userReady ? "unready" : "ready")} onClick={auth?.toggleReady}>
                        <div className={pickingStyles.readyFront}>Submit</div>
                        <div className={pickingStyles.readyBack}>Unsubmit</div>
                    </div>
                </div>
                <BlackCard scale={40} showAnimation ind={auth.room.promptCard} />
                {auth.room.userData[auth.userId].cards?.length > 0 &&
                    auth.room.userData[auth.userId].cards.map((card, i) => {
                        return (
                            <WhiteCard
                                key={card}
                                ind={card}
                                showAnimation
                                index={i}
                                scale={40}
                                onClick={() => {
                                    if (userReady) return;
                                    const cards = auth.room.userData[auth.userId].cards;
                                    cards.splice(i, 1);
                                    auth.submitCards(cards);
                                }}
                                buttonText={!userReady && "Remove Card"}
                            />
                        );
                    })}
            </div>
            <div className={pickingStyles.pickingBottom}>
                <div className={className(pickingStyles.deckContainer, "deckContainer hideScroll")}>
                    {auth.room.userData[auth.userId]?.deck.map((x) => {
                        return (
                            <WhiteCard
                                key={x}
                                ind={x}
                                scale={30}
                                onClick={() => {
                                    if (userReady) return;
                                    const cards = auth.room.userData[auth.userId].cards;
                                    if (!cards.includes(x)) {
                                        auth.submitCards(cards.length == auth.room.needed ? [x] : cards.concat(x));
                                    }
                                }}
                                buttonText={!userReady && "Add Card"}
                                noShadow
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
export function Picked() {
    const auth = useAuth();
    const [timer, setTimer] = useState("1:00");
    const timerRef = useRef();
    useEffect(() => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            let time = auth.room.nextTimestamp - Date.now();
            if (time < 0) {
                setTimer("");
            } else {
                setTimer(parseTime(time));
            }
        }, 100);
        return () => {
            clearInterval(timerRef.current);
        };
    }, [auth.room?.nextTimestamp]);
    return (
        <div className={pickingStyles.pickingPage}>
            <div className={pickingStyles.pickingTop}>
                <Leaderboard users={auth.room.users} data={auth.room.userData} host={auth.room.users[auth.room.host]} />
                <div className={className(pickingStyles.submitButtons, "submitButtons")}>{timer.length > 0 && <div className={pickingStyles.timerText}>{timer}</div>}</div>
                <BlackCard scale={40} showAnimation ind={auth.room.promptCard} />
            </div>
            <div className={pickingStyles.pickingBottom}>
                <div
                    className={className(pickingStyles.deckContainer, "deckContainer hideScroll")}
                    style={{
                        gap: "calc(var(--global) * " + Math.min(auth.room.needed, 2) + ")",
                        fontWeight: "500",
                        fontSize: "calc(var(--global) * 5)",
                        position: "relative",
                    }}>
                    {auth.room.shuffled.map((x) => {
                        return (
                            auth.room.userData[x].cards?.length > 0 && (
                                <div key={x} className={pickingStyles.cardsContainer}>
                                    {auth.room.userData[x].cards.slice(0, auth.room.needed).map((x) => (
                                        <WhiteCard
                                            key={x}
                                            ind={x}
                                            scale={30}
                                            noShadow
                                        />
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

import { createElement as e, useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.js";
import { blacks, whites, parseTime } from "../util.js";
import Profile from "../components/Profile.js";
import { ChosenBoard } from "../components/Leaderboard.js";

export default function Chosen() {
    const auth = useAuth();
    const [timer, setTimer] = useState("1:00");
    const timerRef = useRef();
    useEffect(() => {
        auth.room.nextTimestamp = Date.now() + 10000;
        timerRef.current = setInterval(() => {
            let time = Math.max(auth.room.nextTimestamp - Date.now(), 0);
            setTimer(parseTime(time));
        }, 100);
        return () => {
            clearInterval(timerRef.current);
        }
    }, []);
    const curHist = auth.room.history[auth.room.history.length - 1];
    const winner = auth.room.userData[curHist[1]];
    return auth.room && e("div", {
        style: {
            width: "100vw",
            height: "100vh",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }
    },
        e("div", {
            style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                gap: "calc(var(--global) * 2)",
                position: "relative",
                width: "100%"
            },
        },
            // e(Leaderboard, { users: auth.room.users, data: auth.room.userData, host: auth.room.users[auth.room.host] }),
            e(ChosenBoard, { users: auth.room.users, data: auth.room.userData, host: auth.room.users[auth.room.host] }),
            e("div", {
                style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "calc(var(--global) * 2)"
                }
            },
                e("div", {
                    style: {
                        gap: "calc(var(--global) * 2)",
                        display: "flex"
                    }
                }, 
                    e("div", { className: "black", style: {
                        '--size': "calc(1vh * 40 * 63 / 88)"
                    } }, blacks[curHist[0]]),
                    curHist[2].map((card, i) => {
                        return e("div", {
                            className: "white",
                            key: card,
                            style: {
                                '--size': "calc(1vh * 40 * 63 / 88)"
                            }
                        }, whites[card])
                    })
                ),
                e("div", {
                    style: {
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "calc(var(--global) * 2)"
                    }
                },
                    e(Profile, { id: curHist[1], data: winner, scale: 0.70, hover: false }),
                    e("div", {
                        className: "leaderboardName",
                        style: {
                            fontWeight: "500",
                            fontSize: "calc(var(--global) * 2.75)"
                        }
                    }, winner.name),
                ),
                e("div", {
                    style: {
                        fontWeight: "500",
                        fontSize: "calc(var(--global) * 2.75)",
                        textAlign: "center",
                        marginTop: "calc(var(--global) * 4)"
                    }
                }, timer)
            )
        )
    );
}
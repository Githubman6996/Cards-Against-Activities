import { createElement as e, useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.js";
import { blacks, whites, shuffle, parseTime } from "../util.js";
import Leaderboard from "../components/Leaderboard.js";

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
        return () => {
            clearInterval(timerRef.current);
        }
    }, [auth.room?.nextTimestamp]);
    return auth.room && e("div", {
        style: {
            width: "100vw",
            height: "100vh",
            color: "white",
            display: "grid",
            gridTemplateRows: "1fr 1fr"
        }
    },
        e("div", {
            style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "calc(var(--global) * 2)",
                position: "relative",
            },
        },
            e(Leaderboard, { users: auth.room.users, data: auth.room.userData, host: auth.room.users[auth.room.host] }),
            e("div", {
                className: "submitButtons",
                style: {
                    position: "absolute",
                    right: "calc(var(--global) * 3)",
                    bottom: "calc(var(--global) * 3)",
                    display: "flex",
                    flexDirection: "column",
                    // justifyContent: "center",
                    alignItems: "flex-end",
                    gap: "calc(var(--global) * 1)",
                }
            },
                timer.length > 0 && e("div", {
                    style: {
                        fontWeight: "500",
                        fontSize: "calc(var(--global) * 2.75)",
                    }
                }, timer)
            ),
            e("div", { className: "black", style: {
                '--size': "calc(1vh * 40 * 63 / 88)"
            } }, blacks[auth.room.promptCard])
        ),
        e("div", {
            style: {
                padding: "calc(var(--global) * 3)",
                boxSizing: "border-box",
                height: "50vh"
            }
        },
            e("div", {
                className: "deckContainer hideScroll",
                style: {
                    display: "flex",
                    padding: "calc(var(--global) * 3)",
                    boxSizing: "border-box",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    overflowY: "scroll",
                    height: "calc(50vh - var(--global) * 6)",
                    gap: "calc(var(--global) * " + (Math.min(auth.room.needed, 2)) + ")",
                    outline: "calc(var(--global) * 0.2) solid white",
                    borderRadius: "calc(var(--global) * 1)",
                    background: "rgb(0 0 0 / 50%)",
                    fontWeight: "500",
                    fontSize: "calc(var(--global) * 5)",
                    // flexDirection: "column",
                    position: "relative"
                }
            },
                e("div", {
                    style: {
                        position: "absolute",
                        inset: "0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: "1"
                    }
                }, `${auth.room.users.reduce((a, b) => (a + (b == auth.userId ? 0 : auth.room.userData[b].ready)), 0)} / ${auth.room.users.length - 1} Submissions`),
                // [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]]
                auth.room.users.map(x => {
                    return auth.room.userData[x].cards?.length > 0 && e("div", {
                        key: x,
                        style: {
                            display: "flex",
                            gap: "calc(var(--global) * 1)"
                        }
                    }, 
                        auth.room.userData[x].cards.slice(0, auth.room.needed).map(x => e("div", {
                            className: "whiteBack",
                            key: x,
                            style: {
                                '--size': "calc(1vh * 30 * 63 / 88)",
                                filter: "brightness(0.5)",
                                color: "white"
                            }
                        }))
                    );
                })
            )
        )
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
        }
    }, [auth.room?.nextTimestamp]);
    // useEffect(() => {
    //     auth.room.nextTimestamp = lockedIn ? Date.now() + 5000 : 0;
    // }, [lockedIn]);
    return auth.room && e("div", {
        style: {
            width: "100vw",
            height: "100vh",
            color: "white",
            display: "grid",
            gridTemplateRows: "1fr 1fr"
        }
    },
        e("div", {
            style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "calc(var(--global) * 2)",
                position: "relative",
            },
        },
            e(Leaderboard, { users: auth.room.users, data: auth.room.userData, host: auth.room.users[auth.room.host] }),
            e("div", {
                className: "submitButtons",
                style: {
                    position: "absolute",
                    right: "calc(var(--global) * 3)",
                    bottom: "calc(var(--global) * 3)",
                    display: "flex",
                    flexDirection: "column",
                    // justifyContent: "center",
                    alignItems: "flex-end",
                    gap: "calc(var(--global) * 1)",
                }
            },
                timer.length > 0 && e("div", {
                    style: {
                        fontWeight: "500",
                        fontSize: "calc(var(--global) * 2.75)",
                    }
                }, timer),
                selecting && e("div", { className: lockedIn ? "unready" : "ready", onClick: () => {
                    if (!lockedIn) auth.chooseWinner(selecting);
                    auth?.toggleReady();
                }, style: {
                    border: "none",
                    outline: "none",
                    height: "calc(var(--global) * 6.5)",
                    width: "calc(var(--global) * 18)",
                    // padding: "calc(var(--global) * 2) calc(var(--global) * 4)",
                    borderRadius: "calc(var(--global) * 1)",
                    color: "white",
                    fontWeight: "500",
                    fontSize: "calc(var(--global) * 2.75)",
                    transition: "transform 0.4s",
                    // overflow: "hidden",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    cursor: "pointer",
                    
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: "5"
                } },
                    e("div", {
                        style: {
                            margin: "auto",
                            paddingInline: "calc(var(--global) * 3)",
                            background: "lime",
                            position: "absolute",
                            inset: "0",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: "1",
                            backfaceVisibility: "hidden",
                            borderRadius: "calc(var(--global) * 1)",
                            WebkitBackfaceVisibility: "hidden"
                        }
                    }, "Lock In"),
                    e("div", {
                        style: {
                            margin: "auto",
                            paddingInline: "calc(var(--global) * 3)",
                            background: "red",
                            position: "absolute",
                            inset: "0",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: "0",
                            borderRadius: "calc(var(--global) * 1)",
                            transform: "rotateX(180deg)",
                            backfaceVisibility: "hidden"
                        }
                    }, "Hol' up")
                )
            ),
            e("div", { className: "black", style: {
                '--size': "calc(1vh * 40 * 63 / 88)"
            } }, blacks[auth.room.promptCard]),
            auth.room.userData[selecting]?.cards?.length > 0 && auth.room.userData[selecting].cards.map((card, i) => {
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
                padding: "calc(var(--global) * 3)",
                boxSizing: "border-box",
                height: "50vh"
            }
        },
            e("div", {
                className: "deckContainer hideScroll",
                style: {
                    display: "flex",
                    padding: "calc(var(--global) * 3)",
                    boxSizing: "border-box",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    overflowY: "scroll",
                    height: "calc(50vh - var(--global) * 6)",
                    gap: "calc(var(--global) * " + (Math.min(auth.room.needed, 2)) + ")",
                    outline: "calc(var(--global) * 0.2) solid white",
                    borderRadius: "calc(var(--global) * 1)",
                    background: "rgb(0 0 0 / 50%)",
                    fontWeight: "500",
                    fontSize: "calc(var(--global) * 5)",
                    // flexDirection: "column",
                    position: "relative"
                }
            },
                
                // [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]]
                auth.room.shuffled.map(x => {
                    return auth.room.userData[x].cards?.length > 0 && e("div", {
                        key: x,
                        style: {
                            display: "flex",
                            gap: "calc(var(--global) * 1)",
                            position: "relative",
                            // overflow: "hidden"
                        }
                    }, x == selecting ? e("div", {
                        className: "whiteButton",
                        style: {
                            fontSize: "calc(1890vh / 88 / 8)",
                            inset: "calc(var(--global) * -0.75)",
                            borderRadius: "calc(1890vh / 1760 + var(--global) / 2)",
                            opacity: "1",
                            cursor: "unset"
                        }
                    }, "Chosen") : lockedIn || e("div", {
                        className: "whiteButton",
                        style: {
                            fontSize: "calc(1890vh / 88 / 8)",
                            inset: "calc(var(--global) * -0.75)",
                            borderRadius: "calc(1890vh / 1760 + var(--global) / 2)",
                        },
                        onClick: () => setSelecting(x)
                    }, "Choose Card" + (auth.room.needed == 1 ? "" : "s")),
                        auth.room.userData[x].cards.slice(0, auth.room.needed).map(x => e("div", {
                            className: "white",
                            key: x,
                            style: {
                                '--size': "calc(1vh * 30 * 63 / 88)"
                            }
                        }, whites[x]))
                    );
                })
            )
        )
    );
}
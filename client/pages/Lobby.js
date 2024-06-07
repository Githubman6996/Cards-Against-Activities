import { createElement as e, useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.js";
import Profile from "../components/Profile.js";

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
        }
    }, [auth.room?.nextTimestamp]);

    useEffect(() => {
        clearTimeout(roundTimeout.current);
        if (rounds != auth.room.rounds) roundTimeout.current = setTimeout(() => {
            auth.setRounds(rounds);
        }, 1000);
        return () => clearTimeout(roundTimeout.current);
    }, [rounds]);
    return e("div", {
        style: {
            // background: `radial-gradient(rgb(201, 119, 255) 50%, rgb(157, 46, 230))`,
            // background: `radial-gradient(rgb(32, 32, 32) 50%, black)`,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
        }
    },
        e("div", {
            style: {
                width: "min-content",
                color: "white",
                fontWeight: "600",
                fontSize: "calc(var(--global) * 16)",
                lineHeight: "calc(var(--global) * 16)",
                // marginBottom: "auto",
                paddingLeft: "calc(var(--global) * 6)",
                // outline: "1px solid lime"
            }
        }, window.activityName),
        e("div", {
            style: {
                width: "70vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%"
            }
        },
            auth?.room?.users.length ? e("div", {
                style: {
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    // margin: "calc(var(--global) * 12)"
                    // gridTemplateRows: "1fr 1fr"
                }
            },
                e("div", {
                    className: "usersContainer hideScroll", style: {
                        // display: "flex",
                        // flexDirection: "row",
                        // // gap: "calc(var(--global) * 3.5)",
                        // // outline: "1px solid lime",
                        // // height: "100%",
                        // // width: "100%",
                        // overflowY: "scroll",
                        // zIndex: "0",
                        // flexWrap: "wrap",
                        // justifyContent: "center",
                        // // position: "absolute",
                        // // flexGrow: "1",
                        // // inset: "0"
                        // height: "calc(75vh - calc(var(--global) * 24))",
                        // paddingBlock: "calc(var(--global) * 12)",




                        display: "flex",
                        flexFlow: "wrap",
                        overflowY: "scroll",
                        zIndex: "0",
                        // placeItems: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "75vh",
                        paddingBlock: "calc(var(--global) * 12)",
                        gridTemplateColumns: "repeat(auto-fill,calc(var(--global) * 17))",
                        gap: "calc(var(--global) * 1)",
                        // gridTemplateRows: "repeat(auto-fill,calc(var(--global) * 17))",
                        overflowX: "hidden",
                        boxSizing: "border-box",
                        paddingInline: "calc(var(--global) * 6)"





                        // display: grid;
                        // flex-flow: wrap;
                        // overflow: hidden scroll;
                        // z-index: 0;
                        // place-items: center;
                        // height: 75vh;
                        // padding-block: calc(var(--global) * 12);
                        // grid-template-columns: repeat(auto-fill,calc(var(--global) * 17));
                        // /* gap: 10px; */
                        // /* grid-template-rows: repeat(auto-fill,calc(var(--global) * 17)); */
                        // box-sizing: border-box;
                    }
                }, auth?.room?.users.map((id, i) =>
                    e(Profile, { id, key: id, data: auth.room.userData[id], winner: i == auth.room.winner, host: i == auth.room.host, hover: true })
                )),
                (auth.room?.users.length || 0) >= 2 && e("div", {
                    className: "readyContainer", style: {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // outline: "1px solid lime",
                        height: "25vh",
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        right: "0",
                        flexDirection: "column",
                        position: "relative"
                    }
                },
                    countdown >= 0 && e("div", {
                        style: {
                            color: "white",
                            position: "absolute",
                            top: "0",
                            left: "0",
                            right: "0",
                            textAlign: "center",
                            fontWeight: "500",
                            fontSize: "calc(var(--global) * 3)"
                        }
                    }, "Starting in " + countdown),
                    e("div", {
                        className: auth.room.userData[auth.userId].ready ? "unready" : "ready", onClick: auth.toggleReady, style: {
                            border: "none",
                            outline: "none",
                            height: "calc(var(--global) * 10)",
                            width: "calc(var(--global) * 30)",
                            // padding: "calc(var(--global) * 2) calc(var(--global) * 4)",
                            borderRadius: "calc(var(--global) * 1)",
                            color: "white",
                            fontWeight: "500",
                            fontSize: "calc(var(--global) * 4.5)",
                            transition: "transform 0.4s",
                            // overflow: "hidden",
                            position: "relative",
                            transformStyle: "preserve-3d",
                            cursor: "pointer",

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }
                    },
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
                        }, "Ready"),
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
                        }, "Unready")
                    ),
                    e("div", {
                        style: {
                            color: "white",
                            fontWeight: "500",
                            fontSize: "calc(var(--global) * 3)",
                            marginTop: "calc(var(--global) * 3)",
                            display: "flex"
                        }
                    },
                        ...(auth.room.users[auth.room.host] == auth.userId ? [
                            e("input", {
                                value: rounds,
                                type: "number",
                                min: 3,
                                max: 20,
                                onChange: e => isNaN(parseInt(e.target.value)) || setRounds(parseInt(e.target.value)),
                                style: {
                                    outline: "calc(var(--global) * 0.5) solid " + (rounds != auth.room?.roundsLeft ? "#f88" : "white"),
                                    border: "none",
                                    background: "none",
                                    color: "white",
                                    marginRight: "calc(var(--global) * 1.5)",
                                    borderRadius: "calc(var(--global) * 0.5)",
                                    fontWeight: "500",
                                    fontSize: "calc(var(--global) * 2.25)",
                                    width: "calc(var(--global) * 4)",
                                    textAlign: "center"
                                }
                            }), e("div", null, "rounds")
                        ] : [e("div", null, auth.room.rounds + " rounds")]),
                        // rounds != auth.room?.roundsLeft && " Updating..."
                    )
                )
            ) : e("div", {
                style: {
                    color: "white",
                    fontSize: "calc(var(--global) * 8)",
                    fontWeight: "500"
                },
            }, "Joining...")
        )
    );
}
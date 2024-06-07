import { createElement as e } from "react";
import { useAuth } from "../contexts/AuthContext.js";
import { LOBBY, blacks, whites } from "../util.js";
import Profile from "../components/Profile.js";
import { ResultsBoard } from "../components/Leaderboard.js";

export default function Results() {
    const auth = useAuth();
    return auth.room && e("div", {
        style: {
            width: "100vw",
            height: "100vh",
            color: "white",
            display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
        }
    },
        e("div", {
            style: {
                // display: "flex",
                // alignItems: "center",
                // justifyContent: "space-evenly",
                // gap: "calc(var(--global) * 2)",
                position: "relative",
                width: "100%",
                height: "100%",
                // display: "grid",
                // gridTemplateColumns: "1fr 1fr"
                display: "flex",
                
            },
        },
            // e(Leaderboard, { users: auth.room.users, data: auth.room.userData, host: auth.room.users[auth.room.host] }),
            e("div", {
                style: {
                    height: "100%",
                    width: "50vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    padding: "calc(var(--global) * 5)",
                    gap: "calc(var(--global) * 2)",
                    boxSizing: "border-box"
                }
            },
                e("div", {
                    style: {
                        fontSize: "calc(var(--global) * 5)",
                        fontWeight: "500"
                    }
                }, "History"),
                e("div", {
                    className: "deckContainer hideScroll",
                    style: {
                        display: "flex",
                        maxWidth: "100%",
                        padding: "calc(var(--global) * 3)",
                        boxSizing: "border-box",
                        justifyContent: "center",
                        alignItems: "center",
                        flexWrap: "wrap",
                        overflowY: "scroll",
                        height: "calc(75vh - var(--global) * 6)",
                        gap: "calc(var(--global) * 3)",
                        outline: "calc(var(--global) * 0.2) solid white",
                        borderRadius: "calc(var(--global) * 1)",
                        background: "rgb(0 0 0 / 50%)",
                        // maxHeight: "100%"
                    }
                },
                    auth.room.history.map((hist, i) => {
                        /** 
                         * 
                         * 2 - 1
                         * 3 - 2/3
                         * 4 - 2/4
                         * 5  - 2/54
                         */
                        const scale = `calc(min(32.5vh, (50vw - var(--global) * 15.45 ) / (${hist[2].length} + 1)) * 63 / 88)`
                        return e("div", {
                            key: i,
                            style: {
                                display: "flex",
                                width: "100%",
                                gap: "calc(var(--global) * 3)",
                                justifyContent: "space-between"
                            }
                        }, 
                            e(Profile, { id: hist[1], data: auth.room.userData[hist[1]], scale: 0.70, hover: true, ready: false }),
                            e("div", {
                                style: {
                                    gap: `calc(var(--global) * 2 / ${hist[2].length})`,
                                    display: "flex",
                                    width: "100%",
                                    justifyContent: "center",
                                }
                            },
                                e("div", { className: "black", style: {
                                    // flexGrow: "1"
                                    '--size': scale,
                                } }, blacks[hist[0]]),
                                // e("div", {
                                //     style: {
                                //         display: "flex",
                                //         // flexGrow: "1",
                                //         gap: "calc(var(--global) * 2)",
                                //         justifyContent: "center"
                                //     }
                                // },
                                    hist[2].map((card, i) => {
                                        return e("div", {
                                            className: "white",
                                            key: card,
                                            style: {
                                                // '--size': "calc(1vh * 32.5 * 63 / 88)"
                                                '--size': scale
                                            }
                                        }, whites[card])
                                    })
                                // )
                            )
                        );
                    })
                ),
            ),
            e("div", {
                className: "hideScroll",
                style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "calc(var(--global) * 2)",
                    width: "50vw",
                    fontSize: "calc(var(--global) * 3)",
                    // overflowY: "scroll",
                    // height: "30vw"
                }
            },
                e(ResultsBoard, { users: auth.room.users, data: auth.room.userData, host: auth.room.users[auth.room.host], toLobby: () => auth.setPage(LOBBY) })
            )
        )
    );
}
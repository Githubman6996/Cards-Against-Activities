import { createElement as e, useState, useRef, useEffect } from "react";
import Profile from "./Profile.js";
import { getOrdinal } from "../util.js";

export default function Leaderboard({ users, data, host }) {
    const [board, setBoard] = useState(users);
    const [places, setPlaces] = useState([]);
    useEffect(() => {
        let b = [...users].sort((a, b) => data[b].score - data[a].score);
        let p = [1];
        let place = 1;
        for (let i = 1; i < users.length; i++) {
            if (data[b[i]].score != data[b[i - 1]].score) place++;
            p[i] = place;
        }
        setBoard(b);
        setPlaces(p);
    }, [users, data]);
    return e("div", {
        className: "scores hideScroll",
        style: {
            outline: "calc(var(--global) * 0.2) solid white",
            background: "rgb(0 0 0 / 50%)",
            borderTopRightRadius: "calc(var(--global) * 1)",
            borderBottomRightRadius: "calc(var(--global) * 1)",
            display: "flex",
            flexDirection: "column",
            gap: "calc(var(--global) * 1)",
            position: "fixed",
            left: "0",
            top: "calc(var(--global) * 2)",
            // bottom: "calc(var(--global) * 2 + 50vh)",
            padding: "calc(var(--global) * 2)",
            paddingTop: "calc(var(--global) * 5)",
            maxHeight: "calc(50vh - var(--global) * 4)",
            overflowY: "scroll",
            overflowX: "hidden",
            // width: "calc(var(--global) * 35)",
            boxSizing: "border-box",
            color: "white",
            zIndex: "2"
        }
    },
        board.map((user, i) => {
            return user in data && e("div", {
                key: user,
                style: {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    // gap: "calc(var(--global) * 2)",
                    fontWeight: "500",
                    fontSize: "calc(var(--global) * 2.5)"
                }
            },
                e(Profile, { id: user, data: data[user], winner: places[i] == 1, host: user == host, scale: 0.6, hover: false }),
                e("div", {
                    className: "leaderboardData",
                    style: {
                        display: "flex",
                        // marginLeft: "calc(var(--global) * 2)",
                        // width: "calc(var(--global) * 25)",
                        // paddingRight: "calc(var(--global) * 2)"
                    }
                },
                    e("div", {
                        className: "leaderboardName",
                        style: {
                            // flexGrow: "1",
                            width: "calc(var(--global) * 18)",
                            // outline: "1px solid lime",
                            marginRight: "auto",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                        }
                    }, data[user].name),
                    e("div", {
                        className: "leaderboardScore",
                        style: {}
                    }, data[user].score)
                )
            );
        })
    )
}


export function ChosenBoard({ users, data, host }) {
    const [board, setBoard] = useState(users);
    const [places, setPlaces] = useState([]);
    useEffect(() => {
        let b = [...users].sort((a, b) => data[b].score - data[a].score);
        let p = [1];
        let place = 1;
        for (let i = 1; i < users.length; i++) {
            if (data[b[i]].score != data[b[i - 1]].score) place++;
            p[i] = place;
        }
        setBoard(b);
        setPlaces(p);
    }, [users, data]);
    return e("div", {
        className: "hideScroll",
        style: {
            outline: "calc(var(--global) * 0.2) solid white",
            background: "rgb(0 0 0 / 50%)",
            borderRadius: "calc(var(--global) * 1)",
            display: "flex",
            flexDirection: "column",
            gap: "calc(var(--global) * 1)",
            // bottom: "calc(var(--global) * 2 + 50vh)",
            // padding: "calc(var(--global) * 5)",
            paddingTop: "calc(var(--global) * 5)",
            // paddingLeft: "calc(var(--global) * 4)",
            paddingInline: "calc(var(--global) * 3)",
            paddingBottom: "calc(var(--global) * 2)",
            maxHeight: "calc(50vh - var(--global) * 4)",
            overflowY: "scroll",
            overflowX: "hidden",
            // width: "calc(var(--global) * 35)",
            boxSizing: "border-box",
            color: "white",
            zIndex: "2"
        }
    },
        board.map((user, i) => {
            return user in data && e("div", {
                key: user,
                style: {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    // gap: "calc(var(--global) * 2)",
                    fontWeight: "500",
                    fontSize: "calc(var(--global) * 2.5)"
                }
            },
                e(Profile, { id: user, data: data[user], winner: places[i] == 1, host: user == host, scale: 0.6, ready: false, hover: false }),
                e("div", {
                    className: "leaderboardData",
                    style: {
                        display: "flex",
                        marginLeft: "calc(var(--global) * 2)",
                        width: "calc(var(--global) * 25)",
                        // paddingRight: "calc(var(--global) * 2)"
                    }
                },
                    e("div", {
                        className: "leaderboardName",
                        style: {
                            // flexGrow: "1",
                            width: "calc(var(--global) * 18)",
                            // outline: "1px solid lime",
                            marginRight: "auto",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            // paddingInline: "calc(var(--global) * 2.5)",
                        }
                    }, data[user].name),
                    e("div", {
                        className: "leaderboardScore",
                        style: {}
                    }, data[user].score)
                )
            );
        })
    )
}

function Standing({ place, user, min }) {
    /**
     * min - 1;
     * 1 - 4fr 1fr
     * 
     * min - 2
     * 1 - 3fr 2fr
     * 2 - 4fr 1fr
     * 
     * min - 3
     * 1 - 2fr 3fr
     * 2 - 3fr 2fr
     * 3 - 4fr 1fr
     */
    if (user) return e("div", {
        className: "standing",
        style: {
            height: "100%",
            width: "33.33%",
            display: "grid",
            gridTemplateRows: `${place + 4 - min}fr 1fr ${min - place}fr`
        }
    },
        e(Profile, { winner: place == 1, data: user, ready: false, style: {
            placeSelf: "flex-end",
            justifySelf: "center",
            marginBottom: "calc(var(--global) * 2)"
        } }),
        e("div", {
            style: {
                background: "rgb(0 0 0 / 50%)",
                outline: "calc(var(--global) * 0.2) solid white",
                borderRadius: "calc(var(--global) * 1)",
                textAlign: "center",
                fontWeight: "500",
                fontSize: "calc(var(--global) * 2.5)",
                marginInline: "calc(var(--global) * 1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }
        },
            e("div", {
                className: "standingPlace",
                "ordinal": getOrdinal(place)
            }, place),
            e("div", {}, user.name + " - " + user.score),
        )
    );
}

export function ResultsBoard({ users, data, toLobby }) {
    const [board, setBoard] = useState(users);
    const [places, setPlaces] = useState([]);
    const min = useRef();
    useEffect(() => {
        let b = [...users].sort((a, b) => data[b].score - data[a].score);
        let p = [1];
        let place = 1;
        for (let i = 1; i < users.length; i++) {
            if (data[b[i]].score != data[b[i - 1]].score) place++;
            p[i] = place;
        }
        setBoard(b);
        setPlaces(p);
        min.current = p.length > 2 ? p[2] : p.length > 1 ? p[1] : p[0];
    }, [users, data]);
    return e("div", {
        style: {
            height: "100%",
            padding: "calc(var(--global) * 5)",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column"
        }
    },
        e("div", {
            style: {
                display: "flex",
                height: "50%",
                // background: "white",
                // padding: "calc(var(--global) * 5)",
                justifyContent: "center",
                marginTop: `-${3 - min.current}0%`,
            }
        },
            places.length > 2 && e(Standing, { place: places[2], user: data[board[2]], min: min.current }),
            places.length > 0 && e(Standing, { place: places[0], user: data[board[0]], min: min.current }),
            places.length > 1 && e(Standing, { place: places[1], user: data[board[1]], min: min.current }),
        ),
        e("div", {
            className: "hideScroll",
            style: {
                marginBlock: "calc(var(--global) * 3)",
                display: "flex",
                gap: "calc(var(--global) * 2)",
                flexDirection: "column",
                overflowY: "scroll",
                padding: "calc(var(--global) * 1)",
                maxHeight: "20vh"
            }
        },
            board.slice(3).map((x, i) => {
                const user = data[x];
                const place = places[i + 3];
                if (user) return e("div", {
                    key: i,
                    style: {
                        background: "rgb(0 0 0 / 50%)",
                        outline: "calc(var(--global) * 0.2) solid white",
                        borderRadius: "calc(var(--global) * 1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "500",
                        padding: "calc(var(--global) * 1) calc(var(--global) * 2)",
                        // width: "100%"
                    }
                },
                    e("div", {
                        className: "standingPlace",
                        "ordinal": getOrdinal(place),
                        style: {
                            marginRight: "calc(var(--global) * 3)"
                        }
                    }, place),
                    e(Profile, { winner: place == 1, data: user, ready: false, scale: 0.5 }),
                    e("div", {
                        style: {
                            flexGrow: "1",
                            marginLeft: "calc(var(--global) * 1)"
                        }
                    }, user.name),
                    e("div", {}, user.score),
                )
            })
        ),
        e("div", {
            onClick: toLobby,
            className: "pushy",
            style: {
                color: "black",
                // margin: "auto",
                paddingInline: "calc(var(--global) * 3)",
                background: "white",
                // position: "absolute",
                // inset: "0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: "0",
                borderRadius: "calc(var(--global) * 1)",
                fontWeight: "500",
                alignSelf: "center",
                width: "calc(var(--global) * 12.5)",
                height: "calc(var(--global) * 7.5)",
                cursor: "pointer"
            }
        }, "To Lobby")
    );
}
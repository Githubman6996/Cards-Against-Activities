import { createElement as e, useState, useRef, useEffect } from "react";
import Profile from "./Profile.jsx";
import { className, getOrdinal } from "../util.js";
import leaderboardStyles from "./Leaderboard.module.css";

export default function Leaderboard({ users, data, host }) {
    const [board, setBoard] = useState(users);
    const [places, setPlaces] = useState([]);
    useEffect(() => {
        let b = [...users].sort((a, b) => data[b].score - data[a].score);
        let p = [1];
        let place = 1;
        for (let i = 1; i < users.length; i++) {
            if (data[b[i]].score != data[b[i - 1]].score) place = i + 1;
            p[i] = place;
        }
        setBoard(b);
        setPlaces(p);
    }, [users, data]);
    return (
        <div className={className(leaderboardStyles.scores, "scores hideScroll")}>
            {board.map((user, i) => {
                return (
                    user in data && (
                        <div className={leaderboardStyles.row} key={user}>
                            <Profile id={user} data={data[user]} winner={places[i] == 1} host={user == host} scale={0.6} />
                            <div className={className(leaderboardStyles.data, "leaderboardData")}>
                                <div className={className(leaderboardStyles.name, "leaderboardName")}>{data[user].name}</div>
                                <div className="leaderboardScore">{data[user].score}</div>
                            </div>
                        </div>
                    )
                );
            })}
        </div>
    );
}

export function ChosenBoard({ users, data, host }) {
    const [board, setBoard] = useState(users);
    const [places, setPlaces] = useState([]);
    useEffect(() => {
        let b = [...users].sort((a, b) => data[b].score - data[a].score);
        let p = [1];
        let place = 1;
        for (let i = 1; i < users.length; i++) {
            if (data[b[i]].score != data[b[i - 1]].score) place = i + 1;
            p[i] = place;
        }
        setBoard(b);
        setPlaces(p);
    }, [users, data]);
    return (
        <div
            className={className(leaderboardStyles.chosenBoard, "hideScroll")}
            style={{
                outline: "calc(var(--global) * 0.2) solid white",
                background: "rgb(0 0 0 / 50%)",
                borderRadius: "calc(var(--global) * 1)",
                display: "flex",
                flexDirection: "column",
                gap: "calc(var(--global) * 1)",
                paddingTop: "calc(var(--global) * 5)",
                paddingInline: "calc(var(--global) * 3)",
                paddingBottom: "calc(var(--global) * 2)",
                maxHeight: "calc(50vh - var(--global) * 4)",
                overflowY: "scroll",
                overflowX: "hidden",
                boxSizing: "border-box",
                color: "white",
                zIndex: "2",
            }}>
            {board.map((user, i) => {
                return (
                    user in data && (
                        <div className={leaderboardStyles.row} key={user}>
                            <Profile id={user} data={data[user]} winner={places[i] == 1} host={user == host} scale={0.6} />
                            <div className={className(leaderboardStyles.chosenData, "leaderboardData")}>
                                <div className={className(leaderboardStyles.name, "leaderboardName")}>{data[user].name}</div>
                                <div className="leaderboardScore">{data[user].score}</div>
                            </div>
                        </div>
                    )
                );
            })}
        </div>
    );
}

function Standing({ place, user, min }) {
    return (
        user && (
            <div className={leaderboardStyles.standing} style={{ gridTemplateRows: `${place + 4 - min}fr 1fr ${min - place}fr` }}>
                <Profile winner={place == 1} data={user} ready={false} className={leaderboardStyles.standingProfile} />
                <div className={leaderboardStyles.standingData}>
                    <div className={leaderboardStyles.standingPlace} ordinal={getOrdinal(place)}>
                        {place}
                    </div>
                    <div>{user.name + " - " + user.score}</div>
                </div>
            </div>
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
            if (data[b[i]].score != data[b[i - 1]].score) {
                place = i + 1;
            }
            p[i] = place;
        }
        min.current = p.length > 2 ? p[2] : p.length > 1 ? p[1] : p[0];
        setBoard(b);
        setPlaces(p);
    }, [users, data]);
    return (
        <div className={leaderboardStyles.resultsBoard}>
            <div className={leaderboardStyles.podium} style={{ marginTop: `-${3 - min.current}0%` }}>
                {places.length > 2 && <Standing place={places[2]} user={data[board[2]]} min={min.current} />}
                {places.length > 0 && <Standing place={places[0]} user={data[board[0]]} min={min.current} />}
                {places.length > 1 && <Standing place={places[1]} user={data[board[1]]} min={min.current} />}
            </div>
            <div className={className(leaderboardStyles.runnerups, "hideScroll")}>
                {board.slice(3).map((x, i) => {
                    const user = data[x];
                    const place = places[i + 3];
                    return (
                        user && (
                            <div className={leaderboardStyles.runnerup} key={i}>
                                <div className={className(leaderboardStyles.runnerupPlace, "standingPlace")} ordinal={getOrdinal(place)}>
                                    {place}
                                </div>
                                <Profile winner={place == 1} data={user} ready={false} scale={0.5} />
                                <div className={leaderboardStyles.runnerupName}>{user.name}</div>
                                <div>{user.score}</div>
                            </div>
                        )
                    );
                })}
            </div>
            <div onClick={toLobby} className={className(leaderboardStyles.lobbyButton, "pushy")}>
                To Lobby
            </div>
        </div>
    );
}

import React from "react";
import { useAuth } from "./contexts/AuthContext.jsx";
import Lobby from "./pages/Lobby.jsx";
import { Picked, Picking } from "./pages/Picking.jsx";
import { Waiting, Choosing } from "./pages/Choosing.jsx";
import Chosen from "./pages/Chosen.jsx";
import Results from "./pages/Results.jsx";
import { CHOOSING, CHOSEN, LEADERBOARD, LOBBY, PICKING, STARTING } from "./util.js";

window.React = React;

const routes = {
    [LOBBY]: {
        default: <Lobby />,
    },
    [STARTING]: {
        default: <Lobby />,
    },
    [PICKING]: {
        host: <Waiting />,
        default: <Picking />,
    },
    [CHOOSING]: {
        host: <Choosing />,
        default: <Picked />,
    },
    [CHOSEN]: {
        default: <Chosen />,
    },
    [LEADERBOARD]: {
        default: <Results />,
    },
};

export default function App() {
    const auth = useAuth();
    console.log(auth);
    const isHost = auth.room && auth.room.users[auth.room.host] == auth.userId;
    return <>{(isHost && routes[auth.page]?.host) || routes[auth.page]?.default || <Lobby />}</>;
}

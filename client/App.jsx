import { createElement } from "react";
import { useAuth } from "./contexts/AuthContext.js";
import Lobby from "./pages/Lobby.js";
import { Picked, Picking } from "./pages/Picking.js";
import { Waiting, Choosing } from "./pages/Choosing.js";
import Chosen from "./pages/Chosen.js";
import Results from "./pages/Results.js";
import { CHOOSING, CHOSEN, LEADERBOARD, LOBBY, PICKING, STARTING } from "./util.js";
import ErrorBoundary from "./components/ErrorBoundary.jsx";


const routes = {
    [LOBBY]: {
        default: Lobby,
    },
    [STARTING]: {
        default: Lobby,
    },
    [PICKING]: {
        host: Waiting,
        default: Picking,
    },
    [CHOOSING]: {
        host: Choosing,
        default: Picked,
    },
    [CHOSEN]: {
        default: Chosen,
    },
    [LEADERBOARD]: {
        default: Results
    }
}

export default function App() {
    const auth = useAuth();
    console.log(auth)
    const isHost = auth.room && auth.room.users[auth.room.host] == auth.userId;
    return createElement(ErrorBoundary, {}, createElement(isHost && routes[auth.page].host || routes[auth.page].default || Lobby));
}
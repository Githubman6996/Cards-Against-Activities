import React, { useContext, useEffect, useRef, useState, createElement, useCallback } from "react";
import { discordSdk, useDiscordSdk } from "../discordSdk.jsx";
import { getUserAvatarUrl, getUserDisplayName } from "../util/discord.js";
import EventSocket from "../util/EventSocket.js";
import { LOBBY, CHOOSING, CHOSEN, LEADERBOARD, PICKING, STARTING } from "../util.js";
import { LoadingScreen } from "../components/LoadingScreen.jsx";
import Settings from "../components/Settings.jsx";

const AuthenticatedContext = React.createContext({
    auth: {},
    room: {
        name: "",
        channelId: "",
        state: LOBBY,
        users: [],
        userData: {},
        nextTimestamp: -1,
        starting: false,
        started: false,
        roundsLeft: 10,
        whiteCards: [],
        blackCards: [],
        cardsPerUser: 20,
        promptCard: 0,
        history: [],
        needed: 0,
        host: 0,
        winner: null,
        betWon: false,
        rounds: 10,
        shuffled: [],
        startingTimeout: null,
        winnerTimeout: null,
    }
});

export function useAuth() {
    return useContext(AuthenticatedContext);
}

async function setUpSocket(socketRef, dataRef, setRoom, setPage) {
    const socket = (socketRef.current = new EventSocket(`wss://${location.host}/api/ws`));
    await socket.connectedSignal;
    socket.on("ping", () => socket.emit("pong"));
    socket.on("roomData", (data) => {
        setRoom(data);
        setPage((p) => {
            if ((p == LOBBY && data.state == LEADERBOARD) || (data.state == LOBBY && p == LEADERBOARD)) return p;
            return data.state;
        });
    });
    socketRef.current.emit("userData", dataRef.current);
}

export function AuthenticatedContextProvider({ children }) {
    const {
        data: { newAuth, discordSdk, access_token },
        loading,
    } = useDiscordSdk();
    window.discordSdk = discordSdk;
    const [auth, setAuth] = useState(null);
    const [page, setPage] = useState(LOBBY);
    const [room, setRoom] = useState({
        name: "",
        channelId: "",
        state: LOBBY,
        users: [],
        userData: {},
        nextTimestamp: -1,
        starting: false,
        started: false,
        roundsLeft: 10,
        whiteCards: [],
        blackCards: [],
        cardsPerUser: 20,
        promptCard: 0,
        history: [],
        needed: 0,
        host: 0,
        winner: null,
        betWon: false,
        rounds: 10,
        shuffled: [],
        startingTimeout: null,
        winnerTimeout: null,
    });
    const settingUp = useRef(false);
    const socketRef = useRef();
    const dataRef = useRef({});
    const toggleReady = useCallback(() => {
        socketRef.current.emit("ready", !room.userData[auth.userId].ready);
    }, [room]);
    const submitCards = useCallback((cards) => {
        socketRef.current.emit("submitCards", cards);
    }, []);
    const setRounds = useCallback((rounds) => {
        socketRef.current.emit("setRounds", rounds);
    }, []);
    const chooseWinner = useCallback((id) => {
        socketRef.current.emit("chooseWinner", id);
    }, []);

    useEffect(() => {
        if (!loading)
            (async () => {
                if (settingUp.current) {
                    return setUpSocket(socketRef, dataRef, setRoom, setPage);
                }
                settingUp.current = true;
                await discordSdk.ready();

                // Get guild specific nickname and avatar, and fallback to user name and avatar
                const guildMember = await fetch(`/discord/api/users/@me/guilds/${discordSdk.guildId}/member`, {
                    method: "get",
                    headers: { Authorization: `Bearer ${access_token}` },
                })
                    .then((j) => j.json())
                    .catch(() => null);

                // Done with discord-specific setup

                let roomName = "Channel";

                // Requesting the channel in GDMs (when the guild ID is null) requires
                // the dm_channels.read scope which requires Discord approval.
                if (discordSdk.channelId != null && discordSdk.guildId != null) {
                    // Over RPC collect info about the channel
                    const channel = await discordSdk.commands.getChannel({ channel_id: discordSdk.channelId });
                    if (channel.name != null) roomName = channel.name;
                }

                dataRef.current = {
                    roomName,
                    channelId: discordSdk.channelId,
                    userId: newAuth.user.id,
                    name: getUserDisplayName({ guildMember, user: newAuth.user }),
                    username: newAuth.user.username,
                    avatar: getUserAvatarUrl({ guildMember, user: newAuth.user }),
                };

                await setUpSocket(socketRef, dataRef, setRoom, setPage);

                setAuth(
                    Object.assign(newAuth, dataRef.current, {
                        guildMember,
                        data: dataRef.current,
                    })
                );
            })();
        return () => socketRef.current?.close?.();
    }, [loading]);
    const Provider = AuthenticatedContext.Provider;
    return (
        <>
            <Settings hasLoaded={auth && room} />
            {auth && room ? children && <Provider value={Object.assign({ room, page, toggleReady, submitCards, setRounds, chooseWinner, setPage }, auth)}>{children}</Provider> : <LoadingScreen />}
        </>
    );
}

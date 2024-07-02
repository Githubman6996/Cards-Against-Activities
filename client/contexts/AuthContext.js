import React, { useContext, useEffect, useRef, useState, createElement, useCallback } from 'react';
import { discordSdk } from '../discordSdk.js';
import { LoadingScreen } from '../components/LoadingScreen.jsx';
import { getUserAvatarUrl, getUserDisplayName } from '../util/discord.js';
import EventSocket from '../util/EventSocket.js';
import { LOBBY, CHOOSING, CHOSEN, LEADERBOARD, PICKING, STARTING } from '../util.js';

const AuthenticatedContext = React.createContext({
    user: {
        id: '',
        username: '',
        discriminator: '',
        avatar: null,
        public_flags: 0,
    },
    access_token: '',
    scopes: [],
    expires: '',
    application: {
        rpc_origins: undefined,
        id: '',
        name: '',
        icon: null,
        description: '',
    },
    guildMember: null,
    client: undefined,
    room: {
        avatar: '',
        channelId: '',
        name: '',
        roomName: '',
        userId: '',
        username: '',
        uuid: ''
    },
    socket: EventSocket.prototype,
    getUser: () => { }
});

export function useAuth() {
    return useContext(AuthenticatedContext);
}

export function AuthenticatedContextProvider() {
    const [auth, setAuth] = useState(null);
    const [page, setPage] = useState(LOBBY);
    const [room, setRoom] = useState({
        name: "",
        channelId: "",
        state: 0,
        users: [],
        userData: {},
        nextTimestamp: -1,
        starting: false,
        started: false,
        roundsLeft: 10,
        whiteCards: [],
        blackCards: [],
        cardsPerUser: 10,
        history: [],
        needed: 0,
        host: 0,
        winner: null,
        betWon: false,
        startingTimeout: null,
        winnerTimeout: null
    });
    const settingUp = useRef(false);
    const socketRef = useRef(EventSocket.prototype);
    const toggleReady = useCallback(() => {
        socketRef.current.emit("ready", !room.userData[auth.userId].ready);
    }, [room]);
    const submitCards = useCallback((cards) => {
        socketRef.current.emit("submitCards", cards);
    }, []);
    const setRounds = useCallback((rounds) => {
        socketRef.current.emit("setRounds", rounds);
    }, []);

    useEffect(() => {
        const setUpDiscordSdk = async () => {
            await discordSdk.ready();

            // Authorize with Discord Client
            const { code } = await discordSdk.commands.authorize({
                client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
                response_type: 'code',
                state: '',
                prompt: 'none',
                // More info on scopes here: https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
                scope: [
                    // "applications.builds.upload",
                    // "applications.builds.read",
                    // "applications.store.update",
                    // "applications.entitlements",
                    // "bot",
                    'identify',
                    // "connections",
                    // "email",
                    // "gdm.join",
                    'guilds',
                    // "guilds.join",
                    'guilds.members.read',
                    // "messages.read",
                    // "relationships.read",
                    // 'rpc.activities.write',
                    // "rpc.notifications.read",
                    // "rpc.voice.write",
                    'rpc.voice.read',
                    // "webhook.incoming",
                ],
            });

            // Retrieve an access_token from your embedded app's server
            const response = await fetch('/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code,
                }),
            });
            const { access_token } = await response.json();

            // Authenticate with Discord client (using the access_token)
            const newAuth = await discordSdk.commands.authenticate({
                access_token,
            });

            // Get guild specific nickname and avatar, and fallback to user name and avatar
            const guildMember = await fetch(`/discord/api/users/@me/guilds/${discordSdk.guildId}/member`, {
                method: 'get',
                headers: { Authorization: `Bearer ${access_token}` },
            })
                .then((j) => j.json())
                .catch(() => null);

            // Done with discord-specific setup

            let uidRes;
            let uuid = new Promise(r => uidRes = r);
            const socket = socketRef.current = new EventSocket(`wss://${location.host}/api/ws`);
            socket.on("clientId", function (data) {
                uidRes(data);
            });
            socket.on("ping", () => socket.emit("pong"));
            const signals = Object.create(null);
            const userData = Object.create(null);
            socket.on("resUserData", data => {
                console.log(data);
                signals[data.userId](data);
                userData[data.userId] = data;
            });
            socket.on("roomData", data => {
                setRoom(data);
                if (data.state != LOBBY && data.state != LEADERBOARD) setPage(data.state);
            });
            uuid = await uuid;

            let roomName = "Channel";

            // Requesting the channel in GDMs (when the guild ID is null) requires
            // the dm_channels.read scope which requires Discord approval.
            if (discordSdk.channelId != null && discordSdk.guildId != null) {
                // Over RPC collect info about the channel
                const channel = await discordSdk.commands.getChannel({ channel_id: discordSdk.channelId });
                if (channel.name != null)
                    roomName = channel.name;
            }

            const data = {
                roomName,
                channelId: discordSdk.channelId,
                userId: newAuth.user.id,
                name: getUserDisplayName({ guildMember, user: newAuth.user }),
                username: newAuth.user.username,
                avatar: getUserAvatarUrl({ guildMember, user: newAuth.user }),
                uuid
            }
            socket.emit("userData", data);

            // Finally, we construct our authenticatedContext object to be consumed throughout the app
            setAuth(Object.assign(newAuth, {
                page,
                guildMember, data, socket,
                getUser: async id => userData[id] || new Promise(r => {
                    signals[id] = r;
                    socket.emit("reqUserData", id);
                })
            }));
        };

        if (!settingUp.current) {
            settingUp.current = true;
            setUpDiscordSdk();
        }
    }, []);

    return createElement(AuthenticatedContext.Provider, { value: Object.assign({
        room,
        toggleReady, submitCards, setRounds
    }, auth) }, auth && children);
}
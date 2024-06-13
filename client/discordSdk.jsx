import { Common, DiscordSDK, DiscordSDKMock } from "@discord/embedded-app-sdk";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const queryParams = new URLSearchParams(window.location.search);
const isEmbedded = queryParams.get("frame_id") != null;

let discordSdk;

if (isEmbedded) {
    discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);
} else {
    // We're using session storage for user_id, guild_id, and channel_id
    // This way the user/guild/channel will be maintained until the tab is closed, even if you refresh
    // Session storage will generate new unique mocks for each tab you open
    // Any of these values can be overridden via query parameters
    // i.e. if you set https://my-tunnel-url.com/?user_id=test_user_id
    // this will override this will override the session user_id value
    const mockUserId = getOverrideOrRandomSessionValue("user_id");
    const mockGuildId = getOverrideOrRandomSessionValue("guild_id");
    const mockChannelId = getOverrideOrRandomSessionValue("channel_id");

    discordSdk = new DiscordSDKMock(
        import.meta.env.VITE_DISCORD_CLIENT_ID,
        mockGuildId,
        mockChannelId
    );
    const discriminator = String(mockUserId.charCodeAt(0) % 5);

    discordSdk._updateCommandMocks({
        authenticate: async () => {
            return await {
                access_token: "mock_token",
                user: {
                    username: mockUserId,
                    discriminator,
                    id: mockUserId,
                    avatar: null,
                    public_flags: 1,
                },
                scopes: [],
                expires: new Date(2112, 1, 1).toString(),
                application: {
                    description: "mock_app_description",
                    icon: "mock_app_icon",
                    id: "mock_app_id",
                    name: "mock_app_name",
                },
            };
        },
    });
}

function getOverrideOrRandomSessionValue(queryParam) {
    const overrideValue = queryParams.get(queryParam);
    if (overrideValue != null) {
        return overrideValue;
    }

    const currentStoredValue = sessionStorage.getItem(queryParam);
    if (currentStoredValue != null) {
        return currentStoredValue;
    }

    // Set queryParam to a random 8-character string
    const randomString = Math.random().toString(36).slice(2, 10);
    sessionStorage.setItem(queryParam, randomString);
    return randomString;
}

const DiscordContext = createContext({ discordSdk });

export function DiscordContextProvider({ children }) {
    const setupResult = useDiscordSdkSetup();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            await setupResult.signal;
            setLoading(false);
        })();
    }, []);

    return (
        <DiscordContext.Provider value={{ data: setupResult.data, loading }}>
            {children}
        </DiscordContext.Provider>
    );
}

export function useDiscordSdk() {
    return useContext(DiscordContext);
}

function useDiscordSdkSetup() {
    const [data, setData] = useState({});
    const res = useRef();
    const signal = useRef(new Promise((r) => (res.current = r)));
    useEffect(() => {
        (async () => {
            await discordSdk.ready();
            let access_token;
            try {
                const { code } = await discordSdk.commands.authorize({
                    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
                    response_type: "code",
                    state: "",
                    prompt: "none",
                    // More info on scopes here: https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
                    scope: [
                        // "applications.builds.upload",
                        // "applications.builds.read",
                        // "applications.store.update",
                        // "applications.entitlements",
                        // "bot",
                        "identify",
                        // "connections",
                        // "email",
                        // "gdm.join",
                        "guilds",
                        // "guilds.join",
                        "guilds.members.read",
                        // "messages.read",
                        // "relationships.read",
                        // 'rpc.activities.write',
                        // "rpc.notifications.read",
                        // "rpc.voice.write",
                        "rpc.voice.read",
                        // "webhook.incoming",
                    ],
                });
    
                // Retrieve an access_token from your embedded app's server
                const response = await fetch("/api/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code,
                    }),
                });
                access_token = await response.json().then(x => x.access_token);
                const newAuth = await discordSdk.commands.authenticate({ access_token });
                if (newAuth.user) sessionStorage.setItem("newAuth", JSON.stringify(newAuth));
            } catch (e) {
                console.warn(e);
            }

            // Authenticate with Discord client (using the access_token)
            discordSdk.commands.setOrientationLockState({
                lock_state: Common.OrientationLockStateTypeObject.LANDSCAPE,
                picture_in_picture_lock_state:
                    Common.OrientationLockStateTypeObject.LANDSCAPE,
                grid_lock_state:
                    Common.OrientationLockStateTypeObject.LANDSCAPE,
            });
            res.current();
            const newAuth = JSON.parse(sessionStorage.getItem("newAuth") || "{}");
            setData({ newAuth, discordSdk, access_token: newAuth.access_token });
        })();
    }, []);

    return { data, signal: signal.current };
}

export { discordSdk };

if (import.meta.hot) {
    import.meta.hot.accept();
}

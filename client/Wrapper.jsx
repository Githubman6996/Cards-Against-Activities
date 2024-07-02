import { AuthenticatedContextProvider } from "./contexts/AuthContext.jsx";
import App from "./App.jsx";
import { discordSdk } from "./discordSdk.jsx";

export function Wrapper() {

    return (
        <div style={{
            position: "absolute",
            inset: "0",
            insetInline: discordSdk?.platform == "mobile" ? "5%" : null
        }}>
            <AuthenticatedContextProvider>
                <App />
            </AuthenticatedContextProvider>
        </div>
    );
}

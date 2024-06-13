import React from "react";
import { createRoot } from "react-dom/client";
import { Wrapper } from "./Wrapper.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { DiscordContextProvider } from "./discordSdk.jsx";
import "./util/fontAwesome.js";

// window.caaCache = Object.create(null);
window.activityName = "Cards Against Activities";

createRoot(document.querySelector("#app")).render(
    <DiscordContextProvider>
        <ErrorBoundary>
                <Wrapper />
        </ErrorBoundary>
    </DiscordContextProvider>
);
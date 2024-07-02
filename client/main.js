import { createElement } from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthenticatedContextProvider } from "./contexts/AuthContext";

window.caaCache = Object.create(null);
window.activityName = "Cards Against Humanity"

createRoot(document.querySelector("#app"))
    .render(createElement(AuthenticatedContextProvider, null, createElement(App)));

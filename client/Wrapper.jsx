import { AuthenticatedContextProvider } from "./contexts/AuthContext.jsx";
import App from "./App.jsx";

export function Wrapper() {
    const hue =
        typeof window.localStorage.getItem("hue") === "undefined"
            ? 235
            : window.localStorage.getItem("hue");
    document.body.style.setProperty("--hue", parseFloat(hue));
    const saturation =
        typeof window.localStorage.getItem("saturation") === "undefined"
            ? 0.86
            : window.localStorage.getItem("saturation");
    document.body.style.setProperty("--saturation", parseFloat(saturation));
    const light =
        typeof window.localStorage.getItem("light") === "undefined"
            ? 0.5
            : window.localStorage.getItem("light");
    document.body.style.setProperty("--light", parseFloat(light));

    return (
        <>
            <AuthenticatedContextProvider>
                <App />
            </AuthenticatedContextProvider>
        </>
    );
}

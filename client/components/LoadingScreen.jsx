import './LoadingScreen.css';
import React from "react";

export function LoadingScreen() {
    const [loadingText, setLoadingText] = React.useState("Loading...");
    const textTransitionRef = React.useRef(null);

    React.useEffect(() => {
        textTransitionRef.current.style.opacity = 1;
        textTransitionRef.current.style.transform = "scale(1)";
    }, [loadingText]);

    React.useEffect(() => {
        let ii;

        const shuffles = [
            "Loading...",
            "Connecting...",
            "...",
            "Just a moment...",
            "Almost there...",
            "Please wait...",
            "There might be an issue connecting...",
            "One moment please...",
            "Just a sec...",
            "Getting things ready...",
        ];

        let i = 0;

        const func = () => {
            ii = setTimeout(() => {
                textTransitionRef.current.style.opacity = 0;
                textTransitionRef.current.style.transform = "scale(0)";
                textTransitionRef.current.addEventListener("transitionend", () => {
                    setLoadingText(shuffles[i]);
                }, {once: true});
                i = (i + 1) % shuffles.length;
                func();
            }, 5000);
        };
        func();

        return () => {
            clearTimeout(ii);
        }
    }, []);

    return <div className="loading__container">
        {Array.from({length: 4}, (_, i) => <div className="loading__card" style={{"--nth": i + 1}} key={i}></div>)}
        <div className="loading__spinner"></div>
        <h1 className="loading__text" ref={textTransitionRef} style={{
            transition: "opacity 0.5s ease, transform 0.5s ease"
        }}>{loadingText}</h1>
    </div>;
}
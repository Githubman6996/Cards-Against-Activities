import { useState, useEffect, useRef, memo } from "react";
import { blacks, whites } from "../util";

export const BlackCard = function BlackCard({ ind, showAnimation, scale, size, style, ...props }) {
    const [animationPlayed, setAnimationPlayed] = useState(false);
    const blackCardRef = useRef();

    useEffect(() => {
        if (!blackCardRef.current) return;

        const f = () => {
            setAnimationPlayed(true);
        };

        blackCardRef.current.addEventListener("animationend", f, { once: true });

        return () => {
            if (!blackCardRef.current) return;
            blackCardRef.current.removeEventListener("animationend", f, { once: true });
        };
    }, [blackCardRef]);

    return (
        <div
            {...props}
            className="black"
            ref={blackCardRef}
            style={Object.assign(
                {
                    "--size": size ?? `calc(1vh * ${scale} * 63 / 88)`,
                    boxShadow: "6px 6px 0px rgba(0, 0, 0, 0.5)",
                    ...style
                },
                false && showAnimation && {
                    animation: !animationPlayed && "blackThrowIn 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
                    animationFillMode: !animationPlayed && "forwards",
                    transform: "rotate(-8deg)"
                },
            )}>
            {blacks[ind]}
        </div>
    );
};

function randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const WhiteCard = function WhiteCard({ ind, showAnimation, index, size, scale, buttonText, style, noShadow, ...props }) {
    const [animationPlayed, setAnimationPlayed] = useState(false);
    index = 0;
    const { current: [rotation, offset] } = useRef([index % 2 === 0 ? randRange(12, 8) : randRange(-6, -12), randRange(-50, -4)]);
    const whiteCardRef = useRef();

    useEffect(() => {
        if (!whiteCardRef.current) return;

        const f = () => {
            setAnimationPlayed(true);
        };

        whiteCardRef.current.addEventListener("animationend", f, { once: true });

        return () => {
            if (!whiteCardRef.current) return;
            whiteCardRef.current.removeEventListener("animationend", f, { once: true });
        };
    }, [whiteCardRef]);

    return (
        <div
            {...props}
            className="white"
            ref={whiteCardRef}
            style={Object.assign(
                {
                    "--size": size ?? `calc(1vh * ${scale} * 63 / 88)`,
                    boxShadow: noShadow ? "unset" : ((index % 2 === 0 ? "6px 6px" : "-6px -6px") + " 0px rgba(0, 0, 0, 0.5)"),
                    ...style,
                },
                false && showAnimation && {
                    animation: "whiteCardThrowIn 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
                    opacity: animationPlayed ? 1 : 0,
                    animationDelay: `${(index + 1) * 0.5}s`,
                    animationFillMode: "forwards",
                    "--flip": index % 2 === 0 ? 1 : -1,
                    "--angle": rotation,
                    "--offset": offset,
                }
            )}
        >
            {buttonText && <div className="whiteButton">{buttonText}</div>}
            {whites[ind]}
        </div>
    );
};

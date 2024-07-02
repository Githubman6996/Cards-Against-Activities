import { className } from "../util";

import profileStyles from "./Profile.module.css";

export default function Profile({ className: c, data, winner, host, scale = 1.25, hover, ready, style, animationOnRender = false }) {
    return (
        <div
            className={className(profileStyles.profileWrapper, "profile", c)}
            style={{
                "--scale": scale,
                background: ready ?? data?.ready ? "#00ff00" : "transparent",
                animation: animationOnRender ? "scaleIn 0.5s" : "none",
                boxShadow: ready ?? data?.ready ? "4px 4px 0px rgba(0, 0, 0, 0.5)" : "none",
            }}>
            {winner && data?.score !== 0 && (
                <div className={className(profileStyles.winnerIcon, ready ?? data.ready ? profileStyles.winnerIconReady : "")}>
                    <i className="fa-solid fa-crown" />
                </div>
            )}
            {host && (
                <div className={className(profileStyles.hostIcon, "hostIcon")}>
                    <i className="fa-solid fa-scale-unbalanced-flip" />
                </div>
            )}
            <img
                className={className(profileStyles.avatar, (ready ?? data?.ready) && profileStyles.avatarReady)}
                style={{
                    transform: "translate(-50%, -50%) " + (ready ?? data?.ready ? "scale(1.1) rotateY(360deg)" : "scale(1)"),
                    boxShadow: !ready && !data?.ready ? "4px 4px 0px rgba(0, 0, 0, 0.5)" : "none",
                }}
                src={data.avatar}
            />
            {data?.name && hover && <div className={className(profileStyles.profileName, "profileName")}>{data.name}</div>}
        </div>
    );
}

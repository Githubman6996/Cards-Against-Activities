import { createElement as e } from "react";

export default function Profile({ id, data, winner, host, scale = 1.25, hover, ready, style }) {
    return e("div", {
        className: "profile",
        style: Object.assign({
            padding: `calc(var(--global) * ${0.75 * scale})`,
            aspectRatio: "1 / 1",
            height: `calc(var(--global) * ${12 * scale})`,
            background: ready ?? data?.ready ? "#00ff00" : "transparent",
            transition: "background 0.2s",
            borderRadius: "50%",
            alignSelf: "center",
            position: "relative",
            // marginTop: `calc(var(--global) * ${10 * scale})`
            // justifySelf: "end"
        }, style)
    },
        winner && data?.score !== 0 && e("div", {
            style: {
                position: "absolute",
                rotate: "-22.5deg",
                bottom: "75%",
                fontSize: `calc(var(--global) * ${scale * 8})`,
                right: "35%",
                zIndex: "1"
            },
        }, "👑"),
        host && e("div", {
            className: "hostIcon",
            style: {
                "--size": `calc(var(--global) * ${scale * 3} * 0.05)`,
                position: "absolute",
                bottom: "75%",
                fontSize: `calc(var(--global) * ${scale * 3})`,
                left: "75%",
                zIndex: "1",
                textShadow: "var(--size) var(--size) 0 #000, calc(var(--size) * -1) var(--size) 0 #000, calc(var(--size) * -1) calc(var(--size) * -1) 0 #000, var(--size) calc(var(--size) * -1) 0 #000"
            },
        }, "⚖️"),
        e("img", {
            style: {
                aspectRatio: "1 / 1",
                width: `calc(var(--global) * ${scale * (12)})`,
                // background: data?.avatar,
                borderRadius: "50%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                position: 'absolute',
                zIndex: "0"
            },
            src: data.avatar
        }),
        data?.name && hover && e("div", {
            className: "profileName",
            style: {
                position: "absolute",
                top: "105%",
                insetInline: "-25%",
                textAlign: "center",
                color: "white",
                fontWeight: "500",
                // outline: "1px solid lime",
                fontSize: `calc(var(--global) * ${scale * 2.5})`,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                zIndex: "5"
            },
        }, data.name)
    )
}
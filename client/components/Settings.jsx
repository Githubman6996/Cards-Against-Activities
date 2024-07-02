import React, { useCallback, useEffect, useState } from "react";
import { AlphaPicker, HuePicker } from "react-color";
import settingsStyles from "./Settings.module.css";

export default function Settings({ discordSdk }) {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [hue, setHue] = useState(window.getComputedStyle(document.body).getPropertyValue("--hue") === "" ? 235 : window.getComputedStyle(document.body).getPropertyValue("--hue"));
    const [saturation, setSaturation] = useState(window.getComputedStyle(document.body).getPropertyValue("--saturation") === "" ? 0.86 : window.getComputedStyle(document.body).getPropertyValue("--saturation"));
    const [light, setLight] = useState(window.getComputedStyle(document.body).getPropertyValue("--light") === "" ? 0.5 : window.getComputedStyle(document.body).getPropertyValue("--light"));
    useEffect(() => {
        document.body.style.setProperty("--hue", hue);
        window.localStorage.setItem("hue", hue);
    }, [hue]);
    useEffect(() => {
        document.body.style.setProperty("--saturation", saturation);
        window.localStorage.setItem("saturation", saturation);
    }, [saturation]);
    useEffect(() => {
        document.body.style.setProperty("--light", light);
        window.localStorage.setItem("light", light);
    }, [light]);
    const reset = useCallback(() => {
        setHue(235);
        setSaturation(0.86);
        setLight(0.5);
    }, []);

    useEffect(() => {
        if (isNaN(hue) || isNaN(saturation) || isNaN(light)) reset();
        console.log(discordSdk?.platform == "mobile");
    }, []);

    return (
        <>
            {settingsOpen && <div className={settingsStyles.settingsBackgroundButton} onClick={() => setSettingsOpen(false)}></div>}
            <button className={settingsStyles.settingsButton} onClick={() => setSettingsOpen((s) => !s)} style={{ transform: settingsOpen && "scale(0)" }}>
                <span className={settingsStyles.settingsIcon} role="img" aria-label="settings" style={{ transform: settingsOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
                    <i className="fa-solid fa-gear"></i>
                </span>
            </button>

            <div className={settingsStyles.settingsMenuWrapper} style={{ transform: `scale(${settingsOpen ? 1 : 0}) rotate(${settingsOpen ? 0 : 20}deg)` }}>
                <div className={settingsStyles.settingsMenu}>
                    <h1 className={settingsStyles.header}>Settings</h1>
                    <div className={settingsStyles.exitSettingsButton} onClick={() => setSettingsOpen(false)}>
                        <i className="fa-regular fa-xmark"></i>
                    </div>
                    {`${parseFloat(hue).toPrecision(3)} ${saturation} ${light}`}
                    <div className={settingsStyles.setting}>
                        <label className={settingsStyles.settingHeader} htmlFor="bgColor">
                            Background Color
                            <span className={settingsStyles.settingDescription}>Applies on refresh.</span>
                        </label>
                        <HuePicker color={{ h: hue }} onChange={(color) => setHue(color.hsl.h)} />
                        <AlphaPicker
                            className="saturationPicker"
                            style={{
                                checkboard: {
                                    background: `hsl(${hue}, 0%, ${100 * light}%)`,
                                },
                            }}
                            color={{
                                h: hue,
                                s: 1,
                                l: 0.5,
                                a: saturation,
                            }}
                            onChange={(color) => setSaturation(color.rgb.a)}
                        />
                        <AlphaPicker
                            className="lightPicker"
                            style={{
                                checkboard: {
                                    background: `hsl(${hue}, ${saturation * 100}%, 0%)`,
                                },
                                alpha: {
                                    radius: "0",
                                },
                            }}
                            color={{
                                h: hue,
                                s: saturation,
                                l: 0.5,
                                a: light * 2,
                            }}
                            onChange={(color) => setLight(color.rgb.a / 2)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

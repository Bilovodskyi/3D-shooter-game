import {
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function StartGameDialog({ setStartGame, setBots }) {
    const [localBots, setLocalBots] = useState(0);
    const handleCreateBots = (n) => {
        setBots(Array.from({ length: n }, () => ({ health: 2, id: uuidv4() })));
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
            }}>
            <div
                style={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: "center",
                }}>
                <h1 className="gradient" style={{ fontSize: "64px" }}>
                    Welcome
                </h1>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        alignItems: "center",
                        gap: "16px",
                    }}>
                    <h1 style={{ fontSize: "36px", fontWeight: "normal" }}>
                        Pick number of bots
                    </h1>
                    <div style={{ display: "flex", gap: "2rem" }}>
                        <div
                            onClick={() => setLocalBots(2)}
                            style={{
                                // border: "1px solid black",
                                borderRadius: "50%",
                                width: "35px",
                                height: "35px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#81BF10",
                                cursor: "pointer",
                                color: "white",
                            }}>
                            2
                        </div>
                        <div
                            onClick={() => setLocalBots(3)}
                            style={{
                                // border: "1px solid black",
                                borderRadius: "50%",
                                width: "35px",
                                height: "35px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#FF5733",
                                cursor: "pointer",
                                color: "white",
                            }}>
                            3
                        </div>
                        <div
                            onClick={() => setLocalBots(4)}
                            style={{
                                // border: "1px solid black",
                                borderRadius: "50%",
                                width: "35px",
                                height: "35px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#6495ED",
                                cursor: "pointer",
                                color: "white",
                            }}>
                            4
                        </div>
                        <div
                            onClick={() => setLocalBots(5)}
                            style={{
                                // border: "1px solid black",
                                borderRadius: "50%",
                                width: "35px",
                                height: "35px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#FFBF00",
                                cursor: "pointer",
                                color: "white",
                            }}>
                            5
                        </div>
                    </div>
                    <button
                        style={{
                            width: "400px",
                            marginTop: "20px",
                            fontSize: "18px",
                            padding: "12px",
                            borderRadius: "12px",
                            background: "white",
                            border: "1px solid black",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            handleCreateBots(localBots);
                            setStartGame(false);
                        }}>
                        {localBots === 0
                            ? "Or start game without bots"
                            : `Start game with ${localBots} bots`}
                    </button>
                </div>
                <div>
                    <div style={{ display: "flex" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                            }}>
                            <div
                                style={{
                                    border: "1px solid black",
                                    padding: "4px 8px",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <ChevronUp size={16} />
                            </div>
                            <div
                                style={{
                                    border: "1px solid black",
                                    padding: "4px 8px",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <ChevronDown size={16} />
                            </div>
                            <div
                                style={{
                                    border: "1px solid black",
                                    padding: "4px 8px",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <ChevronLeft size={16} />
                            </div>
                            <div
                                style={{
                                    border: "1px solid black",
                                    padding: "4px 8px",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <ChevronRight size={16} />
                            </div>
                        </div>

                        <p style={{ marginLeft: "6px" }}>
                            {" "}
                            - Use arrows to move
                        </p>
                    </div>

                    <div style={{ display: "flex" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                            }}>
                            <div
                                style={{
                                    border: "1px solid black",
                                    padding: "2px 8px",
                                    borderRadius: "8px",
                                }}>
                                b
                            </div>
                        </div>

                        <p style={{ marginLeft: "6px" }}> - Shoot</p>
                    </div>

                    <div style={{ display: "flex" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                            }}>
                            <div
                                style={{
                                    border: "1px solid black",
                                    padding: "2px 8px",
                                    borderRadius: "8px",
                                }}>
                                Space
                            </div>
                        </div>

                        <p style={{ marginLeft: "6px" }}> - Jump</p>
                    </div>
                </div>
            </div>
            <div
                style={{
                    width: "50%",
                    height: "100%",
                }}>
                <video
                    src="start_screen_video.mov"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                    }}
                    autoPlay
                    loop
                    muted
                />
            </div>
        </div>
    );
}

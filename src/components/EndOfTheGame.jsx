import React from "react";

export default function EndOfTheGame({ win = false }) {
    return (
        <div
            style={{
                height: "100vh",
                position: "fixed",
                top: "0",
                right: "0",
                left: "0",
                zIndex: "10",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}>
            <h1 className="gradient" style={{ fontSize: "64px" }}>
                {win ? "Congrats! You won!" : "You lost! Try again!"}
            </h1>
            <h1 className="gradient" style={{ fontSize: "64px" }}>
                New game starts soon!
            </h1>
        </div>
    );
}

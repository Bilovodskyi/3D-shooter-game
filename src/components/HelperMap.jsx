import { Map } from "lucide-react";
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

export default function HelperMap({ x, z }) {
    const [open, setOpen] = useState(false);

    function mapCoordsToImage(x, z) {
        const imageX = ((x + 48) / 185) * 600;
        const imageY = ((z + 37) / 234) * 752;
        return { imageX, imageY };
    }

    const { imageX, imageY } = mapCoordsToImage(x, z);
    return (
        <>
            <div
                onClick={() => setOpen(true)}
                style={{
                    zIndex: 2,
                    position: "fixed",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "12px",
                    cursor: "pointer",
                }}>
                <Map size={40} />
            </div>
            <SimpleDialog
                open={open}
                onClose={() => setOpen(false)}
                imageX={imageX}
                imageY={imageY}
            />
        </>
    );
}

function SimpleDialog({ onClose, open, imageX, imageY }) {
    return (
        <Dialog onClose={onClose} open={open}>
            <img
                src="mini_map.png"
                alt="mini map"
                style={{ position: "relative" }}
            />
            <div
                style={{
                    height: "12px",
                    width: "12px",
                    backgroundColor: "red",
                    position: "absolute",
                    top: `${Math.round(imageY)}px`,
                    left: `${Math.round(imageX)}px`,
                }}
            />
        </Dialog>
    );
}

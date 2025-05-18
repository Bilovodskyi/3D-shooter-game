import { useEffect, useRef } from "react";

export function useKeyboardController() {
    const inputRef = useRef({
        x: 0,
        y: 0,
        isKeyPressed: false,
        isJumping: false,
        isFiring: false,
    });

    useEffect(() => {
        const handleKeyDown = (event) => {
            const newInput = { ...inputRef.current };
            switch (event.key) {
                case "ArrowUp":
                case "w":
                case "W":
                    newInput.y = 1;
                    break;
                case "ArrowDown":
                case "s":
                case "S":
                    newInput.y = -1;
                    break;
                case "ArrowLeft":
                case "a":
                case "A":
                    newInput.x = -1;
                    break;
                case "ArrowRight":
                case "d":
                case "D":
                    newInput.x = 1;
                    break;
                case " ":
                    if (!newInput.isJumping) {
                        newInput.isJumping = true;
                    }
                    break;
                case "b":
                    if (!newInput.isFiring) {
                        newInput.isFiring = true;
                    }
                    break;
                default:
                    return;
            }

            newInput.isKeyPressed = newInput.x !== 0 || newInput.y !== 0;
            inputRef.current = newInput;
        };

        const handleKeyUp = (event) => {
            const newInput = { ...inputRef.current };
            switch (event.key) {
                case "ArrowUp":
                case "w":
                case "W":
                    if (newInput.y === 1) newInput.y = 0;
                    break;
                case "ArrowDown":
                case "s":
                case "S":
                    if (newInput.y === -1) newInput.y = 0;
                    break;
                case "ArrowLeft":
                case "a":
                case "A":
                    if (newInput.x === -1) newInput.x = 0;
                    break;
                case "ArrowRight":
                case "d":
                case "D":
                    if (newInput.x === 1) newInput.x = 0;
                    break;
                case " ":
                    newInput.isJumping = false;
                    break;
                case "b":
                    newInput.isFiring = false;
                    break;
                default:
                    return;
            }

            newInput.isKeyPressed = newInput.x !== 0 || newInput.y !== 0;
            inputRef.current = newInput;
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return inputRef.current;
}

import { Environment, Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { GameMap } from "./GameMap";
import Controller from "./Controller";
import { Physics } from "@react-three/rapier";
import BotController from "./BotController";
import EndOfTheGame from "./EndOfTheGame";
import StartGameDialog from "./StartGameDialog";
import Bullet from "./Bullet";
import HelperMap from "./HelperMap";

export default function ViewCanvas() {
    const lightRef = useRef();

    const [startGame, setStartGame] = useState(true);
    const [bots, setBots] = useState([]);
    const [bullets, setBullets] = useState([]);
    const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, z: 0 });
    const [health, setHealth] = useState(5);
    const [endOfTheGameModal, setEndOfTheGameModal] = useState({
        show: false,
        win: false,
    });

    const onFire = (bullet) => {
        setBullets((prevBullets) => [...prevBullets, bullet]);
    };

    const onHit = (bulletId) => {
        setBullets((prevBullets) =>
            prevBullets.filter((b) => b.id !== bulletId)
        );
    };

    useEffect(() => {
        if (lightRef.current) {
            lightRef.current.target.position.set(0, 0, 0);
            lightRef.current.target.updateMatrixWorld();
        }
    }, []);

    useEffect(() => {
        let timerId;
        if (bots.length > 0 && bots.every((bot) => bot.health === 0)) {
            setEndOfTheGameModal({ show: true, win: true });
            timerId = setTimeout(() => {
                setHealth(5);
                setEndOfTheGameModal({
                    show: false,
                    win: false,
                });
                setStartGame(true);
            }, 2000);
        } else if (health === 0) {
            setEndOfTheGameModal((prev) => ({ ...prev, show: true }));
            timerId = setTimeout(() => {
                setHealth(5);
                setEndOfTheGameModal({
                    show: false,
                    win: false,
                });
                setStartGame(true);
            }, 2000);
        }
        return () => {
            if (timerId) {
                clearTimeout(timerId);
            }
        };
    }, [bots, health]);

    if (startGame) {
        return (
            <StartGameDialog setStartGame={setStartGame} setBots={setBots} />
        );
    }

    return (
        <>
            {endOfTheGameModal.show && (
                <EndOfTheGame win={endOfTheGameModal.win} />
            )}
            <HelperMap x={playerPosition.x} z={playerPosition.z} />
            <Canvas
                style={{
                    height: "100vh",
                    position: "fixed",
                    background: "#87CEEB",
                }}
                shadows
                dpr={[1, 1.5]}
                gl={{ antialias: true }}
                camera={{
                    position: [20, 80, 40],
                    fov: 30,
                }}>
                <Suspense fallback={null}>
                    <Physics gravity={[0, -40, 0]}>
                        <directionalLight
                            ref={lightRef}
                            castShadow
                            intensity={1.2}
                            position={[50, 100, -50]}
                            shadow-camera-left={-200}
                            shadow-camera-right={200}
                            shadow-camera-top={200}
                            shadow-camera-bottom={-200}
                            shadow-camera-near={0.1}
                            shadow-camera-far={200}
                            shadow-mapSize-width={4096}
                            shadow-mapSize-height={4096}
                            shadow-bias={-0.0001}
                        />
                        {/* <OrbitControls
                            autoRotate
                            autoRotateSpeed={0.1}
                            scale={-4}
                        /> */}

                        <Controller
                            position-y={2}
                            onFire={onFire}
                            health={health}
                            setHealth={setHealth}
                            onPlayerPositionChange={(newPosition) =>
                                setPlayerPosition(newPosition)
                            }
                        />

                        {bots.map((bot) => (
                            <BotController
                                key={bot.id}
                                position-y={2}
                                onFire={onFire}
                                health={bot.health}
                                id={bot.id}
                                setBots={setBots}
                                playerPosition={playerPosition}
                            />
                        ))}
                        {bullets.map((bullet) => (
                            <Bullet
                                key={bullet.id}
                                {...bullet}
                                bulletId={bullet.id}
                                onHit={onHit}
                                type={bullet.type}
                            />
                        ))}
                        <GameMap />
                        <Environment
                            files="/hdr/lebombo_1k.hdr"
                            environmentIntensity={0.75}
                        />
                    </Physics>
                </Suspense>
            </Canvas>
            <Loader />
        </>
    );
}

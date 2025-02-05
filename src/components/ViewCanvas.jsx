import { Environment, Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { GameMap } from "./GameMap";
import { insertCoin, myPlayer, onPlayerJoin } from "playroomkit";
import Controller from "./Controller";
import { Physics } from "@react-three/rapier";

export default function ViewCanvas() {
    const [players, setPlayers] = useState([]);
    const lightRef = useRef();

    const start = async () => {
        await insertCoin();

        onPlayerJoin((state) => {
            const newPlayer = { state };
            state.setState("health", 100);
            state.setState("deaths", 0);
            state.setState("kills", 0);
            setPlayers((players) => [...players, newPlayer]);
            state.onQuit(() => {
                setPlayers((players) =>
                    players.filter((p) => p.state.id !== state.id)
                );
            });
        });
    };

    useEffect(() => {
        if (lightRef.current) {
            lightRef.current.target.position.set(0, 0, 0);
            lightRef.current.target.updateMatrixWorld();
        }
    }, []);

    useEffect(() => {
        start();
    }, []);
    return (
        <>
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
                            // Increase the frustum size to cover the whole map
                            shadow-camera-left={-100}
                            shadow-camera-right={100}
                            shadow-camera-top={100}
                            shadow-camera-bottom={-100}
                            shadow-camera-near={0.1}
                            shadow-camera-far={200}
                            shadow-mapSize-width={4096}
                            shadow-mapSize-height={4096}
                            shadow-bias={-0.0001}
                        />
                        {/* <OrbitControls /> */}

                        {players.map(({ state }, idx) => {
                            return (
                                <Controller
                                    key={state.id}
                                    position-y={15}
                                    state={state}
                                    userPlayer={state.id === myPlayer().id}
                                />
                            );
                        })}
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

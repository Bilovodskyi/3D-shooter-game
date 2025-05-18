import { Environment, Loader, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { GameMap } from "./GameMap";
import Controller from "./Controller";
import { Physics, useRapier } from "@react-three/rapier";
import BotController from "./BotController";
import EndOfTheGame from "./EndOfTheGame";
import StartGameDialog from "./StartGameDialog";
import Bullet from "./Bullet";
import HelperMap from "./HelperMap";

useGLTF.preload("/hdr/lebombo_1k.hdr");

const PhysicsWorldCleanup = ({ onCleanup }) => {
    const { world } = useRapier();

    useEffect(() => {
        return () => {
            if (world) {
                try {
                    // Clean up rigid bodies
                    world.bodies.forEach((body) => {
                        if (body && world.bodies.includes(body)) {
                            world.removeRigidBody(body);
                        }
                    });

                    // Clean up colliders
                    world.colliders.forEach((collider) => {
                        if (collider && world.colliders.includes(collider)) {
                            world.removeCollider(collider);
                        }
                    });

                    // Clean up joints
                    world.joints.forEach((joint) => {
                        if (joint && world.joints.includes(joint)) {
                            world.removeJoint(joint);
                        }
                    });

                    world.free();
                    onCleanup?.();
                } catch (error) {
                    console.error("Error cleaning up physics world:", error);
                }
            }
        };
    }, [world, onCleanup]);

    return null;
};

const cleanupThreeJSResources = (object) => {
    if (!object) return;

    if (object.geometry) {
        object.geometry.dispose();
    }

    if (object.material) {
        if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
        } else {
            object.material.dispose();
        }
    }

    if (object.children) {
        object.children.forEach((child) => cleanupThreeJSResources(child));
    }
};

export default function ViewCanvas() {
    const lightRef = useRef();
    const canvasRef = useRef();
    const sceneRef = useRef(null);

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

    const resetGame = useCallback(() => {
        setBullets([]);
        setBots([]);
        setPlayerPosition({ x: 0, y: 0, z: 0 });
        setHealth(5);
        setEndOfTheGameModal({
            show: false,
            win: false,
        });

        // Force garbage collection by nullifying references (as much as JS allows)
        if (sceneRef.current) {
            sceneRef.current.traverse(cleanupThreeJSResources);
        }

        // Small delay before showing start screen to allow cleanup
        setTimeout(() => {
            setStartGame(true);
        }, 50);
    }, []);

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
            timerId = setTimeout(resetGame, 2000);
        } else if (health === 0) {
            setEndOfTheGameModal({ show: true, win: false });
            timerId = setTimeout(resetGame, 2000);
        }

        return () => {
            if (timerId) {
                clearTimeout(timerId);
            }
        };
    }, [bots, health, resetGame]);

    // Comprehensive cleanup when component unmounts
    useEffect(() => {
        return () => {
            setBullets([]);
            setBots([]);

            if (canvasRef.current?.gl) {
                const renderer = canvasRef.current.gl;
                const scene = canvasRef.current.scene;

                if (scene) {
                    scene.traverse(cleanupThreeJSResources);
                }

                renderer.dispose();
                renderer.forceContextLoss();
                renderer.context = null;
                renderer.domElement = null;
            }
        };
    }, []);

    // Handle storing scene reference
    const handleCreated = useCallback(({ scene, gl }) => {
        sceneRef.current = scene;
    }, []);

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
                ref={canvasRef}
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
                }}
                onCreated={handleCreated}>
                <Suspense fallback={null}>
                    <Physics gravity={[0, -40, 0]}>
                        <PhysicsWorldCleanup
                            onCleanup={() => {
                                setBullets([]);
                                setBots([]);
                            }}
                        />
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

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Soldier } from "./Soldier";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { Billboard, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

const MOVEMENT_SPEED = 3000;
const DETECTION_RANGE = 20;
const MAX_DISTANCE_TO_PLAYER = 10;
const FIRE_RATE = 1000;

export default function BotController({
    id,
    health,
    setBots,
    playerPosition,
    onFire,
    ...props
}) {
    const botGroupRef = useRef();
    const botControllerRef = useRef();
    const botRigidBodyRef = useRef();

    const [animation, setAnimation] = useState("Idle");
    const timeToNextDirectionRef = useRef(0);
    const lastShootRef = useRef(Date.now());

    const randomDirectionRef = useRef(new THREE.Vector3(0, 0, 0));

    useEffect(() => {
        if (botRigidBodyRef.current) {
            botRigidBodyRef.current.applyImpulse(
                { x: 20000, y: 0, z: 30000 },
                true
            );
        }
    }, []);

    useEffect(() => {
        if (health === 0) {
            setAnimation("Death");
        }
    }, [health]);

    const setNewDirectionFunction = () => {
        const randX = Math.random() - 0.5;
        const randZ = Math.random() - 0.5;
        const newDir = new THREE.Vector3(randX, 0, randZ).normalize();

        randomDirectionRef.current = newDir;

        const newTime = Math.random() * 2 + 2;
        timeToNextDirectionRef.current = newTime;
    };

    useFrame((_, delta) => {
        if (!botRigidBodyRef.current || health === 0) return;

        const botPos = botRigidBodyRef.current.translation();

        timeToNextDirectionRef.current -= delta;

        const dx = playerPosition.x - botPos.x;
        const dz = playerPosition.z - botPos.z;
        const distance = Math.sqrt(dx * dx + dz * dz);

        if (distance < DETECTION_RANGE && distance > MAX_DISTANCE_TO_PLAYER) {
            if (animation !== "Run") {
                setAnimation("Run");
            }

            const direction = new THREE.Vector3(dx, 0, dz).normalize();
            const impulse = {
                x: direction.x * MOVEMENT_SPEED * delta,
                y: 0,
                z: direction.z * MOVEMENT_SPEED * delta,
            };

            botRigidBodyRef.current.applyImpulse(impulse, true);

            if (botControllerRef.current) {
                botControllerRef.current.rotation.y = Math.atan2(
                    direction.x,
                    direction.z
                );
            }

            if (
                Date.now() - lastShootRef.current > FIRE_RATE &&
                botRigidBodyRef.current
            ) {
                setAnimation("Idle_Shoot");

                lastShootRef.current = Date.now();

                const newBullet = {
                    id: uuidv4(),
                    position: vec3(botRigidBodyRef.current.translation()),
                    angle: botControllerRef.current.rotation.y,
                    type: "botBullet",
                };
                onFire(newBullet);
            }
        } else if (distance > DETECTION_RANGE) {
            if (animation !== "Run") {
                setAnimation("Run");
            }
            if (timeToNextDirectionRef.current <= 0) {
                setNewDirectionFunction();
            }
            const impulse = {
                x: randomDirectionRef.current.x * MOVEMENT_SPEED * delta,
                y: 0,
                z: randomDirectionRef.current.z * MOVEMENT_SPEED * delta,
            };
            botRigidBodyRef.current.applyImpulse(impulse, true);

            if (botControllerRef.current) {
                botControllerRef.current.rotation.y = Math.atan2(
                    impulse.x,
                    impulse.z
                );
            }
        } else {
            setAnimation("Idle");
        }
    });

    return (
        <group ref={botGroupRef} {...props}>
            <RigidBody
                colliders={false}
                ref={botRigidBodyRef}
                linearDamping={10}
                type={"dynamic"}
                lockRotations
                onIntersectionEnter={({ other }) => {
                    if (
                        other.rigidBody.userData?.type === "bullet" &&
                        health > 0
                    ) {
                        const newHealth = health - 1;
                        if (newHealth <= 0) {
                            botRigidBodyRef.current.setEnabled(false);
                            setBots((prevBots) =>
                                prevBots.map((bot) =>
                                    bot.id === id ? { ...bot, health: 0 } : bot
                                )
                            );
                        } else {
                            setBots((prevBots) =>
                                prevBots.map((bot) =>
                                    bot.id === id
                                        ? { ...bot, health: newHealth }
                                        : bot
                                )
                            );
                        }
                    }
                }}
                userData={{
                    type: "bot",
                }}>
                <PlayerInfo health={health} />
                <group ref={botControllerRef}>
                    <Soldier animation={animation} color="red" />
                </group>
                <CapsuleCollider args={[1, 1.5]} position={[0, 2.8, 0]} />
            </RigidBody>
        </group>
    );
}

const PlayerInfo = ({ health }) => {
    const name = "Test";
    return (
        <Billboard position-y={5}>
            <Text position-y={0.36} fontSize={0.4}>
                {name}
                <meshBasicMaterial color="White" />
            </Text>
            <mesh position-z={-0.1}>
                <planeGeometry args={[1, 0.2]} />
                <meshBasicMaterial color="black" transparent opacity={0.5} />
            </mesh>
            <mesh scale-x={health / 2} position-x={-0.5 * (1 - health / 2)}>
                <planeGeometry args={[1, 0.2]} />
                <meshBasicMaterial color="red" />
            </mesh>
        </Billboard>
    );
};

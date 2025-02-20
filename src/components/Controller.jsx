import React, { useEffect, useRef, useState } from "react";
import { Soldier } from "./Soldier";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { Billboard, CameraControls, Text } from "@react-three/drei";
import { useKeyboardController } from "../hooks/useKeyboardController";
import { v4 as uuidv4 } from "uuid";

const MOVEMENT_SPEED = 4000;
const FIRE_RATE = 350;

export default function Controller({
    onFire,
    health,
    setHealth,
    onPlayerPositionChange,
    ...props
}) {
    const groupRef = useRef();
    const controllerRef = useRef();
    const rigidBodyRef = useRef();
    const controlRef = useRef();
    const lastShootRef = useRef(0);

    const { isKeyPressed, x, y, isJumping, isFiring } = useKeyboardController();

    const [animation, setAnimation] = useState("Idle");

    useEffect(() => {
        if (health === 0) {
            setAnimation("Death");
        }
    }, [health]);

    useFrame((_, delta) => {
        if (controlRef.current) {
            const cameraDistanceY = 20;
            const cameraDistanceZ = 16;
            const playerWorldPosition = vec3(
                rigidBodyRef.current.translation()
            );

            if (onPlayerPositionChange) {
                onPlayerPositionChange(playerWorldPosition);
            }

            controlRef.current.setLookAt(
                playerWorldPosition.x,
                playerWorldPosition.y + cameraDistanceY * 3,
                playerWorldPosition.z + cameraDistanceZ * 3,
                playerWorldPosition.x,
                playerWorldPosition.y + 2.5,
                playerWorldPosition.z
            );
        }

        if (health <= 0) {
            return;
        }

        if (isKeyPressed && (x || y)) {
            if (animation !== "Run") {
                setAnimation("Run");
            }

            const impulse = {
                x: x * MOVEMENT_SPEED * delta,
                y: 0,
                z: -y * MOVEMENT_SPEED * delta,
            };

            rigidBodyRef.current.applyImpulse(impulse, true);
            controllerRef.current.rotation.y = Math.atan2(impulse.x, impulse.z);
        } else {
            if (animation !== "Idle") {
                setAnimation("Idle");
            }
        }

        if (isJumping) {
            rigidBodyRef.current.applyImpulse({ x: 0, y: 30, z: 0 }, true);
            setTimeout(() => {
                rigidBodyRef.current.applyImpulse({ x: 0, y: -30, z: 0 }, true);
            }, 500);
        }

        if (isFiring) {
            setAnimation("Idle_Shoot");

            if (
                Date.now() - lastShootRef.current > FIRE_RATE &&
                rigidBodyRef.current
            ) {
                lastShootRef.current = Date.now();

                const newBullet = {
                    id: uuidv4(),
                    position: vec3(rigidBodyRef.current.translation()),
                    angle: controllerRef.current.rotation.y,
                    type: "bullet",
                };
                onFire(newBullet);
            }
        }
    });

    return (
        <group ref={groupRef} {...props}>
            <CameraControls ref={controlRef} />
            <RigidBody
                colliders={false}
                ref={rigidBodyRef}
                linearDamping={10}
                type={"dynamic"}
                lockRotations
                onIntersectionEnter={({ other }) => {
                    if (
                        other.rigidBody.userData?.type === "botBullet" &&
                        health
                    ) {
                        setHealth((prev) => prev - 1);
                        if (health <= 0) {
                            rigidBodyRef.current.setEnabled(false);
                            setHealth(0);
                        }
                    }
                }}
                userData={{
                    type: "player",
                }}>
                <PlayerInfo health={health} />
                <group ref={controllerRef}>
                    <Soldier animation={animation} />
                </group>
                <CapsuleCollider args={[1, 1.5]} position={[0, 2.8, 0]} />
            </RigidBody>
        </group>
    );
}

const PlayerInfo = ({ health }) => {
    const name = "You";
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
            <mesh scale-x={health / 5} position-x={-0.5 * (1 - health / 5)}>
                <planeGeometry args={[1, 0.2]} />
                <meshBasicMaterial color="red" />
            </mesh>
        </Billboard>
    );
};

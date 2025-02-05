import React, { useRef, useState } from "react";
import { Soldier } from "./Soldier";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useKeyboardController } from "../hooks/useKeyboardController";

const MOVEMENT_SPEED = 200;

export default function Controller({ state, userPlayer, ...props }) {
    const groupRef = useRef();
    const controllerRef = useRef();
    const rigidBodyRef = useRef();
    const controlRef = useRef();

    const { isKeyPressed, x, y, isJumping } = useKeyboardController();

    const [animation, setAnimation] = useState("Idle");
    if (rigidBodyRef.current) {
        const currentVelocity = rigidBodyRef.current.linvel();
        console.log(currentVelocity);
    }

    useFrame((_, delta) => {
        if (controlRef.current) {
            const cameraDistanceY = window.innerWidth < 1024 ? 16 : 20;
            const cameraDistanceZ = window.innerWidth < 1024 ? 12 : 16;
            const playerWorldPosition = vec3(
                rigidBodyRef.current.translation()
            );
            controlRef.current.setLookAt(
                playerWorldPosition.x,
                playerWorldPosition.y + cameraDistanceY * 3,
                playerWorldPosition.z + cameraDistanceZ * 3,
                playerWorldPosition.x,
                playerWorldPosition.y + 2.5,
                playerWorldPosition.z
            );
        }

        if (isKeyPressed && (x || y)) {
            setAnimation("Run");

            const impulse = {
                x: x * MOVEMENT_SPEED * delta,
                y: 0,
                z: -y * MOVEMENT_SPEED * delta,
            };

            rigidBodyRef.current.applyImpulse(impulse, true);
            controllerRef.current.rotation.y = Math.atan2(impulse.x, impulse.z);
        } else {
            setAnimation("Idle");
        }

        if (isJumping) {
            rigidBodyRef.current.applyImpulse({ x: 0, y: 3, z: 0 }, true);
            setTimeout(() => {
                rigidBodyRef.current.applyImpulse({ x: 0, y: -3, z: 0 }, true);
            }, 500);
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
                lockRotations>
                <group ref={controllerRef}>
                    <Soldier
                        animation={animation}
                        color={state.state.profile?.color}
                    />
                </group>
                <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.28, 0]} />
            </RigidBody>
        </group>
    );
}

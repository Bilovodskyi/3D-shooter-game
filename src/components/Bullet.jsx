import { RigidBody, vec3 } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { MeshBasicMaterial } from "three";

const BULLET_SPEED = 50;

export default function Bullet({ angle, position, onHit, bulletId, type }) {
    const rigidBodyBulletRef = useRef();

    const bulletMaterial = new MeshBasicMaterial({
        color: "hotpink",
        toneMapped: false,
    });

    bulletMaterial.color.multiplyScalar(42);

    useEffect(() => {
        const velocity = {
            x: Math.sin(angle) * BULLET_SPEED,
            y: 0,
            z: Math.cos(angle) * BULLET_SPEED,
        };
        rigidBodyBulletRef.current.setLinvel(velocity, true);
    }, []);
    return (
        <group
            position={[position.x, position.y, position.z]}
            rotation-y={angle}>
            <RigidBody
                ref={rigidBodyBulletRef}
                gravityScale={0}
                sensor
                onIntersectionEnter={(e) => {
                    const otherType = e.other.rigidBody.userData?.type;
                    const myType = rigidBodyBulletRef.current.userData?.type;

                    if (myType === "bullet") {
                        if (
                            otherType === "bot" ||
                            (otherType !== "bullet" &&
                                otherType !== "player" &&
                                otherType !== "botBullet" &&
                                otherType !== "bot")
                        ) {
                            rigidBodyBulletRef.current.setEnabled(false);
                            onHit(bulletId);
                        }
                    } else if (myType === "botBullet") {
                        if (
                            otherType === "player" ||
                            (otherType !== "bullet" &&
                                otherType !== "player" &&
                                otherType !== "botBullet" &&
                                otherType !== "bot")
                        ) {
                            rigidBodyBulletRef.current.setEnabled(false);
                            onHit(bulletId);
                        }
                    }
                }}
                userData={{
                    type: type,
                    id: "host",
                    damage: 1,
                }}>
                <mesh
                    position-z={0.25}
                    position-y={3}
                    material={bulletMaterial}
                    castShadow>
                    <boxGeometry args={[0.25, 0.25, 0.5]} />
                </mesh>
            </RigidBody>
        </group>
    );
}

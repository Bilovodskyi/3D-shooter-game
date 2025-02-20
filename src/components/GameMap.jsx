import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export function GameMap(props) {
    const map = useGLTF("/city_V2.glb");

    useEffect(() => {
        map.scene.traverse((children) => {
            if (children.isMesh) {
                children.castShadow = true;
                children.receiveShadow = true;
            }
        });
    }, []);

    return (
        <RigidBody
            colliders="trimesh"
            type="fixed"
            userData={{ type: "obstacle" }}>
            <primitive object={map.scene} />;
        </RigidBody>
    );
}

useGLTF.preload("/city.glb");

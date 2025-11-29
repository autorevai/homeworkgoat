/**
 * VoxelCharacter Component
 * Renders a Minecraft-style blocky character with customizable colors.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { AvatarConfig } from '../persistence/types';

interface VoxelCharacterProps {
  config: AvatarConfig;
  position?: [number, number, number];
  rotation?: number;
  isMoving?: boolean;
  isPlayer?: boolean;
}

export function VoxelCharacter({ 
  config, 
  position = [0, 0, 0], 
  rotation = 0,
  isMoving = false,
  isPlayer = false,
}: VoxelCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  // Animate limbs when moving
  useFrame((state) => {
    if (!isMoving) {
      // Reset limb positions when not moving
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
      return;
    }

    const time = state.clock.elapsedTime;
    const swing = Math.sin(time * 8) * 0.5;

    if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -swing;
    if (rightArmRef.current) rightArmRef.current.rotation.x = swing;
  });

  const skinColor = '#FFD5B8';

  return (
    <group ref={groupRef} position={position} rotation={[0, rotation, 0]}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.9, 0]} castShadow>
        <boxGeometry args={[0.52, 0.15, 0.52]} />
        <meshStandardMaterial color={config.hairColor} />
      </mesh>

      {/* Eyes */}
      <mesh position={[0.12, 1.65, 0.26]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-0.12, 1.65, 0.26]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Body / Shirt */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color={config.shirtColor} />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.35, 1.2, 0]}>
        <mesh ref={leftArmRef} castShadow>
          <boxGeometry args={[0.2, 0.6, 0.2]} />
          <meshStandardMaterial color={config.shirtColor} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.18, 0.15, 0.18]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.35, 1.2, 0]}>
        <mesh ref={rightArmRef} castShadow>
          <boxGeometry args={[0.2, 0.6, 0.2]} />
          <meshStandardMaterial color={config.shirtColor} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.18, 0.15, 0.18]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group position={[-0.12, 0.35, 0]}>
        <mesh ref={leftLegRef} castShadow>
          <boxGeometry args={[0.22, 0.6, 0.25]} />
          <meshStandardMaterial color={config.pantsColor} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[0.12, 0.35, 0]}>
        <mesh ref={rightLegRef} castShadow>
          <boxGeometry args={[0.22, 0.6, 0.25]} />
          <meshStandardMaterial color={config.pantsColor} />
        </mesh>
      </group>

      {/* Accessory: Cap */}
      {config.accessory === 'cap' && (
        <group position={[0, 1.95, 0]}>
          {/* Cap top */}
          <mesh castShadow>
            <boxGeometry args={[0.55, 0.15, 0.55]} />
            <meshStandardMaterial color="#F44336" />
          </mesh>
          {/* Cap brim */}
          <mesh position={[0, -0.05, 0.25]} castShadow>
            <boxGeometry args={[0.5, 0.05, 0.25]} />
            <meshStandardMaterial color="#F44336" />
          </mesh>
        </group>
      )}

      {/* Accessory: Glasses */}
      {config.accessory === 'glasses' && (
        <group position={[0, 1.65, 0.27]}>
          {/* Left lens */}
          <mesh>
            <boxGeometry args={[0.15, 0.1, 0.02]} />
            <meshStandardMaterial color="#1a1a1a" opacity={0.5} transparent />
          </mesh>
          {/* Right lens */}
          <mesh position={[0.2, 0, 0]}>
            <boxGeometry args={[0.15, 0.1, 0.02]} />
            <meshStandardMaterial color="#1a1a1a" opacity={0.5} transparent />
          </mesh>
          {/* Bridge */}
          <mesh position={[0.1, 0, 0]}>
            <boxGeometry args={[0.08, 0.02, 0.02]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </group>
      )}

      {/* Player indicator (floating arrow above head) */}
      {isPlayer && (
        <mesh position={[0, 2.5, 0]}>
          <coneGeometry args={[0.15, 0.3, 4]} />
          <meshStandardMaterial color="#4CAF50" emissive="#4CAF50" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  );
}

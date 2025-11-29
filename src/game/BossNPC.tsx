/**
 * BossNPC Component
 * Renders a boss character in the 3D world with menacing appearance.
 */

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { BossBattle } from '../conquest/bosses';

interface BossNPCProps {
  boss: BossBattle;
  position: [number, number, number];
  isDefeated: boolean;
  onInteract: () => void;
  playerPosition: THREE.Vector3;
}

export function BossNPC({ boss, position, isDefeated, onInteract, playerPosition }: BossNPCProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const interactionDistance = 4;

  // Check if player is close enough to interact
  useEffect(() => {
    const npcPos = new THREE.Vector3(...position);
    const dist = playerPosition.distanceTo(npcPos);
    setShowPrompt(dist < interactionDistance);
  }, [playerPosition, position]);

  // Floating animation
  useFrame((state) => {
    if (groupRef.current) {
      // Menacing floating
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.2;

      // Rotate to face player
      const npcPos = new THREE.Vector3(...position);
      const direction = new THREE.Vector3()
        .subVectors(playerPosition, npcPos)
        .setY(0)
        .normalize();
      if (direction.length() > 0) {
        const angle = Math.atan2(direction.x, direction.z);
        groupRef.current.rotation.y = angle;
      }
    }
  });

  // Parse boss colors
  const primaryColor = boss.accentColor || '#f44336';

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onInteract}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Boss body - larger and more imposing */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <capsuleGeometry args={[0.7, 1.4, 8, 16]} />
        <meshStandardMaterial
          color={isDefeated ? '#555555' : primaryColor}
          emissive={isDefeated ? '#000' : primaryColor}
          emissiveIntensity={isDefeated ? 0 : 0.3}
        />
      </mesh>

      {/* Boss head */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color={isDefeated ? '#444444' : primaryColor}
          emissive={isDefeated ? '#000' : primaryColor}
          emissiveIntensity={isDefeated ? 0 : 0.3}
        />
      </mesh>

      {/* Glowing eyes */}
      {!isDefeated && (
        <>
          <mesh position={[-0.15, 2.85, 0.4]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color="#fff"
              emissive="#ff0"
              emissiveIntensity={1}
            />
          </mesh>
          <mesh position={[0.15, 2.85, 0.4]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color="#fff"
              emissive="#ff0"
              emissiveIntensity={1}
            />
          </mesh>
        </>
      )}

      {/* Horns or crown (depending on boss) */}
      <mesh position={[-0.3, 3.2, 0]} rotation={[0, 0, -0.3]} castShadow>
        <coneGeometry args={[0.1, 0.4, 6]} />
        <meshStandardMaterial
          color={isDefeated ? '#333' : '#2d2d2d'}
        />
      </mesh>
      <mesh position={[0.3, 3.2, 0]} rotation={[0, 0, 0.3]} castShadow>
        <coneGeometry args={[0.1, 0.4, 6]} />
        <meshStandardMaterial
          color={isDefeated ? '#333' : '#2d2d2d'}
        />
      </mesh>

      {/* Aura effect when not defeated */}
      {!isDefeated && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshStandardMaterial
            color={primaryColor}
            transparent
            opacity={hovered ? 0.3 : 0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Light effect */}
      {!isDefeated && (
        <pointLight
          position={[0, 2, 0]}
          color={primaryColor}
          intensity={hovered ? 2 : 1}
          distance={6}
        />
      )}

      {/* Interaction prompt */}
      {showPrompt && (
        <Html position={[0, 4.2, 0]} center>
          <div
            style={{
              background: isDefeated
                ? 'rgba(100, 100, 100, 0.9)'
                : `linear-gradient(135deg, ${primaryColor}, #000)`,
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              fontFamily: 'Arial, sans-serif',
              border: isDefeated ? '2px solid #666' : `2px solid ${primaryColor}`,
              boxShadow: isDefeated ? 'none' : `0 0 20px ${primaryColor}`,
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
              {boss.bossEmoji} {boss.bossName}
            </div>
            <div style={{ fontSize: '11px', marginTop: '4px' }}>
              {isDefeated ? '✅ Defeated' : 'Press E to Battle!'}
            </div>
            {!isDefeated && (
              <div style={{ fontSize: '10px', color: '#FFD700', marginTop: '2px' }}>
                {boss.rewards.xp} XP Reward
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

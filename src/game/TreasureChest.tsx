/**
 * TreasureChest Component
 * A 3D chest that glows and can be interacted with to solve math puzzles.
 */

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { TreasureChestDef } from '../persistence/types';
import { CHEST_RARITY_CONFIG, getChestRarityInfo } from '../exploration/treasureChests';

interface TreasureChestProps {
  chest: TreasureChestDef;
  isOpened: boolean;
  playerPosition: THREE.Vector3;
  onInteract: () => void;
}

export function TreasureChest({ chest, isOpened, playerPosition, onInteract }: TreasureChestProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [glowIntensity, setGlowIntensity] = useState(0);

  const config = CHEST_RARITY_CONFIG[chest.rarity];
  const rarityInfo = getChestRarityInfo(chest.rarity);
  const position = new THREE.Vector3(...chest.position);

  // Calculate distance to player
  const distance = playerPosition.distanceTo(position);
  const isNearby = distance < 3;

  // Animate glow
  useFrame(() => {
    if (isOpened) {
      setGlowIntensity(0);
      return;
    }

    // Pulsing glow effect
    const pulse = Math.sin(Date.now() * 0.003) * 0.3 + 0.7;
    setGlowIntensity(isNearby ? pulse * 1.5 : pulse);
  });

  // Lid rotation for opened chests
  const lidRotation = isOpened ? -Math.PI / 2 : 0;

  return (
    <group ref={groupRef} position={chest.position}>
      {/* Chest base */}
      <mesh
        position={[0, 0.25, 0]}
        castShadow
        receiveShadow
        onClick={onInteract}
      >
        <boxGeometry args={[0.8, 0.5, 0.6]} />
        <meshStandardMaterial
          color={isOpened ? '#5C4033' : config.color}
          emissive={isOpened ? '#000000' : config.glowColor}
          emissiveIntensity={isOpened ? 0 : glowIntensity * 0.3}
        />
      </mesh>

      {/* Chest lid */}
      <group position={[0, 0.5, -0.3]} rotation={[lidRotation, 0, 0]}>
        <mesh position={[0, 0.15, 0.15]} castShadow>
          <boxGeometry args={[0.85, 0.3, 0.65]} />
          <meshStandardMaterial
            color={isOpened ? '#5C4033' : config.color}
            emissive={isOpened ? '#000000' : config.glowColor}
            emissiveIntensity={isOpened ? 0 : glowIntensity * 0.3}
          />
        </mesh>
      </group>

      {/* Lock (only if not opened) */}
      {!isOpened && (
        <mesh position={[0, 0.35, 0.31]}>
          <boxGeometry args={[0.15, 0.2, 0.05]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      )}

      {/* Glow effect (point light) */}
      {!isOpened && (
        <pointLight
          position={[0, 0.5, 0]}
          color={config.glowColor}
          intensity={glowIntensity * 2}
          distance={3}
        />
      )}

      {/* Sparkles for rare+ chests */}
      {!isOpened && chest.rarity !== 'common' && (
        <>
          <mesh position={[0.3, 0.8, 0]} rotation={[0, Date.now() * 0.001, 0]}>
            <octahedronGeometry args={[0.05]} />
            <meshBasicMaterial color={config.glowColor} />
          </mesh>
          <mesh position={[-0.2, 0.9, 0.2]} rotation={[0, Date.now() * 0.002, 0]}>
            <octahedronGeometry args={[0.04]} />
            <meshBasicMaterial color={config.glowColor} />
          </mesh>
        </>
      )}

      {/* Interaction prompt */}
      {isNearby && !isOpened && (
        <Html position={[0, 1.5, 0]} center>
          <div
            style={{
              background: `linear-gradient(135deg, ${config.color}ee, ${config.color}99)`,
              color: 'white',
              padding: '8px 16px',
              borderRadius: '12px',
              whiteSpace: 'nowrap',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: `0 0 20px ${config.glowColor}`,
              border: `2px solid ${config.glowColor}`,
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '4px' }}>
              {rarityInfo.emoji} {rarityInfo.label} Chest
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              Press E to unlock
            </div>
          </div>
        </Html>
      )}

      {/* Opened indicator */}
      {isOpened && isNearby && (
        <Html position={[0, 1, 0]} center>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              color: '#888',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          >
            Already opened
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * CrystalShard Component
 * A glowing 3D crystal that floats and pulses, attracting players to collect it.
 */

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { CrystalShardDef } from '../persistence/types';
import { CRYSTAL_COLORS, type CrystalColor } from '../exploration/crystalShards';

interface CrystalShardProps {
  shard: CrystalShardDef;
  isCollected: boolean;
  playerPosition: THREE.Vector3;
  onInteract: () => void;
}

export function CrystalShard({ shard, isCollected, playerPosition, onInteract }: CrystalShardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoverPulse, setHoverPulse] = useState(0);

  const colorKey = shard.color as CrystalColor;
  const crystalColor = CRYSTAL_COLORS[colorKey] || CRYSTAL_COLORS.blue;
  const position = new THREE.Vector3(...shard.position);

  // Calculate distance to player
  const distance = playerPosition.distanceTo(position);
  const isNearby = distance < 3;

  // Don't render if already collected
  if (isCollected) {
    return null;
  }

  // Animate crystal floating and rotating
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Floating motion
    groupRef.current.position.y = shard.position[1] + 0.5 + Math.sin(time * 2) * 0.15;

    // Rotation
    groupRef.current.rotation.y = time * 0.5;

    // Pulse effect when nearby
    setHoverPulse(isNearby ? Math.sin(time * 4) * 0.2 + 1.2 : 1);
  });

  return (
    <group ref={groupRef} position={[shard.position[0], shard.position[1] + 0.5, shard.position[2]]}>
      {/* Main crystal body - octahedron shape */}
      <mesh onClick={onInteract} scale={[0.3 * hoverPulse, 0.5 * hoverPulse, 0.3 * hoverPulse]}>
        <octahedronGeometry args={[1]} />
        <meshStandardMaterial
          color={crystalColor.hex}
          emissive={crystalColor.hex}
          emissiveIntensity={0.5 + (isNearby ? 0.3 : 0)}
          transparent
          opacity={0.85}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* Inner glow */}
      <mesh scale={[0.2, 0.35, 0.2]}>
        <octahedronGeometry args={[1]} />
        <meshBasicMaterial color={crystalColor.glow} transparent opacity={0.6} />
      </mesh>

      {/* Particle sparkles around crystal */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2 + Date.now() * 0.001;
        const radius = 0.4;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(Date.now() * 0.002 + i) * 0.2,
              Math.sin(angle) * radius,
            ]}
          >
            <sphereGeometry args={[0.03]} />
            <meshBasicMaterial color={crystalColor.glow} />
          </mesh>
        );
      })}

      {/* Point light for glow effect */}
      <pointLight
        color={crystalColor.hex}
        intensity={isNearby ? 3 : 1.5}
        distance={4}
      />

      {/* Interaction prompt */}
      {isNearby && (
        <Html position={[0, 1.2, 0]} center>
          <div
            style={{
              background: `linear-gradient(135deg, ${crystalColor.hex}ee, ${crystalColor.hex}99)`,
              color: 'white',
              padding: '8px 16px',
              borderRadius: '12px',
              whiteSpace: 'nowrap',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: `0 0 20px ${crystalColor.glow}`,
              border: `2px solid ${crystalColor.glow}`,
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '4px' }}>
              💎 {crystalColor.hex === CRYSTAL_COLORS.gold.hex ? 'Golden ' : ''}Crystal Shard
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              Press E to collect
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

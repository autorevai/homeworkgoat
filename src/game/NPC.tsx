/**
 * NPC Component
 * Renders an NPC character that players can interact with to start quests.
 */

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Quest } from '../learning/types';
import { isTouchDevice } from '../ui/MobileControls';

interface NPCProps {
  quest: Quest;
  position: [number, number, number];
  isCompleted: boolean;
  onInteract: () => void;
  playerPosition: THREE.Vector3;
}

const INTERACTION_DISTANCE = 4;

export function NPC({ quest, position, isCompleted, onInteract, playerPosition }: NPCProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isNear, setIsNear] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isMobile = useMemo(() => isTouchDevice(), []);

  // Check distance to player and handle bobbing animation
  useFrame((state) => {
    if (!groupRef.current) return;

    const npcPos = new THREE.Vector3(...position);
    const distance = npcPos.distanceTo(playerPosition);
    const near = distance < INTERACTION_DISTANCE;
    
    if (near !== isNear) {
      setIsNear(near);
    }

    // Gentle bobbing animation
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;

    // Face the player when nearby
    if (near) {
      const direction = new THREE.Vector3()
        .subVectors(playerPosition, npcPos)
        .normalize();
      const angle = Math.atan2(direction.x, direction.z);
      groupRef.current.rotation.y = angle;
    }
  });

  // NPC colors based on quest
  const robeColor = isCompleted ? '#808080' : '#9C27B0'; // Gray if completed, purple otherwise
  const hatColor = isCompleted ? '#606060' : '#7B1FA2';

  return (
    <group ref={groupRef} position={position}>
      {/* Robe / Body */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.6, 1.4, 0.4]} />
        <meshStandardMaterial color={robeColor} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <boxGeometry args={[0.45, 0.45, 0.45]} />
        <meshStandardMaterial color="#FFD5B8" />
      </mesh>

      {/* Wizard hat */}
      <group position={[0, 2.1, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.1, 0.6]} />
          <meshStandardMaterial color={hatColor} />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color={hatColor} />
        </mesh>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color={hatColor} />
        </mesh>
      </group>

      {/* Eyes */}
      <mesh position={[0.1, 1.75, 0.24]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-0.1, 1.75, 0.24]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Beard */}
      <mesh position={[0, 1.5, 0.2]} castShadow>
        <boxGeometry args={[0.3, 0.25, 0.1]} />
        <meshStandardMaterial color="#E0E0E0" />
      </mesh>

      {/* Staff */}
      <group position={[0.4, 0.8, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.1, 2, 0.1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        {/* Crystal on staff */}
        <mesh position={[0, 1.1, 0]}>
          <octahedronGeometry args={[0.15]} />
          <meshStandardMaterial 
            color={isCompleted ? '#808080' : '#00FFFF'} 
            emissive={isCompleted ? '#404040' : '#00FFFF'} 
            emissiveIntensity={isCompleted ? 0.2 : 0.5} 
          />
        </mesh>
      </group>

      {/* NPC Name floating above */}
      <Text
        position={[0, 2.8, 0]}
        fontSize={0.25}
        color={isCompleted ? '#808080' : '#FFD700'}
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {quest.npcName}
      </Text>

      {/* Quest indicator */}
      {!isCompleted && (
        <mesh position={[0, 3.2, 0]}>
          <boxGeometry args={[0.2, 0.3, 0.05]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
        </mesh>
      )}

      {/* Checkmark if completed */}
      {isCompleted && (
        <Text
          position={[0, 3.2, 0]}
          fontSize={0.4}
          color="#4CAF50"
          anchorX="center"
          anchorY="middle"
        >
          ✓
        </Text>
      )}

      {/* Interaction prompt */}
      {isNear && (
        <Html position={[0, 3.6, 0]} center>
          <div
            onClick={onInteract}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            style={{
              background: hovered ? 'rgba(76, 175, 80, 0.95)' : 'rgba(0, 0, 0, 0.85)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              border: '2px solid ' + (isCompleted ? '#808080' : '#FFD700'),
              transition: 'all 0.2s',
              transform: hovered ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {isCompleted ? '✓ Quest Complete' : (isMobile ? `Tap 👆 to talk` : `Press E or Click: ${quest.title}`)}
          </div>
        </Html>
      )}

      {/* Glow effect for active quests */}
      {!isCompleted && (
        <pointLight position={[0, 1, 0]} color="#9C27B0" intensity={0.5} distance={3} />
      )}
    </group>
  );
}

/**
 * WorldScene Component
 * The main 3D game world containing the environment, player, and NPCs.
 */

import { useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import { Ground } from './Ground';
import { PlayerController } from './PlayerController';
import { NPC } from './NPC';
import { useGameState } from '../hooks/useGameState';
import { quests } from '../learning/quests';
import type { Quest } from '../learning/types';

interface WorldSceneProps {
  onStartQuest: (quest: Quest) => void;
  isQuestActive: boolean;
}

// NPC positions in the world
const NPC_POSITIONS: Record<string, [number, number, number]> = {
  'quest-power-crystals': [-5, 0, -5],
  'quest-treasure-hunt': [5, 0, -5],
};

export function WorldScene({ onStartQuest, isQuestActive }: WorldSceneProps) {
  const { saveData } = useGameState();
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 0, 8));
  const [nearbyQuest, setNearbyQuest] = useState<Quest | null>(null);

  const handlePositionChange = useCallback((position: THREE.Vector3) => {
    setPlayerPosition(position);
  }, []);

  // Handle E key for interaction
  useEffect(() => {
    if (isQuestActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' && nearbyQuest) {
        onStartQuest(nearbyQuest);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearbyQuest, onStartQuest, isQuestActive]);

  // Check which NPC is nearby
  useEffect(() => {
    let closest: Quest | null = null;
    let closestDist = 3; // Interaction distance

    for (const quest of quests) {
      const npcPos = NPC_POSITIONS[quest.id];
      if (!npcPos) continue;

      const dist = playerPosition.distanceTo(new THREE.Vector3(...npcPos));
      if (dist < closestDist) {
        closest = quest;
        closestDist = dist;
      }
    }

    setNearbyQuest(closest);
  }, [playerPosition]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [0, 5, 15], fov: 60 }}
        style={{ background: '#87CEEB' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />

        {/* Sky */}
        <Sky
          distance={450000}
          sunPosition={[100, 20, 100]}
          inclination={0.6}
          azimuth={0.25}
        />

        {/* Environment */}
        <Ground />

        {/* Player */}
        <PlayerController
          avatarConfig={saveData.avatarConfig}
          onPositionChange={handlePositionChange}
          disabled={isQuestActive}
        />

        {/* NPCs */}
        {quests.map((quest) => (
          <NPC
            key={quest.id}
            quest={quest}
            position={NPC_POSITIONS[quest.id] || [0, 0, 0]}
            isCompleted={saveData.completedQuestIds.includes(quest.id)}
            onInteract={() => onStartQuest(quest)}
            playerPosition={playerPosition}
          />
        ))}
      </Canvas>

      {/* Controls hint */}
      {!isQuestActive && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
          }}
        >
          <strong>Controls:</strong> WASD or Arrow Keys to move | E or Click NPC to talk
        </div>
      )}
    </div>
  );
}

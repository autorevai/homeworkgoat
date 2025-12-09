/**
 * PlayerController Component
 * Handles player movement, collision, and camera following.
 */

import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { VoxelCharacter } from './VoxelCharacter';
import type { AvatarConfig } from '../persistence/types';

// Shared mobile input state (set by MobileControls component)
export const mobileInputState = {
  forward: 0,
  turn: 0,
};

interface PlayerControllerProps {
  avatarConfig: AvatarConfig;
  onPositionChange: (position: THREE.Vector3) => void;
  disabled?: boolean;
}

// World boundaries - 40x40 map (player can reach all chests/shards)
const BOUNDS = {
  minX: -20,
  maxX: 20,
  minZ: -20,
  maxZ: 20,
};

// Movement settings
const MOVE_SPEED = 5;
const ROTATION_SPEED = 3;

export function PlayerController({ 
  avatarConfig, 
  onPositionChange,
  disabled = false,
}: PlayerControllerProps) {
  const { camera } = useThree();
  
  const positionRef = useRef(new THREE.Vector3(0, 0, 8));
  const rotationRef = useRef(0);
  const isMovingRef = useRef(false);
  const keysRef = useRef<Set<string>>(new Set());
  
  // Handle keyboard input
  useEffect(() => {
    if (disabled) {
      keysRef.current.clear();
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        keysRef.current.add(key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current.delete(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [disabled]);

  // Get movement direction from keys or mobile input
  const getMovement = useCallback(() => {
    const keys = keysRef.current;
    let forward = 0;
    let turn = 0;

    // Keyboard input
    if (keys.has('w') || keys.has('arrowup')) forward += 1;
    if (keys.has('s') || keys.has('arrowdown')) forward -= 1;
    if (keys.has('a') || keys.has('arrowleft')) turn += 1;
    if (keys.has('d') || keys.has('arrowright')) turn -= 1;

    // Mobile input (if any) - adds to keyboard
    if (mobileInputState.forward !== 0 || mobileInputState.turn !== 0) {
      forward = mobileInputState.forward;
      turn = mobileInputState.turn;
    }

    return { forward, turn };
  }, []);

  // Update loop
  useFrame((_, delta) => {
    if (disabled) {
      isMovingRef.current = false;
      return;
    }

    const { forward, turn } = getMovement();
    const isMoving = forward !== 0 || turn !== 0;
    isMovingRef.current = isMoving;

    // Apply rotation
    rotationRef.current += turn * ROTATION_SPEED * delta;

    // Calculate movement direction based on current rotation
    if (forward !== 0) {
      const moveX = Math.sin(rotationRef.current) * forward * MOVE_SPEED * delta;
      const moveZ = Math.cos(rotationRef.current) * forward * MOVE_SPEED * delta;

      // Calculate new position
      let newX = positionRef.current.x + moveX;
      let newZ = positionRef.current.z + moveZ;

      // Apply boundaries
      newX = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, newX));
      newZ = Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, newZ));

      positionRef.current.x = newX;
      positionRef.current.z = newZ;
    }

    // Update camera to follow player (third person)
    const cameraOffset = new THREE.Vector3(
      Math.sin(rotationRef.current) * -6,
      4,
      Math.cos(rotationRef.current) * -6
    );
    
    const targetCameraPos = positionRef.current.clone().add(cameraOffset);
    camera.position.lerp(targetCameraPos, 0.1);
    
    // Look at player
    const lookTarget = positionRef.current.clone();
    lookTarget.y += 1;
    camera.lookAt(lookTarget);

    // Notify parent of position change
    onPositionChange(positionRef.current.clone());
  });

  return (
    <VoxelCharacter
      config={avatarConfig}
      position={[positionRef.current.x, positionRef.current.y, positionRef.current.z]}
      rotation={rotationRef.current}
      isMoving={isMovingRef.current}
      isPlayer={true}
    />
  );
}
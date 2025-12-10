/**
 * MobileControls Component
 * Virtual joystick and action button for mobile devices.
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { mobileInputState } from '../game/PlayerController';

interface MobileControlsProps {
  onAction: () => void;
  disabled?: boolean;
}

// Detect if the device is mobile/touch
export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is IE-specific
    navigator.msMaxTouchPoints > 0
  );
}

export function MobileControls({ onAction, disabled = false }: MobileControlsProps) {
  const joystickRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const touchIdRef = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const maxDistanceRef = useRef(40);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || touchIdRef.current !== null) return;

    const touch = e.touches[0];
    const rect = joystickRef.current?.getBoundingClientRect();
    if (!rect) return;

    touchIdRef.current = touch.identifier;
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    setIsActive(true);

    // Process initial position
    handleTouchMove(e);
  }, [disabled]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchIdRef.current === null) return;

    const touch = Array.from(e.touches).find(t => t.identifier === touchIdRef.current);
    if (!touch) return;

    const deltaX = touch.clientX - centerRef.current.x;
    const deltaY = touch.clientY - centerRef.current.y;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDist = maxDistanceRef.current;
    const clampedDist = Math.min(distance, maxDist);

    const angle = Math.atan2(deltaY, deltaX);
    const clampedX = Math.cos(angle) * clampedDist;
    const clampedY = Math.sin(angle) * clampedDist;

    // Update knob position
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
    }

    // Calculate normalized values (-1 to 1)
    const normalizedX = clampedX / maxDist; // Left/Right for turning
    const normalizedY = -clampedY / maxDist; // Up/Down for forward/backward (inverted)

    // Convert to forward/turn values
    // Forward: pushing up = forward (positive normalizedY)
    // Turn: pushing left = turn left (negative normalizedX)
    mobileInputState.forward = normalizedY;
    mobileInputState.turn = -normalizedX;
  }, []);

  const resetJoystick = useCallback(() => {
    touchIdRef.current = null;
    setIsActive(false);

    // Reset knob position
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(0px, 0px)';
    }

    // Stop movement
    mobileInputState.forward = 0;
    mobileInputState.turn = 0;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    // If we find our touch in changedTouches, or if there are no touches left, reset
    const touch = Array.from(e.changedTouches).find(t => t.identifier === touchIdRef.current);
    if (touch || e.touches.length === 0) {
      resetJoystick();
    }
  }, [resetJoystick]);

  // Prevent default touch behavior to avoid scrolling
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (touchIdRef.current !== null) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });
    return () => document.removeEventListener('touchmove', preventScroll);
  }, []);

  // Reset state when disabled changes or component unmounts
  useEffect(() => {
    if (disabled) {
      resetJoystick();
    }
    return () => {
      // Cleanup on unmount - ensure movement stops
      mobileInputState.forward = 0;
      mobileInputState.turn = 0;
    };
  }, [disabled, resetJoystick]);

  // Also add a window blur listener to reset when focus is lost
  useEffect(() => {
    const handleBlur = () => {
      resetJoystick();
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        resetJoystick();
      }
    };

    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [resetJoystick]);

  if (disabled) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '200px',
        pointerEvents: 'none',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '20px 30px',
      }}
    >
      {/* Virtual Joystick */}
      <div
        ref={joystickRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: isActive
            ? 'rgba(76, 175, 80, 0.4)'
            : 'rgba(255, 255, 255, 0.2)',
          border: `3px solid ${isActive ? '#4CAF50' : 'rgba(255, 255, 255, 0.4)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          touchAction: 'none',
          transition: 'background 0.2s, border-color 0.2s',
        }}
      >
        {/* Joystick Knob */}
        <div
          ref={knobRef}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: isActive
              ? 'linear-gradient(135deg, #4CAF50, #45a049)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6))',
            boxShadow: isActive
              ? '0 4px 15px rgba(76, 175, 80, 0.5)'
              : '0 2px 10px rgba(0,0,0,0.3)',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
        />
      </div>

      {/* Action Button - Hand/Interact icon */}
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAction();
        }}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          border: '4px solid rgba(255, 255, 255, 0.6)',
          color: '#1a1a2e',
          fontSize: '32px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          touchAction: 'manipulation',
          boxShadow: '0 4px 20px rgba(255, 215, 0, 0.5)',
          cursor: 'pointer',
        }}
      >
        👆
      </button>
    </div>
  );
}

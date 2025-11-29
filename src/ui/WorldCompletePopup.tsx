/**
 * WorldCompletePopup Component
 * Shows celebration when all quests in a world are completed.
 * Offers to go to the next world or stay and explore.
 */

import { useEffect, useState } from 'react';
import { worlds } from '../worlds/worldDefinitions';

interface WorldCompletePopupProps {
  worldId: string;
  nextWorldId: string | null;
  onGoToNextWorld: () => void;
  onStayAndExplore: () => void;
  onGoToWorldSelector: () => void;
}

export function WorldCompletePopup({
  worldId,
  nextWorldId,
  onGoToNextWorld,
  onStayAndExplore,
  onGoToWorldSelector,
}: WorldCompletePopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  const currentWorld = worlds.find(w => w.id === worldId);
  const nextWorld = nextWorldId ? worlds.find(w => w.id === nextWorldId) : null;

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2500,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '500px',
          width: '90%',
          border: '4px solid #FFD700',
          boxShadow: '0 0 60px rgba(255, 215, 0, 0.4)',
          textAlign: 'center',
          transform: isVisible ? 'scale(1)' : 'scale(0.8)',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Celebration header */}
        <div style={{ fontSize: '60px', marginBottom: '10px' }}>
          🎉🏆🎉
        </div>

        <h1
          style={{
            color: '#FFD700',
            fontSize: '32px',
            margin: '0 0 10px 0',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
          }}
        >
          World Complete!
        </h1>

        <p
          style={{
            color: '#4CAF50',
            fontSize: '20px',
            margin: '0 0 20px 0',
            fontWeight: 'bold',
          }}
        >
          You mastered {currentWorld?.name || 'this world'}!
        </p>

        <p style={{ color: '#b8b8b8', fontSize: '14px', marginBottom: '30px' }}>
          All quests completed! You're a true Math Hero!
        </p>

        {/* Stats could go here */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              background: 'rgba(76, 175, 80, 0.2)',
              border: '1px solid #4CAF50',
              borderRadius: '12px',
              padding: '15px 25px',
            }}
          >
            <div style={{ color: '#4CAF50', fontSize: '24px', fontWeight: 'bold' }}>
              4/4
            </div>
            <div style={{ color: '#888', fontSize: '12px' }}>Quests</div>
          </div>
          <div
            style={{
              background: 'rgba(255, 215, 0, 0.2)',
              border: '1px solid #FFD700',
              borderRadius: '12px',
              padding: '15px 25px',
            }}
          >
            <div style={{ color: '#FFD700', fontSize: '24px', fontWeight: 'bold' }}>
              100%
            </div>
            <div style={{ color: '#888', fontSize: '12px' }}>Complete</div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {nextWorld ? (
            <button
              onClick={onGoToNextWorld}
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
              }}
            >
              Continue to {nextWorld.name} →
            </button>
          ) : (
            <button
              onClick={onGoToWorldSelector}
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)',
              }}
            >
              Choose Another World →
            </button>
          )}

          <button
            onClick={onStayAndExplore}
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              color: '#888',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Stay and Explore (Find Chests & Shards)
          </button>

          <button
            onClick={onGoToWorldSelector}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: 'none',
              color: '#666',
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            View All Worlds
          </button>
        </div>
      </div>
    </div>
  );
}

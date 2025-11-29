/**
 * Hud Component
 * Displays player information during gameplay (name, level, XP).
 */

import { useGameState } from '../hooks/useGameState';

export function Hud() {
  const { saveData, level, xpProgress, setScreen } = useGameState();

  const xpPercentage = Math.min(100, (xpProgress.current / xpProgress.needed) * 100);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      {/* Player info (left side) */}
      <div
        className="panel"
        style={{
          padding: '15px 20px',
          pointerEvents: 'auto',
          minWidth: '200px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          {/* Level badge */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '18px',
              color: '#1a1a2e',
              boxShadow: '0 2px 10px rgba(255, 215, 0, 0.3)',
            }}
          >
            {level}
          </div>
          <div>
            <p style={{ 
              margin: 0, 
              fontWeight: 'bold', 
              fontSize: '18px',
              color: '#FFD700',
            }}>
              {saveData.playerName}
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: '12px', 
              color: '#b8b8b8' 
            }}>
              Level {level} Hero
            </p>
          </div>
        </div>

        {/* XP Bar */}
        <div style={{ marginBottom: '5px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#b8b8b8',
            marginBottom: '4px',
          }}>
            <span>XP</span>
            <span>{xpProgress.current} / {xpProgress.needed}</span>
          </div>
          <div className="xp-bar-container">
            <div 
              className="xp-bar-fill" 
              style={{ width: `${xpPercentage}%` }} 
            />
          </div>
        </div>

        {/* Quest progress */}
        <p style={{ 
          margin: '8px 0 0 0', 
          fontSize: '12px', 
          color: '#4CAF50' 
        }}>
          ✓ {saveData.completedQuestIds.length} Quests Completed
        </p>
      </div>

      {/* Menu button (right side) */}
      <button
        onClick={() => setScreen('mainMenu')}
        style={{
          padding: '10px 20px',
          background: 'rgba(0, 0, 0, 0.7)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          pointerEvents: 'auto',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.9)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        ☰ Menu
      </button>
    </div>
  );
}

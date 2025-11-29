/**
 * Achievement Popup Component
 * Shows a celebration when an achievement is unlocked.
 */

import { useEffect, useState } from 'react';
import { Achievement, getTierColor } from '../achievements/achievements';

interface AchievementPopupProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tierColor = getTierColor(achievement.tier);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 50);

    // Auto-close after 4 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: isVisible ? '20px' : '-200px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 3000,
        transition: 'top 0.3s ease-out',
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          borderRadius: '16px',
          padding: '20px 30px',
          border: `3px solid ${tierColor}`,
          boxShadow: `0 0 30px ${tierColor}66`,
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          minWidth: '350px',
          cursor: 'pointer',
        }}
        onClick={onClose}
      >
        {/* Achievement icon */}
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${tierColor}44, ${tierColor}22)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
            border: `2px solid ${tierColor}`,
            animation: 'achievementPop 0.5s ease-out',
          }}
        >
          {achievement.icon}
        </div>

        {/* Achievement details */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: tierColor,
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '4px',
            }}
          >
            Achievement Unlocked!
          </div>
          <div
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '4px',
            }}
          >
            {achievement.name}
          </div>
          <div style={{ color: '#888', fontSize: '13px' }}>{achievement.description}</div>
        </div>

        {/* Rewards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '4px',
          }}
        >
          <div style={{ color: '#4CAF50', fontSize: '14px', fontWeight: 'bold' }}>
            +{achievement.xpReward} XP
          </div>
          {achievement.coinReward && (
            <div style={{ color: '#FFD700', fontSize: '12px' }}>+{achievement.coinReward} coins</div>
          )}
          {achievement.cosmeticReward && (
            <div style={{ color: '#9C27B0', fontSize: '12px' }}>New cosmetic!</div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes achievementPop {
            0% { transform: scale(0.5); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}

/**
 * Achievement Queue Manager
 * Handles showing multiple achievements one at a time
 */
interface AchievementQueueProps {
  achievements: Achievement[];
  onAllDismissed: () => void;
}

export function AchievementQueue({ achievements, onAllDismissed }: AchievementQueueProps) {
  const [queue, setQueue] = useState<Achievement[]>(achievements);
  const [current, setCurrent] = useState<Achievement | null>(null);

  useEffect(() => {
    if (queue.length > 0 && !current) {
      setCurrent(queue[0]);
      setQueue((prev) => prev.slice(1));
    } else if (queue.length === 0 && !current) {
      onAllDismissed();
    }
  }, [queue, current, onAllDismissed]);

  const handleClose = () => {
    setCurrent(null);
  };

  if (!current) return null;

  return <AchievementPopup achievement={current} onClose={handleClose} />;
}

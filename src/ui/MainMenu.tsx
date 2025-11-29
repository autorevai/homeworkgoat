/**
 * MainMenu Component
 * The game's main menu with Play, Options, and Reset Progress buttons.
 */

import { useGameState } from '../hooks/useGameState';
import { getNextStreakMilestone, createInitialDailyProgress } from '../daily/dailyChallenge';

export function MainMenu() {
  const { setScreen, isNewPlayer, saveData, level } = useGameState();

  // Get daily challenge info
  const dailyProgress = saveData.dailyProgress || createInitialDailyProgress();
  const hasCompletedToday = dailyProgress.lastCompletedDate === new Date().toISOString().split('T')[0];
  const currentStreak = dailyProgress.currentStreak || 0;
  const nextMilestone = getNextStreakMilestone(currentStreak);
  const streakMessage = currentStreak > 0 ? `Keep your ${currentStreak} day streak going!` : null;

  const handlePlay = () => {
    if (isNewPlayer || !saveData.playerName) {
      setScreen('avatarSetup');
    } else {
      setScreen('playing');
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background shapes */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'rgba(76, 175, 80, 0.2)',
          borderRadius: '20px',
          transform: 'rotate(45deg)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: 'rgba(33, 150, 243, 0.2)',
          borderRadius: '30px',
          transform: 'rotate(30deg)',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '20%',
          width: '80px',
          height: '80px',
          background: 'rgba(255, 152, 0, 0.2)',
          borderRadius: '15px',
          transform: 'rotate(60deg)',
          animation: 'float 5s ease-in-out infinite',
        }}
      />

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '40px', zIndex: 1 }}>
        <h1
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: '#FFD700',
            textShadow: '4px 4px 8px rgba(0,0,0,0.5), 0 0 40px rgba(255,215,0,0.3)',
            margin: 0,
            fontFamily: "'Segoe UI', Arial, sans-serif",
            letterSpacing: '2px',
          }}
        >
          HOMEWORK
        </h1>
        <h1
          style={{
            fontSize: '96px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            margin: '-10px 0 0 0',
            fontFamily: "'Segoe UI', Arial, sans-serif",
            letterSpacing: '4px',
          }}
        >
          GOAT 🐐
        </h1>
        <p
          style={{
            fontSize: '20px',
            color: '#b8b8b8',
            marginTop: '10px',
          }}
        >
          Math Adventures for Champions!
        </p>
      </div>

      {/* Welcome back message */}
      {!isNewPlayer && saveData.playerName && (
        <div
          style={{
            background: 'rgba(76, 175, 80, 0.2)',
            border: '2px solid rgba(76, 175, 80, 0.5)',
            borderRadius: '12px',
            padding: '15px 30px',
            marginBottom: '30px',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          <p style={{ margin: 0, fontSize: '18px', color: '#4CAF50' }}>
            Welcome back, <strong>{saveData.playerName}</strong>!
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#b8b8b8' }}>
            Level {level} • {saveData.xp} XP • {saveData.completedQuestIds.length} quests completed
          </p>
        </div>
      )}

      {/* Daily Challenge Banner (for returning players) */}
      {!isNewPlayer && saveData.playerName && !hasCompletedToday && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.2), rgba(255, 87, 34, 0.2))',
            border: '2px solid rgba(255, 152, 0, 0.5)',
            borderRadius: '12px',
            padding: '15px 25px',
            marginBottom: '20px',
            textAlign: 'center',
            zIndex: 1,
            maxWidth: '300px',
          }}
        >
          <p style={{ margin: 0, fontSize: '16px', color: '#FF9800' }}>
            {currentStreak > 0 ? `🔥 ${currentStreak} Day Streak!` : '☀️ Daily Challenge Available!'}
          </p>
          {streakMessage && (
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#b8b8b8' }}>
              {streakMessage}
            </p>
          )}
          {nextMilestone && (
            <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#4CAF50' }}>
              {nextMilestone.daysAway} days to: {nextMilestone.reward.title}
            </p>
          )}
        </div>
      )}

      {/* Streak badge for completed daily */}
      {!isNewPlayer && hasCompletedToday && currentStreak > 0 && (
        <div
          style={{
            background: 'rgba(76, 175, 80, 0.2)',
            border: '2px solid rgba(76, 175, 80, 0.5)',
            borderRadius: '20px',
            padding: '8px 20px',
            marginBottom: '20px',
            zIndex: 1,
          }}
        >
          <p style={{ margin: 0, fontSize: '14px', color: '#4CAF50' }}>
            ✅ Daily Complete • 🔥 {currentStreak} Day Streak
          </p>
        </div>
      )}

      {/* Menu buttons */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          zIndex: 1,
        }}
      >
        <button
          className="btn btn-primary"
          onClick={handlePlay}
          style={{
            minWidth: '250px',
            fontSize: '22px',
            padding: '20px 40px',
          }}
        >
          {isNewPlayer ? '🎮 New Game' : '▶️ Continue'}
        </button>

        {/* World Selector button (for returning players) */}
        {!isNewPlayer && (
          <button
            className="btn btn-secondary"
            onClick={() => setScreen('worldSelector')}
            style={{
              minWidth: '250px',
              background: 'linear-gradient(135deg, #9C27B0, #673AB7)',
            }}
          >
            🌍 Choose World
          </button>
        )}

        <button
          className="btn btn-secondary"
          onClick={() => setScreen('options')}
          style={{
            minWidth: '250px',
          }}
        >
          ⚙️ Options
        </button>

        {!isNewPlayer && (
          <button
            className="btn btn-danger btn-small"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
                const { resetProgress } = useGameState.getState();
                resetProgress();
              }
            }}
            style={{
              minWidth: '250px',
              marginTop: '20px',
              opacity: 0.8,
            }}
          >
            🗑️ Reset Progress
          </button>
        )}
      </div>

      {/* Version */}
      <p
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '12px',
        }}
      >
        v1.0.0 • Made with ❤️ for learning
      </p>

      {/* Floating animation keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(45deg); }
            50% { transform: translateY(-20px) rotate(45deg); }
          }
        `}
      </style>
    </div>
  );
}

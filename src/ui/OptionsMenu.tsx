/**
 * OptionsMenu Component
 * Game options and settings including avatar customization and reset.
 */

import { useGameState } from '../hooks/useGameState';

export function OptionsMenu() {
  const { setScreen, saveData, resetProgress, level } = useGameState();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset ALL progress? This cannot be undone!')) {
      resetProgress();
    }
  };

  return (
    <div
      className="menu-scrollable"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '20px',
      }}
    >
      <div
        className="panel animate-fade-in"
        style={{
          maxWidth: '500px',
          width: '100%',
          padding: '30px',
          margin: '20px 0',
        }}
      >
        <h2 style={{ 
          margin: '0 0 30px 0',
          color: '#FFD700',
          textAlign: 'center',
          fontSize: '32px',
        }}>
          ⚙️ Options
        </h2>

        {/* Player Stats */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '25px',
          }}
        >
          <h3 style={{ 
            margin: '0 0 15px 0',
            color: '#b8b8b8',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Your Stats
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <p style={{ margin: 0, color: '#b8b8b8', fontSize: '12px' }}>Player</p>
              <p style={{ margin: '5px 0 0 0', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                {saveData.playerName || 'Not set'}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#b8b8b8', fontSize: '12px' }}>Level</p>
              <p style={{ margin: '5px 0 0 0', color: '#FFD700', fontSize: '18px', fontWeight: 'bold' }}>
                {level}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#b8b8b8', fontSize: '12px' }}>Total XP</p>
              <p style={{ margin: '5px 0 0 0', color: '#FF9800', fontSize: '18px', fontWeight: 'bold' }}>
                {saveData.xp}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#b8b8b8', fontSize: '12px' }}>Quests Done</p>
              <p style={{ margin: '5px 0 0 0', color: '#4CAF50', fontSize: '18px', fontWeight: 'bold' }}>
                {saveData.completedQuestIds.length}
              </p>
            </div>
          </div>
        </div>

        {/* Learning Stats */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '25px',
          }}
        >
          <h3 style={{ 
            margin: '0 0 15px 0',
            color: '#b8b8b8',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Learning Progress
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <p style={{ margin: 0, color: '#b8b8b8', fontSize: '12px' }}>Questions Answered</p>
              <p style={{ margin: '5px 0 0 0', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                {saveData.learningStats.totalQuestionsAnswered}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#b8b8b8', fontSize: '12px' }}>Accuracy</p>
              <p style={{ margin: '5px 0 0 0', color: '#4CAF50', fontSize: '18px', fontWeight: 'bold' }}>
                {saveData.learningStats.totalQuestionsAnswered > 0
                  ? Math.round((saveData.learningStats.totalCorrect / saveData.learningStats.totalQuestionsAnswered) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Options buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setScreen('avatarSetup')}
            style={{ width: '100%' }}
          >
            ✨ Customize Avatar
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => setScreen('accessibility')}
            style={{ width: '100%' }}
          >
            ♿ Accessibility
          </button>

          <button
            className="btn btn-danger"
            onClick={handleReset}
            style={{ width: '100%' }}
          >
            🗑️ Reset All Progress
          </button>
        </div>

        {/* Back button */}
        <button
          className="btn btn-primary"
          onClick={() => setScreen('mainMenu')}
          style={{ width: '100%', marginTop: '30px' }}
        >
          ← Back to Menu
        </button>

        {/* Game info */}
        <p
          style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '12px',
            marginTop: '30px',
          }}
        >
          Homework GOAT v1.0.0<br />
          Made for learning math! 🐐
        </p>
      </div>
    </div>
  );
}

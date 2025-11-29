/**
 * QuestComplete Component
 * Displays quest completion with rewards and stats.
 */

import { useGameState } from '../hooks/useGameState';
import { getQuestById } from '../learning/quests';

export function QuestComplete() {
  const { questCompleteData, dismissQuestComplete, level } = useGameState();

  if (!questCompleteData) return null;

  const quest = getQuestById(questCompleteData.questId);
  const accuracy = Math.round(
    (questCompleteData.correctAnswers / questCompleteData.totalQuestions) * 100
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        className="panel animate-fade-in"
        style={{
          maxWidth: '500px',
          width: '100%',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        {/* Celebration header */}
        <div style={{ marginBottom: '30px' }}>
          <span style={{ fontSize: '80px', display: 'block', marginBottom: '10px' }}>
            🏆
          </span>
          <h1 style={{ 
            color: '#FFD700',
            margin: '0 0 10px 0',
            fontSize: '36px',
          }}>
            Quest Complete!
          </h1>
          <p style={{ 
            color: '#4CAF50',
            margin: 0,
            fontSize: '20px',
            fontWeight: 'bold',
          }}>
            {questCompleteData.questTitle}
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '15px',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 215, 0, 0.1)',
              borderRadius: '12px',
              padding: '15px',
            }}
          >
            <p style={{ 
              margin: 0, 
              fontSize: '32px', 
              fontWeight: 'bold',
              color: '#FFD700',
            }}>
              +{questCompleteData.xpEarned}
            </p>
            <p style={{ margin: '5px 0 0 0', color: '#b8b8b8', fontSize: '12px' }}>
              XP Earned
            </p>
          </div>

          <div
            style={{
              background: 'rgba(76, 175, 80, 0.1)',
              borderRadius: '12px',
              padding: '15px',
            }}
          >
            <p style={{ 
              margin: 0, 
              fontSize: '32px', 
              fontWeight: 'bold',
              color: '#4CAF50',
            }}>
              {questCompleteData.correctAnswers}/{questCompleteData.totalQuestions}
            </p>
            <p style={{ margin: '5px 0 0 0', color: '#b8b8b8', fontSize: '12px' }}>
              Correct
            </p>
          </div>

          <div
            style={{
              background: 'rgba(33, 150, 243, 0.1)',
              borderRadius: '12px',
              padding: '15px',
            }}
          >
            <p style={{ 
              margin: 0, 
              fontSize: '32px', 
              fontWeight: 'bold',
              color: '#2196F3',
            }}>
              {accuracy}%
            </p>
            <p style={{ margin: '5px 0 0 0', color: '#b8b8b8', fontSize: '12px' }}>
              Accuracy
            </p>
          </div>
        </div>

        {/* Level display */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,152,0,0.2))',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            border: '2px solid rgba(255, 215, 0, 0.3)',
          }}
        >
          <p style={{ margin: 0, color: '#b8b8b8', fontSize: '14px' }}>
            Current Level
          </p>
          <p style={{ 
            margin: '5px 0 0 0', 
            fontSize: '48px', 
            fontWeight: 'bold',
            color: '#FFD700',
          }}>
            {level}
          </p>
        </div>

        {/* Completion message */}
        {quest && (
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '30px',
              whiteSpace: 'pre-line',
              lineHeight: '1.6',
              textAlign: 'left',
              fontSize: '14px',
              color: '#b8b8b8',
            }}
          >
            <p style={{ color: '#FFD700', margin: '0 0 10px 0', fontWeight: 'bold' }}>
              {quest.npcName} says:
            </p>
            {quest.completionMessage}
          </div>
        )}

        {/* Continue button */}
        <button
          className="btn btn-primary"
          onClick={dismissQuestComplete}
          style={{ 
            width: '100%',
            fontSize: '20px',
            padding: '18px',
          }}
        >
          Continue Adventure! 🚀
        </button>
      </div>

      {/* Confetti effect (CSS animation) */}
      <style>
        {`
          @keyframes confetti-fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
        `}
      </style>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: '-20px',
            width: '10px',
            height: '10px',
            background: ['#FFD700', '#4CAF50', '#2196F3', '#FF9800', '#E91E63'][i % 5],
            borderRadius: i % 2 === 0 ? '50%' : '0',
            animation: `confetti-fall ${2 + Math.random() * 2}s linear forwards`,
            animationDelay: `${Math.random() * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

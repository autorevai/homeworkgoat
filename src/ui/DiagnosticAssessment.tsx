/**
 * DiagnosticAssessment Component
 * 
 * A friendly, game-like placement test that runs when new players start.
 * Assesses their skills and places them at the right level.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  createAssessmentState,
  processAssessmentAnswer,
  generateDiagnosticResult,
  getAssessmentProgress,
  getAssessmentEncouragement,
  type AssessmentState,
  type DiagnosticResult,
} from '../learning/diagnosticAssessment';
import { SpeakerButton } from './SpeakerButton';

interface DiagnosticAssessmentProps {
  playerName: string;
  onComplete: (result: DiagnosticResult) => void;
  onSkip?: () => void; // Optional skip for returning players
}

// Skill icons for visual variety
const SKILL_ICONS: Record<string, string> = {
  Addition: '➕',
  Subtraction: '➖',
  Multiplication: '✖️',
  Division: '➗',
  'Word Problems': '📖',
};

// Encouraging phrases for correct answers
const CORRECT_PHRASES = [
  'Awesome! 🎉',
  'Perfect! ⭐',
  'You got it! ✨',
  'Amazing! 🌟',
  'Brilliant! 💫',
  'Correct! 🎯',
];

// Encouraging phrases for wrong answers
const WRONG_PHRASES = [
  'Good try! 💪',
  'Almost! 🌈',
  'Keep going! 🚀',
  'Nice effort! ⭐',
];

export function DiagnosticAssessment({ 
  playerName, 
  onComplete, 
  onSkip 
}: DiagnosticAssessmentProps) {
  const [state, setState] = useState<AssessmentState>(createAssessmentState);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [feedbackPhrase, setFeedbackPhrase] = useState('');
  const [encouragement, setEncouragement] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  // Reset timer when question changes
  useEffect(() => {
    if (!showFeedback) {
      setStartTime(Date.now());
    }
  }, [state.currentQuestion?.id, showFeedback]);

  // Check for encouragement messages
  useEffect(() => {
    const msg = getAssessmentEncouragement(state);
    if (msg) {
      setEncouragement(msg);
      setTimeout(() => setEncouragement(null), 2000);
    }
  }, [state.currentSkillIndex]);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (showFeedback || state.isComplete) return;

    const timeMs = Date.now() - startTime;
    const correct = answerIndex === state.currentQuestion?.correctIndex;

    // Show feedback
    setLastAnswerCorrect(correct);
    setFeedbackPhrase(
      correct 
        ? CORRECT_PHRASES[Math.floor(Math.random() * CORRECT_PHRASES.length)]
        : WRONG_PHRASES[Math.floor(Math.random() * WRONG_PHRASES.length)]
    );
    setShowFeedback(true);

    // Process answer after delay
    setTimeout(() => {
      const newState = processAssessmentAnswer(state, answerIndex, timeMs);
      setState(newState);
      setShowFeedback(false);
      setLastAnswerCorrect(null);

      // Check if complete
      if (newState.isComplete) {
        const diagnosticResult = generateDiagnosticResult(newState);
        setResult(diagnosticResult);
        setShowResults(true);
      }
    }, 1200);
  }, [state, showFeedback, startTime]);

  const handleFinish = useCallback(() => {
    if (result) {
      onComplete(result);
    }
  }, [result, onComplete]);

  const progress = getAssessmentProgress(state);

  // Results screen
  if (showResults && result) {
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
          padding: '20px',
          overflow: 'auto',
        }}
      >
        <div
          className="panel animate-fade-in"
          style={{
            maxWidth: '500px',
            width: '100%',
            padding: '30px',
            textAlign: 'center',
          }}
        >
          {/* Celebration */}
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>
            {result.overallLevel === 'above' ? '🏆' : result.overallLevel === 'on' ? '⭐' : '🌟'}
          </div>

          <h2 style={{ 
            color: '#FFD700', 
            fontSize: '28px', 
            marginBottom: '10px' 
          }}>
            Assessment Complete!
          </h2>

          <p style={{ 
            color: '#b8b8b8', 
            fontSize: '16px', 
            marginBottom: '25px',
            lineHeight: '1.6',
          }}>
            {result.personalizedMessage}
          </p>

          {/* Grade level indicator */}
          <div
            style={{
              background: 'rgba(255, 215, 0, 0.1)',
              border: '2px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '25px',
            }}
          >
            <p style={{ color: '#b8b8b8', fontSize: '12px', margin: 0 }}>
              Estimated Level
            </p>
            <p style={{ 
              color: '#FFD700', 
              fontSize: '32px', 
              fontWeight: 'bold', 
              margin: '5px 0' 
            }}>
              Grade {result.estimatedGradeLevel.toFixed(1)}
            </p>
          </div>

          {/* Skill breakdown */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '15px' }}>
              Your Skills
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(result.skillResults).map(([skill, data]) => {
                const accuracy = data.questionsAsked > 0 
                  ? Math.round((data.correct / data.questionsAsked) * 100)
                  : 0;
                const color = accuracy >= 70 ? '#4CAF50' : accuracy >= 50 ? '#FF9800' : '#f44336';
                
                return (
                  <div
                    key={skill}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ width: '120px', textAlign: 'left', color: '#b8b8b8', fontSize: '14px' }}>
                      {skill.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${accuracy}%`,
                          background: color,
                          transition: 'width 0.5s',
                        }}
                      />
                    </div>
                    <span style={{ width: '45px', textAlign: 'right', color, fontWeight: 'bold' }}>
                      {accuracy}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendation */}
          <div
            style={{
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '25px',
            }}
          >
            <p style={{ color: '#4CAF50', fontSize: '14px', margin: 0 }}>
              🎯 <strong>Recommended:</strong> Start with{' '}
              {result.recommendedPath.replace(/([A-Z])/g, ' $1').trim()} practice!
            </p>
          </div>

          {/* Start button */}
          <button
            className="btn btn-primary"
            onClick={handleFinish}
            style={{
              width: '100%',
              fontSize: '20px',
              padding: '18px',
            }}
          >
            Start My Adventure! 🚀
          </button>
        </div>
      </div>
    );
  }

  // Assessment question screen
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
        padding: '20px',
      }}
    >
      <div
        className="panel"
        style={{
          maxWidth: '550px',
          width: '100%',
          padding: '30px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#FFD700', fontSize: '24px', margin: '0 0 5px 0' }}>
            Let's See What You Know!
          </h2>
          <p style={{ color: '#b8b8b8', fontSize: '14px', margin: 0 }}>
            Hi {playerName}! Answer a few questions so we can customize your adventure.
          </p>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#b8b8b8', fontSize: '13px' }}>
              {SKILL_ICONS[progress.currentSkillName]} {progress.currentSkillName}
            </span>
            <span style={{ color: '#4CAF50', fontSize: '13px' }}>
              {progress.overallProgress}% Complete
            </span>
          </div>
          <div
            style={{
              height: '8px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress.overallProgress}%`,
                background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                transition: 'width 0.3s',
              }}
            />
          </div>
          <p style={{ 
            color: '#666', 
            fontSize: '11px', 
            textAlign: 'center', 
            marginTop: '5px' 
          }}>
            Section {progress.skillNumber} of {progress.totalSkills}
          </p>
        </div>

        {/* Encouragement popup */}
        {encouragement && (
          <div
            className="animate-fade-in"
            style={{
              background: 'rgba(76, 175, 80, 0.2)',
              border: '1px solid rgba(76, 175, 80, 0.4)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '15px',
              textAlign: 'center',
              color: '#4CAF50',
              fontWeight: 'bold',
            }}
          >
            {encouragement}
          </div>
        )}

        {/* Question */}
        {state.currentQuestion && (
          <>
            <div
              style={{
                background: showFeedback 
                  ? lastAnswerCorrect 
                    ? 'rgba(76, 175, 80, 0.2)' 
                    : 'rgba(255, 152, 0, 0.2)'
                  : 'rgba(0, 0, 0, 0.3)',
                border: showFeedback
                  ? `2px solid ${lastAnswerCorrect ? '#4CAF50' : '#FF9800'}`
                  : '2px solid transparent',
                borderRadius: '12px',
                padding: '25px',
                marginBottom: '20px',
                textAlign: 'center',
                transition: 'all 0.3s',
                position: 'relative',
              }}
            >
              {/* Feedback overlay */}
              {showFeedback && (
                <div
                  className="animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: lastAnswerCorrect ? '#4CAF50' : '#FF9800',
                    color: 'white',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {feedbackPhrase}
                </div>
              )}

              <p style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: 'bold',
                lineHeight: '1.4',
                color: '#fff',
              }}>
                {state.currentQuestion.prompt}
              </p>
              <SpeakerButton
                text={state.currentQuestion.prompt}
                size="small"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              />
            </div>

            {/* Answer choices */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {state.currentQuestion.choices.map((choice, index) => {
                let bgColor = 'rgba(255,255,255,0.05)';
                let borderColor = 'rgba(255,255,255,0.1)';
                
                if (showFeedback) {
                  if (index === state.currentQuestion!.correctIndex) {
                    bgColor = 'rgba(76, 175, 80, 0.3)';
                    borderColor = '#4CAF50';
                  }
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showFeedback}
                    style={{
                      background: bgColor,
                      border: `2px solid ${borderColor}`,
                      borderRadius: '10px',
                      padding: '15px 20px',
                      color: '#fff',
                      fontSize: '18px',
                      fontWeight: '500',
                      cursor: showFeedback ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: showFeedback ? 0.7 : 1,
                    }}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Skip option */}
        {onSkip && (
          <button
            onClick={onSkip}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#666',
              fontSize: '12px',
              marginTop: '20px',
              cursor: 'pointer',
              width: '100%',
              padding: '10px',
            }}
          >
            Skip assessment (returning player)
          </button>
        )}
      </div>
    </div>
  );
}

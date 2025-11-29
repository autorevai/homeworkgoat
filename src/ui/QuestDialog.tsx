/**
 * QuestDialog Component
 * Handles NPC dialogue, quest questions, and feedback display.
 */

import { useState, useCallback } from 'react';
import type { Quest } from '../learning/types';
import { useQuestRunner } from '../hooks/useQuestRunner';
import { useGameState } from '../hooks/useGameState';
import { SpeakerButton } from './SpeakerButton';
import { AbilityBar } from './AbilityBar';
import type { AbilityEffect } from '../abilities/abilities';

interface QuestDialogProps {
  quest: Quest;
  onClose: () => void;
}

export function QuestDialog({ quest, onClose }: QuestDialogProps) {
  const { saveData, level } = useGameState();
  const {
    phase,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isCorrect,
    showHint,
    correctCount,
    feedbackMessage,
    startQuest,
    beginQuestions,
    submitAnswer,
    showHintAction,
    nextQuestion,
    getHint,
  } = useQuestRunner();

  // Ability effect states
  const [eliminatedChoices, setEliminatedChoices] = useState<number[]>([]);

  // Start the quest if not already started
  if (phase === 'intro' && !currentQuestion) {
    startQuest(quest);
  }

  // Handle ability usage
  const handleUseAbility = useCallback((_abilityId: string, effect: AbilityEffect) => {
    switch (effect) {
      case 'fifty-fifty':
        // Eliminate two wrong answers
        if (currentQuestion) {
          const wrongIndices = currentQuestion.choices
            .map((_, i) => i)
            .filter((i) => i !== currentQuestion.correctIndex && !eliminatedChoices.includes(i));
          const toEliminate = wrongIndices.slice(0, 2);
          setEliminatedChoices((prev) => [...prev, ...toEliminate]);
        }
        break;
      case 'hint':
        showHintAction();
        break;
      case 'skip':
        // Skip to next question
        nextQuestion();
        break;
      // Other effects handled elsewhere
    }
  }, [currentQuestion, eliminatedChoices, showHintAction, nextQuestion]);

  // Reset ability effects when moving to next question
  const handleNextQuestion = useCallback(() => {
    setEliminatedChoices([]);
    nextQuestion();
  }, [nextQuestion]);

  const isQuestCompleted = saveData.completedQuestIds.includes(quest.id);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
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
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '30px',
        }}
      >
        {/* Quest completed state */}
        {isQuestCompleted && phase === 'intro' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '48px' }}>✅</span>
              <h2 style={{ 
                color: '#4CAF50', 
                margin: '10px 0',
                fontSize: '28px',
              }}>
                Quest Already Completed!
              </h2>
              <p style={{ color: '#b8b8b8' }}>
                You've already helped {quest.npcName} with this quest.
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={onClose}
              style={{ width: '100%' }}
            >
              Return to World
            </button>
          </>
        )}

        {/* Intro phase */}
        {!isQuestCompleted && phase === 'intro' && (
          <>
            {/* NPC header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '2px solid rgba(255,255,255,0.1)',
            }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                }}
              >
                🧙
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#FFD700', fontSize: '24px' }}>
                  {quest.npcName}
                </h3>
                <p style={{ margin: 0, color: '#b8b8b8', fontSize: '14px' }}>
                  {quest.title}
                </p>
              </div>
            </div>

            {/* NPC dialogue */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '25px',
                whiteSpace: 'pre-line',
                lineHeight: '1.6',
                fontSize: '16px',
                position: 'relative',
              }}
            >
              {quest.npcIntro}
              <SpeakerButton
                text={quest.npcIntro}
                size="small"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              />
            </div>

            {/* Quest info */}
            <div
              style={{
                background: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '25px',
              }}
            >
              <p style={{ margin: 0, fontSize: '14px', color: '#4CAF50' }}>
                📋 <strong>{totalQuestions} Questions</strong> • 
                🏆 <strong>{quest.rewardXp} XP Reward</strong>
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-secondary"
                onClick={onClose}
                style={{ flex: 1 }}
              >
                Not Now
              </button>
              <button
                className="btn btn-primary"
                onClick={beginQuestions}
                style={{ flex: 2 }}
              >
                Accept Quest! ⚔️
              </button>
            </div>
          </>
        )}

        {/* Question phase */}
        {phase === 'question' && currentQuestion && (
          <>
            {/* Progress header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <span style={{ color: '#b8b8b8', fontSize: '14px' }}>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span style={{ color: '#4CAF50', fontSize: '14px' }}>
                ✓ {correctCount} correct
              </span>
            </div>

            {/* Progress bar */}
            <div
              style={{
                height: '8px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                marginBottom: '25px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${((currentQuestionIndex) / totalQuestions) * 100}%`,
                  background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                  transition: 'width 0.3s',
                }}
              />
            </div>

            {/* Question */}
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                padding: '25px',
                marginBottom: '25px',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <p style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 'bold',
                lineHeight: '1.4',
              }}>
                {currentQuestion.prompt}
              </p>
              <SpeakerButton
                text={currentQuestion.prompt}
                size="medium"
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              />
            </div>

            {/* Choices */}
            <div style={{ marginBottom: '20px' }}>
              {currentQuestion.choices.map((choice, index) => {
                const isEliminated = eliminatedChoices.includes(index);
                return (
                  <button
                    key={index}
                    className="choice-btn"
                    onClick={() => !isEliminated && submitAnswer(index)}
                    disabled={isEliminated}
                    style={{
                      display: 'block',
                      opacity: isEliminated ? 0.3 : 1,
                      textDecoration: isEliminated ? 'line-through' : 'none',
                      cursor: isEliminated ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {choice}
                    {isEliminated && ' ❌'}
                  </button>
                );
              })}
            </div>

            {/* Hint section */}
            {!showHint ? (
              <button
                onClick={showHintAction}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#FFD700',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '10px',
                  width: '100%',
                }}
              >
                💡 Need a hint?
              </button>
            ) : (
              <div
                style={{
                  background: 'rgba(255, 215, 0, 0.1)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: '8px',
                  padding: '15px',
                }}
              >
                <p style={{ margin: 0, color: '#FFD700', fontSize: '14px' }}>
                  💡 <strong>Hint:</strong> {getHint()}
                </p>
              </div>
            )}

            {/* Ability Bar - shows unlocked abilities */}
            {level >= 2 && (
              <AbilityBar onUseAbility={handleUseAbility} />
            )}
          </>
        )}

        {/* Feedback phase */}
        {phase === 'feedback' && currentQuestion && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '25px', position: 'relative' }}>
              <span style={{ fontSize: '64px' }}>
                {isCorrect ? '🎉' : '🤔'}
              </span>
              <h2 style={{
                color: isCorrect ? '#4CAF50' : '#FF9800',
                margin: '15px 0 10px 0',
                fontSize: '28px',
              }}>
                {isCorrect ? 'Correct!' : 'Not Quite!'}
              </h2>
              <p style={{ color: '#b8b8b8', fontSize: '16px', margin: 0 }}>
                {feedbackMessage}
              </p>
              <SpeakerButton
                text={`${isCorrect ? 'Correct!' : 'Not quite!'} ${feedbackMessage}`}
                size="small"
                style={{ position: 'absolute', top: '0', right: '0' }}
              />
            </div>

            {/* Show correct answer if wrong */}
            {!isCorrect && (
              <div
                style={{
                  background: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}
              >
                <p style={{ margin: 0, color: '#4CAF50' }}>
                  The correct answer was: <strong>{currentQuestion.choices[currentQuestion.correctIndex]}</strong>
                </p>
              </div>
            )}

            {/* Show hint after wrong answer */}
            {!isCorrect && (
              <div
                style={{
                  background: 'rgba(255, 215, 0, 0.1)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '25px',
                }}
              >
                <p style={{ margin: 0, color: '#FFD700', fontSize: '14px' }}>
                  💡 <strong>Remember:</strong> {currentQuestion.hint}
                </p>
              </div>
            )}

            <button
              className="btn btn-primary"
              onClick={handleNextQuestion}
              style={{ width: '100%' }}
            >
              {currentQuestionIndex < totalQuestions - 1
                ? 'Next Question →'
                : 'See Results 🏆'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

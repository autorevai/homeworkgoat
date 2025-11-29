/**
 * GradeLevelPicker Component
 * Allows players to select their grade level for appropriate difficulty scaling.
 */

import { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import type { GradeLevel } from '../persistence/types';

interface GradeLevelPickerProps {
  onComplete: () => void;
}

interface GradeOption {
  level: GradeLevel;
  label: string;
  ageRange: string;
  description: string;
  emoji: string;
  mathFocus: string[];
  color: string;
}

const GRADE_OPTIONS: GradeOption[] = [
  {
    level: 2,
    label: '2nd Grade',
    ageRange: '7-8 years',
    description: 'Just starting your math journey!',
    emoji: '🌱',
    mathFocus: ['Single digit +/-', 'Counting', 'Intro to multiplication'],
    color: '#4CAF50',
  },
  {
    level: 3,
    label: '3rd Grade',
    ageRange: '8-9 years',
    description: 'Building multiplication skills!',
    emoji: '🌟',
    mathFocus: ['Multi-digit +/-', 'Times tables (1-10)', 'Intro to division'],
    color: '#2196F3',
  },
  {
    level: 4,
    label: '4th Grade',
    ageRange: '9-10 years',
    description: 'Taking on bigger challenges!',
    emoji: '🚀',
    mathFocus: ['Large numbers', 'Fractions intro', 'Multi-step problems'],
    color: '#FF9800',
  },
  {
    level: 5,
    label: '5th Grade',
    ageRange: '10-11 years',
    description: 'Advanced math adventurer!',
    emoji: '⚡',
    mathFocus: ['Decimals', 'Complex word problems', 'Ratios intro'],
    color: '#9C27B0',
  },
  {
    level: 6,
    label: '6th Grade',
    ageRange: '11-12 years',
    description: 'Math master in training!',
    emoji: '🏆',
    mathFocus: ['Pre-algebra', 'Advanced ratios', 'Negative numbers'],
    color: '#F44336',
  },
];

export function GradeLevelPicker({ onComplete }: GradeLevelPickerProps) {
  const { updateSaveData } = useGameState();
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSelectGrade = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (selectedGrade) {
      updateSaveData({ gradeLevel: selectedGrade });
      onComplete();
    }
  };

  const selectedOption = GRADE_OPTIONS.find((g) => g.level === selectedGrade);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f2040 100%)',
        padding: '20px',
        overflow: 'auto',
      }}
    >
      {!showConfirmation ? (
        <>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span style={{ fontSize: '60px', display: 'block', marginBottom: '15px' }}>📚</span>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#FFD700',
                textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
                margin: '0 0 10px 0',
              }}
            >
              What grade are you in?
            </h1>
            <p style={{ color: '#b8b8b8', margin: 0, fontSize: '16px' }}>
              This helps us give you the right math challenges!
            </p>
          </div>

          {/* Grade Cards */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxWidth: '500px',
              width: '100%',
            }}
          >
            {GRADE_OPTIONS.map((grade) => (
              <button
                key={grade.level}
                onClick={() => handleSelectGrade(grade.level)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '18px 24px',
                  background: `linear-gradient(135deg, ${grade.color}22, ${grade.color}11)`,
                  border: `2px solid ${grade.color}66`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.borderColor = grade.color;
                  e.currentTarget.style.boxShadow = `0 0 20px ${grade.color}44`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = `${grade.color}66`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '40px' }}>{grade.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '4px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: grade.color,
                      }}
                    >
                      {grade.label}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#888',
                        background: 'rgba(255,255,255,0.1)',
                        padding: '2px 8px',
                        borderRadius: '10px',
                      }}
                    >
                      {grade.ageRange}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      color: '#b8b8b8',
                    }}
                  >
                    {grade.description}
                  </p>
                </div>
                <span style={{ fontSize: '24px', color: '#666' }}>→</span>
              </button>
            ))}
          </div>

          {/* Help text */}
          <p
            style={{
              marginTop: '30px',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '12px',
              textAlign: 'center',
            }}
          >
            Don't worry - you can change this later in settings!
          </p>
        </>
      ) : (
        /* Confirmation Screen */
        <div
          style={{
            textAlign: 'center',
            maxWidth: '500px',
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          <span style={{ fontSize: '80px', display: 'block', marginBottom: '20px' }}>
            {selectedOption?.emoji}
          </span>
          <h2
            style={{
              fontSize: '28px',
              color: selectedOption?.color || '#fff',
              margin: '0 0 10px 0',
              fontWeight: 'bold',
            }}
          >
            {selectedOption?.label}
          </h2>
          <p style={{ color: '#b8b8b8', fontSize: '16px', marginBottom: '25px' }}>
            {selectedOption?.description}
          </p>

          {/* Math focus areas */}
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '30px',
            }}
          >
            <h3
              style={{
                fontSize: '14px',
                color: '#FFD700',
                margin: '0 0 15px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Your Math Adventures Will Include:
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {selectedOption?.mathFocus.map((focus, index) => (
                <span
                  key={index}
                  style={{
                    background: `${selectedOption?.color}33`,
                    color: selectedOption?.color,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {focus}
                </span>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={() => setShowConfirmation(false)}
              className="btn btn-secondary"
              style={{ padding: '15px 30px' }}
            >
              ← Change Grade
            </button>
            <button
              onClick={handleConfirm}
              className="btn btn-primary"
              style={{
                padding: '15px 40px',
                background: `linear-gradient(135deg, ${selectedOption?.color}, ${selectedOption?.color}cc)`,
              }}
            >
              Let's Go!
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

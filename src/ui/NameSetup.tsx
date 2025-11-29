/**
 * NameSetup Component
 * Allows players to enter their name before starting the game.
 */

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { VoxelCharacter } from '../game/VoxelCharacter';
import { useGameState } from '../hooks/useGameState';

export function NameSetup() {
  const { saveData, updatePlayerName, setScreen } = useGameState();
  const [name, setName] = useState(saveData.playerName || '');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter your name!');
      return;
    }
    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters!');
      return;
    }
    if (trimmedName.length > 20) {
      setError('Name must be 20 characters or less!');
      return;
    }

    updatePlayerName(trimmedName);
    setScreen('playing');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
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
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      }}
    >
      {/* Character preview */}
      <div
        style={{
          width: '200px',
          height: '250px',
          marginBottom: '20px',
        }}
      >
        <Canvas camera={{ position: [0, 1.5, 2.5], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <VoxelCharacter 
            config={saveData.avatarConfig} 
            position={[0, -0.5, 0]} 
          />
        </Canvas>
      </div>

      {/* Name input card */}
      <div
        className="panel animate-fade-in"
        style={{
          padding: '40px',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%',
        }}
      >
        <h2 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '32px',
          color: '#FFD700',
        }}>
          What's your name, hero?
        </h2>
        <p style={{ 
          margin: '0 0 30px 0', 
          color: '#b8b8b8',
          fontSize: '16px',
        }}>
          This is how the NPCs will address you!
        </p>

        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          onKeyPress={handleKeyPress}
          placeholder="Enter your name..."
          maxLength={20}
          style={{
            width: '100%',
            fontSize: '20px',
            padding: '15px',
            textAlign: 'center',
            marginBottom: '10px',
          }}
          autoFocus
        />

        {error && (
          <p style={{ 
            color: '#f44336', 
            margin: '10px 0',
            fontSize: '14px',
          }}>
            {error}
          </p>
        )}

        <p style={{ 
          color: '#666', 
          fontSize: '12px',
          margin: '10px 0 20px 0',
        }}>
          {name.length}/20 characters
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setScreen('avatarSetup')}
            style={{ flex: 1 }}
          >
            ← Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            style={{ flex: 2 }}
          >
            Start Adventure! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * AvatarCustomization Component
 * Allows players to customize their character's appearance.
 */

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { VoxelCharacter } from '../game/VoxelCharacter';
import { useGameState } from '../hooks/useGameState';
import type { AvatarConfig } from '../persistence/types';
import { 
  HAIR_COLORS, 
  SHIRT_COLORS, 
  PANTS_COLORS, 
  ACCESSORIES,
  DEFAULT_AVATAR,
} from '../persistence/types';

export function AvatarCustomization() {
  const { saveData, updateAvatar, setScreen } = useGameState();
  const [config, setConfig] = useState<AvatarConfig>(
    saveData.avatarConfig || DEFAULT_AVATAR
  );

  const handleColorChange = (type: 'hairColor' | 'shirtColor' | 'pantsColor', color: string) => {
    setConfig(prev => ({ ...prev, [type]: color }));
  };

  const handleAccessoryChange = (accessory: AvatarConfig['accessory']) => {
    setConfig(prev => ({ ...prev, accessory }));
  };

  const handleSave = () => {
    updateAvatar(config);
    setScreen('nameSetup');
  };

  const ColorPicker = ({ 
    label, 
    colors, 
    selected, 
    onChange 
  }: { 
    label: string; 
    colors: string[]; 
    selected: string; 
    onChange: (color: string) => void;
  }) => (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#FFD700',
      }}>
        {label}
      </label>
      <div className="color-grid">
        {colors.map((color) => (
          <button
            key={color}
            className={`color-swatch ${selected === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            aria-label={`Select ${color}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      }}
    >
      {/* 3D Preview */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <VoxelCharacter config={config} position={[0, -0.5, 0]} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#b8b8b8',
            fontSize: '14px',
          }}
        >
          Drag to rotate
        </div>
      </div>

      {/* Customization Panel */}
      <div
        className="panel"
        style={{
          width: '350px',
          padding: '30px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2 style={{ 
          margin: '0 0 30px 0', 
          fontSize: '28px',
          color: '#FFD700',
          textAlign: 'center',
        }}>
          ✨ Create Your Hero
        </h2>

        <ColorPicker
          label="Hair Color"
          colors={HAIR_COLORS}
          selected={config.hairColor}
          onChange={(c) => handleColorChange('hairColor', c)}
        />

        <ColorPicker
          label="Shirt Color"
          colors={SHIRT_COLORS}
          selected={config.shirtColor}
          onChange={(c) => handleColorChange('shirtColor', c)}
        />

        <ColorPicker
          label="Pants Color"
          colors={PANTS_COLORS}
          selected={config.pantsColor}
          onChange={(c) => handleColorChange('pantsColor', c)}
        />

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#FFD700',
          }}>
            Accessory
          </label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {ACCESSORIES.map((acc) => (
              <button
                key={acc.id}
                onClick={() => handleAccessoryChange(acc.id as AvatarConfig['accessory'])}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: config.accessory === acc.id 
                    ? '2px solid #FFD700' 
                    : '2px solid rgba(255,255,255,0.2)',
                  background: config.accessory === acc.id 
                    ? 'rgba(255, 215, 0, 0.2)' 
                    : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setScreen('mainMenu')}
            style={{ flex: 1 }}
          >
            Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            style={{ flex: 2 }}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

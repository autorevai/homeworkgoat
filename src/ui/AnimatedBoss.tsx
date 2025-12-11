/**
 * AnimatedBoss Component
 * Renders cool animated boss sprites for boss battles.
 * Each boss has unique design with idle animations and hurt states.
 */

import { useEffect, useState } from 'react';

interface AnimatedBossProps {
  bossId: string;
  health: number;
  isHurt: boolean;
  isShaking: boolean;
  accentColor: string;
  templateBossId?: string; // For AI-generated bosses, the original template boss ID
}

export function AnimatedBoss({ bossId, health, isHurt, isShaking, accentColor: _accentColor, templateBossId }: AnimatedBossProps) {
  const [idleFrame, setIdleFrame] = useState(0);

  // Idle animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setIdleFrame((f) => (f + 1) % 60);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Calculate breathing/floating offset
  const breatheOffset = Math.sin(idleFrame * 0.1) * 3;
  const floatOffset = Math.sin(idleFrame * 0.05) * 2;

  // Damage visual state
  const damageState = health > 60 ? 'healthy' : health > 30 ? 'damaged' : 'critical';

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    filter: isHurt ? 'brightness(2) saturate(0.3)' : 'none',
    transition: 'filter 0.2s ease',
  };

  const shakeClass = isShaking ? 'boss-shake' : '';

  // Render different boss designs based on bossId
  // AI-generated bosses use the template boss's design
  const effectiveBossId = templateBossId || bossId;

  switch (effectiveBossId) {
    case 'boss-math-master':
      return <MathMaster style={containerStyle} className={shakeClass} breatheOffset={breatheOffset} floatOffset={floatOffset} idleFrame={idleFrame} damageState={damageState} isHurt={isHurt} health={health} />;
    case 'boss-tree-spirit':
      return <TreeSpirit style={containerStyle} className={shakeClass} breatheOffset={breatheOffset} damageState={damageState} isHurt={isHurt} health={health} />;
    case 'boss-math-dragon':
      return <MathDragon style={containerStyle} className={shakeClass} breatheOffset={breatheOffset} floatOffset={floatOffset} damageState={damageState} isHurt={isHurt} health={health} />;
    case 'boss-cosmic-calculator':
      return <CosmicCalculator style={containerStyle} className={shakeClass} idleFrame={idleFrame} damageState={damageState} isHurt={isHurt} health={health} />;
    case 'boss-kraken-king':
      return <KrakenKing style={containerStyle} className={shakeClass} idleFrame={idleFrame} breatheOffset={breatheOffset} damageState={damageState} isHurt={isHurt} health={health} />;
    default:
      // For unknown bosses, use Math Master as default
      return <MathMaster style={containerStyle} className={shakeClass} breatheOffset={breatheOffset} floatOffset={floatOffset} idleFrame={idleFrame} damageState={damageState} isHurt={isHurt} health={health} />;
  }
}

// ============================================
// MATH MASTER (Professor Pythagoras) BOSS
// ============================================
function MathMaster({
  style,
  className,
  breatheOffset,
  floatOffset,
  idleFrame,
  damageState,
  isHurt,
  health
}: {
  style: React.CSSProperties;
  className: string;
  breatheOffset: number;
  floatOffset: number;
  idleFrame: number;
  damageState: string;
  isHurt: boolean;
  health: number;
}) {
  const robeColor = damageState === 'critical' ? '#1A237E' : damageState === 'damaged' ? '#283593' : '#3F51B5';
  const skinColor = '#FFCCBC';
  const beardColor = damageState === 'critical' ? '#9E9E9E' : '#BDBDBD';
  const staffGlow = isHurt ? '#FF5722' : damageState === 'critical' ? '#F44336' : '#FFC107';

  // Staff crystal pulse
  const crystalPulse = Math.sin(idleFrame * 0.2) * 0.3 + 0.7;

  // Floating math symbols
  const symbolY1 = (idleFrame * 2) % 60;
  const symbolY2 = ((idleFrame * 2) + 30) % 60;

  return (
    <div style={style} className={className}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Floating math symbols in background */}
        <text x="10" y={70 - symbolY1} fill="#FFC107" fontSize="8" opacity={0.4 - symbolY1/150} fontFamily="serif">
          π
        </text>
        <text x="65" y={70 - symbolY2} fill="#FFC107" fontSize="8" opacity={0.4 - symbolY2/150} fontFamily="serif">
          ∑
        </text>
        <text x="5" y={60 - symbolY2} fill="#FFC107" fontSize="6" opacity={0.3 - symbolY2/150} fontFamily="serif">
          √
        </text>
        <text x="70" y={65 - symbolY1} fill="#FFC107" fontSize="7" opacity={0.35 - symbolY1/150} fontFamily="serif">
          ∞
        </text>

        {/* Magic staff */}
        <rect
          x="58"
          y={20 + floatOffset * 0.5}
          width="4"
          height="50"
          fill="#5D4037"
          rx="2"
        />
        {/* Staff crystal */}
        <polygon
          points={`60,${15 + floatOffset * 0.5} 55,${22 + floatOffset * 0.5} 60,${29 + floatOffset * 0.5} 65,${22 + floatOffset * 0.5}`}
          fill={staffGlow}
          opacity={crystalPulse}
          style={{ filter: `drop-shadow(0 0 6px ${staffGlow})` }}
        />
        {/* Inner crystal glow */}
        <polygon
          points={`60,${18 + floatOffset * 0.5} 57,${22 + floatOffset * 0.5} 60,${26 + floatOffset * 0.5} 63,${22 + floatOffset * 0.5}`}
          fill="#FFFFFF"
          opacity={crystalPulse * 0.6}
        />

        {/* Wizard hat */}
        <path
          d={`M25 ${22 + breatheOffset * 0.3} L40 ${2 + breatheOffset * 0.5} L55 ${22 + breatheOffset * 0.3} Z`}
          fill="#1A237E"
          style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}
        />
        {/* Hat band */}
        <rect x="25" y={20 + breatheOffset * 0.3} width="30" height="4" fill="#FFC107" rx="1" />
        {/* Hat stars */}
        <text x="35" y={15 + breatheOffset * 0.4} fill="#FFC107" fontSize="6">★</text>
        <text x="42" y={12 + breatheOffset * 0.4} fill="#FFC107" fontSize="4">★</text>

        {/* Head */}
        <ellipse
          cx="40"
          cy={30 + breatheOffset * 0.3}
          rx="12"
          ry="10"
          fill={skinColor}
        />

        {/* Glasses */}
        <circle cx="35" cy={28 + breatheOffset * 0.3} r="5" fill="none" stroke="#37474F" strokeWidth="1.5" />
        <circle cx="45" cy={28 + breatheOffset * 0.3} r="5" fill="none" stroke="#37474F" strokeWidth="1.5" />
        <line x1="40" y1={28 + breatheOffset * 0.3} x2="40" y2={28 + breatheOffset * 0.3} stroke="#37474F" strokeWidth="1.5" />
        {/* Glasses bridge */}
        <path d={`M40 ${28 + breatheOffset * 0.3} Q40 ${26 + breatheOffset * 0.3} 40 ${28 + breatheOffset * 0.3}`} stroke="#37474F" strokeWidth="1" fill="none" />

        {/* Eyes behind glasses */}
        <circle cx="35" cy={28 + breatheOffset * 0.3} r="2" fill="#1a1a1a" />
        <circle cx="45" cy={28 + breatheOffset * 0.3} r="2" fill="#1a1a1a" />
        {/* Eye glint */}
        <circle cx="34" cy={27 + breatheOffset * 0.3} r="0.8" fill={isHurt ? '#FF5722' : '#FFFFFF'} />
        <circle cx="44" cy={27 + breatheOffset * 0.3} r="0.8" fill={isHurt ? '#FF5722' : '#FFFFFF'} />

        {/* Eyebrows */}
        {damageState !== 'healthy' ? (
          <>
            <line x1="31" y1={23 + breatheOffset * 0.3} x2="38" y2={25 + breatheOffset * 0.3} stroke="#5D4037" strokeWidth="1.5" />
            <line x1="49" y1={23 + breatheOffset * 0.3} x2="42" y2={25 + breatheOffset * 0.3} stroke="#5D4037" strokeWidth="1.5" />
          </>
        ) : (
          <>
            <path d={`M31 ${24 + breatheOffset * 0.3} Q34 ${22 + breatheOffset * 0.3} 38 ${24 + breatheOffset * 0.3}`} stroke="#5D4037" strokeWidth="1.5" fill="none" />
            <path d={`M42 ${24 + breatheOffset * 0.3} Q46 ${22 + breatheOffset * 0.3} 49 ${24 + breatheOffset * 0.3}`} stroke="#5D4037" strokeWidth="1.5" fill="none" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="40" cy={32 + breatheOffset * 0.3} rx="2" ry="2.5" fill="#FFAB91" />

        {/* Long wizard beard */}
        <path
          d={`M30 ${35 + breatheOffset * 0.3} Q28 ${50 + breatheOffset * 0.2} 32 ${65 + breatheOffset * 0.1} L40 ${60 + breatheOffset * 0.1} L48 ${65 + breatheOffset * 0.1} Q52 ${50 + breatheOffset * 0.2} 50 ${35 + breatheOffset * 0.3}`}
          fill={beardColor}
        />
        {/* Beard texture */}
        <path
          d={`M34 ${42 + breatheOffset * 0.2} Q36 ${50 + breatheOffset * 0.2} 35 ${58 + breatheOffset * 0.1}`}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d={`M40 ${40 + breatheOffset * 0.2} L40 ${58 + breatheOffset * 0.1}`}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d={`M46 ${42 + breatheOffset * 0.2} Q44 ${50 + breatheOffset * 0.2} 45 ${58 + breatheOffset * 0.1}`}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1"
          fill="none"
        />

        {/* Robe body */}
        <path
          d={`M28 ${40 + breatheOffset * 0.2} L25 70 L55 70 L52 ${40 + breatheOffset * 0.2}`}
          fill={robeColor}
        />
        {/* Robe collar */}
        <path
          d={`M30 ${38 + breatheOffset * 0.2} Q40 ${42 + breatheOffset * 0.2} 50 ${38 + breatheOffset * 0.2}`}
          fill="#283593"
        />
        {/* Robe trim */}
        <path
          d={`M25 70 L55 70`}
          stroke="#FFC107"
          strokeWidth="3"
        />

        {/* Arms/Sleeves */}
        <path
          d={`M28 ${45 + breatheOffset * 0.2} Q20 ${50 + floatOffset} 18 ${55 + floatOffset}`}
          stroke={robeColor}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        {/* Hand holding something */}
        <circle cx="18" cy={57 + floatOffset} r="4" fill={skinColor} />

        {/* Right arm reaching to staff */}
        <path
          d={`M52 ${45 + breatheOffset * 0.2} Q55 ${50 + floatOffset * 0.5} 58 ${45 + floatOffset * 0.5}`}
          stroke={robeColor}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="58" cy={47 + floatOffset * 0.5} r="4" fill={skinColor} />

        {/* Damage effects */}
        {health < 60 && (
          <text x="15" y="35" fill="#F44336" fontSize="8" opacity="0.7">!</text>
        )}
        {health < 30 && (
          <>
            <text x="8" y="50" fill="#F44336" fontSize="6" opacity="0.6">?!</text>
            {/* Cracked glasses */}
            <line x1="33" y1={26 + breatheOffset * 0.3} x2="37" y2={30 + breatheOffset * 0.3} stroke="#37474F" strokeWidth="0.5" opacity="0.5" />
          </>
        )}

        {/* Magic sparkle when hurt */}
        {isHurt && (
          <>
            <circle cx="60" cy={22 + floatOffset * 0.5} r="8" fill={staffGlow} opacity="0.6">
              <animate attributeName="r" values="8;15;8" dur="0.3s" />
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="0.3s" />
            </circle>
            <text x="55" y="35" fill="#FFC107" fontSize="10" opacity="0.8">
              ✧
              <animate attributeName="opacity" values="0.8;0;0.8" dur="0.2s" repeatCount="2" />
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

// ============================================
// TREE SPIRIT BOSS
// ============================================
function TreeSpirit({
  style,
  className,
  breatheOffset,
  damageState,
  isHurt,
  health
}: {
  style: React.CSSProperties;
  className: string;
  breatheOffset: number;
  damageState: string;
  isHurt: boolean;
  health: number;
}) {
  const trunkColor = damageState === 'critical' ? '#5D4037' : damageState === 'damaged' ? '#6D4C41' : '#8D6E63';
  const leafColor = damageState === 'critical' ? '#558B2F' : damageState === 'damaged' ? '#7CB342' : '#8BC34A';
  const eyeGlow = isHurt ? '#FF5722' : damageState === 'critical' ? '#F44336' : '#FFEB3B';

  return (
    <div style={style} className={className}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Roots */}
        <path
          d="M25 70 Q20 75 15 72 M40 70 Q40 78 40 78 M55 70 Q60 75 65 72"
          stroke={trunkColor}
          strokeWidth="4"
          fill="none"
          opacity="0.8"
        />

        {/* Main trunk */}
        <rect
          x="30"
          y="40"
          width="20"
          height="32"
          fill={trunkColor}
          rx="3"
        />

        {/* Trunk texture lines */}
        <path
          d="M33 45 L33 68 M40 42 L40 70 M47 45 L47 68"
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="1.5"
        />

        {/* Tree crown / leaves - multiple layers */}
        <ellipse
          cx="40"
          cy={25 + breatheOffset * 0.5}
          rx="28"
          ry="22"
          fill={leafColor}
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
        />
        <ellipse
          cx="30"
          cy={20 + breatheOffset * 0.3}
          rx="15"
          ry="12"
          fill={leafColor}
          opacity="0.9"
        />
        <ellipse
          cx="50"
          cy={20 + breatheOffset * 0.3}
          rx="15"
          ry="12"
          fill={leafColor}
          opacity="0.9"
        />
        <ellipse
          cx="40"
          cy={12 + breatheOffset}
          rx="12"
          ry="10"
          fill={leafColor}
        />

        {/* Face area (darker bark) */}
        <ellipse cx="40" cy="35" rx="12" ry="8" fill="rgba(0,0,0,0.15)" />

        {/* Eyes - glowing */}
        <ellipse cx="34" cy="33" rx="4" ry="5" fill="#1a1a1a" />
        <ellipse cx="46" cy="33" rx="4" ry="5" fill="#1a1a1a" />
        <circle cx="34" cy="32" r="2" fill={eyeGlow} style={{ filter: `drop-shadow(0 0 3px ${eyeGlow})` }} />
        <circle cx="46" cy="32" r="2" fill={eyeGlow} style={{ filter: `drop-shadow(0 0 3px ${eyeGlow})` }} />

        {/* Angry eyebrows when damaged */}
        {damageState !== 'healthy' && (
          <>
            <line x1="30" y1="26" x2="37" y2="28" stroke="#1a1a1a" strokeWidth="2" />
            <line x1="50" y1="26" x2="43" y2="28" stroke="#1a1a1a" strokeWidth="2" />
          </>
        )}

        {/* Mouth */}
        <path
          d={damageState === 'critical'
            ? "M35 42 Q40 46 45 42" // Grimace
            : damageState === 'damaged'
            ? "M35 43 L45 43" // Neutral
            : "M35 42 Q40 38 45 42" // Slight frown (intimidating)
          }
          stroke="#1a1a1a"
          strokeWidth="2"
          fill="none"
        />

        {/* Damage cracks */}
        {health < 60 && (
          <path d="M52 35 L55 42 L53 48" stroke="#3E2723" strokeWidth="1.5" fill="none" opacity="0.6" />
        )}
        {health < 30 && (
          <>
            <path d="M28 30 L25 38 L27 45" stroke="#3E2723" strokeWidth="1.5" fill="none" opacity="0.6" />
            <path d="M38 50 L40 58 L42 55" stroke="#3E2723" strokeWidth="1" fill="none" opacity="0.5" />
          </>
        )}

        {/* Falling leaves when hurt */}
        {isHurt && (
          <>
            <ellipse cx="15" cy="25" rx="3" ry="2" fill={leafColor} opacity="0.7">
              <animate attributeName="cy" values="25;75" dur="0.8s" fill="freeze" />
              <animate attributeName="opacity" values="0.7;0" dur="0.8s" fill="freeze" />
            </ellipse>
            <ellipse cx="65" cy="20" rx="3" ry="2" fill={leafColor} opacity="0.7">
              <animate attributeName="cy" values="20;70" dur="0.7s" fill="freeze" />
              <animate attributeName="opacity" values="0.7;0" dur="0.7s" fill="freeze" />
            </ellipse>
          </>
        )}
      </svg>
    </div>
  );
}

// ============================================
// MATH DRAGON BOSS
// ============================================
function MathDragon({
  style,
  className,
  breatheOffset,
  floatOffset,
  damageState,
  isHurt,
  health
}: {
  style: React.CSSProperties;
  className: string;
  breatheOffset: number;
  floatOffset: number;
  damageState: string;
  isHurt: boolean;
  health: number;
}) {
  const bodyColor = damageState === 'critical' ? '#B71C1C' : damageState === 'damaged' ? '#C62828' : '#D32F2F';
  const bellyColor = damageState === 'critical' ? '#FF8A65' : '#FFAB91';
  const eyeGlow = isHurt ? '#FFFFFF' : damageState === 'critical' ? '#FF5722' : '#FFC107';
  const fireColor = damageState === 'critical' ? '#FF5722' : '#FF9800';

  return (
    <div style={style} className={className}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Wings */}
        <path
          d={`M15 ${35 + floatOffset} Q5 25 10 ${15 + floatOffset * 2} L20 ${30 + floatOffset}`}
          fill={bodyColor}
          opacity="0.8"
        />
        <path
          d={`M65 ${35 + floatOffset} Q75 25 70 ${15 + floatOffset * 2} L60 ${30 + floatOffset}`}
          fill={bodyColor}
          opacity="0.8"
        />
        {/* Wing bones */}
        <line x1="15" y1={35 + floatOffset} x2="10" y2={15 + floatOffset * 2} stroke="#8B0000" strokeWidth="1" opacity="0.5" />
        <line x1="65" y1={35 + floatOffset} x2="70" y2={15 + floatOffset * 2} stroke="#8B0000" strokeWidth="1" opacity="0.5" />

        {/* Tail */}
        <path
          d={`M25 55 Q10 60 5 ${50 + breatheOffset} Q0 ${45 + breatheOffset} 3 ${40 + breatheOffset}`}
          stroke={bodyColor}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Tail spikes */}
        <circle cx="5" cy={42 + breatheOffset} r="3" fill="#FF5722" />

        {/* Body */}
        <ellipse
          cx="40"
          cy={48 + breatheOffset * 0.3}
          rx="18"
          ry="14"
          fill={bodyColor}
        />

        {/* Belly */}
        <ellipse
          cx="40"
          cy={50 + breatheOffset * 0.3}
          rx="10"
          ry="8"
          fill={bellyColor}
        />
        {/* Belly scales */}
        <path
          d={`M34 ${45 + breatheOffset * 0.3} H46 M33 ${50 + breatheOffset * 0.3} H47 M34 ${55 + breatheOffset * 0.3} H46`}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1"
        />

        {/* Head */}
        <ellipse
          cx="40"
          cy={28 + breatheOffset * 0.5}
          rx="14"
          ry="12"
          fill={bodyColor}
        />

        {/* Snout */}
        <ellipse
          cx="40"
          cy={34 + breatheOffset * 0.5}
          rx="8"
          ry="5"
          fill={bodyColor}
        />

        {/* Nostrils with smoke/fire */}
        <circle cx="36" cy={33 + breatheOffset * 0.5} r="1.5" fill="#1a1a1a" />
        <circle cx="44" cy={33 + breatheOffset * 0.5} r="1.5" fill="#1a1a1a" />
        {damageState !== 'critical' && (
          <>
            <ellipse cx="36" cy={30 + breatheOffset * 0.5} rx="2" ry="3" fill={fireColor} opacity="0.6">
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="0.5s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="44" cy={30 + breatheOffset * 0.5} rx="2" ry="3" fill={fireColor} opacity="0.6">
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur="0.5s" repeatCount="indefinite" />
            </ellipse>
          </>
        )}

        {/* Horns */}
        <path d={`M30 ${20 + breatheOffset * 0.5} L26 ${10 + breatheOffset * 0.7} L32 ${18 + breatheOffset * 0.5}`} fill="#4E342E" />
        <path d={`M50 ${20 + breatheOffset * 0.5} L54 ${10 + breatheOffset * 0.7} L48 ${18 + breatheOffset * 0.5}`} fill="#4E342E" />

        {/* Eyes */}
        <ellipse cx="34" cy={24 + breatheOffset * 0.5} rx="4" ry="5" fill="#1a1a1a" />
        <ellipse cx="46" cy={24 + breatheOffset * 0.5} rx="4" ry="5" fill="#1a1a1a" />
        <ellipse cx="34" cy={23 + breatheOffset * 0.5} rx="2" ry="3" fill={eyeGlow} style={{ filter: `drop-shadow(0 0 4px ${eyeGlow})` }}>
          <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="46" cy={23 + breatheOffset * 0.5} rx="2" ry="3" fill={eyeGlow} style={{ filter: `drop-shadow(0 0 4px ${eyeGlow})` }}>
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </ellipse>

        {/* Angry eyebrows */}
        <line x1="29" y1={18 + breatheOffset * 0.5} x2="37" y2={20 + breatheOffset * 0.5} stroke="#1a1a1a" strokeWidth="2" />
        <line x1="51" y1={18 + breatheOffset * 0.5} x2="43" y2={20 + breatheOffset * 0.5} stroke="#1a1a1a" strokeWidth="2" />

        {/* Spikes down neck */}
        <path d={`M40 ${16 + breatheOffset * 0.5} L43 ${10 + breatheOffset * 0.7} L40 ${14 + breatheOffset * 0.5}`} fill="#FF5722" />

        {/* Legs */}
        <rect x="28" y="58" width="6" height="12" fill={bodyColor} rx="2" />
        <rect x="46" y="58" width="6" height="12" fill={bodyColor} rx="2" />

        {/* Claws */}
        <path d="M28 70 L26 73 M31 70 L31 74 M34 70 L36 73" stroke="#4E342E" strokeWidth="2" strokeLinecap="round" />
        <path d="M46 70 L44 73 M49 70 L49 74 M52 70 L54 73" stroke="#4E342E" strokeWidth="2" strokeLinecap="round" />

        {/* Damage scars */}
        {health < 60 && (
          <path d="M50 35 L55 42 L52 48" stroke="#8B0000" strokeWidth="1.5" fill="none" opacity="0.7" />
        )}
        {health < 30 && (
          <path d="M25 40 L22 48 L26 55" stroke="#8B0000" strokeWidth="1.5" fill="none" opacity="0.7" />
        )}

        {/* Fire breath when hurt (defeated animation) */}
        {isHurt && (
          <ellipse cx="40" cy="38" rx="8" ry="4" fill="#FF5722" opacity="0.8">
            <animate attributeName="rx" values="8;15;8" dur="0.3s" />
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.3s" />
          </ellipse>
        )}
      </svg>
    </div>
  );
}

// ============================================
// COSMIC CALCULATOR (ROBOT) BOSS
// ============================================
function CosmicCalculator({
  style,
  className,
  idleFrame,
  damageState,
  isHurt,
  health
}: {
  style: React.CSSProperties;
  className: string;
  idleFrame: number;
  damageState: string;
  isHurt: boolean;
  health: number;
}) {
  const bodyColor = damageState === 'critical' ? '#37474F' : damageState === 'damaged' ? '#455A64' : '#607D8B';
  const screenColor = damageState === 'critical' ? '#B71C1C' : damageState === 'damaged' ? '#FF9800' : '#00BCD4';
  const glowIntensity = isHurt ? '8px' : '4px';

  // Glitch effect when damaged
  const glitchOffset = damageState !== 'healthy' ? Math.sin(idleFrame * 0.5) * 2 : 0;

  // Scanning line animation
  const scanY = 28 + (idleFrame % 20);

  return (
    <div style={style} className={className}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Antenna */}
        <line x1="40" y1="8" x2="40" y2="15" stroke="#90A4AE" strokeWidth="2" />
        <circle cx="40" cy="6" r="3" fill={screenColor} style={{ filter: `drop-shadow(0 0 ${glowIntensity} ${screenColor})` }}>
          <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
        </circle>

        {/* Head/Main screen */}
        <rect
          x="20"
          y="15"
          width="40"
          height="35"
          fill={bodyColor}
          rx="4"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
        />

        {/* Screen */}
        <rect
          x="24"
          y="19"
          width="32"
          height="27"
          fill="#1a1a1a"
          rx="2"
        />

        {/* Screen glow */}
        <rect
          x="24"
          y="19"
          width="32"
          height="27"
          fill={screenColor}
          opacity="0.1"
          rx="2"
        />

        {/* Scan line */}
        <rect x="24" y={scanY} width="32" height="2" fill={screenColor} opacity="0.3" />

        {/* Eyes/Display */}
        <rect
          x={28 + glitchOffset}
          y="24"
          width="8"
          height="10"
          fill={screenColor}
          style={{ filter: `drop-shadow(0 0 ${glowIntensity} ${screenColor})` }}
        >
          {damageState !== 'healthy' && (
            <animate attributeName="opacity" values="1;0.3;1;0.5;1" dur="0.2s" repeatCount="indefinite" />
          )}
        </rect>
        <rect
          x={44 - glitchOffset}
          y="24"
          width="8"
          height="10"
          fill={screenColor}
          style={{ filter: `drop-shadow(0 0 ${glowIntensity} ${screenColor})` }}
        >
          {damageState !== 'healthy' && (
            <animate attributeName="opacity" values="0.5;1;0.3;1;0.5" dur="0.2s" repeatCount="indefinite" />
          )}
        </rect>

        {/* Angry eyes when damaged */}
        {damageState !== 'healthy' && (
          <>
            <rect x={28 + glitchOffset} y="22" width="8" height="3" fill="#1a1a1a" />
            <rect x={44 - glitchOffset} y="22" width="8" height="3" fill="#1a1a1a" />
          </>
        )}

        {/* Mouth display */}
        <rect
          x="32"
          y="38"
          width="16"
          height="4"
          fill={screenColor}
          opacity={damageState === 'critical' ? 0.5 : 0.8}
        />
        {damageState === 'critical' && (
          // Error pattern
          <text x="33" y="42" fill="#FF0000" fontSize="4" fontFamily="monospace">ERR</text>
        )}

        {/* Body */}
        <rect
          x="25"
          y="52"
          width="30"
          height="18"
          fill={bodyColor}
          rx="3"
        />

        {/* Chest panel */}
        <rect x="30" y="55" width="20" height="12" fill="#37474F" rx="2" />

        {/* Status lights */}
        <circle cx="34" cy="59" r="2" fill={health > 60 ? '#4CAF50' : '#666'}>
          <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="40" cy="59" r="2" fill={health > 30 ? '#FFC107' : '#666'}>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="46" cy="59" r="2" fill={damageState === 'critical' ? '#F44336' : '#666'}>
          {damageState === 'critical' && (
            <animate attributeName="opacity" values="1;0;1" dur="0.3s" repeatCount="indefinite" />
          )}
        </circle>

        {/* Arms */}
        <rect x="12" y="52" width="8" height="4" fill={bodyColor} rx="2" />
        <rect x="10" y="56" width="6" height="14" fill="#90A4AE" rx="2" />
        <rect x="60" y="52" width="8" height="4" fill={bodyColor} rx="2" />
        <rect x="64" y="56" width="6" height="14" fill="#90A4AE" rx="2" />

        {/* Hands/Claws */}
        <path d="M10 70 L8 74 M13 70 L13 75 M16 70 L18 74" stroke="#78909C" strokeWidth="2" strokeLinecap="round" />
        <path d="M64 70 L62 74 M67 70 L67 75 M70 70 L72 74" stroke="#78909C" strokeWidth="2" strokeLinecap="round" />

        {/* Damage sparks */}
        {health < 60 && (
          <circle cx="55" cy="25" r="2" fill="#FFC107" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0;0.8" dur="0.3s" repeatCount="indefinite" />
          </circle>
        )}
        {health < 30 && (
          <>
            <circle cx="22" cy="45" r="2" fill="#FFC107" opacity="0.8">
              <animate attributeName="opacity" values="0;0.8;0" dur="0.2s" repeatCount="indefinite" />
            </circle>
            <path d="M58 55 L62 52 L60 58" stroke="#FFC107" strokeWidth="1" fill="none" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0;0.8" dur="0.15s" repeatCount="indefinite" />
            </path>
          </>
        )}

        {/* Electric shock when hurt */}
        {isHurt && (
          <>
            <path d="M20 30 L15 35 L22 35 L17 42" stroke="#00BCD4" strokeWidth="2" fill="none" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.3;0.9" dur="0.1s" repeatCount="3" />
            </path>
            <path d="M60 25 L65 30 L58 32 L63 38" stroke="#00BCD4" strokeWidth="2" fill="none" opacity="0.9">
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur="0.1s" repeatCount="3" />
            </path>
          </>
        )}
      </svg>
    </div>
  );
}

// ============================================
// KRAKEN KING BOSS
// ============================================
function KrakenKing({
  style,
  className,
  idleFrame,
  breatheOffset,
  damageState,
  isHurt,
  health
}: {
  style: React.CSSProperties;
  className: string;
  idleFrame: number;
  breatheOffset: number;
  damageState: string;
  isHurt: boolean;
  health: number;
}) {
  const bodyColor = damageState === 'critical' ? '#4A148C' : damageState === 'damaged' ? '#6A1B9A' : '#8E24AA';
  const tentacleColor = damageState === 'critical' ? '#7B1FA2' : '#AB47BC';
  const eyeColor = isHurt ? '#FFFFFF' : damageState === 'critical' ? '#F44336' : '#E040FB';

  // Tentacle wave animation
  const wave1 = Math.sin(idleFrame * 0.15) * 5;
  const wave2 = Math.sin(idleFrame * 0.15 + 1) * 5;
  const wave3 = Math.sin(idleFrame * 0.15 + 2) * 5;

  return (
    <div style={style} className={className}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Crown */}
        <path
          d={`M25 ${15 + breatheOffset * 0.3} L30 ${5 + breatheOffset * 0.5} L35 ${12 + breatheOffset * 0.3} L40 ${2 + breatheOffset * 0.5} L45 ${12 + breatheOffset * 0.3} L50 ${5 + breatheOffset * 0.5} L55 ${15 + breatheOffset * 0.3} Z`}
          fill="#FFD700"
          style={{ filter: 'drop-shadow(0 0 4px #FFD700)' }}
        />
        {/* Crown jewels */}
        <circle cx="30" cy={8 + breatheOffset * 0.5} r="2" fill="#E040FB" />
        <circle cx="40" cy={5 + breatheOffset * 0.5} r="2.5" fill="#00BCD4" />
        <circle cx="50" cy={8 + breatheOffset * 0.5} r="2" fill="#E040FB" />

        {/* Main head/body */}
        <ellipse
          cx="40"
          cy={30 + breatheOffset * 0.3}
          rx="22"
          ry="18"
          fill={bodyColor}
          style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' }}
        />

        {/* Head spots/texture */}
        <ellipse cx="28" cy={25 + breatheOffset * 0.3} rx="3" ry="4" fill="rgba(255,255,255,0.1)" />
        <ellipse cx="52" cy={28 + breatheOffset * 0.3} rx="4" ry="3" fill="rgba(255,255,255,0.1)" />

        {/* Eyes */}
        <ellipse cx="32" cy={28 + breatheOffset * 0.3} rx="6" ry="7" fill="#1a1a1a" />
        <ellipse cx="48" cy={28 + breatheOffset * 0.3} rx="6" ry="7" fill="#1a1a1a" />
        <ellipse cx="32" cy={27 + breatheOffset * 0.3} rx="3" ry="4" fill={eyeColor} style={{ filter: `drop-shadow(0 0 5px ${eyeColor})` }}>
          <animate attributeName="opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="48" cy={27 + breatheOffset * 0.3} rx="3" ry="4" fill={eyeColor} style={{ filter: `drop-shadow(0 0 5px ${eyeColor})` }}>
          <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* Angry eyebrows */}
        {damageState !== 'healthy' && (
          <>
            <line x1="25" y1={20 + breatheOffset * 0.3} x2="36" y2={23 + breatheOffset * 0.3} stroke={bodyColor} strokeWidth="3" />
            <line x1="55" y1={20 + breatheOffset * 0.3} x2="44" y2={23 + breatheOffset * 0.3} stroke={bodyColor} strokeWidth="3" />
          </>
        )}

        {/* Beak/Mouth */}
        <path
          d={`M35 ${38 + breatheOffset * 0.3} L40 ${44 + breatheOffset * 0.3} L45 ${38 + breatheOffset * 0.3}`}
          fill="#4A148C"
          stroke="#311B92"
          strokeWidth="1"
        />

        {/* Tentacles */}
        {/* Left tentacles */}
        <path
          d={`M20 45 Q${10 + wave1} 55 ${8 + wave1} 70 Q${5 + wave1} 75 ${10 + wave1} 78`}
          stroke={tentacleColor}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M25 48 Q${15 + wave2} 58 ${15 + wave2} 72`}
          stroke={tentacleColor}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Right tentacles */}
        <path
          d={`M60 45 Q${70 - wave1} 55 ${72 - wave1} 70 Q${75 - wave1} 75 ${70 - wave1} 78`}
          stroke={tentacleColor}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M55 48 Q${65 - wave2} 58 ${65 - wave2} 72`}
          stroke={tentacleColor}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Center tentacles */}
        <path
          d={`M35 46 Q${30 + wave3} 60 ${32 + wave3} 75`}
          stroke={tentacleColor}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M45 46 Q${50 - wave3} 60 ${48 - wave3} 75`}
          stroke={tentacleColor}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Tentacle suckers */}
        <circle cx={10 + wave1} cy="65" r="2" fill="rgba(255,255,255,0.3)" />
        <circle cx={72 - wave1} cy="65" r="2" fill="rgba(255,255,255,0.3)" />
        <circle cx={32 + wave3} cy="68" r="1.5" fill="rgba(255,255,255,0.3)" />
        <circle cx={48 - wave3} cy="68" r="1.5" fill="rgba(255,255,255,0.3)" />

        {/* Damage marks */}
        {health < 60 && (
          <path d="M55 35 L58 42 L54 48" stroke="#311B92" strokeWidth="1.5" fill="none" opacity="0.6" />
        )}
        {health < 30 && (
          <path d="M22 32 L18 40 L24 45" stroke="#311B92" strokeWidth="1.5" fill="none" opacity="0.6" />
        )}

        {/* Ink splash when hurt */}
        {isHurt && (
          <>
            <ellipse cx="40" cy="50" rx="15" ry="8" fill="#1a1a1a" opacity="0.7">
              <animate attributeName="ry" values="8;20;8" dur="0.4s" />
              <animate attributeName="opacity" values="0.7;0;0.7" dur="0.4s" />
            </ellipse>
          </>
        )}

        {/* Bubbles (ambient) */}
        <circle cx="12" cy="30" r="2" fill="rgba(255,255,255,0.3)">
          <animate attributeName="cy" values="30;10" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="68" cy="35" r="1.5" fill="rgba(255,255,255,0.3)">
          <animate attributeName="cy" values="35;15" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}


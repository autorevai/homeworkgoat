/**
 * Expanded Quest Definitions
 * Quests organized by world with themed NPCs and storylines.
 */

import type { Quest } from './types';

export const quests: Quest[] = [
  // =====================================================
  // SCHOOL COURTYARD QUESTS (World 1 - Starting Area)
  // =====================================================
  
  {
    id: 'quest-power-crystals',
    title: 'Fix the Power Crystals',
    description: 'Help Professor Pixel restore power to the school by solving math challenges!',
    npcName: 'Professor Pixel',
    npcIntro: `Oh thank goodness you're here, young hero!

The school's Power Crystals have gone haywire! They run on mathematical energy, and I need someone clever to recalibrate them.

Each crystal needs a specific number to power it up. Get the answers right, and we'll restore power to the whole school!

Are you ready to help?`,
    questionIds: ['add-001', 'mult-001', 'sub-003', 'word-002'],
    rewardXp: 100,
    completionMessage: `AMAZING! You did it!

All the Power Crystals are glowing bright again! The school has power once more, all thanks to your math skills!

You've earned 100 XP and proven yourself a true Math Hero!`,
  },

  {
    id: 'quest-treasure-hunt',
    title: 'The Number Treasure Hunt',
    description: 'Decode the treasure map by solving tricky math puzzles!',
    npcName: 'Captain Calculator',
    npcIntro: `Ahoy there, matey!

I've found an ancient treasure map, but the directions are all in math riddles! My old brain can't figure them out anymore.

Help me decode these number puzzles, and I'll share the treasure with you!

What do you say, ready to hunt for treasure?`,
    questionIds: ['add-008', 'sub-007', 'mult-011', 'div-002', 'word-006'],
    rewardXp: 150,
    completionMessage: `Shiver me timbers! You cracked the code!

The treasure is ours! Well, mostly yours - you did all the hard work!

You've earned 150 XP and the title of Master Decoder!`,
  },

  {
    id: 'quest-robot-repair',
    title: 'Robot Repair',
    description: 'Fix the school robot by solving multiplication puzzles!',
    npcName: 'Rusty the Robot',
    npcIntro: `BEEP BOOP! My circuits are scrambled!

I need a math expert to recalibrate my processors. Each correct answer fixes one of my systems!

My multiplication module is completely fried. Can you help me, young engineer?`,
    questionIds: ['mult-002', 'mult-003', 'mult-005', 'mult-007', 'mult-008'],
    rewardXp: 125,
    completionMessage: `BEEP BOOP! All systems operational!

Thank you, engineer! My multiplication circuits are running perfectly now!

You've earned 125 XP! BOOP BEEP!`,
  },

  {
    id: 'quest-lunch-count',
    title: 'Cafeteria Crisis',
    description: 'Help the lunch lady figure out how much food to prepare!',
    npcName: 'Mrs. Munchkin',
    npcIntro: `Oh dear, oh my!

The lunch orders are all mixed up! I need to figure out how many sandwiches, drinks, and snacks to prepare.

Can you help me with these calculations? The students are counting on us!`,
    questionIds: ['add-003', 'add-006', 'word-004', 'word-005', 'div-004'],
    rewardXp: 100,
    completionMessage: `Perfect! The lunch is saved!

Every student will get their meal thanks to your quick math!

You've earned 100 XP and a gold star from the cafeteria! ⭐`,
  },

  // =====================================================
  // ENCHANTED FOREST QUESTS (World 2)
  // =====================================================

  {
    id: 'quest-fairy-lights',
    title: 'Fairy Light Festival',
    description: 'Help Twinkle the Fairy count all the magical lights!',
    npcName: 'Twinkle',
    npcIntro: `✨ Hello, kind traveler!

The Fairy Light Festival is tonight, but I've lost count of all our magical lanterns!

We need exactly the right number for the spell to work. Too many or too few and... *poof!* 

Will you help me count them with math?`,
    questionIds: ['add-004', 'add-010', 'mult-006', 'word-001', 'add-015'],
    rewardXp: 150,
    completionMessage: `✨ The lights are perfect!

Look how beautiful the forest glows! The festival can begin!

You've earned 150 XP and the blessing of the fairies! ✨`,
  },

  {
    id: 'quest-owl-wisdom',
    title: 'The Wisdom of Owls',
    description: 'Answer Professor Hoot\'s challenging riddles!',
    npcName: 'Professor Hoot',
    npcIntro: `Hoo-hoo, young scholar!

I am the keeper of ancient forest knowledge. Many have tried to answer my riddles, but few succeed!

These questions test not just your math, but your wisdom. Do you dare to try?`,
    questionIds: ['div-008', 'div-009', 'word-009', 'mult-013', 'sub-011'],
    rewardXp: 175,
    completionMessage: `Hoo-hoo! Most impressive!

You have the mind of a true scholar. The forest creatures will speak of your wisdom!

You've earned 175 XP and the title of Forest Scholar! 🦉`,
  },

  {
    id: 'quest-mushroom-math',
    title: 'Mushroom Multiplication',
    description: 'Help Fungi count his magical mushroom patches!',
    npcName: 'Fungi McSpore',
    npcIntro: `*bounces excitedly*

My mushroom patches are growing so fast! But I need to know exactly how many mushrooms I have.

There are patches and rows and groups... it's all very confusing!

Can you help me multiply it all out?`,
    questionIds: ['mult-004', 'mult-010', 'mult-012', 'mult-014', 'word-008'],
    rewardXp: 150,
    completionMessage: `*bounces with joy*

I know exactly how many mushrooms I have now! 1,247... no wait, that's not right. Hmm...

Just kidding! You've earned 150 XP! The mushrooms thank you! 🍄`,
  },

  {
    id: 'quest-forest-guardian',
    title: 'Trial of the Guardian',
    description: 'Prove your worth to the Forest Guardian!',
    npcName: 'Oakhart',
    npcIntro: `*the ancient tree speaks slowly*

Young one... I am Oakhart, Guardian of this forest for a thousand years.

To pass deeper into the magical woods, you must prove your knowledge. Answer my questions truthfully.

The forest itself watches and judges...`,
    questionIds: ['sub-009', 'sub-012', 'div-011', 'word-010', 'add-017', 'mult-017'],
    rewardXp: 200,
    completionMessage: `*the leaves rustle approvingly*

The forest accepts you. You have shown wisdom beyond your years.

You've earned 200 XP and safe passage through the Enchanted Forest! 🌳`,
  },

  // =====================================================
  // KINGDOM OF NUMBERS QUESTS (World 3)
  // =====================================================

  {
    id: 'quest-royal-vault',
    title: 'The Royal Vault',
    description: 'Help the Royal Accountant count the kingdom\'s treasure!',
    npcName: 'Sir Countsworth',
    npcIntro: `*adjusts monocle*

Ah, a capable young mathematician! Just what we need!

The Royal Vault needs auditing, and the King demands an accurate count of all gold, gems, and treasures!

One mistake and it's the dungeon for me! Will you assist?`,
    questionIds: ['add-011', 'add-014', 'mult-015', 'word-006', 'div-012'],
    rewardXp: 175,
    completionMessage: `*polishes monocle happily*

Splendid! The accounts are balanced to the last gold coin!

The King is most pleased! You've earned 175 XP and royal favor! 👑`,
  },

  {
    id: 'quest-knight-training',
    title: 'Knight Training Academy',
    description: 'Help train the new knights with strategic calculations!',
    npcName: 'Sir Galahad Jr.',
    npcIntro: `*strikes heroic pose*

Greetings, fellow champion of justice!

I'm training to become a knight, but the Academy requires us to master strategic calculations!

How many soldiers? What formations? How much supplies? It's all math!

Train with me, and we'll both grow stronger!`,
    questionIds: ['mult-016', 'mult-18', 'div-10', 'word-012', 'add-018'],
    rewardXp: 150,
    completionMessage: `*raises sword triumphantly*

Victory! Our training is complete!

You've proven yourself a true strategist! 150 XP earned, future knight! ⚔️`,
  },

  {
    id: 'quest-wizard-potions',
    title: 'Potion Proportions',
    description: 'Help Merlin measure the exact amounts for magical potions!',
    npcName: 'Merlin the Magnificent',
    npcIntro: `*strokes long beard*

Ah, a young apprentice with potential! 

Potion-making requires PRECISE measurements! Too much newt, too little frog... disaster!

Help me calculate the exact proportions, and I'll teach you the ways of mathematical magic!`,
    questionIds: ['div-013', 'div-014', 'mult-19', 'word-013', 'sub-13'],
    rewardXp: 175,
    completionMessage: `*waves wand creating sparkles*

The potions are PERFECT! Such precision!

You've earned 175 XP and the Wizard's Approval! ✨🧙‍♂️`,
  },

  {
    id: 'quest-dragon-eggs',
    title: 'Dragon Egg Delivery',
    description: 'Help the Dragon Keeper track and deliver precious eggs!',
    npcName: 'Drake the Keeper',
    npcIntro: `*wipes soot from face*

The royal dragons have laid their eggs, and each one must be accounted for!

These eggs are worth their weight in gold - literally! We can't afford to miscount!

Help me track how many eggs go to each dragon nursery?`,
    questionIds: ['div-007', 'div-15', 'mult-020', 'word-011', 'sub-014'],
    rewardXp: 175,
    completionMessage: `*baby dragon chirps nearby*

Every egg accounted for! The hatchlings will be so happy!

You've earned 175 XP and the gratitude of dragonkind! 🐉`,
  },

  // =====================================================
  // SPACE STATION ALPHA QUESTS (World 4)
  // =====================================================

  {
    id: 'quest-asteroid-count',
    title: 'Asteroid Tracking',
    description: 'Help Commander Nova track dangerous asteroids!',
    npcName: 'Commander Nova',
    npcIntro: `*salutes*

Cadet! We've got a situation!

Our sensors have detected multiple asteroid clusters heading toward the station! 

I need you to calculate their trajectories and quantities. The fate of the station depends on your math skills!`,
    questionIds: ['mult-011', 'mult-015', 'add-019', 'word-014', 'div-009'],
    rewardXp: 200,
    completionMessage: `*removes helmet*

Outstanding work, Cadet! The asteroids have been successfully tracked!

You've earned 200 XP and a Space Medal of Honor! 🚀⭐`,
  },

  {
    id: 'quest-fuel-calculation',
    title: 'Fuel for the Journey',
    description: 'Calculate the exact fuel needed for the space mission!',
    npcName: 'Engineer Spark',
    npcIntro: `*covered in engine grease*

Oh good, you're here! Our ship needs EXACTLY the right amount of fuel!

Too little and we're stranded in space. Too much and we can't lift off!

Every calculation counts - literally! Can you help me figure this out?`,
    questionIds: ['add-020', 'sub-015', 'mult-017', 'div-010', 'word-015'],
    rewardXp: 175,
    completionMessage: `*wipes grease on sleeve*

PERFECT calculations! The fuel levels are exactly right!

You've earned 175 XP and the title of Junior Engineer! 🔧`,
  },

  {
    id: 'quest-alien-decoder',
    title: 'Alien Signal Decoder',
    description: 'Decode the mysterious alien transmission using math!',
    npcName: 'Dr. Cosmos',
    npcIntro: `*adjusts space goggles*

We've received a transmission from an alien civilization!

But their number system is different from ours. We need to decode their message using mathematical patterns!

This could be first contact... no pressure! Will you help decode it?`,
    questionIds: ['mult-013', 'div-011', 'add-016', 'word-009', 'sub-010'],
    rewardXp: 200,
    completionMessage: `*jumps excitedly*

The message is decoded! They're friendly and they love math too!

You've earned 200 XP and made first contact! 👽✨`,
  },

  {
    id: 'quest-gravity-math',
    title: 'Gravity Calculations',
    description: 'Help calibrate the artificial gravity system!',
    npcName: 'Zero-G Zack',
    npcIntro: `*floating upside down*

Whoa! The gravity generator is malfunctioning!

I need someone to help me recalculate the settings. One wrong number and we could all be floating... or pancaked!

Quick, help me solve these equations before I float away!`,
    questionIds: ['div-012', 'div-013', 'mult-018', 'add-012', 'word-010'],
    rewardXp: 175,
    completionMessage: `*feet touch ground*

Gravity restored! I can finally eat soup again!

You've earned 175 XP and the Anti-Gravity Badge! 🏅`,
  },

  // =====================================================
  // UNDERWATER KINGDOM QUESTS (World 5 - Bonus)
  // =====================================================

  {
    id: 'quest-pearl-counting',
    title: 'Pearl of Great Price',
    description: 'Help the Mermaid Princess count her royal pearls!',
    npcName: 'Princess Coral',
    npcIntro: `*swishes tail*

Oh, a surface dweller! How exciting!

I need help counting all the pearls for my coronation crown. There are SO many!

Each one must be perfect and accounted for. Will you help a princess?`,
    questionIds: ['mult-007', 'mult-009', 'add-013', 'word-001', 'div-005'],
    rewardXp: 175,
    completionMessage: `*crown sparkles*

The crown is complete! Every pearl is in its place!

You've earned 175 XP and friendship of the Mer-Royal Family! 👑🧜‍♀️`,
  },

  {
    id: 'quest-treasure-dive',
    title: 'Sunken Treasure',
    description: 'Calculate the value of the ancient sunken treasure!',
    npcName: 'Finn the Explorer',
    npcIntro: `*adjusts diving goggles*

I've found the legendary sunken ship!

But before we can recover the treasure, we need to calculate its weight and value. 

Too heavy for our equipment? We need to know! Can you help with the math?`,
    questionIds: ['add-009', 'mult-012', 'sub-008', 'word-007', 'div-006'],
    rewardXp: 175,
    completionMessage: `*holds up golden chalice*

We did it! The treasure is ours!

You've earned 175 XP and a share of the treasure! 💰🌊`,
  },

  {
    id: 'quest-coral-calculation',
    title: 'Coral Conservation',
    description: 'Help the Sea Scientist protect the coral reef!',
    npcName: 'Dr. Shelley',
    npcIntro: `*takes notes on waterproof clipboard*

The coral reef needs our help!

I need to calculate how many coral fragments to plant, how much they'll grow, and where to place them.

Every number matters for the ocean's health. Will you be my research assistant?`,
    questionIds: ['mult-014', 'add-017', 'div-014', 'word-012', 'sub-012'],
    rewardXp: 200,
    completionMessage: `*adjusts glasses*

The conservation plan is complete! The reef will thrive!

You've earned 200 XP and the Ocean Guardian Badge! 🐠🌊`,
  },

  {
    id: 'quest-whale-song',
    title: 'Whale Song Symphony',
    description: 'Help decode the mathematical patterns in whale songs!',
    npcName: 'Whaley McWhaleface',
    npcIntro: `*sings a low note*

OOOOooooOOOO! (That means hello!)

We whales sing in mathematical patterns! Each note is a number!

I want to teach you our song, but first you must understand our number patterns. Ready to learn?`,
    questionIds: ['mult-016', 'div-015', 'add-018', 'word-014', 'sub-011'],
    rewardXp: 200,
    completionMessage: `*sings joyfully*

OOOOooooOOOO! You've learned our song!

You've earned 200 XP and can now speak Whale! 🐋🎵`,
  },
];

/**
 * Get a quest by its ID
 */
export function getQuestById(id: string): Quest | undefined {
  return quests.find((q) => q.id === id);
}

/**
 * Get all available quests
 */
export function getAllQuests(): Quest[] {
  return quests;
}

/**
 * Get quests that haven't been completed yet
 */
export function getIncompleteQuests(completedQuestIds: string[]): Quest[] {
  return quests.filter((q) => !completedQuestIds.includes(q.id));
}

/**
 * Get quests for a specific world
 */
export function getQuestsByWorld(questIds: string[]): Quest[] {
  return quests.filter((q) => questIds.includes(q.id));
}

/**
 * Get quests for a specific world by world ID
 */
export function getQuestsForWorld(worldId: string): Quest[] {
  const worldQuestMap: Record<string, string[]> = {
    'world-school': ['quest-power-crystals', 'quest-treasure-hunt', 'quest-robot-repair', 'quest-lunch-count'],
    'world-forest': ['quest-fairy-lights', 'quest-owl-wisdom', 'quest-mushroom-math', 'quest-forest-guardian'],
    'world-space': ['quest-asteroid-count', 'quest-fuel-calculation', 'quest-alien-decoder', 'quest-gravity-math'],
    'world-kingdom': ['quest-royal-vault', 'quest-knight-training', 'quest-wizard-potions', 'quest-dragon-eggs'],
    'world-underwater': ['quest-pearl-counting', 'quest-treasure-dive', 'quest-coral-calculation', 'quest-whale-song'],
  };

  const questIds = worldQuestMap[worldId] || worldQuestMap['world-school'];
  return quests.filter((q) => questIds.includes(q.id));
}

/**
 * Get quest completion stats for a world
 */
export function getWorldQuestStats(
  worldQuestIds: string[],
  completedQuestIds: string[]
): { completed: number; total: number } {
  const worldQuests = worldQuestIds;
  const completed = worldQuests.filter((id) => completedQuestIds.includes(id)).length;
  return { completed, total: worldQuests.length };
}

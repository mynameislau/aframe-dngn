# Grid-Based Turn-Based 3D RPG - Design Plan

## Executive Summary

Transform the current aframe-dngn roguelike demo into a complete turn-based grid-based 3D RPG with character progression, tactical combat, inventory management, and procedural dungeon generation.

---

## Current State Analysis

### ✅ Existing Foundation
- **Grid-based movement system** - Player moves on discrete grid cells
- **3D rendering pipeline** - A-Frame with post-processing effects
- **Redux state management** - Centralized game state
- **Basic terrain system** - Walls, floors, pillars, doors
- **Enemy entities** - Foes and worms (currently static)
- **Asset pipeline** - OBJ models and textures
- **Camera controls** - First-person perspective with WASD

### 🔴 Missing Core RPG Features
- Turn-based combat mechanics
- Character stats and progression
- Enemy AI and behavior patterns
- Inventory and equipment system
- Skills/abilities system
- Procedural dungeon generation
- Quest/objective framework
- Save/load functionality
- UI for stats, inventory, combat

---

## Phase 1: Core Turn-Based Mechanics

### 1.1 Turn System Architecture

**Goal:** Implement strict turn-based gameplay where player and enemies alternate actions.

**Implementation:**
```javascript
// Redux state additions
{
  turnSystem: {
    currentTurn: 'player' | 'enemy',
    turnNumber: number,
    actionsQueue: Action[],
    turnHistory: TurnRecord[]
  }
}
```

**Features:**
- **Turn manager** - Controls whose turn it is
- **Action system** - Move, attack, use item, skip turn, etc.
- **Turn queue** - Handle multiple enemies taking turns
- **Animation delays** - Wait for animations to complete before next turn
- **Turn counter** - Track game progression

**Files to create:**
- `/src/js/systems/turn-system.js` - Turn management logic
- `/src/js/redux/turn/` - Turn-related actions and reducers
- `/src/js/components/TurnIndicator.jsx` - UI showing current turn

---

### 1.2 Combat System

**Goal:** Implement tactical turn-based combat with positioning, line-of-sight, and attack types.

**Core Mechanics:**
- **Melee combat** - Adjacent cell attacks
- **Ranged combat** - Line-of-sight projectile attacks
- **Area effects** - Multi-cell damage/effects
- **Backstab/flanking** - Positional bonuses
- **Critical hits** - RNG-based damage multipliers
- **Status effects** - Poison, stun, slow, etc.

**Combat Flow:**
```
1. Player selects action (move/attack/item/skill)
2. Validate action (range, resources, etc.)
3. Execute action with animations
4. Calculate damage/effects
5. Update state (HP, status effects)
6. Check for death/victory
7. Switch to enemy turn
8. Enemies perform AI actions
9. Return to player turn
```

**Redux state additions:**
```javascript
{
  combat: {
    inCombat: boolean,
    combatLog: LogEntry[],
    targetedEnemy: EntityId | null,
    activeEffects: StatusEffect[]
  }
}
```

**Files to create:**
- `/src/js/systems/combat-system.js` - Combat calculations
- `/src/js/systems/damage-calculator.js` - Damage formulas
- `/src/js/systems/status-effects.js` - Status effect management
- `/src/js/components/CombatLog.jsx` - Combat message display
- `/src/js/components/HealthBar.jsx` - 3D health bars above entities

---

## Phase 2: Character System

### 2.1 Character Stats & Progression

**Goal:** Implement RPG character stats, leveling, and progression systems.

**Core Stats:**
```javascript
{
  character: {
    // Base attributes
    level: number,
    experience: number,
    experienceToNext: number,

    // Primary stats
    strength: number,      // Melee damage, carry capacity
    dexterity: number,     // Accuracy, evasion, initiative
    constitution: number,  // Max HP, HP regen
    intelligence: number,  // Magic damage, mana
    wisdom: number,        // Magic defense, mana regen

    // Derived stats
    maxHP: number,
    currentHP: number,
    maxMana: number,
    currentMana: number,
    armor: number,
    attackPower: number,
    magicPower: number,
    initiative: number,
    evasion: number,
    critChance: number,

    // Progression
    statPoints: number,    // Unspent points
    skillPoints: number    // Unspent skill points
  }
}
```

**Progression System:**
- **Experience gain** - From defeating enemies
- **Level up** - Gain stat points and skill points
- **Stat allocation** - Player chooses stat increases
- **Milestone abilities** - Unlock skills at specific levels

**Files to create:**
- `/src/js/systems/character-system.js` - Character management
- `/src/js/systems/experience-calculator.js` - XP formulas
- `/src/js/systems/stat-calculator.js` - Derived stat calculations
- `/src/js/components/CharacterSheet.jsx` - Stats UI overlay
- `/src/js/components/LevelUpModal.jsx` - Level up interface

---

### 2.2 Skills & Abilities System

**Goal:** Implement active and passive abilities that expand tactical options.

**Skill Categories:**
- **Combat Skills** - Special attacks, combos
- **Magic Spells** - Elemental damage, healing, buffs
- **Passive Abilities** - Permanent bonuses
- **Movement Skills** - Dash, teleport, leap

**Skill Structure:**
```javascript
{
  id: string,
  name: string,
  description: string,
  type: 'active' | 'passive',
  cost: { mana?: number, stamina?: number },
  cooldown: number,
  range: number,
  areaOfEffect: number,
  targetType: 'self' | 'enemy' | 'ally' | 'ground',
  effect: EffectDefinition,
  requirements: { level: number, stats: {} }
}
```

**Example Skills:**
- **Fireball** - Ranged AoE magic damage
- **Power Strike** - High damage melee attack
- **Heal** - Restore HP
- **Shield Block** - Reduce incoming damage
- **Blink** - Teleport to target cell

**Files to create:**
- `/src/js/systems/skill-system.js` - Skill execution logic
- `/src/js/data/skills/` - Skill definitions
- `/src/js/components/SkillBar.jsx` - Hotbar for skills
- `/src/js/components/SkillTree.jsx` - Skill unlock interface

---

## Phase 3: Inventory & Equipment

### 3.1 Inventory System

**Goal:** Implement item management with equipment, consumables, and loot.

**Inventory Structure:**
```javascript
{
  inventory: {
    items: Item[],           // All carried items
    maxSlots: number,
    gold: number,

    equipped: {
      weapon: Item | null,
      armor: Item | null,
      helmet: Item | null,
      boots: Item | null,
      accessory1: Item | null,
      accessory2: Item | null
    },

    quickSlots: [Item, Item, Item, Item] // Hotkeyed items
  }
}
```

**Item Types:**
- **Weapons** - Swords, axes, bows, staffs
- **Armor** - Chest, helmet, boots, shields
- **Consumables** - Potions, scrolls, food
- **Quest Items** - Special items for objectives
- **Crafting Materials** - Resources for upgrades

**Item Properties:**
```javascript
{
  id: string,
  name: string,
  description: string,
  type: 'weapon' | 'armor' | 'consumable' | 'quest' | 'material',
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary',

  // For equipment
  stats: {
    attack?: number,
    defense?: number,
    magicPower?: number,
    // ... other bonuses
  },

  // For consumables
  effects: Effect[],

  stackable: boolean,
  maxStack: number,
  value: number,         // Gold value
  weight: number,

  // 3D representation
  modelSrc: string,
  textureSrc: string
}
```

**Files to create:**
- `/src/js/systems/inventory-system.js` - Inventory management
- `/src/js/systems/equipment-system.js` - Equipment bonuses
- `/src/js/systems/loot-system.js` - Loot generation
- `/src/js/data/items/` - Item definitions
- `/src/js/components/InventoryUI.jsx` - Inventory interface
- `/src/js/components/LootPickup.jsx` - 3D loot entities

---

### 3.2 Crafting & Upgrades

**Goal:** Allow players to improve equipment and create items.

**Crafting System:**
- **Recipes** - Combine materials to create items
- **Weapon upgrades** - Enhance damage/effects
- **Armor upgrades** - Improve defense
- **Enchanting** - Add magical properties
- **Potion brewing** - Create consumables

**Files to create:**
- `/src/js/systems/crafting-system.js` - Crafting logic
- `/src/js/data/recipes.js` - Recipe definitions
- `/src/js/components/CraftingUI.jsx` - Crafting interface

---

## Phase 4: Enemy AI & Behavior

### 4.1 Enemy System

**Goal:** Create diverse enemies with unique behaviors and stats.

**Enemy Structure:**
```javascript
{
  id: string,
  type: 'foe' | 'worm' | 'skeleton' | 'goblin' | 'boss',

  // Stats
  level: number,
  hp: number,
  maxHP: number,
  attack: number,
  defense: number,

  // AI behavior
  aiType: 'aggressive' | 'defensive' | 'ranged' | 'patrol' | 'boss',
  aggroRange: number,
  attackRange: number,

  // Loot
  lootTable: LootEntry[],
  experienceReward: number,

  // Visual
  position: {x, y},
  modelSrc: string,
  scale: number,
  color: string
}
```

**AI Behaviors:**
- **Aggressive** - Chase and attack player on sight
- **Defensive** - Guard area, attack when approached
- **Ranged** - Keep distance, shoot projectiles
- **Patrol** - Follow path, attack when provoked
- **Boss** - Multi-phase complex behavior

**Files to create:**
- `/src/js/systems/enemy-ai.js` - AI decision making
- `/src/js/systems/pathfinding.js` - A* pathfinding
- `/src/js/data/enemies/` - Enemy definitions
- `/src/js/components/Enemy.jsx` - Enhanced enemy component

---

### 4.2 Enemy Spawning & Encounters

**Goal:** Dynamic enemy placement and encounter management.

**Spawn System:**
- **Room-based spawning** - Enemies spawn when entering rooms
- **Wave spawning** - Multiple waves of enemies
- **Boss encounters** - Special arena-style fights
- **Random encounters** - Chance-based spawns while exploring

**Files to create:**
- `/src/js/systems/spawn-system.js` - Enemy spawning logic
- `/src/js/systems/encounter-manager.js` - Encounter orchestration

---

## Phase 5: Procedural Dungeon Generation

### 5.1 Advanced Dungeon Generation

**Goal:** Generate varied, interesting dungeons procedurally.

**Current:** Static text-based `.dmap` files
**Target:** Procedural generation with BSP or cellular automata

**Generation Algorithms:**
- **BSP (Binary Space Partitioning)** - Create rooms and corridors
- **Cellular Automata** - Organic cave-like dungeons
- **Prefab Rooms** - Hand-crafted room templates
- **Hybrid Approach** - Combine algorithms for variety

**Dungeon Features:**
- **Multiple floors** - Stairs up/down
- **Room types** - Combat, treasure, puzzle, safe room, boss
- **Secret rooms** - Hidden areas with rewards
- **Traps** - Damage or status effects
- **Environmental hazards** - Lava, spikes, pits

**Redux state additions:**
```javascript
{
  dungeon: {
    currentFloor: number,
    maxFloor: number,
    seed: string,           // For reproducible dungeons
    roomMap: Room[],
    exploredCells: boolean[][],
    fogOfWar: boolean
  }
}
```

**Files to create:**
- `/src/js/systems/dungeon-generator.js` - Generation algorithms
- `/src/js/systems/bsp-generator.js` - BSP implementation
- `/src/js/systems/cellular-automata.js` - Cave generation
- `/src/js/data/room-templates/` - Prefab room definitions
- `/src/js/components/Stairs.jsx` - Stairway entities
- `/src/js/components/Trap.jsx` - Trap entities

---

### 5.2 Fog of War & Exploration

**Goal:** Implement exploration mechanics with visibility system.

**Features:**
- **Line-of-sight** - Only see what's visible from current position
- **Fog of war** - Previously explored areas shown dimly
- **Unexplored areas** - Hidden until discovered
- **Light sources** - Torches, spells increase visibility

**Files to create:**
- `/src/js/systems/visibility-system.js` - LOS calculations
- `/src/js/systems/fog-of-war.js` - Fog management
- `/src/js/components/FogCell.jsx` - Visual fog overlay

---

## Phase 6: UI & UX Enhancements

### 6.1 HUD & Interface

**Goal:** Create comprehensive UI for all game systems.

**HUD Elements:**
- **Health/Mana bars** - Top left corner
- **Mini-map** - Top right corner showing explored area
- **Skill hotbar** - Bottom center with cooldowns
- **Quick inventory** - Bottom right for consumables
- **Turn indicator** - Center top showing whose turn
- **Combat log** - Left side scrolling messages
- **Target info** - Enemy health and name when targeted

**Modal Interfaces:**
- **Character sheet** - Full stats and equipment
- **Inventory** - Grid-based item management
- **Skill tree** - Unlock and upgrade abilities
- **Crafting** - Recipe selection and crafting
- **Map** - Full dungeon overview
- **Settings** - Graphics, controls, audio

**Files to create:**
- `/src/js/components/HUD/` - All HUD components
- `/src/js/components/Modals/` - All modal interfaces
- `/src/js/components/MiniMap.jsx` - Mini-map display
- `/src/css/ui.css` - UI styling

---

### 6.2 Visual Feedback & Animations

**Goal:** Enhance game feel with visual effects and animations.

**Animations:**
- **Movement** - Smooth grid-to-grid transitions
- **Combat** - Attack animations, hit effects
- **Damage numbers** - Floating damage text in 3D space
- **Status effects** - Visual indicators (poison glow, stun stars)
- **Item pickups** - Loot pop-up animations
- **Level up** - Celebratory particle effects

**Particle Effects:**
- **Blood splatter** - On successful hit
- **Magic effects** - Spell casting visuals
- **Environmental** - Torches, ambient particles
- **Death effects** - Enemy dissolve/disappear

**Files to create:**
- `/src/js/ecs/animation-system.js` - Animation management
- `/src/js/ecs/particle-system.js` - Particle effects
- `/src/js/components/DamageNumber.jsx` - 3D damage text
- `/src/js/components/StatusIcon.jsx` - Status effect icons

---

## Phase 7: Quests & Objectives

### 7.1 Quest System

**Goal:** Implement quest tracking and objectives.

**Quest Structure:**
```javascript
{
  id: string,
  title: string,
  description: string,
  questGiver: string | null,

  objectives: [
    {
      id: string,
      description: string,
      type: 'kill' | 'collect' | 'explore' | 'interact',
      target: string,
      current: number,
      required: number,
      completed: boolean
    }
  ],

  rewards: {
    experience: number,
    gold: number,
    items: Item[]
  },

  status: 'available' | 'active' | 'completed' | 'failed'
}
```

**Quest Types:**
- **Main quest** - Story progression
- **Side quests** - Optional objectives
- **Bounties** - Kill specific enemies
- **Collection** - Gather items
- **Exploration** - Reach certain floors/areas

**Files to create:**
- `/src/js/systems/quest-system.js` - Quest management
- `/src/js/data/quests/` - Quest definitions
- `/src/js/components/QuestLog.jsx` - Quest UI
- `/src/js/components/QuestTracker.jsx` - Active quest display

---

## Phase 8: Persistence & Meta-Progression

### 8.1 Save/Load System

**Goal:** Allow players to save and load game progress.

**Save Data:**
```javascript
{
  version: string,
  timestamp: number,
  playtime: number,

  character: CharacterState,
  inventory: InventoryState,
  dungeon: DungeonState,
  quests: QuestState,
  turnSystem: TurnState,

  metadata: {
    saveSlot: number,
    characterName: string,
    level: number,
    currentFloor: number
  }
}
```

**Features:**
- **Multiple save slots** - 3-5 different saves
- **Auto-save** - Save on floor transition, after combat
- **Manual save** - Save anywhere (or only in safe rooms)
- **Cloud save** - Optional online backup

**Files to create:**
- `/src/js/systems/save-system.js` - Save/load logic
- `/src/js/utils/serialization.js` - State serialization
- `/src/js/components/SaveMenu.jsx` - Save/load interface

---

### 8.2 Meta-Progression

**Goal:** Unlock persistent benefits across runs.

**Meta-Progression Features:**
- **Achievements** - Unlock titles, cosmetics
- **Unlockable classes** - New playstyles
- **Permanent upgrades** - Small bonuses (find in runs)
- **Bestiary** - Track defeated enemy types
- **Item codex** - Record found items

**Files to create:**
- `/src/js/systems/meta-progression.js` - Meta-progression tracking
- `/src/js/data/achievements.js` - Achievement definitions
- `/src/js/components/AchievementToast.jsx` - Achievement notifications

---

## Phase 9: Audio & Polish

### 9.1 Audio System

**Goal:** Add sound effects and music.

**Audio Elements:**
- **Combat sounds** - Sword swing, magic cast, hit sounds
- **Ambient sounds** - Dungeon atmosphere, torch crackle
- **UI sounds** - Button clicks, menu navigation
- **Music** - Background music per floor/encounter type
- **Footsteps** - Walking on different terrain

**Files to create:**
- `/src/js/systems/audio-system.js` - Audio management
- `/src/data/audio/` - Sound files
- `/src/js/components/AudioManager.jsx` - Audio component

---

### 9.2 Polish & Quality of Life

**QoL Features:**
- **Control options** - Mouse + keyboard, gamepad support
- **Camera angles** - Multiple view modes
- **Colorblind modes** - Accessibility options
- **Tutorial** - First-time player guidance
- **Tooltips** - Hover info for items, skills, enemies
- **Difficulty settings** - Easy, normal, hard modes
- **Speed settings** - Animation speed control

---

## Implementation Roadmap

### Sprint 1 (Foundation) - 2-3 weeks
- [ ] Turn-based system architecture
- [ ] Basic combat mechanics
- [ ] Character stats system
- [ ] Enemy AI framework
- [ ] Enhanced Redux structure

### Sprint 2 (Core Gameplay) - 2-3 weeks
- [ ] Inventory system
- [ ] Equipment and items
- [ ] Skills and abilities
- [ ] Enemy variety (5+ enemy types)
- [ ] Combat balancing

### Sprint 3 (Generation & Exploration) - 2-3 weeks
- [ ] Procedural dungeon generation
- [ ] Multiple floors
- [ ] Fog of war
- [ ] Traps and hazards
- [ ] Loot system

### Sprint 4 (UI & Polish) - 2-3 weeks
- [ ] Complete HUD
- [ ] All modal interfaces
- [ ] Animations and effects
- [ ] Visual feedback
- [ ] Audio integration

### Sprint 5 (Systems & Content) - 2-3 weeks
- [ ] Quest system
- [ ] Save/load functionality
- [ ] Meta-progression
- [ ] Boss encounters
- [ ] Balancing and tuning

### Sprint 6 (Polish & Release) - 1-2 weeks
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Tutorial and onboarding
- [ ] Final content pass
- [ ] Release preparation

---

## Technical Architecture Changes

### Redux State Structure (New)
```javascript
{
  // Existing
  geo: { terrain, playerPos },

  // New
  turnSystem: { currentTurn, turnNumber, actionsQueue },
  character: { stats, skills, progression },
  inventory: { items, equipped, quickSlots, gold },
  enemies: { entities: {}, turnOrder: [] },
  combat: { inCombat, log, effects },
  dungeon: { floor, seed, rooms, explored, fogOfWar },
  quests: { active, completed, available },
  ui: { activeModal, notifications, settings },
  meta: { achievements, unlocks, statistics },
  audio: { musicVolume, sfxVolume, enabled }
}
```

### New Directory Structure
```
/src/js/
├── components/       (React/A-Frame components)
│   ├── entities/    (3D game objects)
│   ├── ui/          (HUD and interface)
│   └── modals/      (Full-screen overlays)
├── systems/         (Game logic systems)
├── ecs/             (A-Frame components/systems)
├── redux/           (State management)
│   ├── actions/
│   ├── reducers/
│   └── selectors/
├── data/            (Game content definitions)
│   ├── items/
│   ├── enemies/
│   ├── skills/
│   ├── quests/
│   └── rooms/
├── utils/           (Utility functions)
└── graph/           (Pathfinding, algorithms)
```

---

## Performance Considerations

### Optimization Strategies
1. **Entity pooling** - Reuse enemy/effect entities
2. **LOD system** - Lower detail for distant objects
3. **Culling** - Don't render off-screen entities
4. **Lazy loading** - Load floor assets on-demand
5. **State memoization** - Use reselect for derived state
6. **Animation throttling** - Reduce particles on low-end devices

### Target Performance
- **60 FPS** on desktop (modern browsers)
- **30 FPS** on mobile/VR
- **< 3s** initial load time
- **< 100ms** turn execution time

---

## Testing Strategy

### Unit Tests
- Combat calculations
- Stat formulas
- AI decision making
- Dungeon generation
- Inventory management

### Integration Tests
- Turn system flow
- Combat sequences
- Save/load roundtrip
- Quest completion

### Playtesting Focus
- Combat balance
- Progression pacing
- Difficulty curve
- UX/UI usability

---

## Success Metrics

### Core Gameplay
- ✅ Turn-based combat feels tactical and engaging
- ✅ Character progression is rewarding
- ✅ Enemy variety provides different challenges
- ✅ Dungeon exploration is compelling

### Technical
- ✅ 60 FPS on target hardware
- ✅ No major bugs
- ✅ Save/load works reliably
- ✅ Cross-browser compatibility

### Player Experience
- ✅ Tutorial teaches core mechanics
- ✅ UI is intuitive
- ✅ Difficulty is balanced
- ✅ Game loop is addictive

---

## Future Enhancements (Post-MVP)

- **Multiplayer** - Co-op dungeon runs
- **Character classes** - Warrior, Mage, Rogue, etc.
- **Pet system** - Companions that assist in combat
- **Crafting stations** - Specialized crafting areas
- **Town hub** - Safe area with NPCs and shops
- **Story mode** - Narrative campaign
- **Endless mode** - Procedural infinite dungeon
- **Daily challenges** - Special dungeon runs
- **Leaderboards** - Compete for high scores

---

## Conclusion

This plan transforms the current roguelike demo into a fully-featured turn-based grid-based 3D RPG. The phased approach allows for iterative development and testing, while the modular architecture ensures maintainability and extensibility.

**Estimated Total Development Time:** 12-16 weeks for MVP
**Team Size:** 1-2 developers
**Tech Stack:** A-Frame, React, Redux, Three.js, Webpack, Vitest

The foundation is already solid - this plan builds upon existing systems while adding the depth and complexity expected of a modern indie RPG.

# Game Design Document: Grid Dungeon RPG (Lean MVP)

**Version:** 1.0
**Date:** 2026-01-13
**Project:** aframe-dngn Turn-Based RPG
**Target Platform:** Web (Desktop browsers, VR-compatible)
**Engine:** A-Frame 1.6.0 + React + Redux
**Development Time:** 1-2 weeks

---

## Table of Contents

1. [Game Overview](#1-game-overview)
2. [Core Gameplay](#2-core-gameplay)
3. [Game Flow](#3-game-flow)
4. [Combat System](#4-combat-system)
5. [Character System](#5-character-system)
6. [Enemy Design](#6-enemy-design)
7. [Level Design](#7-level-design)
8. [User Interface](#8-user-interface)
9. [Controls](#9-controls)
10. [Audio](#10-audio)
11. [Technical Specifications](#11-technical-specifications)
12. [Balance & Tuning](#12-balance--tuning)
13. [Success Metrics](#13-success-metrics)

---

## 1. Game Overview

### 1.1 Concept

**Grid Dungeon RPG** is a turn-based tactical dungeon crawler played from a first-person perspective in 3D. Players navigate a grid-based dungeon, engage in strategic turn-based combat with enemies, gain experience to level up, and ultimately defeat a powerful boss to win.

### 1.2 Genre

- **Primary:** Turn-Based Tactical RPG
- **Secondary:** Dungeon Crawler, First-Person
- **Sub-Genre:** Grid-Based Strategy

### 1.3 Target Audience

- **Primary:** PC gamers who enjoy tactical combat and dungeon crawlers
- **Secondary:** Fans of classic roguelikes and grid-based RPGs
- **Age Rating:** Everyone 10+ (E10+)

### 1.4 Unique Selling Points

1. **3D First-Person Turn-Based Combat** - Rare combination of FPS perspective with tactical turn-based gameplay
2. **VR-Ready** - Built on A-Frame, playable in both desktop and VR modes
3. **Tight, Focused Experience** - Complete game loop in 3-5 minutes
4. **Pure Strategy** - No twitch reflexes, only tactical decision-making

### 1.5 Core Pillars

1. **Strategic Positioning** - Where you stand matters
2. **Risk vs Reward** - Push forward or play safe?
3. **Clear Feedback** - Always understand what happened and why
4. **Fair Challenge** - Difficult but never unfair

### 1.6 Inspiration

- **Dungeon Crawlers:** Eye of the Beholder, Legend of Grimrock
- **Turn-Based Tactics:** Into the Breach, XCOM
- **Traditional Roguelikes:** NetHack, Dungeon Crawl Stone Soup
- **Grid RPGs:** Final Fantasy Tactics, Fire Emblem

---

## 2. Core Gameplay

### 2.1 Core Loop

```
Explore → Encounter → Combat → Victory → Progress → Repeat
    ↓         ↓          ↓         ↓         ↓
  Move    Engage    Tactics   Loot XP   Level Up
```

**Session Duration:** 3-5 minutes for full playthrough

### 2.2 Game Objective

**Primary Goal:** Navigate the dungeon and defeat the boss enemy

**Secondary Goals:**
- Defeat all enemies (optional for higher XP)
- Minimize damage taken (player skill expression)
- Reach maximum level (exploration reward)

### 2.3 Core Mechanics

#### Movement
- **Grid-Based:** Player occupies one cell at a time
- **Turn Cost:** Moving costs one turn
- **Cardinal Directions:** Move N, E, S, W (no diagonal movement)
- **Obstacles:** Cannot move through walls, pillars, or enemies
- **Doors:** Passable like floor tiles

#### Combat
- **Melee Attack:** Attack adjacent enemy (costs one turn)
- **Ranged Attack:** Not available to player in MVP
- **Damage Calculation:** `Damage = max(1, Attacker.Attack - Defender.Defense)`
- **Death:** Entity dies when HP ≤ 0

#### Progression
- **Experience Gain:** Kill enemy → gain XP equal to enemy's XP reward
- **Level Up:** When XP ≥ XP threshold, level increases
- **Stat Growth:** Automatic stat increases on level up
- **Healing:** Full HP restore on level up

### 2.4 Turn Structure

**Player Turn:**
1. Player can take ONE action:
   - Move to adjacent cell, OR
   - Attack adjacent enemy
2. Action executes immediately
3. Turn switches to enemies

**Enemy Turn:**
1. All enemies execute their AI in sequence
2. Each enemy takes ONE action (move or attack)
3. Turn switches back to player

**Turn Counter:** Increments after all entities have acted

### 2.5 Win/Lose Conditions

**Victory Conditions:**
- Defeat the boss enemy
- Victory screen displays

**Defeat Conditions:**
- Player HP reaches 0
- Game over screen displays
- Refresh page to restart

---

## 3. Game Flow

### 3.1 Game States

```
Main Menu (Future)
      ↓
   Gameplay ←→ Paused (Future)
      ↓
  Victory / Game Over
      ↓
   Restart
```

**MVP Note:** No main menu or pause in MVP. Game starts immediately on page load.

### 3.2 Gameplay State Machine

```
PLAYER_TURN:
  - Wait for player input
  - On valid action → execute → ENEMY_TURN

ENEMY_TURN:
  - Execute all enemy AIs
  - Check for game over conditions
  - → PLAYER_TURN or GAME_OVER or VICTORY

GAME_OVER:
  - Display game over screen
  - Wait for restart

VICTORY:
  - Display victory screen
  - Wait for restart
```

### 3.3 Session Flow

**Ideal 5-Minute Session:**

| Time | Event |
|------|-------|
| 0:00 | Game loads, player spawns |
| 0:10 | First movement, exploring |
| 0:30 | First enemy encounter |
| 1:00 | First kill, gain XP |
| 1:30 | Second enemy fight |
| 2:00 | Level up to Level 2 |
| 2:30 | Fighting through dungeon |
| 3:00 | Multiple enemies, tactical combat |
| 3:30 | Level up to Level 3 |
| 4:00 | Reach boss room |
| 4:30 | Boss fight begins |
| 5:00 | Boss defeated, victory! |

---

## 4. Combat System

### 4.1 Combat Overview

**Type:** Turn-Based Tactical
**Perspective:** First-Person
**Scope:** Single target, melee only (MVP)

### 4.2 Player Combat

#### Available Actions
1. **Melee Attack**
   - **Targeting:** Click on adjacent enemy
   - **Range:** 1 cell (adjacent only)
   - **Cost:** 1 turn
   - **Effect:** Deal damage to target

2. **Move** (Tactical Retreat)
   - **Use Case:** Move away from dangerous position
   - **Cost:** 1 turn
   - **Strategic Value:** Reposition for better combat

#### Combat Calculation

```javascript
// Basic damage formula
baseDamage = attacker.attack - defender.defense
finalDamage = Math.max(1, baseDamage) // Minimum 1 damage

// Apply damage
defender.hp -= finalDamage

// Check death
if (defender.hp <= 0) {
  kill(defender)
}
```

#### No Randomness (MVP)
- Damage is deterministic
- Players can calculate exact outcomes
- Promotes strategic planning over luck

**Future Consideration:** Add critical hits (5-10% chance for 2x damage) in post-MVP

### 4.3 Enemy Combat

Enemies use AI to determine actions:

#### Melee Enemy AI
```
IF player is adjacent:
  Attack player
ELSE:
  Move one cell toward player
```

#### Ranged Enemy AI
```
IF player within 3 cells AND line-of-sight:
  Attack player (ranged)
ELSE IF player further than 3 cells:
  Move toward player
ELSE:
  Move to get line-of-sight
```

### 4.4 Combat Feedback

**Visual Feedback:**
- Health bars above all entities
- Damage numbers appear above damaged entity (future)
- Hit flash effect (future)
- Death animation (entity fades/disappears)

**Text Feedback:**
- Combat log shows all actions
- Example: "You hit Goblin for 5 damage"
- Example: "Goblin attacks you for 3 damage"
- Example: "Goblin defeated! +25 XP"

### 4.5 Combat Pacing

- **No Animation Delays (MVP):** Actions are instant
- **Turn Indicator:** Clear visual for whose turn it is
- **Future:** Add 0.3-0.5s animations for better game feel

---

## 5. Character System

### 5.1 Player Character

**Identity:** Generic adventurer (no class system in MVP)

**Starting Stats:**
```javascript
{
  level: 1,
  hp: 100,
  maxHP: 100,
  attack: 10,
  defense: 5,
  xp: 0,
  xpToNext: 100
}
```

### 5.2 Stats Explained

| Stat | Description | Effect |
|------|-------------|--------|
| **HP** | Health Points | Current health, die at 0 |
| **Max HP** | Maximum Health | HP cannot exceed this |
| **Attack** | Attack Power | Damage dealt in combat |
| **Defense** | Defense Power | Reduces incoming damage |
| **Level** | Character Level | Overall power indicator |
| **XP** | Experience Points | Progress toward next level |
| **XP to Next** | XP Threshold | XP needed for next level |

### 5.3 Progression

#### Experience Gain
- Defeating enemy grants XP equal to enemy's `xpReward`
- XP accumulates across the session
- No XP loss on taking damage

#### Level Up Mechanics

**Trigger:** XP ≥ XP to Next Level

**Effects:**
1. Level increases by 1
2. Max HP increases by +10
3. Current HP fully restored (heal to full)
4. Attack increases by +2
5. Defense increases by +1
6. XP to Next Level recalculated

**XP Scaling:**
```javascript
xpToNext = level * 100

// Examples:
// Level 1 → 2: 100 XP
// Level 2 → 3: 200 XP
// Level 3 → 4: 300 XP
```

**Stat Growth Table:**

| Level | HP | Attack | Defense | XP Required (Cumulative) |
|-------|-------|--------|---------|--------------------------|
| 1 | 100 | 10 | 5 | 0 |
| 2 | 110 | 12 | 6 | 100 |
| 3 | 120 | 14 | 7 | 300 |
| 4 | 130 | 16 | 8 | 600 |
| 5 | 140 | 18 | 9 | 1000 |

### 5.4 No Customization (MVP)

- **No Stat Allocation:** Stats increase automatically
- **No Class Choice:** Single character type
- **No Skills:** Only basic attack
- **No Equipment:** No items to equip

**Rationale:** Keeps scope minimal, focuses on core combat loop

**Future:** Add skill points, equipment, class choice in v1.1+

---

## 6. Enemy Design

### 6.1 Enemy Types

**Total Enemy Types:** 3

#### Type 1: Goblin (Melee)
```javascript
{
  name: "Goblin",
  symbol: "F", // "Foe" in .dmap
  model: "foe.obj",

  stats: {
    hp: 20,
    maxHP: 20,
    attack: 8,
    defense: 2,
    xpReward: 25
  },

  ai: "melee",
  description: "Weak melee enemy, rushes player"
}
```

**Behavior:** Moves toward player, attacks when adjacent

**Strategy to Counter:** Engage early, defeat before taking too much damage

---

#### Type 2: Worm (Ranged)
```javascript
{
  name: "Worm",
  symbol: "W",
  model: "worm.obj",

  stats: {
    hp: 15,
    maxHP: 15,
    attack: 6,
    defense: 1,
    xpReward: 20
  },

  ai: "ranged",
  attackRange: 3,
  description: "Ranged enemy, keeps distance"
}
```

**Behavior:** Shoots from 3 cells away, retreats if player gets too close

**Strategy to Counter:** Close distance quickly to force retreat

---

#### Type 3: Boss (Elite Melee)
```javascript
{
  name: "Dungeon Lord",
  symbol: "BOSS",
  model: "foe.obj", // Reuse, but scaled larger
  scale: 2,

  stats: {
    hp: 100,
    maxHP: 100,
    attack: 15,
    defense: 5,
    xpReward: 200
  },

  ai: "melee",
  description: "Powerful boss, final challenge"
}
```

**Behavior:** Same as melee, but much tougher stats

**Strategy to Counter:** Must be high level (3-4) to survive

---

### 6.2 Enemy Placement

**Philosophy:** Hand-placed for balanced difficulty curve

**Dungeon Sections:**

1. **Entry Area** (Safe)
   - No enemies
   - Tutorial space
   - Player learns movement

2. **Early Encounters** (Easy)
   - 1-2 Goblins
   - Low risk, learn combat

3. **Mid Dungeon** (Medium)
   - 2-3 Goblins
   - 1-2 Worms
   - Mixed enemy types, tactical positioning

4. **Pre-Boss Corridor** (Hard)
   - 3 Goblins + 2 Worms
   - Gauntlet before boss
   - Opportunity to level up

5. **Boss Room** (Very Hard)
   - 1 Boss
   - Large arena
   - Final challenge

**Total Enemy Count:** 10-12 enemies + 1 boss

### 6.3 Enemy Spawn

**Method:** Static placement in `.dmap` file

**No Dynamic Spawning:** All enemies present at game start

**Persistence:** Dead enemies do not respawn

---

## 7. Level Design

### 7.1 Dungeon Overview

**Name:** The Crimson Crypt (placeholder)

**Size:** ~25x25 grid cells

**Theme:** Dark stone dungeon with pillars and corridors

**Layout Type:** Hand-crafted (no procedural generation in MVP)

### 7.2 Dungeon Map

```
BBBBBBBBBBBBBBBBBBBBBBBBB
B.......................B
B..F.........B........W.B
B............B..........B
B............D..........B
B..P.........B..........B
B............B........P.B
BBBBBBB.BBBBBB..BBBBBBBBB
B...............................B
B....F.............W........B
B...........................B
B.............@.............B
B...........................B
B....W.............F........B
B...........................B
BBBBBBBBBBB.BBBBBBBBBBBBBBBB
B............D..............B
B.........F.....F...........B
B...........................B
B.........P.BOSS.P..........B
B...........................B
B...........................B
BBBBBBBBBBBBBBBBBBBBBBBBBBB

Legend:
B = Wall (impassable)
. = Floor (walkable)
@ = Player start position
F = Goblin (Foe)
W = Worm
P = Pillar (impassable obstacle)
D = Door (walkable)
BOSS = Dungeon Lord (boss enemy)
```

### 7.3 Level Flow

**Section 1: Entry Hall**
- **Cells:** 0-5 from spawn
- **Enemies:** 0
- **Purpose:** Safe area, learn movement controls

**Section 2: First Encounter**
- **Cells:** 6-10 from spawn
- **Enemies:** 1 Goblin
- **Purpose:** First combat tutorial

**Section 3: Western Wing**
- **Cells:** Left side of map
- **Enemies:** 2 Goblins, 1 Worm
- **Purpose:** Learn enemy variety

**Section 4: Eastern Corridor**
- **Cells:** Right side of map
- **Enemies:** 1 Goblin, 2 Worms
- **Purpose:** Tactical positioning practice

**Section 5: Central Chamber**
- **Cells:** Middle section
- **Enemies:** Mixed
- **Purpose:** Preparation before boss

**Section 6: Boss Chamber**
- **Cells:** Bottom of map
- **Enemies:** Boss + 2 Goblins
- **Purpose:** Final challenge

### 7.4 Environmental Elements

#### Walls
- **Visual:** Stone texture
- **Gameplay:** Impassable terrain
- **Purpose:** Define corridors and rooms

#### Pillars
- **Visual:** 3D stone columns
- **Gameplay:** Impassable obstacles
- **Purpose:** Create tactical chokepoints

#### Doors
- **Visual:** Wooden door models
- **Gameplay:** Passable (no open/close in MVP)
- **Purpose:** Visual room separation

#### Floor
- **Visual:** Stone tile texture
- **Gameplay:** Walkable terrain
- **Purpose:** Movement area

#### Ceiling
- **Visual:** Slime/stone texture
- **Gameplay:** Visual only
- **Purpose:** Atmosphere

### 7.5 No Fog of War (MVP)

**All dungeon visible from start**

**Rationale:**
- Simpler implementation
- Focus on combat, not exploration
- Player can plan route

**Future (v1.4):** Add fog of war for exploration gameplay

---

## 8. User Interface

### 8.1 UI Philosophy

- **Minimal and Clear:** Only show essential information
- **Non-Intrusive:** Don't block 3D view
- **Readable:** Large text, high contrast
- **Persistent HUD:** Always visible

### 8.2 HUD Layout

```
┌─────────────────────────────────────────────────┐
│ [PLAYER STATS]              [TURN]              │
│ HP: 85/100                YOUR TURN             │
│ Level: 2                                        │
│ XP: 45/200                                      │
│ ATK: 12  DEF: 6                                 │
│                                                 │
│                                                 │
│                                                 │
│          [3D GAME VIEW - FIRST PERSON]          │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│ [COMBAT LOG]                                    │
│ You hit Goblin for 5 damage                     │
│ Goblin attacks you for 3 damage                 │
│ Goblin defeated! +25 XP                         │
│ Level up! Now level 2                           │
│ (Scrollable, shows last 5 messages)             │
└─────────────────────────────────────────────────┘
```

### 8.3 HUD Components

#### Player Stats Panel (Top-Left)
- **Position:** Fixed, top-left corner
- **Background:** Semi-transparent dark overlay
- **Font:** Monospace, white text, 16px
- **Contents:**
  - HP: Current/Max with bar
  - Level
  - XP: Current/Required with bar
  - ATK and DEF values

#### Turn Indicator (Top-Center)
- **Position:** Fixed, top-center
- **Font:** Bold, 24px
- **Colors:**
  - Player turn: Green "YOUR TURN"
  - Enemy turn: Red "ENEMY TURN"
- **Animation:** Pulse effect (future)

#### Combat Log (Bottom-Left)
- **Position:** Fixed, bottom-left
- **Size:** 400px wide, 150px tall
- **Style:** Semi-transparent, scrollable
- **Contents:** Last 5-10 combat messages
- **Auto-scroll:** Newest at bottom

#### Enemy Health Bars (3D Space)
- **Position:** Floating above each enemy
- **Style:** Red bar, decreases left-to-right
- **Size:** 0.5 units wide, 0.05 units tall
- **Always Faces Camera:** Billboard effect

### 8.4 Modal Screens

#### Game Over Screen
```
┌─────────────────────────────┐
│                             │
│        YOU DIED             │
│                             │
│   Final Level: 3            │
│   Enemies Defeated: 7       │
│   Turns Survived: 42        │
│                             │
│   [Press R to Restart]      │
│                             │
└─────────────────────────────┘
```

- **Trigger:** Player HP reaches 0
- **Overlay:** Full screen, semi-transparent black
- **Text:** Large, centered, white
- **Action:** Refresh page to restart (MVP)

#### Victory Screen
```
┌─────────────────────────────┐
│                             │
│       VICTORY!              │
│                             │
│   You defeated the          │
│   Dungeon Lord!             │
│                             │
│   Final Level: 4            │
│   Total XP Earned: 375      │
│   Turns Taken: 68           │
│                             │
│   [Press R to Play Again]   │
│                             │
└─────────────────────────────┘
```

- **Trigger:** Boss HP reaches 0
- **Overlay:** Full screen, semi-transparent gold
- **Text:** Large, centered, gold
- **Action:** Refresh page to restart (MVP)

### 8.5 UI Styling

**Color Palette:**
```css
--color-bg: rgba(0, 0, 0, 0.7);
--color-text: #FFFFFF;
--color-hp: #FF4444;
--color-xp: #44FF44;
--color-player-turn: #44FF44;
--color-enemy-turn: #FF4444;
--color-accent: #FFD700;
```

**Typography:**
- **Primary Font:** 'Courier New', monospace
- **Headings:** 24px, bold
- **Body:** 16px, normal
- **Combat Log:** 14px, normal

### 8.6 Responsive Design (Future)

MVP targets desktop only:
- **Min Resolution:** 1280x720
- **Recommended:** 1920x1080

---

## 9. Controls

### 9.1 Input Methods

**Primary:** Mouse + Keyboard (desktop)
**Future:** Touch (mobile), Gamepad, VR controllers

### 9.2 Desktop Controls

#### Mouse
- **Camera Rotation:** Click + drag to look around
- **Target Cell:** Click floor cell to move
- **Target Enemy:** Click enemy to attack
- **UI Interaction:** Click buttons (future modals)

#### Keyboard
- **Camera Look:** Mouse look (existing A-Frame component)
- **Movement (Disabled):** WASD disabled in turn-based mode
- **Future Hotkeys:**
  - `R` - Restart game
  - `ESC` - Pause menu
  - `I` - Inventory (v1.1+)

### 9.3 Interaction Feedback

**Hover States:**
- **Floor Cell:** Highlight green if valid move
- **Enemy:** Highlight red if valid attack target
- **Invalid Action:** Red X cursor (future)

**Click Feedback:**
- **Valid Action:** Action executes immediately
- **Invalid Action:** Nothing happens (future: shake animation)

### 9.4 Camera Controls

**Type:** First-Person Look Controls
**Provider:** A-Frame's `look-controls` component

**Behavior:**
- Free rotation (mouse drag or move)
- Player position fixed during look
- No vertical movement (locked to grid plane)

---

## 10. Audio

### 10.1 MVP Audio Scope

**MVP: No Audio**

Audio is not critical for core gameplay loop. Defer to post-MVP.

### 10.2 Future Audio Plan (v1.5+)

#### Sound Effects
- **Combat:** Sword swing, hit impact, enemy death
- **Movement:** Footstep on stone
- **UI:** Button click, level up chime
- **Ambient:** Dungeon atmosphere, distant echoes

#### Music
- **Exploration:** Calm, ambient dungeon track
- **Combat:** Tense battle music (triggered on enemy aggro)
- **Boss Fight:** Epic boss battle theme
- **Victory:** Triumphant fanfare

---

## 11. Technical Specifications

### 11.1 Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **3D Engine** | A-Frame | 1.6.0 |
| **3D Library** | Three.js | (via A-Frame) |
| **UI Framework** | React | 18.2.0 |
| **State Management** | Redux | 5.0.1 |
| **Build Tool** | Webpack | 5.x |
| **Language** | JavaScript | ES6+ |

### 11.2 Architecture

#### Redux State Structure
```javascript
{
  geo: {
    terrain: Cell[][],     // Existing
    playerPos: {x, y}      // Existing
  },

  combat: {
    // NEW for MVP
    currentTurn: 'player' | 'enemies',
    turnNumber: 0,

    player: {
      hp: 100,
      maxHP: 100,
      attack: 10,
      defense: 5,
      level: 1,
      xp: 0,
      xpToNext: 100
    },

    enemies: {
      'enemy_0': {
        id: 'enemy_0',
        type: 'foe',
        position: {x: 3, y: 2},
        hp: 20,
        maxHP: 20,
        attack: 8,
        defense: 2,
        xpReward: 25,
        aiType: 'melee'
      },
      // ... more enemies
    },

    combatLog: [
      'Game started',
      'You hit Goblin for 5 damage',
      // ... recent messages
    ],

    gameState: 'playing' | 'victory' | 'gameOver'
  }
}
```

#### Redux Actions
```javascript
// Turn management
PLAYER_MOVE(position)
PLAYER_ATTACK(enemyId)
END_PLAYER_TURN()
EXECUTE_ENEMY_TURN()
END_ENEMY_TURN()

// Combat
DEAL_DAMAGE(targetId, amount)
KILL_ENTITY(entityId)
GAIN_XP(amount)
LEVEL_UP()

// Game state
START_GAME()
GAME_OVER()
VICTORY()

// Logging
ADD_COMBAT_LOG(message)
```

#### File Structure
```
/src/js/
├── systems/
│   ├── turn-manager.js       // NEW - Turn flow logic
│   ├── combat.js             // NEW - Combat calculations
│   └── enemy-ai.js           // NEW - AI decision making
│
├── redux/
│   └── combat/
│       ├── actions.js        // NEW - Combat actions
│       ├── reducer.js        // NEW - Combat state
│       └── selectors.js      // NEW - Derived state
│
├── components/
│   ├── HUD.jsx               // NEW - Main UI overlay
│   ├── CombatLog.jsx         // NEW - Message log
│   ├── GameOverScreen.jsx    // NEW - Game over modal
│   ├── VictoryScreen.jsx     // NEW - Victory modal
│   │
│   ├── Enemy.jsx             // MODIFIED - Add health, click
│   ├── PlayerCam.jsx         // MODIFIED - Combat interactions
│   └── Board.jsx             // MODIFIED - Integrate combat
│
├── data/
│   └── enemy-stats.js        // NEW - Enemy definitions
│
└── utils/
    └── pathfinding.js        // NEW - A* for enemy AI
```

### 11.3 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Frame Rate** | 60 FPS | Desktop Chrome |
| **Initial Load** | < 3 seconds | Localhost |
| **Turn Response** | < 100ms | Click to action |
| **Memory Usage** | < 200MB | Chrome DevTools |

### 11.4 Browser Support

**Primary Target:**
- Chrome 90+ (Desktop)
- Firefox 88+ (Desktop)

**Future:**
- Safari 14+ (Desktop)
- Mobile browsers (iOS Safari, Chrome Mobile)
- VR browsers (Oculus Browser, Firefox Reality)

### 11.5 Accessibility

**MVP:**
- Keyboard navigation (basic)
- High contrast UI
- Readable font sizes

**Future (v1.3+):**
- Screen reader support
- Colorblind modes
- Customizable font sizes
- Key remapping

---

## 12. Balance & Tuning

### 12.1 Difficulty Curve

**Target Experience:**
- First encounter: Easy win (learn mechanics)
- Mid-game: Moderate challenge (tactical thinking)
- Boss fight: Hard but fair (test player skill)

**Expected Player Levels:**
- First enemy: Level 1
- Mid-dungeon: Level 2-3
- Boss: Level 3-4

### 12.2 Stat Balance

#### Damage Formulas

**Goal:** Player should feel progression, but enemies remain threatening

**Player vs Goblin (Level 1):**
```
Player damage to Goblin: 10 - 2 = 8 damage
Goblin damage to Player: 8 - 5 = 3 damage

Goblin HP: 20
Turns to kill: 20 / 8 = 3 turns
Damage taken: 3 * 3 = 9 HP lost

Result: Player wins, loses ~10% HP
```

**Player vs Goblin (Level 2):**
```
Player (ATK 12): 12 - 2 = 10 damage
Goblin damage: 8 - 6 = 2 damage

Turns to kill: 20 / 10 = 2 turns
Damage taken: 2 * 2 = 4 HP lost

Result: Faster win, less damage taken (feel progression)
```

**Player vs Boss (Level 3):**
```
Player (ATK 14): 14 - 5 = 9 damage
Boss (ATK 15): 15 - 7 = 8 damage

Boss HP: 100
Turns to kill: 100 / 9 = 12 turns
Damage taken: 12 * 8 = 96 HP lost

Result: Close fight, requires high HP
```

### 12.3 XP Curve

**Goal:** 2-3 level ups during full playthrough

**Total Enemy XP:**
- 8 Goblins: 8 * 25 = 200 XP
- 4 Worms: 4 * 20 = 80 XP
- 1 Boss: 200 XP
- **Total: 480 XP**

**Level Requirements:**
- Level 1 → 2: 100 XP
- Level 2 → 3: 200 XP (cumulative: 300)
- Level 3 → 4: 300 XP (cumulative: 600)

**Expected Progression:**
- Kill 4 enemies → Level 2 (100 XP)
- Kill 7 enemies → Level 3 (300 XP total)
- Kill boss → Level 4 (500 XP total)

### 12.4 Enemy Placement Balance

**Room Difficulty Tiers:**

| Area | Enemies | Expected Player Level | Difficulty |
|------|---------|----------------------|------------|
| Entry | 0 | 1 | Safe |
| First Room | 1 Goblin | 1 | Easy |
| West Wing | 2 Goblin, 1 Worm | 1-2 | Medium |
| East Wing | 1 Goblin, 2 Worm | 2 | Medium |
| Pre-Boss | 3 Goblin, 1 Worm | 2-3 | Hard |
| Boss Room | 1 Boss | 3-4 | Very Hard |

### 12.5 Tuning Knobs

**If game is too easy:**
- Increase enemy HP by 20-30%
- Increase enemy attack by 1-2
- Reduce player stat growth

**If game is too hard:**
- Decrease enemy HP by 20-30%
- Decrease enemy attack by 1-2
- Increase player stat growth
- Add more low-level enemies for XP

### 12.6 Playtesting Metrics

**Track During Testing:**
1. Average playthrough time
2. Player death rate and location
3. Average player level at boss
4. Average HP remaining at boss victory
5. Number of turns taken

**Target Metrics:**
- **Completion Rate:** 70-80% (after learning)
- **Average Time:** 3-5 minutes
- **Boss Level:** 3-4
- **Deaths:** <3 before first victory

---

## 13. Success Metrics

### 13.1 Development Success

**MVP Complete When:**
- ✅ Player can move on grid
- ✅ Player can attack enemies
- ✅ Enemies execute AI turns
- ✅ Combat damage works correctly
- ✅ Player levels up from XP
- ✅ Boss can be defeated
- ✅ Victory/game over screens work
- ✅ UI displays all necessary info
- ✅ No game-breaking bugs
- ✅ Runs at 60 FPS on target hardware

### 13.2 Gameplay Success

**Core Loop is Fun When:**
- ✅ Combat feels tactical and strategic
- ✅ Leveling up feels rewarding
- ✅ Boss fight is challenging but fair
- ✅ Players want to replay after winning/losing
- ✅ No confusion about what to do

### 13.3 Technical Success

**Code Quality:**
- ✅ Redux state is well-organized
- ✅ Components are reusable
- ✅ No prop-drilling issues
- ✅ Combat logic is unit tested
- ✅ AI is predictable and debuggable

### 13.4 Player Feedback Goals

**Positive Feedback Themes:**
- "Combat is satisfying"
- "Leveling up feels good"
- "I wanted to play again"
- "UI is clear"

**Address Negative Feedback:**
- "Too easy/hard" → Balance tuning
- "Confusing controls" → Better visual feedback
- "Boring combat" → Add more enemy types (post-MVP)

---

## Appendix A: Future Feature Roadmap

### Version 1.1 (Week 3)
- Simple inventory (5 slots)
- Health potions (find as loot)
- Basic weapons (+ATK stat)
- Basic armor (+DEF stat)

### Version 1.2 (Week 4)
- 3 active skills (Heal, Fireball, Power Strike)
- Mana resource
- Skill hotbar UI
- Cooldown system

### Version 1.3 (Week 5)
- 3 dungeon floors
- Stairs to go up/down
- Save/load (localStorage)
- Permadeath mode

### Version 1.4 (Week 6)
- Procedural dungeon generation (BSP)
- Fog of war
- Mini-map
- Random enemy spawns

### Version 1.5+ (Long-term)
- Character classes (Warrior, Mage, Rogue)
- Crafting system
- Quest system
- Multiplayer co-op

---

## Appendix B: Known Limitations

### Technical Limitations (MVP)
- No mobile support
- No audio
- No save/load
- No animation smoothing
- Single dungeon only

### Design Limitations (MVP)
- No equipment system
- No inventory
- No skills/abilities
- No procedural generation
- No randomness in combat
- Auto-stat allocation only

### Intentional Scope Cuts
- Multiplayer
- VR-specific controls
- Complex AI
- Narrative/story
- Multiple character classes
- Status effects

**These are all candidates for post-MVP development.**

---

## Appendix C: Glossary

- **Grid-Based:** Movement restricted to discrete cells
- **Turn-Based:** Players and enemies alternate actions
- **MVP:** Minimum Viable Product
- **AI:** Artificial Intelligence (enemy decision-making)
- **XP:** Experience Points
- **HP:** Health Points
- **ATK:** Attack stat
- **DEF:** Defense stat
- **HUD:** Heads-Up Display
- **LOS:** Line of Sight
- **BSP:** Binary Space Partitioning (dungeon generation)
- **A*:** A-star pathfinding algorithm

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-13 | Claude | Initial GDD for Lean MVP |

---

**END OF DOCUMENT**

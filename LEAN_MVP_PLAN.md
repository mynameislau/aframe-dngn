# Lean MVP: Turn-Based Grid RPG

## Core Philosophy
**Get a playable, fun turn-based combat loop working in 1-2 weeks.**

Strip everything down to the bare essentials. No complex systems, no extensive UI, no procedural generation. Just: move, fight, level up, win.

---

## MVP Scope: The Minimum Fun Product

### ✅ What's IN the MVP

**1. Turn-Based Combat** (2-3 days)
- Player moves OR attacks per turn
- After player action, all enemies take their turn
- Click adjacent cell to move (existing system)
- Click enemy to attack
- Simple damage calculation: `damage = attacker.attack - defender.defense`
- Death: HP reaches 0, entity removed

**2. Basic Stats** (1 day)
- Player: `{ hp, maxHP, attack, defense, level, xp }`
- Enemies: `{ hp, maxHP, attack, defense, xpReward }`
- No derived stats, no complex formulas
- Stats displayed as simple text overlay

**3. Simple Enemy AI** (1-2 days)
- **Melee enemy**: If adjacent to player, attack. Otherwise, move closer.
- **Ranged enemy**: If in range (3 cells), shoot. Otherwise, move to range.
- Use existing pathfinding or simple "move toward player" logic
- 2-3 enemy types total

**4. Progression** (1 day)
- Kill enemy → gain XP
- XP threshold → level up
- Level up → +10 maxHP, +2 attack, +1 defense (auto, no choices)
- Display level and XP on screen

**5. One Hand-Crafted Dungeon** (1 day)
- Enhance existing `.dmap` file with more enemies
- Add boss at the end (tougher enemy with more HP/attack)
- Win condition: Kill boss

**6. Minimal UI** (1-2 days)
- Text overlay showing: HP, Level, XP, Turn indicator
- Combat log (3-5 most recent messages)
- "You Win!" / "You Died" screen
- No inventory UI, no character sheet, no modal

**Total: 7-10 days of focused work**

---

## What's OUT of MVP (Add Later)

❌ Skills and abilities
❌ Inventory system
❌ Equipment
❌ Procedural generation
❌ Multiple floors
❌ Save/load
❌ Quests
❌ Crafting
❌ Complex UI
❌ Status effects
❌ Meta-progression
❌ Audio
❌ Animations (beyond basic movement)
❌ Fog of war
❌ Line-of-sight
❌ Multiple character classes

---

## Implementation Details

### Redux State (Minimal Additions)

```javascript
{
  // Existing
  geo: { terrain, playerPos },

  // NEW - Add only this
  combat: {
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
      // Map of enemy ID to enemy state
      'enemy_1': { id, type, position, hp, maxHP, attack, defense, xpReward },
      'enemy_2': { ... }
    },

    combatLog: [
      'You hit Goblin for 5 damage',
      'Goblin attacks you for 3 damage',
      ...
    ],

    gameOver: false,
    victory: false
  }
}
```

### Core Systems

**Turn Manager** (`/src/js/systems/turn-manager.js`)
```javascript
// Simple turn flow
1. Player clicks cell or enemy
2. Validate action (adjacent for move, adjacent for melee attack)
3. Execute action (update HP, position)
4. Log message
5. Check for deaths
6. Switch to enemy turn
7. For each enemy: execute AI
8. Switch back to player turn
```

**Combat System** (`/src/js/systems/combat.js`)
```javascript
function attack(attacker, defender) {
  const damage = Math.max(1, attacker.attack - defender.defense);
  defender.hp -= damage;

  if (defender.hp <= 0) {
    handleDeath(defender);
  }

  return damage;
}

function handleDeath(entity) {
  if (entity.type === 'player') {
    gameOver();
  } else {
    // Remove enemy, give XP to player
    removeEnemy(entity);
    giveXP(entity.xpReward);
  }
}

function giveXP(amount) {
  player.xp += amount;
  while (player.xp >= player.xpToNext) {
    levelUp();
  }
}

function levelUp() {
  player.level++;
  player.maxHP += 10;
  player.hp = player.maxHP; // Full heal on level
  player.attack += 2;
  player.defense += 1;
  player.xpToNext = player.level * 100;
}
```

**Enemy AI** (`/src/js/systems/enemy-ai.js`)
```javascript
function executeMeleeAI(enemy, playerPos) {
  const distance = getDistance(enemy.position, playerPos);

  if (distance === 1) {
    // Adjacent - attack
    attack(enemy, player);
  } else {
    // Move closer
    const nextCell = getCloserCell(enemy.position, playerPos);
    moveEnemy(enemy, nextCell);
  }
}

function executeRangedAI(enemy, playerPos) {
  const distance = getDistance(enemy.position, playerPos);

  if (distance <= 3 && hasLineOfSight(enemy.position, playerPos)) {
    // In range - shoot
    attack(enemy, player); // Simplified - just use attack()
  } else if (distance > 3) {
    // Too far - move closer
    const nextCell = getCloserCell(enemy.position, playerPos);
    moveEnemy(enemy, nextCell);
  } else {
    // No LOS - move to get LOS
    const nextCell = getCloserCell(enemy.position, playerPos);
    moveEnemy(enemy, nextCell);
  }
}
```

### UI Components

**Simple HUD** (`/src/js/components/HUD.jsx`)
```jsx
function HUD({ player, combat }) {
  return (
    <div className="hud">
      <div className="player-stats">
        <div>Level {player.level}</div>
        <div>HP: {player.hp}/{player.maxHP}</div>
        <div>XP: {player.xp}/{player.xpToNext}</div>
        <div>ATK: {player.attack} | DEF: {player.defense}</div>
      </div>

      <div className="turn-indicator">
        {combat.currentTurn === 'player' ? 'YOUR TURN' : 'ENEMY TURN'}
      </div>

      <div className="combat-log">
        {combat.combatLog.slice(-5).map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>

      {combat.gameOver && <div className="game-over">YOU DIED</div>}
      {combat.victory && <div className="victory">YOU WIN!</div>}
    </div>
  );
}
```

**Health Bar** (`/src/js/components/HealthBar.jsx`)
```jsx
// A-Frame component for 3D health bars above enemies
AFRAME.registerComponent('health-bar', {
  schema: {
    hp: { type: 'number' },
    maxHP: { type: 'number' }
  },

  update() {
    const percent = this.data.hp / this.data.maxHP;
    const width = 0.5 * percent;

    // Update health bar width/color
    // Red bar that shrinks as HP decreases
  }
});
```

### Enhanced Enemy Component

**Enemy.jsx** - Update existing component
```jsx
function Enemy({ enemy, onClick }) {
  return (
    <Entity
      position={`${enemy.position.x} 0 ${-enemy.position.y}`}
      obj-model={`obj: #${enemy.type}; mtl: #${enemy.type}-mtl`}
      health-bar={`hp: ${enemy.hp}; maxHP: ${enemy.maxHP}`}
      events={{
        click: () => onClick(enemy.id)
      }}
    />
  );
}
```

### Player Interaction

**Enhanced PlayerCam** - Update to handle combat
```jsx
function PlayerCam({ position, onCellClick, onEnemyClick }) {
  return (
    <Entity position={`${position.x} 0 ${-position.y}`}>
      <Entity
        camera
        look-controls
        wasd-controls="enabled: false" // Disable WASD for turn-based
      >
        <Entity
          cursor="rayOrigin: mouse"
          raycaster="objects: .cell, .enemy"
        />
      </Entity>
    </Entity>
  );
}
```

---

## File Changes Required

### New Files (7 files)
1. `/src/js/systems/turn-manager.js` - Turn flow logic
2. `/src/js/systems/combat.js` - Combat calculations
3. `/src/js/systems/enemy-ai.js` - AI behaviors
4. `/src/js/redux/combat/actions.js` - Combat actions
5. `/src/js/redux/combat/reducer.js` - Combat state
6. `/src/js/components/HUD.jsx` - UI overlay
7. `/src/css/hud.css` - HUD styling

### Modified Files (5 files)
1. `/src/js/components/Enemy.jsx` - Add click handler, health bar
2. `/src/js/components/Foe.jsx` - Add health tracking
3. `/src/js/components/Worm.jsx` - Add health tracking
4. `/src/js/components/PlayerCam.jsx` - Handle combat interactions
5. `/src/js/components/Board.jsx` - Integrate combat system

### Enhanced Data
1. `/src/data/default.dmap` - Add more enemies and boss
2. `/src/js/data/enemy-stats.js` - Enemy definitions

---

## Enemy Definitions

```javascript
// /src/js/data/enemy-stats.js
export const ENEMY_STATS = {
  'foe': {
    type: 'foe',
    aiType: 'melee',
    maxHP: 20,
    attack: 8,
    defense: 2,
    xpReward: 25,
    modelSrc: '#foe'
  },

  'worm': {
    type: 'worm',
    aiType: 'ranged',
    maxHP: 15,
    attack: 6,
    defense: 1,
    xpReward: 20,
    modelSrc: '#worm'
  },

  'boss': {
    type: 'foe', // Reuse model
    aiType: 'melee',
    maxHP: 100,
    attack: 15,
    defense: 5,
    xpReward: 200,
    modelSrc: '#foe',
    scale: 2 // Bigger
  }
};
```

---

## Sample Enhanced Dungeon Map

```
// /src/data/default.dmap
BBBBBBBBBBBBBBBBBBBBB
B...........B.......B
B.F.........B..W....B
B...........D.......B
B.P.........B.......B
B...........B..P....B
BBBBBB.BBBBBB.......B
B.......................B
B..F.........F..W...B
B...................B
B.......@...........B
B...................B
B..W................B
B...........P.......B
BBBBBBBBBB.BBBBBBBBB
B.........D.........B
B........F.F........B
B...................B
B.......BOSS........B
B...................B
BBBBBBBBBBBBBBBBBBBBB

Legend:
@ = Player start
F = Foe (melee)
W = Worm (ranged)
BOSS = Boss enemy
P = Pillar (obstacle)
D = Door (passable)
B = Wall
. = Floor
```

---

## Player Experience

### Game Loop
1. **Start**: Player spawns in dungeon with starter stats
2. **Explore**: Click cells to move (turn-based)
3. **Combat**: Encounter enemies, click to attack
4. **Progress**: Gain XP, level up, get stronger
5. **Boss Fight**: Final challenge
6. **Win**: Defeat boss, see victory screen
7. **Restart**: Reload page to play again

### Example Play Session (3-5 minutes)
```
Turn 1: Move toward first enemy
Turn 2: Attack enemy (deal 5 damage)
Turn 3: Enemy attacks back (take 3 damage)
Turn 4: Attack again (kill enemy, gain XP)
Turn 5: Move forward
Turn 6-10: Fight second enemy, level up
Turn 11-15: Navigate to boss room
Turn 16-25: Boss fight (tough battle)
Victory!
```

---

## Success Criteria

### Must Have
- ✅ Turn-based combat works correctly
- ✅ Player can move and attack
- ✅ Enemies use AI to fight back
- ✅ Level up system functions
- ✅ Game has win/lose conditions
- ✅ Basic UI shows necessary info

### Nice to Have (Can add post-MVP)
- Smooth animations
- Sound effects
- More enemy variety
- Better visual feedback
- Polished UI

---

## Post-MVP Roadmap (Prioritized)

### Version 1.1 (Week 3)
- Simple inventory (3-5 item slots)
- Health potions (consumable)
- Basic equipment (weapon, armor with stat bonuses)
- Loot drops from enemies

### Version 1.2 (Week 4)
- 3 simple skills (heal, fireball, power attack)
- Mana resource
- Skill cooldowns
- Hotbar UI

### Version 1.3 (Week 5)
- 3 dungeon levels
- Stairs up/down
- Different enemy compositions per floor
- Save/load (single slot)

### Version 1.4 (Week 6)
- Simple procedural generation (BSP)
- Fog of war
- Mini-map
- More enemy types (5-6 total)

### Version 1.5+ (Beyond)
- Quest system
- Meta-progression
- Audio
- Advanced features from full plan

---

## Development Timeline (Lean MVP)

### Day 1-2: Turn System & Combat
- Implement turn manager
- Combat calculations
- Player attack input
- Enemy death/XP

### Day 3-4: Enemy AI
- Melee AI (move + attack)
- Ranged AI (shoot from range)
- Enemy turn execution
- Pathfinding integration

### Day 5-6: Progression & UI
- XP and leveling
- HUD component
- Combat log
- Health bars

### Day 7: Dungeon & Boss
- Enhanced dungeon map
- Boss enemy
- Win/lose screens
- Playtesting

### Day 8-10: Polish & Bug Fixes
- Balance combat
- Fix bugs
- Improve visual feedback
- Final testing

---

## Technical Risks & Mitigations

### Risk: Turn execution too slow
**Mitigation**: Keep animations minimal in MVP, focus on instant feedback

### Risk: AI pathfinding performance
**Mitigation**: Simple "move toward player" algorithm, A* only if needed

### Risk: Combat feels boring
**Mitigation**: Tight number tuning, varied enemy placement, good feedback

### Risk: Scope creep
**Mitigation**: Strict adherence to "IN scope" list, no features beyond MVP

---

## Estimated Effort

**Total Development Time**: 1-2 weeks (80-120 hours for solo dev)
**Team Size**: 1 developer
**Dependencies**: None (all features buildable independently)

---

## Key Design Decisions

### Why No Inventory in MVP?
- Adds UI complexity (modal, drag-drop)
- Requires item system, loot tables
- Not core to turn-based combat loop
- Easy to add in v1.1

### Why No Procedural Generation?
- Hand-crafted level ensures good experience
- Procedural adds complexity and bugs
- Can test combat balance with known layout
- Easy to add in v1.4

### Why Auto-Level Stats?
- No UI needed for stat allocation
- Faster iteration on balance
- Simpler player experience
- Can add choice in v1.2

### Why No Skills?
- Requires mana resource
- Requires hotbar UI
- Requires targeting system
- Basic attack is sufficient for MVP
- Can add in v1.2

---

## Conclusion

This lean MVP focuses on **one thing: fun turn-based grid combat**.

Everything else is stripped away to get a playable game in 1-2 weeks. Once the core loop is fun, we can iterate and add systems from the full plan.

**Core Question**: Can we make clicking to move and clicking to attack feel good?

If yes, we have a foundation. If no, no amount of features will save it.

Let's build the minimum, make it fun, then grow from there.

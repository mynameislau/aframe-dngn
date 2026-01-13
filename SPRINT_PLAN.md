# MVP Sprint Plan: Turn-Based Grid RPG

**Total Duration:** 2 weeks (2 sprints)
**Sprint Length:** 1 week (5 working days)
**Team Size:** 1 developer
**Reference:** [GDD_LEAN_MVP.md](./GDD_LEAN_MVP.md)

---

## Sprint Overview

| Sprint | Focus | Deliverable | Success Criteria |
|--------|-------|-------------|------------------|
| **Sprint 1** | Core Systems | Playable combat prototype | Player can move and fight enemies with turn-based mechanics |
| **Sprint 2** | Polish & Content | Complete MVP game | Full dungeon, boss fight, win/lose states, UI complete |

---

# Sprint 1: Core Systems Foundation

**Goal:** Build the fundamental turn-based combat engine

**Duration:** Week 1 (5 days)
**End State:** Player can move on grid, attack enemies, enemies fight back with AI, basic progression works

---

## Day 1: Redux Architecture & Turn System

### Morning (4 hours)
**Tasks:**
- [ ] Set up Redux combat state structure
- [ ] Create combat actions (`PLAYER_MOVE`, `PLAYER_ATTACK`, `END_TURN`, etc.)
- [ ] Implement combat reducer with initial state
- [ ] Write Redux selectors for combat data

**Files:**
```
/src/js/redux/combat/
├── actions.js        (NEW)
├── reducer.js        (NEW)
├── selectors.js      (NEW)
└── types.js          (NEW)
```

**Deliverables:**
```javascript
// State structure working:
{
  combat: {
    currentTurn: 'player',
    turnNumber: 0,
    player: { hp: 100, maxHP: 100, attack: 10, defense: 5, level: 1, xp: 0, xpToNext: 100 },
    enemies: {},
    combatLog: [],
    gameState: 'playing'
  }
}
```

### Afternoon (4 hours)
**Tasks:**
- [ ] Create turn manager system
- [ ] Implement `startPlayerTurn()` logic
- [ ] Implement `endPlayerTurn()` logic
- [ ] Implement `executeEnemyTurn()` logic
- [ ] Write unit tests for turn flow

**Files:**
```
/src/js/systems/turn-manager.js (NEW)
/src/js/systems/turn-manager.test.js (NEW)
```

**Acceptance Criteria:**
- ✅ Redux store initializes with correct combat state
- ✅ Turn state can switch between 'player' and 'enemies'
- ✅ Turn counter increments correctly
- ✅ Unit tests pass for turn transitions

---

## Day 2: Combat System & Damage Calculation

### Morning (4 hours)
**Tasks:**
- [ ] Create combat calculation functions
- [ ] Implement damage formula: `max(1, attacker.attack - defender.defense)`
- [ ] Implement `dealDamage()` function
- [ ] Implement `killEntity()` function
- [ ] Implement `gainXP()` function
- [ ] Implement `levelUp()` function

**Files:**
```
/src/js/systems/combat.js (NEW)
/src/js/systems/combat.test.js (NEW)
```

**Unit Tests:**
```javascript
// Test cases:
- Player attacks enemy: correct damage calculated
- Enemy attacks player: correct damage calculated
- Minimum 1 damage always dealt
- Entity dies when HP <= 0
- XP awarded on enemy death
- Level up triggers at XP threshold
- Stats increase correctly on level up
```

### Afternoon (4 hours)
**Tasks:**
- [ ] Integrate combat system with Redux
- [ ] Create `attackEnemy()` action
- [ ] Create `takeDamage()` action
- [ ] Create `enemyDeath()` action
- [ ] Create `playerLevelUp()` action
- [ ] Test combat flow end-to-end

**Acceptance Criteria:**
- ✅ Combat calculations are deterministic and correct
- ✅ All unit tests pass (>95% coverage for combat.js)
- ✅ Redux actions properly update combat state
- ✅ Level up correctly increases stats and heals to full

---

## Day 3: Enemy AI & Pathfinding

### Morning (4 hours)
**Tasks:**
- [ ] Create enemy stats definitions
- [ ] Implement melee AI behavior
- [ ] Implement ranged AI behavior
- [ ] Create simple pathfinding (A* or "move toward player")
- [ ] Write AI unit tests

**Files:**
```
/src/js/data/enemy-stats.js (NEW)
/src/js/systems/enemy-ai.js (NEW)
/src/js/systems/enemy-ai.test.js (NEW)
/src/js/utils/pathfinding.js (NEW - if needed)
```

**Enemy Definitions:**
```javascript
// enemy-stats.js
GOBLIN: { type: 'foe', hp: 20, attack: 8, defense: 2, xpReward: 25, ai: 'melee' }
WORM: { type: 'worm', hp: 15, attack: 6, defense: 1, xpReward: 20, ai: 'ranged', range: 3 }
BOSS: { type: 'foe', hp: 100, attack: 15, defense: 5, xpReward: 200, ai: 'melee', scale: 2 }
```

### Afternoon (4 hours)
**Tasks:**
- [ ] Integrate AI with turn system
- [ ] Implement enemy turn execution loop
- [ ] Add enemies to Redux state on game start
- [ ] Test AI behavior with multiple enemies
- [ ] Test edge cases (blocked paths, no valid moves)

**Acceptance Criteria:**
- ✅ Melee enemies move toward player and attack when adjacent
- ✅ Ranged enemies shoot from distance (3 cells)
- ✅ AI handles obstacles (walls, pillars)
- ✅ Multiple enemies can take turns in sequence
- ✅ AI unit tests pass

---

## Day 4: Player Interaction & Board Integration

### Morning (4 hours)
**Tasks:**
- [ ] Update `PlayerCam` component to disable WASD controls
- [ ] Add click handlers for floor cells (movement)
- [ ] Add click handlers for enemies (attack)
- [ ] Implement action validation (adjacent cells only)
- [ ] Dispatch Redux actions on player input

**Files to Modify:**
```
/src/js/components/PlayerCam.jsx (MODIFY)
/src/js/components/Board.jsx (MODIFY)
/src/js/components/Cell.jsx (MODIFY)
```

**New Component Logic:**
```javascript
// PlayerCam.jsx
function handleCellClick(cell) {
  if (isAdjacentToPlayer(cell)) {
    dispatch(movePlayer(cell));
  }
}

function handleEnemyClick(enemyId) {
  if (isAdjacentToPlayer(enemyPosition)) {
    dispatch(attackEnemy(enemyId));
  }
}
```

### Afternoon (4 hours)
**Tasks:**
- [ ] Update `Enemy` component with click handlers
- [ ] Update `Foe` component with health tracking
- [ ] Update `Worm` component with health tracking
- [ ] Add health bar component (3D)
- [ ] Connect enemies to Redux state
- [ ] Test player movement and attack in browser

**Files:**
```
/src/js/components/Enemy.jsx (MODIFY)
/src/js/components/Foe.jsx (MODIFY)
/src/js/components/Worm.jsx (MODIFY)
/src/js/ecs/health-bar.component.js (NEW)
```

**Acceptance Criteria:**
- ✅ Player can click adjacent cells to move
- ✅ Player can click adjacent enemies to attack
- ✅ Invalid clicks do nothing (no error)
- ✅ Turn switches to enemies after player action
- ✅ Health bars visible above enemies
- ✅ Enemies update position/HP correctly

---

## Day 5: Combat Logging & Sprint Review

### Morning (4 hours)
**Tasks:**
- [ ] Implement combat log Redux state
- [ ] Create `addCombatLog()` action
- [ ] Add logging to all combat events
- [ ] Create basic combat log display (console for now)
- [ ] Test full combat flow with logging

**Combat Log Messages:**
```
"Game started"
"You moved to (3, 5)"
"You hit Goblin for 5 damage"
"Goblin attacks you for 3 damage"
"Goblin defeated! +25 XP"
"Level up! Now level 2"
"Worm shoots you for 4 damage"
```

### Afternoon (4 hours)
**Tasks:**
- [ ] End-to-end testing of all Sprint 1 features
- [ ] Fix bugs discovered during testing
- [ ] Code review and refactoring
- [ ] Write integration tests
- [ ] Document any known issues

**Sprint 1 Testing Checklist:**
- [ ] Player can move on grid
- [ ] Player can attack enemies
- [ ] Enemies execute AI turns
- [ ] Damage calculations correct
- [ ] XP and leveling works
- [ ] Turn flow is correct
- [ ] No infinite loops or crashes
- [ ] Redux DevTools shows correct state

**Sprint 1 Deliverable:**
- ✅ Playable combat prototype (no UI, just functional gameplay)
- ✅ Console shows combat log
- ✅ All core systems working
- ✅ Unit tests passing (>90% coverage)

---

# Sprint 2: UI, Content & Polish

**Goal:** Complete the game with dungeon, UI, boss, and win/lose conditions

**Duration:** Week 2 (5 days)
**End State:** Fully playable game with complete UI and polished experience

---

## Day 6: HUD Implementation

### Morning (4 hours)
**Tasks:**
- [ ] Create HUD component structure
- [ ] Implement player stats panel (HP, Level, XP, ATK, DEF)
- [ ] Add HP bar visualization
- [ ] Add XP bar visualization
- [ ] Connect HUD to Redux state

**Files:**
```
/src/js/components/HUD/
├── HUD.jsx (NEW)
├── PlayerStats.jsx (NEW)
├── StatBar.jsx (NEW - reusable HP/XP bar)
└── index.js (NEW)

/src/css/hud.css (NEW)
```

**HUD Layout:**
```
┌─────────────────────┐
│ ♥ HP: 85/100 ████░░ │
│ ⭐ Level: 2          │
│ ✨ XP: 45/200 ██░░░░ │
│ ⚔️ ATK: 12  🛡️ DEF: 6 │
└─────────────────────┘
```

### Afternoon (4 hours)
**Tasks:**
- [ ] Create turn indicator component
- [ ] Style turn indicator (green for player, red for enemy)
- [ ] Create combat log UI component
- [ ] Implement auto-scrolling for combat log
- [ ] Style combat log with timestamps/icons

**Files:**
```
/src/js/components/HUD/
├── TurnIndicator.jsx (NEW)
└── CombatLog.jsx (NEW)
```

**Acceptance Criteria:**
- ✅ HUD displays all player stats correctly
- ✅ Stats update in real-time during combat
- ✅ Turn indicator clearly shows whose turn it is
- ✅ Combat log displays all messages
- ✅ UI is readable and non-intrusive
- ✅ Responsive to state changes

---

## Day 7: Game States & Modal Screens

### Morning (4 hours)
**Tasks:**
- [ ] Implement game over detection
- [ ] Create Game Over screen component
- [ ] Implement victory detection
- [ ] Create Victory screen component
- [ ] Add restart functionality

**Files:**
```
/src/js/components/Modals/
├── GameOverScreen.jsx (NEW)
├── VictoryScreen.jsx (NEW)
└── index.js (NEW)

/src/css/modals.css (NEW)
```

**Game Over Screen:**
```
╔═══════════════════════════╗
║                           ║
║       YOU DIED            ║
║                           ║
║  Final Level: 3           ║
║  Enemies Defeated: 7      ║
║  Turns Survived: 42       ║
║                           ║
║  Press R to Restart       ║
║                           ║
╚═══════════════════════════╝
```

**Victory Screen:**
```
╔═══════════════════════════╗
║                           ║
║      VICTORY!             ║
║                           ║
║  You defeated the         ║
║  Dungeon Lord!            ║
║                           ║
║  Final Level: 4           ║
║  Total XP: 375            ║
║  Turns: 68                ║
║                           ║
║  Press R to Play Again    ║
║                           ║
╚═══════════════════════════╝
```

### Afternoon (4 hours)
**Tasks:**
- [ ] Add keyboard handler for restart (R key)
- [ ] Implement game state transitions
- [ ] Add overlay backdrop for modals
- [ ] Test win/lose conditions
- [ ] Polish modal animations (fade in)

**Game State Machine:**
```javascript
'playing' → (player dies) → 'gameOver'
'playing' → (boss dies) → 'victory'
'gameOver' → (press R) → 'playing' (reload page)
'victory' → (press R) → 'playing' (reload page)
```

**Acceptance Criteria:**
- ✅ Game over screen appears when player HP = 0
- ✅ Victory screen appears when boss HP = 0
- ✅ Screens display correct stats
- ✅ R key restarts game (page reload)
- ✅ Modals are centered and styled
- ✅ Game state transitions work correctly

---

## Day 8: Dungeon Design & Boss Implementation

### Morning (4 hours)
**Tasks:**
- [ ] Design complete dungeon map (25×25 grid)
- [ ] Update `default.dmap` with full layout
- [ ] Place all enemies strategically
- [ ] Add boss to final room
- [ ] Add pillars for tactical chokepoints

**Dungeon Structure:**
```
Section 1: Entry (safe zone)
Section 2: First encounter (1 goblin)
Section 3: West wing (2 goblins, 1 worm)
Section 4: East corridor (1 goblin, 2 worms)
Section 5: Pre-boss gauntlet (3 goblins, 1 worm)
Section 6: Boss arena (boss + 2 goblin guards)
```

**Enemy Placement:**
- Total: 8 Goblins, 4 Worms, 1 Boss
- Progressive difficulty curve
- Mixed enemy types per section
- Clear path to boss room

### Afternoon (4 hours)
**Tasks:**
- [ ] Implement boss enemy variant
- [ ] Scale boss model larger (2x)
- [ ] Implement boss spawn logic
- [ ] Add victory condition (boss death)
- [ ] Test full dungeon playthrough
- [ ] Balance enemy placement

**Boss Implementation:**
```javascript
// In enemy-stats.js
BOSS: {
  name: "Dungeon Lord",
  type: 'foe',
  hp: 100,
  maxHP: 100,
  attack: 15,
  defense: 5,
  xpReward: 200,
  ai: 'melee',
  scale: 2,
  isBoss: true
}
```

**Acceptance Criteria:**
- ✅ Complete dungeon map is playable
- ✅ All enemies spawn correctly
- ✅ Boss is visually distinct (larger)
- ✅ Boss is significantly harder than normal enemies
- ✅ Victory triggers when boss dies
- ✅ Can complete full playthrough in 3-5 minutes

---

## Day 9: Balance, Polish & Visual Feedback

### Morning (4 hours)
**Tasks:**
- [ ] Playtest full game multiple times
- [ ] Balance damage values if needed
- [ ] Balance XP rewards if needed
- [ ] Adjust enemy HP if too easy/hard
- [ ] Fine-tune boss difficulty

**Balance Testing Metrics:**
```
Target Results:
- First enemy kill: Player loses ~10% HP
- Reach boss: Player level 3-4
- Boss fight: Close battle, ~10-20% HP remaining
- Average playthrough: 3-5 minutes
- Win rate (skilled player): 70-80%
```

**Tuning Adjustments:**
```javascript
// If too easy:
- Increase enemy HP by 20-30%
- Increase enemy attack by 1-2
- Reduce player stat growth

// If too hard:
- Decrease enemy HP by 20-30%
- Decrease enemy attack by 1-2
- Increase XP rewards by 10-20%
```

### Afternoon (4 hours)
**Tasks:**
- [ ] Add hover effects for interactive elements
- [ ] Add click feedback (cell highlights)
- [ ] Improve health bar visibility
- [ ] Add death animations (fade out)
- [ ] Polish UI styling
- [ ] Test in different resolutions

**Visual Polish:**
```
- Floor cells: Green highlight on valid move
- Enemies: Red highlight on valid attack
- Health bars: Smooth color transition (green → yellow → red)
- Dead enemies: 0.5s fade out animation
- Level up: Flash effect on player (future)
- Damage: Shake effect on hit (future)
```

**CSS Additions:**
```css
.cell-hover-valid { box-shadow: 0 0 10px green; }
.cell-hover-invalid { cursor: not-allowed; }
.enemy-targetable { box-shadow: 0 0 10px red; }
.health-bar-high { background: #44ff44; }
.health-bar-medium { background: #ffff44; }
.health-bar-low { background: #ff4444; }
```

**Acceptance Criteria:**
- ✅ Game is balanced for 3-5 minute sessions
- ✅ Boss fight is challenging but fair
- ✅ Visual feedback is clear and helpful
- ✅ UI is polished and professional
- ✅ No confusing interactions

---

## Day 10: Testing, Bug Fixes & Release

### Morning (4 hours)
**Tasks:**
- [ ] Comprehensive end-to-end testing
- [ ] Fix all critical bugs
- [ ] Write integration tests
- [ ] Test edge cases
- [ ] Cross-browser testing (Chrome, Firefox)

**Testing Checklist:**

**Core Gameplay:**
- [ ] Player movement works correctly
- [ ] Player attack works correctly
- [ ] Enemy AI is functional
- [ ] Turn system works without issues
- [ ] Combat damage is correct
- [ ] XP gain works
- [ ] Leveling up works
- [ ] Stats increase correctly

**UI/UX:**
- [ ] HUD displays correct information
- [ ] Combat log updates properly
- [ ] Turn indicator is accurate
- [ ] Health bars update correctly
- [ ] Game over screen appears correctly
- [ ] Victory screen appears correctly
- [ ] Restart functionality works

**Edge Cases:**
- [ ] Player surrounded by enemies
- [ ] All enemies killed except boss
- [ ] Level up during combat
- [ ] Multiple enemies attack same turn
- [ ] Boss defeated on exact HP
- [ ] No valid moves available

**Performance:**
- [ ] Game runs at 60 FPS
- [ ] No memory leaks
- [ ] No infinite loops
- [ ] Turn execution < 100ms
- [ ] Page load < 3 seconds

### Afternoon (4 hours)
**Tasks:**
- [ ] Final bug fixes
- [ ] Code cleanup and refactoring
- [ ] Update documentation
- [ ] Write release notes
- [ ] Final playtest session
- [ ] Deploy/commit final version

**Documentation Updates:**
```
- Update README.md with how to play
- Document known limitations
- List browser requirements
- Add development setup instructions
```

**Release Notes (v1.0 MVP):**
```markdown
# Grid Dungeon RPG - v1.0 MVP

## Features
- Turn-based tactical combat
- 3 enemy types (Goblin, Worm, Boss)
- Character progression (XP and leveling)
- Hand-crafted dungeon
- Complete UI with HUD and combat log
- Win/lose conditions

## How to Play
1. Click adjacent cells to move
2. Click adjacent enemies to attack
3. Defeat all enemies and the boss to win
4. Press R to restart after game over/victory

## Technical
- Built with A-Frame, React, Redux
- 60 FPS gameplay
- Desktop browsers (Chrome, Firefox)
```

**Acceptance Criteria:**
- ✅ All critical bugs fixed
- ✅ All tests passing
- ✅ Game is feature-complete per GDD
- ✅ Documentation is updated
- ✅ Ready for demo/release

---

## Sprint 2 Deliverable

**Complete MVP Game:**
- ✅ Full turn-based combat system
- ✅ Player progression (XP, leveling, stats)
- ✅ 3 enemy types with AI
- ✅ Complete dungeon with boss
- ✅ Full UI (HUD, combat log, modals)
- ✅ Win/lose conditions
- ✅ Polished and balanced
- ✅ Bug-free and tested
- ✅ Documented

---

## Daily Standup Template

**Each Morning (10 minutes):**

**Yesterday:**
- What did I complete?
- What blockers did I face?

**Today:**
- What will I work on?
- What blockers do I anticipate?

**Risks:**
- Any scope creep?
- Any technical challenges?

---

## Definition of Done

A task is "done" when:
- ✅ Code is written and committed
- ✅ Unit tests written and passing (if applicable)
- ✅ Manually tested in browser
- ✅ No console errors
- ✅ Redux state is correct
- ✅ Code is reviewed (self-review for solo dev)
- ✅ Documentation updated (if applicable)

---

## Risk Management

### High-Risk Items
| Risk | Mitigation | Contingency |
|------|------------|-------------|
| **AI pathfinding complex** | Use simple "move toward player" | Skip advanced pathfinding, manual waypoints |
| **Turn system bugs** | Write comprehensive tests early | Simplify turn flow if needed |
| **Balance issues** | Test early and often | Tweak numbers, spreadsheet modeling |
| **Scope creep** | Strict adherence to GDD | Cut non-essential features |

### Scope Management
**If behind schedule:**
- Cut animations (instant actions)
- Simplify UI styling
- Reduce enemy variety (2 types instead of 3)
- Smaller dungeon map
- Skip edge case handling

**If ahead of schedule:**
- Add smooth animations
- Polish UI further
- Add damage numbers (floating text)
- Add more enemy variety
- Improve AI complexity

---

## Success Metrics

### Sprint 1 Success
- [ ] Player can move and attack
- [ ] Enemies use AI
- [ ] Turn system works
- [ ] Combat calculations correct
- [ ] XP and leveling functional
- [ ] No critical bugs

### Sprint 2 Success
- [ ] Complete UI
- [ ] Full dungeon playable
- [ ] Boss fight works
- [ ] Win/lose conditions trigger
- [ ] Game is balanced
- [ ] Ready for demo

### Overall MVP Success
- [ ] All GDD features implemented
- [ ] Playable 3-5 minute sessions
- [ ] 60 FPS performance
- [ ] No game-breaking bugs
- [ ] Fun to play (subjective but important!)

---

## Post-Sprint Activities

**After Sprint 2:**
1. Demo the game to stakeholders/users
2. Gather feedback
3. Create backlog for v1.1 features
4. Plan next sprint (inventory system)
5. Celebrate! 🎉

---

## Appendix: Time Estimates

**Total Estimated Hours:** 80 hours
- Sprint 1: 40 hours (5 days × 8 hours)
- Sprint 2: 40 hours (5 days × 8 hours)

**Buffer:** Built into daily schedules (4-hour blocks with testing time)

**Realistic:** Assumes 6-7 hours of productive coding per day, rest for breaks, debugging, meetings

---

## Appendix: Tech Stack Reference

| Component | Technology | Purpose |
|-----------|-----------|---------|
| 3D Engine | A-Frame 1.6.0 | Scene rendering |
| 3D Library | Three.js | Underlying graphics |
| UI Framework | React 18.2.0 | Component architecture |
| State Management | Redux 5.0.1 | Game state |
| Build Tool | Webpack 5 | Bundling |
| Test Framework | Vitest | Unit/integration tests |
| Language | JavaScript (ES6+) | Development |

---

**Good luck with development! 🚀**

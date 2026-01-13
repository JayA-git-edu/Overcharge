
const MAX_HEAT = 10;
const OVERCHARGE_THRESHOLD = 8;
const OVERHEAT_DAMAGE = 3;
const OVERHEAT_RESET = 6;
const BASE_ENERGY = 3;
const HAND_SIZE = 5;
const DEFAULT_PLAYER_HP = 26;
const INACTIVE_HINT_MS = 15000;
const AUTO_END_MS = 300000;
const START_TIPS = [
  "Tip: Overcharge discounts your first card each turn.",
  "Tip: Vents reset risk and open new lines of play.",
  "Tip: Armor blocks damage before your HP drops.",
  "Tip: Modules stack, so build around a theme.",
];

const MAX_BONUS_CARDS = 8;
const DEFAULT_COLORS = ["#ff7a4b", "#52d6ff", "#ffb347", "#9b7bff"];
const DECK_PRESETS = {
  balanced: ["pulseDriver", "flashGuard", "coolantBurst", "powerSurge", "barrierField", "overchargeCoils"],
  aggression: ["doubleTap", "breachShot", "reactorSmash", "shockWave", "overloadBurst", "plasmaLance"],
  fortress: ["bulkhead", "reactorShell", "impactDampers", "reflectPlate", "shieldMatrix", "radiantPlating"],
  overclock: ["heatBattery", "overchargeCoils", "targetingSuite", "overheatBurst", "shockWave", "overloadBurst"],
  coolant: ["purgeHeat", "coreFlush", "coolantSpray", "heatDump", "thermalBleed", "coolantLoop"],
};

const CARD_LIBRARY = {
  sparkShot: {
    id: "sparkShot",
    name: "Spark Shot",
    cost: 1,
    heat: 1,
    type: "attack",
    text: "Deal 2 damage.",
    actions: [{ type: "damage", amount: 2, useAttackBonus: true }],
  },
  arcSlash: {
    id: "arcSlash",
    name: "Arc Slash",
    cost: 2,
    heat: 2,
    type: "attack",
    text: "Deal 4 damage.",
    actions: [{ type: "damage", amount: 4, useAttackBonus: true }],
  },
  chainLightning: {
    id: "chainLightning",
    name: "Chain Lightning",
    cost: 2,
    heat: 3,
    type: "attack",
    text: "Deal 2 damage. Take 1 damage.",
    actions: [
      { type: "damage", amount: 2, useAttackBonus: true },
      { type: "selfDamage", amount: 1 },
    ],
  },
  voltageSpike: {
    id: "voltageSpike",
    name: "Voltage Spike",
    cost: 1,
    heat: 1,
    type: "attack",
    text: "Deal 3 damage.",
    actions: [{ type: "damage", amount: 3, useAttackBonus: true }],
  },
  fragmentPulse: {
    id: "fragmentPulse",
    name: "Fragment Pulse",
    cost: 1,
    heat: 0,
    type: "attack",
    text: "Deal 1 damage twice.",
    actions: [{ type: "damage", amount: 1, hits: 2, useAttackBonus: true }],
  },
  overloadBurst: {
    id: "overloadBurst",
    name: "Overload Burst",
    cost: 2,
    heat: 3,
    type: "attack",
    text: "Deal 4 damage. If Heat >= 8, deal +2.",
    actions: [
      { type: "damage", amount: 4, useAttackBonus: true },
      {
        type: "ifHot",
        threshold: 8,
        actions: [{ type: "damage", amount: 2, useAttackBonus: false }],
      },
    ],
  },
  plasmaLance: {
    id: "plasmaLance",
    name: "Plasma Lance",
    cost: 3,
    heat: 3,
    type: "attack",
    text: "Deal 7 damage.",
    actions: [{ type: "damage", amount: 7, useAttackBonus: true }],
  },
  shockWave: {
    id: "shockWave",
    name: "Shock Wave",
    cost: 2,
    heat: 2,
    type: "attack",
    text: "Deal 2 damage three times.",
    actions: [{ type: "damage", amount: 2, hits: 3, useAttackBonus: true }],
  },
  ionDive: {
    id: "ionDive",
    name: "Ion Dive",
    cost: 1,
    heat: 2,
    type: "attack",
    text: "Deal 5 damage. Take 2 damage.",
    actions: [
      { type: "damage", amount: 5, useAttackBonus: true },
      { type: "selfDamage", amount: 2 },
    ],
  },
  pulseDriver: {
    id: "pulseDriver",
    name: "Pulse Driver",
    cost: 1,
    heat: 1,
    type: "attack",
    text: "Deal 2 damage. Draw 1 card.",
    actions: [
      { type: "damage", amount: 2, useAttackBonus: true },
      { type: "draw", amount: 1 },
    ],
  },
  breachShot: {
    id: "breachShot",
    name: "Breach Shot",
    cost: 2,
    heat: 1,
    type: "attack",
    text: "Pierce for 3 damage.",
    actions: [{ type: "damage", amount: 3, pierce: true, useAttackBonus: true }],
  },
  doubleTap: {
    id: "doubleTap",
    name: "Double Tap",
    cost: 1,
    heat: 1,
    type: "attack",
    text: "Deal 1 damage four times.",
    actions: [{ type: "damage", amount: 1, hits: 4, useAttackBonus: true }],
  },
  reactorSmash: {
    id: "reactorSmash",
    name: "Reactor Smash",
    cost: 2,
    heat: 2,
    type: "attack",
    text: "Deal 4 damage. Gain 1 Energy.",
    actions: [
      { type: "damage", amount: 4, useAttackBonus: true },
      { type: "energy", amount: 1 },
    ],
  },
  staticHook: {
    id: "staticHook",
    name: "Static Hook",
    cost: 1,
    heat: -1,
    type: "attack",
    text: "Deal 2 damage. Vent 1 heat.",
    actions: [{ type: "damage", amount: 2, useAttackBonus: true }],
  },
  voltCascade: {
    id: "voltCascade",
    name: "Volt Cascade",
    cost: 2,
    heat: 2,
    type: "attack",
    text: "Deal 2 damage twice. Draw 1 card.",
    actions: [
      { type: "damage", amount: 2, hits: 2, useAttackBonus: true },
      { type: "draw", amount: 1 },
    ],
  },
  insulate: {
    id: "insulate",
    name: "Insulate",
    cost: 1,
    heat: 0,
    type: "shield",
    text: "Gain 3 armor.",
    actions: [{ type: "armor", amount: 3 }],
  },
  barrierField: {
    id: "barrierField",
    name: "Barrier Field",
    cost: 2,
    heat: 0,
    type: "shield",
    text: "Gain 6 armor.",
    actions: [{ type: "armor", amount: 6 }],
  },
  flashGuard: {
    id: "flashGuard",
    name: "Flash Guard",
    cost: 1,
    heat: 1,
    type: "shield",
    text: "Gain 2 armor. Draw 1 card.",
    actions: [
      { type: "armor", amount: 2 },
      { type: "draw", amount: 1 },
    ],
  },
  reactorShell: {
    id: "reactorShell",
    name: "Reactor Shell",
    cost: 2,
    heat: 1,
    type: "shield",
    text: "Gain 5 armor. If Heat >= 8, gain +2.",
    actions: [
      { type: "armor", amount: 5 },
      {
        type: "ifHot",
        threshold: 8,
        actions: [{ type: "armor", amount: 2 }],
      },
    ],
  },
  reflectPlate: {
    id: "reflectPlate",
    name: "Reflect Plate",
    cost: 2,
    heat: 1,
    type: "shield",
    text: "Gain 4 armor. Reflect 2.",
    actions: [
      { type: "armor", amount: 4 },
      { type: "reflect", amount: 2 },
    ],
  },
  bulkhead: {
    id: "bulkhead",
    name: "Bulkhead",
    cost: 2,
    heat: 0,
    type: "shield",
    text: "Gain 5 armor. Gain 1 Energy.",
    actions: [
      { type: "armor", amount: 5 },
      { type: "energy", amount: 1 },
    ],
  },
  coolantGuard: {
    id: "coolantGuard",
    name: "Coolant Guard",
    cost: 1,
    heat: -1,
    type: "shield",
    text: "Gain 3 armor. Vent 1 heat.",
    actions: [{ type: "armor", amount: 3 }],
  },
  phaseBuffer: {
    id: "phaseBuffer",
    name: "Phase Buffer",
    cost: 1,
    heat: 0,
    type: "shield",
    text: "Gain 2 armor. Draw 2 cards.",
    actions: [
      { type: "armor", amount: 2 },
      { type: "draw", amount: 2 },
    ],
  },
  radiantPlating: {
    id: "radiantPlating",
    name: "Radiant Plating",
    cost: 2,
    heat: 0,
    type: "shield",
    text: "Gain 4 armor. Heal 1.",
    actions: [
      { type: "armor", amount: 4 },
      { type: "heal", amount: 1 },
    ],
  },
  magnetScreen: {
    id: "magnetScreen",
    name: "Magnet Screen",
    cost: 2,
    heat: 1,
    type: "shield",
    text: "Gain 3 armor. Reflect 1. Draw 1.",
    actions: [
      { type: "armor", amount: 3 },
      { type: "reflect", amount: 1 },
      { type: "draw", amount: 1 },
    ],
  },
  impactDampers: {
    id: "impactDampers",
    name: "Impact Dampers",
    cost: 2,
    heat: 0,
    type: "shield",
    text: "Gain 4 armor. Gain 1 Energy. Draw 1.",
    actions: [
      { type: "armor", amount: 4 },
      { type: "energy", amount: 1 },
      { type: "draw", amount: 1 },
    ],
  },
  holoShield: {
    id: "holoShield",
    name: "Holo Shield",
    cost: 1,
    heat: 1,
    type: "shield",
    text: "Gain 2 armor. If Heat >= 8, draw 1.",
    actions: [
      { type: "armor", amount: 2 },
      {
        type: "ifHot",
        threshold: 8,
        actions: [{ type: "draw", amount: 1 }],
      },
    ],
  },
  circuitGuard: {
    id: "circuitGuard",
    name: "Circuit Guard",
    cost: 1,
    heat: -2,
    type: "shield",
    text: "Gain 3 armor. Vent 2 heat.",
    actions: [{ type: "armor", amount: 3 }],
  },
  emergencyBulkhead: {
    id: "emergencyBulkhead",
    name: "Emergency Bulkhead",
    cost: 2,
    heat: 1,
    type: "shield",
    text: "Gain 7 armor. Take 1 damage.",
    actions: [
      { type: "armor", amount: 7 },
      { type: "selfDamage", amount: 1 },
    ],
  },
  shieldMatrix: {
    id: "shieldMatrix",
    name: "Shield Matrix",
    cost: 2,
    heat: 0,
    type: "shield",
    text: "Gain 2 armor. Install Stasis Matrix.",
    actions: [
      { type: "armor", amount: 2 },
      { type: "module", name: "stasisMatrix" },
    ],
  },
  coolantBurst: {
    id: "coolantBurst",
    name: "Coolant Burst",
    cost: 1,
    heat: -4,
    type: "vent",
    text: "Reduce Heat by 4.",
    actions: [{ type: "note", message: "Coolant Burst vents heat." }],
  },
  stabilize: {
    id: "stabilize",
    name: "Stabilize",
    cost: 1,
    heat: -3,
    type: "vent",
    text: "Reduce Heat by 3. Draw 1 card.",
    actions: [{ type: "draw", amount: 1 }],
  },
  emergencyVent: {
    id: "emergencyVent",
    name: "Emergency Vent",
    cost: 0,
    heat: -2,
    type: "vent",
    text: "Reduce Heat by 2. End your turn.",
    actions: [
      { type: "note", message: "Emergency Vent forces a cooldown." },
      { type: "endTurn" },
    ],
  },
  powerSurge: {
    id: "powerSurge",
    name: "Power Surge",
    cost: 0,
    heat: 1,
    type: "vent",
    text: "Gain 1 Energy.",
    actions: [{ type: "energy", amount: 1 }],
  },
  purgeHeat: {
    id: "purgeHeat",
    name: "Purge Heat",
    cost: 2,
    heat: -5,
    type: "vent",
    text: "Reduce Heat by 5.",
    actions: [{ type: "note", message: "Purge Heat vents the core." }],
  },
  reactorTuning: {
    id: "reactorTuning",
    name: "Reactor Tuning",
    cost: 1,
    heat: -2,
    type: "vent",
    text: "Reduce Heat by 2. Gain 2 armor.",
    actions: [{ type: "armor", amount: 2 }],
  },
  heatDump: {
    id: "heatDump",
    name: "Heat Dump",
    cost: 1,
    heat: -3,
    type: "vent",
    text: "Reduce Heat by 3. Gain 1 Energy.",
    actions: [{ type: "energy", amount: 1 }],
  },
  coolantSpray: {
    id: "coolantSpray",
    name: "Coolant Spray",
    cost: 1,
    heat: -1,
    type: "vent",
    text: "Reduce Heat by 1. Draw 2 cards.",
    actions: [{ type: "draw", amount: 2 }],
  },
  coreFlush: {
    id: "coreFlush",
    name: "Core Flush",
    cost: 2,
    heat: -4,
    type: "vent",
    text: "Reduce Heat by 4. Heal 1.",
    actions: [{ type: "heal", amount: 1 }],
  },
  safetyCutoff: {
    id: "safetyCutoff",
    name: "Safety Cutoff",
    cost: 0,
    heat: -6,
    type: "vent",
    text: "Reduce Heat by 6. Draw 1. End your turn.",
    actions: [
      { type: "draw", amount: 1 },
      { type: "note", message: "Safety Cutoff ends the turn." },
      { type: "endTurn" },
    ],
  },
  ventCycle: {
    id: "ventCycle",
    name: "Vent Cycle",
    cost: 1,
    heat: -2,
    type: "vent",
    text: "Reduce Heat by 2. Gain 2 Energy.",
    actions: [{ type: "energy", amount: 2 }],
  },
  chillLine: {
    id: "chillLine",
    name: "Chill Line",
    cost: 1,
    heat: -2,
    type: "vent",
    text: "Reduce Heat by 2. Reflect 1.",
    actions: [{ type: "reflect", amount: 1 }],
  },
  pressureRelease: {
    id: "pressureRelease",
    name: "Pressure Release",
    cost: 1,
    heat: -4,
    type: "vent",
    text: "Reduce Heat by 4. Deal 1 damage.",
    actions: [{ type: "damage", amount: 1, useAttackBonus: false }],
  },
  siphonVent: {
    id: "siphonVent",
    name: "Siphon Vent",
    cost: 1,
    heat: -3,
    type: "vent",
    text: "Reduce Heat by 3. Draw 1. Gain 1 Energy.",
    actions: [
      { type: "draw", amount: 1 },
      { type: "energy", amount: 1 },
    ],
  },
  thermalBleed: {
    id: "thermalBleed",
    name: "Thermal Bleed",
    cost: 1,
    heat: -2,
    type: "vent",
    text: "Reduce Heat by 2. If Heat >= 8, draw 1.",
    actions: [
      {
        type: "ifHot",
        threshold: 8,
        actions: [{ type: "draw", amount: 1 }],
      },
    ],
  },
  turboCore: {
    id: "turboCore",
    name: "Turbo Core",
    cost: 2,
    heat: 2,
    type: "module",
    text: "+1 Energy each turn.",
    actions: [{ type: "module", name: "turboCore" }],
  },
  hotHands: {
    id: "hotHands",
    name: "Hot Hands",
    cost: 1,
    heat: 1,
    type: "module",
    text: "While Heat >= 8, draw +1 each turn.",
    actions: [{ type: "module", name: "hotHands" }],
  },
  overchargeCoils: {
    id: "overchargeCoils",
    name: "Overcharge Coils",
    cost: 2,
    heat: 1,
    type: "module",
    text: "While Heat >= 8, +1 damage.",
    actions: [{ type: "module", name: "overchargeCoils" }],
  },
  coolantLoop: {
    id: "coolantLoop",
    name: "Coolant Loop",
    cost: 1,
    heat: 0,
    type: "module",
    text: "At start of turn, reduce Heat by 1.",
    actions: [{ type: "module", name: "coolantLoop" }],
  },
  syncModule: {
    id: "syncModule",
    name: "Sync Module",
    cost: 1,
    heat: 1,
    type: "module",
    text: "First card each turn draws 1.",
    actions: [{ type: "module", name: "syncModule" }],
  },
  targetingSuite: {
    id: "targetingSuite",
    name: "Targeting Suite",
    cost: 2,
    heat: 1,
    type: "module",
    text: "+1 damage to attacks.",
    actions: [{ type: "module", name: "targetingSuite" }],
  },
  shieldWeave: {
    id: "shieldWeave",
    name: "Shield Weave",
    cost: 1,
    heat: 0,
    type: "module",
    text: "After you play an Attack, gain 1 armor.",
    actions: [{ type: "module", name: "shieldWeave" }],
  },
  energySiphon: {
    id: "energySiphon",
    name: "Energy Siphon",
    cost: 1,
    heat: 1,
    type: "module",
    text: "After you play a Shield, gain 1 Energy.",
    actions: [{ type: "module", name: "energySiphon" }],
  },
  ventCycleCore: {
    id: "ventCycleCore",
    name: "Vent Cycle Core",
    cost: 1,
    heat: 0,
    type: "module",
    text: "After you play a Vent, draw 1.",
    actions: [{ type: "module", name: "ventCycle" }],
  },
  heatBattery: {
    id: "heatBattery",
    name: "Heat Battery",
    cost: 2,
    heat: 2,
    type: "module",
    text: "At start of turn, if Heat >= 8, gain 1 Energy.",
    actions: [{ type: "module", name: "heatBattery" }],
  },
  stasisMatrix: {
    id: "stasisMatrix",
    name: "Stasis Matrix",
    cost: 2,
    heat: 1,
    type: "module",
    text: "At start of turn, gain 1 armor.",
    actions: [{ type: "module", name: "stasisMatrix" }],
  },
  overheatShield: {
    id: "overheatShield",
    name: "Overheat Shield",
    cost: 1,
    heat: 0,
    type: "module",
    text: "Overheat damage -1.",
    actions: [{ type: "module", name: "overheatShield" }],
  },
  overheatBurst: {
    id: "overheatBurst",
    name: "Overheat Burst",
    cost: 2,
    heat: 2,
    type: "module",
    text: "When you overheat, deal 2 damage.",
    actions: [{ type: "module", name: "overheatBurst" }],
  },
  handFan: {
    id: "handFan",
    name: "Hand Fan",
    cost: 1,
    heat: 0,
    type: "module",
    text: "Max hand size +1.",
    actions: [{ type: "module", name: "handFan" }],
  },
  heatDampener: {
    id: "heatDampener",
    name: "Heat Dampener",
    cost: 2,
    heat: 1,
    type: "module",
    text: "Reduce Heat gained from cards by 1.",
    actions: [{ type: "module", name: "heatReducer" }],
  },
};

const STARTER_DECK = [
  "sparkShot",
  "voltageSpike",
  "pulseDriver",
  "arcSlash",
  "fragmentPulse",
  "breachShot",
  "insulate",
  "flashGuard",
  "barrierField",
  "reactorShell",
  "coolantGuard",
  "reflectPlate",
  "coolantBurst",
  "stabilize",
  "powerSurge",
  "heatDump",
  "turboCore",
  "coolantLoop",
  "hotHands",
  "targetingSuite",
  "shieldWeave",
  "ventCycleCore",
  "plasmaLance",
  "shockWave",
  "phaseBuffer",
  "radiantPlating",
  "emergencyVent",
  "purgeHeat",
  "handFan",
  "overchargeCoils",
];

const ENEMY_LIBRARY = [
  {
    name: "Sentinel Drone",
    maxHp: 32,
    pattern: [
      { type: "attack", amount: 4 },
      { type: "attack", amount: 4 },
      { type: "charge", amount: 2 },
      { type: "bigAttack", amount: 7 },
    ],
  },
  {
    name: "Ash Marauder",
    maxHp: 36,
    pattern: [
      { type: "attack", amount: 5 },
      { type: "multi", amount: 2, hits: 3 },
      { type: "charge", amount: 2 },
      { type: "bigAttack", amount: 8 },
    ],
  },
  {
    name: "Cryo Warden",
    maxHp: 34,
    pattern: [
      { type: "attack", amount: 4 },
      { type: "pierce", amount: 5 },
      { type: "charge", amount: 2 },
      { type: "bigAttack", amount: 7 },
    ],
  },
  {
    name: "Pulse Stalker",
    maxHp: 30,
    pattern: [
      { type: "multi", amount: 3, hits: 2 },
      { type: "attack", amount: 4 },
      { type: "charge", amount: 2 },
      { type: "bigAttack", amount: 7 },
    ],
  },
  {
    name: "Iron Bulwark",
    maxHp: 40,
    pattern: [
      { type: "attack", amount: 5 },
      { type: "charge", amount: 3 },
      { type: "bigAttack", amount: 9 },
      { type: "attack", amount: 4 },
    ],
  },
];

const SETTINGS_KEY = "overcharge-settings";
const LOADOUT_KEY = "overcharge-loadout";
const SAVE_KEY = "overcharge-save";
const STATS_KEY = "overcharge-stats";
const DEFAULT_SETTINGS = {
  sound: "on",
  music: "on",
  musicVolume: 40,
  optimization: "full",
  cardSize: "medium",
  fontSize: "medium",
  autoEnd: "on",
  difficulty: "normal",
  theme: "dark",
  contrast: "normal",
  confirmEndTurn: "on",
};

const DEFAULT_STATS = {
  gamesWon: 0,
  gamesLost: 0,
  cardsPlayed: 0,
};

const state = {
  mode: "ai",
  players: [],
  selectedTargetIndex: null,
  loadoutCards: [],
  stats: { ...DEFAULT_STATS },
  enemy: {
    name: "Sentinel Drone",
    hp: 32,
    maxHp: 32,
    pattern: [],
    index: 0,
    buff: 0,
    damageMultiplier: 1,
  },
  turn: {
    number: 1,
    activeIndex: 0,
    playerPhase: true,
    firstCardPlayed: false,
  },
  log: [],
  gameOver: false,
  lastActionAt: Date.now(),
  inactiveHint: false,
  settings: { ...DEFAULT_SETTINGS },
};

const SOUND_FILES = {
  attack: "assets/sfx/attack.ogg",
  shield: "assets/sfx/shield.ogg",
  vent: "assets/sfx/vent.ogg",
  module: "assets/sfx/module.ogg",
  hit: "assets/sfx/hit.ogg",
  overheat: "assets/sfx/overheat.ogg",
  click: "assets/sfx/click.ogg",
};

const elements = {
  enemyName: document.getElementById("enemy-name"),
  enemyHpFill: document.getElementById("enemy-hp-fill"),
  enemyHpText: document.getElementById("enemy-hp-text"),
  enemyIntent: document.getElementById("enemy-intent"),
  battleLog: document.getElementById("battle-log"),
  playerHp: document.getElementById("player-hp"),
  playerArmor: document.getElementById("player-armor"),
  deckCount: document.getElementById("deck-count"),
  discardButton: document.getElementById("discard-button"),
  moduleList: document.getElementById("module-list"),
  discardPreviewList: document.getElementById("discard-preview-list"),
  energyRow: document.getElementById("energy-row"),
  energyText: document.getElementById("energy-text"),
  heatFill: document.getElementById("heat-fill"),
  heatText: document.getElementById("heat-text"),
  hand: document.getElementById("hand"),
  endTurn: document.getElementById("end-turn"),
  turnPill: document.getElementById("turn-pill"),
  game: document.getElementById("game"),
  startScreen: document.getElementById("start-screen"),
  vfxLayer: document.getElementById("vfx-layer"),
  startPlayers: document.getElementById("start-players"),
  targetRow: document.getElementById("target-row"),
  targetSelect: document.getElementById("target-select"),
  modeSelect: document.getElementById("mode-select"),
  playerCount: document.getElementById("player-count"),
  startRun: document.getElementById("start-run"),
  deckBuilderButton: document.getElementById("deck-builder-button"),
  restartButton: document.getElementById("restart-button"),
  infoButton: document.getElementById("info-button"),
  settingsButton: document.getElementById("settings-button"),
  deckButton: document.getElementById("deck-button"),
  discardModal: document.getElementById("discard-modal"),
  discardList: document.getElementById("discard-list"),
  deckModal: document.getElementById("deck-modal"),
  deckFilter: document.getElementById("deck-filter"),
  drawList: document.getElementById("draw-list"),
  deckDiscardList: document.getElementById("deck-discard-list"),
  deckBuilderModal: document.getElementById("deck-builder-modal"),
  deckBuilder: document.getElementById("deck-builder"),
  presetSelect: document.getElementById("preset-select"),
  deckClear: document.getElementById("deck-clear"),
  deckSave: document.getElementById("deck-save"),
  infoModal: document.getElementById("info-modal"),
  settingsModal: document.getElementById("settings-modal"),
  howToPlay: document.getElementById("how-to-play"),
  cardCatalog: document.getElementById("card-catalog"),
  enemyCatalog: document.getElementById("enemy-catalog"),
  audioCredits: document.getElementById("audio-credits"),
  settingSound: document.getElementById("setting-sound"),
  settingMusic: document.getElementById("setting-music"),
  settingMusicVolume: document.getElementById("setting-music-volume"),
  settingOptimization: document.getElementById("setting-optimization"),
  settingCardSize: document.getElementById("setting-card-size"),
  settingFontSize: document.getElementById("setting-font-size"),
  settingAutoEnd: document.getElementById("setting-auto-end"),
  settingConfirmEnd: document.getElementById("setting-confirm-end"),
  settingDifficulty: document.getElementById("setting-difficulty"),
  settingTheme: document.getElementById("setting-theme"),
  settingContrast: document.getElementById("setting-contrast"),
  endModal: document.getElementById("end-modal"),
  endTitle: document.getElementById("end-title"),
  endMessage: document.getElementById("end-message"),
  playAgain: document.getElementById("play-again"),
  backToMenu: document.getElementById("back-to-menu"),
  continueRun: document.getElementById("continue-run"),
  statsButton: document.getElementById("stats-button"),
  statsButtonTop: document.getElementById("stats-button-top"),
  statsModal: document.getElementById("stats-modal"),
  statsGrid: document.getElementById("stats-grid"),
};

const sounds = {};
const music = new Audio("assets/music/bg.ogg");
music.loop = true;

function loadSounds() {
  Object.entries(SOUND_FILES).forEach(([key, src]) => {
    const audio = new Audio(src);
    audio.preload = "auto";
    sounds[key] = audio;
  });
}

function playSound(key) {
  if (state.settings.sound !== "on") {
    return;
  }
  const audio = sounds[key];
  if (!audio) {
    return;
  }
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function applyMusicSettings() {
  music.volume = Math.min(1, Math.max(0, state.settings.musicVolume / 100));
  if (state.settings.music === "on") {
    music.play().catch(() => {});
  } else {
    music.pause();
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function logEvent(message) {
  state.log.push(message);
  state.log = state.log.slice(-120);
  renderLog();
}

function renderLog() {
  elements.battleLog.innerHTML = state.log
    .map((entry) => `<div>${entry}</div>`)
    .join("");
  elements.battleLog.scrollTop = elements.battleLog.scrollHeight;
}

function createPlayer(name) {
  return {
    name,
    hp: DEFAULT_PLAYER_HP,
    maxHp: DEFAULT_PLAYER_HP,
    armor: 0,
    energy: 0,
    heat: 0,
    deck: [],
    discard: [],
    hand: [],
    maxHandSize: HAND_SIZE,
    modules: {
      turboCore: 0,
      hotHands: 0,
      overchargeCoils: 0,
      coolantLoop: 0,
      syncModule: 0,
      targetingSuite: 0,
      shieldWeave: 0,
      energySiphon: 0,
      ventCycle: 0,
      heatBattery: 0,
      stasisMatrix: 0,
      overheatShield: 0,
      overheatBurst: 0,
      handFan: 0,
      heatReducer: 0,
    },
    reflect: 0,
    alive: true,
  };
}

function hydratePlayer(data) {
  const base = createPlayer(data.name || "Runner");
  base.hp = data.hp ?? base.hp;
  base.maxHp = data.maxHp ?? base.maxHp;
  base.armor = data.armor ?? base.armor;
  base.energy = data.energy ?? base.energy;
  base.heat = data.heat ?? base.heat;
  base.deck = Array.isArray(data.deck) ? data.deck : [];
  base.discard = Array.isArray(data.discard) ? data.discard : [];
  base.hand = Array.isArray(data.hand) ? data.hand : [];
  base.reflect = data.reflect ?? base.reflect;
  base.alive = data.alive ?? base.alive;
  base.maxHandSize = data.maxHandSize ?? base.maxHandSize;
  base.color = data.color || base.color;
  base.modules = { ...base.modules, ...(data.modules || {}) };
  return base;
}

function initializeDeck(player, extraCards = []) {
  const extras = extraCards.slice(0, MAX_BONUS_CARDS);
  player.deck = shuffle([...STARTER_DECK, ...extras]);
  player.discard = [];
  player.hand = [];
}

function drawCards(player, count) {
  for (let i = 0; i < count; i += 1) {
    if (player.deck.length === 0) {
      if (player.discard.length === 0) {
        return;
      }
      player.deck = shuffle([...player.discard]);
      player.discard = [];
      logEvent(`${player.name} reshuffles the discard into the deck.`);
    }
    const cardId = player.deck.pop();
    player.hand.push(cardId);
  }
}

function getAttackBonus(player) {
  if (player.heat < OVERCHARGE_THRESHOLD) {
    return player.modules.targetingSuite;
  }
  return 1 + player.modules.overchargeCoils + player.modules.targetingSuite;
}

function getCardCost(card, player) {
  if (!state.turn.firstCardPlayed && player.heat >= OVERCHARGE_THRESHOLD) {
    return Math.max(0, card.cost - 1);
  }
  return card.cost;
}

function applyHeat(player, amount) {
  let adjusted = amount;
  if (amount > 0 && player.modules.heatReducer > 0) {
    adjusted = Math.max(0, amount - player.modules.heatReducer);
  }
  player.heat = Math.max(0, player.heat + adjusted);
}

function takeDamage(target, amount) {
  if (amount <= 0) {
    return 0;
  }
  let remaining = amount;
  if (target.armor > 0) {
    const blocked = Math.min(target.armor, remaining);
    target.armor -= blocked;
    remaining -= blocked;
  }
  if (remaining > 0) {
    target.hp -= remaining;
  }
  return remaining;
}

function takeDamageIgnoreArmor(target, amount) {
  if (amount <= 0) {
    return;
  }
  target.hp -= amount;
}

function updateDefeatedPlayers() {
  state.players.forEach((player) => {
    if (player.alive && player.hp <= 0) {
      player.alive = false;
      player.hp = 0;
      logEvent(`${player.name} is out.`);
    }
  });
}

function checkGameOver() {
  if (state.gameOver) {
    return true;
  }

  if (state.mode === "ai") {
    const player = state.players[0];
    if (state.enemy.hp <= 0) {
      state.gameOver = true;
      logEvent("Enemy core ruptured. You win.");
      showEndModal("YOU WIN!!", "Enemy core ruptured. You survive the redline.");
      state.stats.gamesWon += 1;
      saveStats();
      clearSavedMatch();
      return true;
    }
    if (player.hp <= 0) {
      state.gameOver = true;
      logEvent("Your core flickers out. Run failed.");
      showEndModal("RUN FAILED", "Your core flickers out. Try a cooler line next time.");
      state.stats.gamesLost += 1;
      saveStats();
      clearSavedMatch();
      return true;
    }
    return false;
  }

  updateDefeatedPlayers();
  const living = state.players.filter((player) => player.alive);
  if (living.length <= 1) {
    state.gameOver = true;
    if (living.length === 1) {
      logEvent(`${living[0].name} takes the core.`);
      showEndModal("YOU WIN!!", `${living[0].name} takes the core.`);
      if (state.players[0] && living[0].name === state.players[0].name) {
        state.stats.gamesWon += 1;
      } else {
        state.stats.gamesLost += 1;
      }
      saveStats();
      clearSavedMatch();
    } else {
      logEvent("No runners left standing.");
      showEndModal("DRAW", "No runners left standing.");
      saveStats();
      clearSavedMatch();
    }
    return true;
  }
  return false;
}

function flashDamage() {
  if (state.settings.optimization !== "full") {
    return;
  }
  const flash = document.createElement("div");
  flash.className = "damage-flash";
  document.body.appendChild(flash);
  flash.addEventListener("animationend", () => flash.remove());
}

function shakeElement(element) {
  element.classList.remove("hp-hit");
  element.offsetHeight;
  element.classList.add("hp-hit");
}

function spawnDamageNumber(target, amount) {
  if (state.settings.optimization !== "full") {
    return;
  }
  const rect = target.getBoundingClientRect();
  const damage = document.createElement("div");
  damage.className = "damage-float";
  damage.textContent = `-${amount}`;
  damage.style.left = `${rect.left + rect.width / 2}px`;
  damage.style.top = `${rect.top + rect.height / 2}px`;
  document.body.appendChild(damage);
  damage.addEventListener("animationend", () => damage.remove());
}

function triggerVfx(type) {
  if (state.settings.optimization !== "full") {
    return;
  }
  const burst = document.createElement("div");
  burst.className = `vfx-burst vfx-${type}`;
  elements.vfxLayer.appendChild(burst);
  burst.addEventListener("animationend", () => burst.remove());
}

function triggerOverheat(player) {
  const reduced = Math.max(1, OVERHEAT_DAMAGE - player.modules.overheatShield);
  player.hp -= reduced;
  player.heat = OVERHEAT_RESET;
  elements.game.classList.add("overheat");
  setTimeout(() => elements.game.classList.remove("overheat"), 300);
  flashDamage();
  playSound("overheat");
  shakeElement(elements.playerHp);
  spawnDamageNumber(elements.playerHp, reduced);
  logEvent(`${player.name} overheats for ${reduced} damage and resets to heat 6.`);
  if (player.modules.overheatBurst > 0) {
    const burstDamage = player.modules.overheatBurst * 2;
    dealToTarget(player, burstDamage, { label: "Overheat Burst" });
  }
}

function checkOverheat(player) {
  if (player.heat > MAX_HEAT) {
    triggerOverheat(player);
  }
}

function addModule(player, type) {
  player.modules[type] += 1;
  if (type === "handFan") {
    player.maxHandSize += 1;
  }
}

function getActivePlayer() {
  return state.players[state.turn.activeIndex];
}

function getNextLivingIndex(startIndex) {
  const total = state.players.length;
  for (let i = 1; i <= total; i += 1) {
    const nextIndex = (startIndex + i) % total;
    if (state.players[nextIndex].alive) {
      return nextIndex;
    }
  }
  return startIndex;
}

function getOpponent() {
  if (state.mode !== "pvp") {
    return null;
  }
  return state.players[getNextLivingIndex(state.turn.activeIndex)];
}

function markAction() {
  state.lastActionAt = Date.now();
  if (state.inactiveHint) {
    state.inactiveHint = false;
    render();
    return;
  }
  state.inactiveHint = false;
}

function getAvailableTargets() {
  if (state.mode !== "pvp") {
    return [];
  }
  return state.players
    .map((player, index) => ({ player, index }))
    .filter(({ player, index }) => index !== state.turn.activeIndex && player.alive);
}

function ensureTargetSelection() {
  const targets = getAvailableTargets();
  if (!targets.length) {
    state.selectedTargetIndex = null;
    return;
  }
  const valid = targets.some((target) => target.index === state.selectedTargetIndex);
  if (!valid) {
    state.selectedTargetIndex = targets[0].index;
  }
}

function getTargetPlayer() {
  if (state.mode !== "pvp") {
    return null;
  }
  ensureTargetSelection();
  const target = state.players[state.selectedTargetIndex];
  return target && target.alive ? target : getOpponent();
}

function hasPlayableCard(player) {
  return player.hand.some((cardId) => {
    const card = CARD_LIBRARY[cardId];
    return player.energy >= getCardCost(card, player);
  });
}

function dealToTarget(attacker, amount, options = {}) {
  const hits = options.hits || 1;
  const pierce = options.pierce || false;
  const label = options.label || "Attack";
  const total = amount * hits;

  shakeElement(elements.enemyHpText);
  spawnDamageNumber(elements.enemyHpText, total);

  if (state.mode === "ai") {
    state.enemy.hp -= total;
    logEvent(
      hits > 1
        ? `${label} hits ${hits} times for ${amount}.`
        : `${label} hits ${state.enemy.name} for ${amount}.`
    );
    playSound("hit");
    return;
  }

  const opponent = getTargetPlayer();
  if (!opponent) {
    return;
  }
  for (let i = 0; i < hits; i += 1) {
    if (pierce) {
      takeDamageIgnoreArmor(opponent, amount);
    } else {
      takeDamage(opponent, amount);
    }
  }
  logEvent(
    hits > 1
      ? `${label} hits ${opponent.name} ${hits} times for ${amount}.`
      : `${label} hits ${opponent.name} for ${amount}.`
  );
  playSound("hit");
  if (opponent.reflect > 0) {
    const reflected = opponent.reflect;
    opponent.reflect = 0;
    takeDamage(attacker, reflected);
    logEvent(`${opponent.name} reflects ${reflected} back.`);
    flashDamage();
  }
}

function applyAction(action, player, card) {
  switch (action.type) {
    case "damage": {
      const bonus = action.useAttackBonus ? getAttackBonus(player) : 0;
      const amount = action.amount + bonus;
      dealToTarget(player, amount, {
        label: card.name,
        hits: action.hits || 1,
        pierce: action.pierce || false,
      });
      break;
    }
    case "selfDamage": {
      takeDamage(player, action.amount);
      flashDamage();
      shakeElement(elements.playerHp);
      spawnDamageNumber(elements.playerHp, action.amount);
      logEvent(`${card.name} zaps ${player.name} for ${action.amount}.`);
      break;
    }
    case "armor": {
      player.armor += action.amount;
      logEvent(`${card.name} grants ${player.name} ${action.amount} armor.`);
      break;
    }
    case "energy": {
      player.energy += action.amount;
      logEvent(`${card.name} grants ${player.name} ${action.amount} energy.`);
      break;
    }
    case "draw": {
      drawCards(player, action.amount);
      logEvent(`${card.name} draws ${action.amount} card${action.amount === 1 ? "" : "s"}.`);
      break;
    }
    case "heat": {
      applyHeat(player, action.amount);
      logEvent(`${card.name} shifts heat by ${action.amount}.`);
      break;
    }
    case "reflect": {
      player.reflect = action.amount;
      logEvent(`${card.name} sets ${player.name} to reflect ${action.amount}.`);
      break;
    }
    case "heal": {
      const before = player.hp;
      player.hp = Math.min(player.maxHp, player.hp + action.amount);
      const healed = player.hp - before;
      logEvent(`${card.name} restores ${player.name} for ${healed}.`);
      break;
    }
    case "module": {
      addModule(player, action.name);
      logEvent(`${card.name} installs.`);
      break;
    }
    case "ifHot": {
      if (player.heat >= (action.threshold || OVERCHARGE_THRESHOLD)) {
        action.actions.forEach((inner) => applyAction(inner, player, card));
      }
      break;
    }
    case "endTurn": {
      endPlayerTurn();
      break;
    }
    case "note": {
      logEvent(action.message);
      break;
    }
    default:
      break;
  }
}

function applyCardEffect(card, player) {
  triggerVfx(card.type);
  playSound(card.type);
  if (card.actions) {
    card.actions.forEach((action) => applyAction(action, player, card));
    return;
  }
}

function playCard(index) {
  if (!state.turn.playerPhase || state.gameOver) {
    return;
  }
  const player = getActivePlayer();
  const cardId = player.hand[index];
  const card = CARD_LIBRARY[cardId];
  const cost = getCardCost(card, player);
  const isFirstCard = !state.turn.firstCardPlayed;
  if (player.energy < cost) {
    logEvent("Not enough energy.");
    return;
  }
  player.energy -= cost;
  state.turn.firstCardPlayed = true;
  player.hand.splice(index, 1);
  player.discard.push(cardId);
  state.stats.cardsPlayed += 1;
  saveStats();

  markAction();
  applyHeat(player, card.heat);
  if (player.modules.syncModule > 0 && isFirstCard) {
    drawCards(player, player.modules.syncModule);
    logEvent("Sync Module draws a card.");
  }
  applyCardEffect(card, player);
  if (card.type === "attack" && player.modules.shieldWeave > 0) {
    player.armor += player.modules.shieldWeave;
    logEvent(`${player.name} gains armor from Shield Weave.`);
  }
  if (card.type === "shield" && player.modules.energySiphon > 0) {
    player.energy += player.modules.energySiphon;
    logEvent(`${player.name} gains energy from Energy Siphon.`);
  }
  if (card.type === "vent" && player.modules.ventCycle > 0) {
    drawCards(player, player.modules.ventCycle);
    logEvent(`${player.name} draws from Vent Cycle.`);
  }
  checkOverheat(player);
  checkGameOver();
  render();
  saveMatchState();
}

function setEnemy(template) {
  state.enemy.name = template.name;
  state.enemy.hp = template.maxHp;
  state.enemy.maxHp = template.maxHp;
  state.enemy.pattern = template.pattern.map((action) => ({ ...action }));
  state.enemy.index = 0;
  state.enemy.buff = 0;
  state.enemy.damageMultiplier = 1;
}

function pickRandomEnemy() {
  const template = ENEMY_LIBRARY[Math.floor(Math.random() * ENEMY_LIBRARY.length)];
  setEnemy(template);
}

function updateEnemyIntent() {
  if (state.mode === "pvp") {
    const opponent = getOpponent();
    elements.enemyIntent.textContent = opponent ? "Awaiting input" : "No target";
    return;
  }

  const nextAction = state.enemy.pattern[state.enemy.index];
  let intent = "";
  const buffedAmount = nextAction && nextAction.amount ? nextAction.amount + state.enemy.buff : 0;
  const displayAmount = Math.max(1, Math.round(buffedAmount * state.enemy.damageMultiplier));
  if (nextAction && nextAction.type === "attack") {
    intent = `Attack ${displayAmount}`;
  } else if (nextAction && nextAction.type === "bigAttack") {
    intent = `Big attack ${displayAmount}`;
  } else if (nextAction && nextAction.type === "charge") {
    intent = `Charge +${nextAction.amount}`;
  } else if (nextAction && nextAction.type === "multi") {
    intent = `Multi ${displayAmount} x${nextAction.hits}`;
  } else if (nextAction && nextAction.type === "pierce") {
    intent = `Pierce ${displayAmount}`;
  } else {
    intent = "Scanning";
  }
  elements.enemyIntent.textContent = intent;
}

function enemyAct() {
  const player = getActivePlayer();
  const action = state.enemy.pattern[state.enemy.index];
  state.enemy.index = (state.enemy.index + 1) % state.enemy.pattern.length;

  if (action.type === "charge") {
    state.enemy.buff += action.amount;
    logEvent(`Enemy spools up. Next hit +${action.amount}.`);
    return;
  }

  const damage = action.amount + state.enemy.buff;
  state.enemy.buff = 0;
  const scaledDamage = Math.max(1, Math.round(damage * state.enemy.damageMultiplier));
  flashDamage();
  shakeElement(elements.playerHp);
  spawnDamageNumber(elements.playerHp, scaledDamage);

  if (action.type === "multi") {
    for (let i = 0; i < action.hits; i += 1) {
      takeDamage(player, scaledDamage);
    }
    logEvent(`Enemy strikes ${action.hits} times for ${scaledDamage}.`);
  } else if (action.type === "pierce") {
    takeDamageIgnoreArmor(player, scaledDamage);
    logEvent(`Enemy pierces for ${scaledDamage}.`);
  } else {
    takeDamage(player, scaledDamage);
    logEvent(`Enemy attacks for ${scaledDamage}.`);
  }

  playSound("hit");

  if (player.reflect > 0) {
    state.enemy.hp -= player.reflect;
    logEvent(`Reflect snaps back for ${player.reflect}.`);
    player.reflect = 0;
  }
}

function startPlayerTurn() {
  state.turn.playerPhase = true;
  state.turn.firstCardPlayed = false;
  state.turn.number += 1;
  const player = getActivePlayer();
  player.energy = BASE_ENERGY + player.modules.turboCore;

  if (player.modules.heatBattery > 0 && player.heat >= OVERCHARGE_THRESHOLD) {
    player.energy += player.modules.heatBattery;
    logEvent(`${player.name} draws energy from Heat Battery.`);
  }

  if (player.modules.stasisMatrix > 0) {
    player.armor += player.modules.stasisMatrix;
    logEvent(`${player.name} gains ${player.modules.stasisMatrix} armor from Stasis Matrix.`);
  }

  if (player.modules.coolantLoop > 0 && player.heat > 0) {
    applyHeat(player, -player.modules.coolantLoop);
    logEvent(`${player.name} bleeds off heat.`);
  }

  const drawBase = Math.max(0, player.maxHandSize - player.hand.length);
  const hotHandsBonus =
    player.modules.hotHands > 0 && player.heat >= OVERCHARGE_THRESHOLD ? player.modules.hotHands : 0;
  drawCards(player, drawBase + hotHandsBonus);

  if (state.mode === "ai") {
    logEvent("Your turn begins.");
  } else {
    logEvent(`${player.name}'s turn begins.`);
  }
  markAction();
}

function endPlayerTurn() {
  if (!state.turn.playerPhase || state.gameOver) {
    return;
  }
  state.turn.playerPhase = false;
  markAction();

  if (state.mode === "ai") {
    logEvent("Enemy phase.");
    enemyAct();
    checkOverheat(getActivePlayer());
    if (checkGameOver()) {
      render();
      clearSavedMatch();
      return;
    }
    startPlayerTurn();
    render();
    saveMatchState();
    return;
  }

  state.turn.activeIndex = getNextLivingIndex(state.turn.activeIndex);
  if (checkGameOver()) {
    render();
    clearSavedMatch();
    return;
  }
  startPlayerTurn();
  render();
  saveMatchState();
}

function renderHand() {
  elements.hand.innerHTML = "";
  const player = getActivePlayer();
  const showHint = state.inactiveHint && state.turn.playerPhase && !state.gameOver;
  player.hand.forEach((cardId, index) => {
    const card = CARD_LIBRARY[cardId];
    const cardElement = document.createElement("div");
    cardElement.className = `card animated-border ${card.type}`;
    const cost = getCardCost(card, player);
    const playable = player.energy >= cost && state.turn.playerPhase && !state.gameOver;
    if (!playable) {
      cardElement.classList.add("disabled");
    } else if (showHint) {
      cardElement.classList.add("playable-hint");
    }
    const heatText = card.heat >= 0 ? `+${card.heat}` : `${card.heat}`;
    cardElement.innerHTML = `
      <div class="card-header">
        <div class="card-title">${card.name}</div>
        <div class="card-cost">${cost}E</div>
      </div>
      <div class="card-type">${card.type}</div>
      <div class="card-text">${card.text}</div>
      <div class="card-heat">Heat ${heatText}</div>
    `;
    cardElement.addEventListener("click", () => playCard(index));
    elements.hand.appendChild(cardElement);
  });
}

function renderModules() {
  const player = getActivePlayer();
  const modules = [];
  if (player.modules.turboCore > 0) {
    modules.push(`Turbo Core x${player.modules.turboCore}`);
  }
  if (player.modules.hotHands > 0) {
    modules.push(`Hot Hands x${player.modules.hotHands}`);
  }
  if (player.modules.overchargeCoils > 0) {
    modules.push(`Overcharge Coils x${player.modules.overchargeCoils}`);
  }
  if (player.modules.coolantLoop > 0) {
    modules.push(`Coolant Loop x${player.modules.coolantLoop}`);
  }
  if (player.modules.syncModule > 0) {
    modules.push(`Sync Module x${player.modules.syncModule}`);
  }
  if (player.modules.targetingSuite > 0) {
    modules.push(`Targeting Suite x${player.modules.targetingSuite}`);
  }
  if (player.modules.shieldWeave > 0) {
    modules.push(`Shield Weave x${player.modules.shieldWeave}`);
  }
  if (player.modules.energySiphon > 0) {
    modules.push(`Energy Siphon x${player.modules.energySiphon}`);
  }
  if (player.modules.ventCycle > 0) {
    modules.push(`Vent Cycle x${player.modules.ventCycle}`);
  }
  if (player.modules.heatBattery > 0) {
    modules.push(`Heat Battery x${player.modules.heatBattery}`);
  }
  if (player.modules.stasisMatrix > 0) {
    modules.push(`Stasis Matrix x${player.modules.stasisMatrix}`);
  }
  if (player.modules.overheatShield > 0) {
    modules.push(`Overheat Shield x${player.modules.overheatShield}`);
  }
  if (player.modules.overheatBurst > 0) {
    modules.push(`Overheat Burst x${player.modules.overheatBurst}`);
  }
  if (player.modules.handFan > 0) {
    modules.push(`Hand Fan x${player.modules.handFan}`);
  }
  if (player.modules.heatReducer > 0) {
    modules.push(`Heat Dampener x${player.modules.heatReducer}`);
  }
  elements.moduleList.textContent = modules.length ? modules.join(" | ") : "None";
}

function renderDiscardPreview() {
  const player = getActivePlayer();
  if (!elements.discardPreviewList) {
    return;
  }
  const recent = player.discard.slice(-5).reverse();
  const entries = recent.map((cardId) => CARD_LIBRARY[cardId].name);
  elements.discardPreviewList.innerHTML = entries.length
    ? entries.map((entry) => `<div>${entry}</div>`).join("")
    : "<div>Empty</div>";
}

function renderTargetSelector() {
  if (!elements.targetRow || !elements.targetSelect) {
    return;
  }
  const targets = getAvailableTargets();
  if (state.mode !== "pvp" || targets.length <= 1) {
    elements.targetRow.classList.add("hidden");
    return;
  }
  if (targets.length === 1) {
    state.selectedTargetIndex = targets[0].index;
  }
  elements.targetRow.classList.remove("hidden");
  elements.targetSelect.innerHTML = targets
    .map(
      (target) =>
        `<option value="${target.index}">${target.player.name} (${target.player.hp})</option>`
    )
    .join("");
  ensureTargetSelection();
  if (state.selectedTargetIndex !== null) {
    elements.targetSelect.value = String(state.selectedTargetIndex);
  }
}

function renderMeters() {
  const player = getActivePlayer();
  const heatPercent = Math.min(100, (player.heat / MAX_HEAT) * 100);
  elements.heatFill.style.width = `${heatPercent}%`;
  elements.heatText.textContent = `${player.heat} / ${MAX_HEAT}`;
  elements.energyText.textContent = `${player.energy} Energy`;

  elements.energyRow.innerHTML = "";
  const pipCount = Math.max(6, player.energy);
  for (let i = 0; i < pipCount; i += 1) {
    const pip = document.createElement("div");
    pip.className = "energy-pip";
    if (i < player.energy) {
      pip.classList.add("active");
    }
    elements.energyRow.appendChild(pip);
  }

  if (player.heat >= OVERCHARGE_THRESHOLD) {
    elements.game.classList.add("overcharge");
  } else {
    elements.game.classList.remove("overcharge");
  }
}

function renderStats() {
  const player = getActivePlayer();
  if (player.color) {
    elements.turnPill.style.borderColor = player.color;
    elements.turnPill.style.color = player.color;
  }
  elements.playerHp.textContent = `${player.hp} / ${player.maxHp}`;
  elements.playerArmor.textContent = player.armor;
  elements.deckCount.textContent = player.deck.length;
  elements.discardButton.textContent = player.discard.length;

  let opponentName = state.enemy.name;
  let opponentHp = state.enemy.hp;
  let opponentMax = state.enemy.maxHp;
  if (state.mode === "pvp") {
    const opponent = getTargetPlayer();
    opponentName = opponent ? opponent.name : "No target";
    opponentHp = opponent ? opponent.hp : 0;
    opponentMax = opponent ? opponent.maxHp : 0;
  }
  elements.enemyName.textContent = opponentName;

  const enemyHpPercent = opponentMax > 0 ? Math.max(0, (opponentHp / opponentMax) * 100) : 0;
  elements.enemyHpFill.style.width = `${enemyHpPercent}%`;
  elements.enemyHpText.textContent = `HP ${opponentHp} / ${opponentMax}`;

  const turnLabel = state.mode === "pvp" ? `${player.name}` : "Runner";
  elements.turnPill.textContent = `Turn ${state.turn.number} � ${turnLabel}`;
}

function render() {
  renderStats();
  renderMeters();
  renderModules();
  renderDiscardPreview();
  renderHand();
  renderLog();
  updateEnemyIntent();
  renderTargetSelector();
  elements.endTurn.disabled = !state.turn.playerPhase || state.gameOver;
}

function setMenuState() {
  elements.playerCount.disabled = elements.modeSelect.value !== "pvp";
}

function openModal(modal) {
  modal.classList.remove("hidden");
}

function closeModal(modal) {
  modal.classList.add("hidden");
}

function showEndModal(title, message) {
  elements.endTitle.textContent = title;
  elements.endMessage.textContent = message;
  openModal(elements.endModal);
}

function backToMenu() {
  closeModal(elements.endModal);
  elements.game.classList.add("hidden");
  elements.startScreen.classList.remove("hidden");
}

function anyModalOpen() {
  return document.querySelector(".modal:not(.hidden)") !== null;
}

function handleHotkeys(event) {
  if (event.target && ["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName)) {
    return;
  }
  if (anyModalOpen()) {
    return;
  }
  const key = event.key.toLowerCase();
  if (key >= "1" && key <= "9") {
    const index = Number(key) - 1;
    playCard(index);
    return;
  }
  if (key === "e") {
    elements.endTurn.click();
  } else if (key === "d") {
    renderDeckModal();
    openModal(elements.deckModal);
  } else if (key === "i") {
    openModal(elements.infoModal);
  } else if (key === "s") {
    openModal(elements.settingsModal);
  } else if (key === "r") {
    confirmRestart();
  }
}

function renderDiscardList() {
  const player = getActivePlayer();
  const counts = {};
  player.discard.forEach((cardId) => {
    counts[cardId] = (counts[cardId] || 0) + 1;
  });
  const list = Object.keys(counts).length
    ? Object.entries(counts)
        .map(([cardId, count]) => {
          const card = CARD_LIBRARY[cardId];
          return `<div>${card.name} x${count}</div>`;
        })
        .join("")
    : "<div>Discard pile is empty.</div>";
  elements.discardList.innerHTML = list;
}

function renderDeckModal() {
  if (!elements.deckFilter) {
    return;
  }
  const player = getActivePlayer();
  const filter = elements.deckFilter.value;
  const filterFn = (cardId) => {
    if (filter === "all") {
      return true;
    }
    return CARD_LIBRARY[cardId].type === filter;
  };
  const renderPile = (pile) => {
    const counts = {};
    pile.filter(filterFn).forEach((cardId) => {
      counts[cardId] = (counts[cardId] || 0) + 1;
    });
    return (
      Object.entries(counts)
        .map(([cardId, count]) => `<div>${CARD_LIBRARY[cardId].name} x${count}</div>`)
        .join("") || "<div>Empty</div>"
    );
  };
  elements.drawList.innerHTML = renderPile(player.deck);
  elements.deckDiscardList.innerHTML = renderPile(player.discard);
}

function buildDeckBuilder() {
  if (!elements.deckBuilder) {
    return;
  }
  const types = ["attack", "shield", "module", "vent"];
  elements.deckBuilder.innerHTML = types
    .map((type) => {
      const options = Object.values(CARD_LIBRARY)
        .filter((card) => card.type === type)
        .map((card) => `<option value="${card.id}">${card.name}</option>`)
        .join("");
      return `<optgroup label="${type}">${options}</optgroup>`;
    })
    .join("");
  state.loadoutCards.forEach((id) => {
    const option = elements.deckBuilder.querySelector(`option[value="${id}"]`);
    if (option) {
      option.selected = true;
    }
  });
}

function applyPreset(name) {
  const preset = DECK_PRESETS[name] || [];
  Array.from(elements.deckBuilder.options).forEach((option) => {
    option.selected = preset.includes(option.value);
  });
}

function updateDeckBuilderLabel() {
  if (!elements.deckBuilderButton) {
    return;
  }
  const count = state.loadoutCards.length;
  elements.deckBuilderButton.textContent = count ? `Deck Builder (${count})` : "Deck Builder";
}

function renderStartPlayers() {
  if (!elements.startPlayers) {
    return;
  }
  const total = elements.modeSelect.value === "pvp" ? Number(elements.playerCount.value) : 1;
  elements.startPlayers.innerHTML = Array.from({ length: total }).map((_, index) => {
    const color = DEFAULT_COLORS[index % DEFAULT_COLORS.length];
    return `
      <div class="player-config">
        <input type="text" value="Runner ${index + 1}" data-player-name="${index}" />
        <span>Color</span>
        <input type="color" value="${color}" data-player-color="${index}" />
      </div>
    `;
  }).join("");
}

function readStartPlayers() {
  const configs = [];
  const nameInputs = elements.startPlayers.querySelectorAll("[data-player-name]");
  const colorInputs = elements.startPlayers.querySelectorAll("[data-player-color]");
  nameInputs.forEach((input, index) => {
    const color = colorInputs[index] ? colorInputs[index].value : DEFAULT_COLORS[index % DEFAULT_COLORS.length];
    configs.push({ name: input.value.trim() || `Runner ${index + 1}`, color });
  });
  return configs;
}

function loadLoadout() {
  const stored = localStorage.getItem(LOADOUT_KEY);
  if (!stored) {
    return;
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      state.loadoutCards = parsed.filter((id) => CARD_LIBRARY[id]).slice(0, MAX_BONUS_CARDS);
    }
  } catch {
    state.loadoutCards = [];
  }
}

function saveLoadout(cards) {
  state.loadoutCards = cards.slice(0, MAX_BONUS_CARDS);
  localStorage.setItem(LOADOUT_KEY, JSON.stringify(state.loadoutCards));
  updateDeckBuilderLabel();
}

function loadStats() {
  const stored = localStorage.getItem(STATS_KEY);
  if (stored) {
    try {
      state.stats = { ...DEFAULT_STATS, ...JSON.parse(stored) };
      return;
    } catch {
      state.stats = { ...DEFAULT_STATS };
    }
  }
  state.stats = { ...DEFAULT_STATS };
}

function saveStats() {
  localStorage.setItem(STATS_KEY, JSON.stringify(state.stats));
}

function renderStatsModal() {
  if (!elements.statsGrid) {
    return;
  }
  elements.statsGrid.innerHTML = [
    `<div class="stats-row"><span>Games Won</span><span>${state.stats.gamesWon}</span></div>`,
    `<div class="stats-row"><span>Games Lost</span><span>${state.stats.gamesLost}</span></div>`,
    `<div class="stats-row"><span>Cards Played</span><span>${state.stats.cardsPlayed}</span></div>`,
  ].join("");
}

function saveMatchState() {
  const payload = {
    mode: state.mode,
    players: state.players,
    enemy: state.enemy,
    turn: state.turn,
    log: state.log,
    selectedTargetIndex: state.selectedTargetIndex,
    timestamp: Date.now(),
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  updateContinueButton();
}

function clearSavedMatch() {
  localStorage.removeItem(SAVE_KEY);
  updateContinueButton();
}

function updateContinueButton() {
  if (!elements.continueRun) {
    return;
  }
  const saved = localStorage.getItem(SAVE_KEY);
  elements.continueRun.disabled = !saved;
}

function continueMatch() {
  const stored = localStorage.getItem(SAVE_KEY);
  if (!stored) {
    return;
  }
  try {
    const payload = JSON.parse(stored);
    state.mode = payload.mode || "ai";
    state.players = Array.isArray(payload.players)
      ? payload.players.map((player) => hydratePlayer(player))
      : [];
    state.enemy = { ...state.enemy, ...(payload.enemy || {}) };
    state.enemy.damageMultiplier = payload.enemy?.damageMultiplier ?? 1;
    state.turn = payload.turn || state.turn;
    state.log = payload.log || [];
    state.selectedTargetIndex = payload.selectedTargetIndex ?? null;
    state.gameOver = false;
    render();
    elements.startScreen.classList.add("hidden");
    elements.game.classList.remove("hidden");
    applyMusicSettings();
  } catch {
    clearSavedMatch();
  }
}

function buildInfoMenu() {
  elements.howToPlay.innerHTML = `
    <h3>Core Rules</h3>
    <ul>
      <li>Gain Energy, draw up to hand size, play cards, then enemy acts.</li>
      <li>Cards cost Energy and add Heat. Heat 8+ grants Overcharge bonuses.</li>
      <li>If Heat exceeds 10, you overheat: take 3 damage and reset to heat 6.</li>
      <li>Modules are passive for the rest of the fight.</li>
      <li>In PvP, players rotate turns until one runner remains.</li>
    </ul>
  `;

  const types = ["attack", "shield", "module", "vent"];
  const cardGroups = types
    .map((type) => {
      const cards = Object.values(CARD_LIBRARY)
        .filter((card) => card.type === type)
        .map((card) => `<li>${card.name} (${card.cost}E, Heat ${card.heat >= 0 ? `+${card.heat}` : card.heat}): ${card.text}</li>`)
        .join("");
      return `<h3>${type}</h3><ul>${cards}</ul>`;
    })
    .join("");
  elements.cardCatalog.innerHTML = `<h3>Card Catalog</h3>${cardGroups}`;

  const enemies = ENEMY_LIBRARY.map((enemy) => {
    const pattern = enemy.pattern
      .map((action) => `${action.type} ${action.amount}${action.hits ? ` x${action.hits}` : ""}`)
      .join(" ? ");
    return `<li>${enemy.name} (${enemy.maxHp} HP): ${pattern}</li>`;
  }).join("");
  elements.enemyCatalog.innerHTML = `<h3>Enemy Patterns</h3><ul>${enemies}</ul>`;

  elements.audioCredits.innerHTML = `
    <h3>Audio Credits</h3>
    <ul>
      <li>Sound effects and background ambience from the Google Actions Sound Library.</li>
    </ul>
  `;
}

function getDifficultySettings() {
  if (state.settings.difficulty === "easy") {
    return { enemyHp: 0.85, enemyDamage: 0.85 };
  }
  if (state.settings.difficulty === "hard") {
    return { enemyHp: 1.2, enemyDamage: 1.2 };
  }
  if (state.settings.difficulty === "brutal") {
    return { enemyHp: 1.4, enemyDamage: 1.35 };
  }
  return { enemyHp: 1, enemyDamage: 1 };
}

function applySettings() {
  const themeClasses = ["theme-dark", "theme-light", "theme-neon", "theme-dusk", "theme-solar"];
  themeClasses.forEach((themeClass) => document.body.classList.remove(themeClass));
  document.body.classList.add(`theme-${state.settings.theme}`);
  const reduced = state.settings.optimization !== "full";
  document.body.classList.toggle("reduced-motion", reduced);
  document.body.classList.toggle("minimal-effects", state.settings.optimization === "minimal");
  document.body.classList.toggle("high-contrast", state.settings.contrast === "high");
  const cardSizeMap = {
    small: { width: 150, height: 220 },
    medium: { width: 168, height: 240 },
    large: { width: 190, height: 260 },
  };
  const fontSizeMap = {
    small: 14,
    medium: 15,
    large: 16,
  };
  const cardSize = cardSizeMap[state.settings.cardSize] || cardSizeMap.medium;
  const fontSize = fontSizeMap[state.settings.fontSize] || fontSizeMap.medium;
  document.documentElement.style.setProperty("--card-width", `${cardSize.width}px`);
  document.documentElement.style.setProperty("--card-height", `${cardSize.height}px`);
  document.documentElement.style.setProperty("--base-font", `${fontSize}px`);
  state.settings.sound = elements.settingSound.value;
  applyMusicSettings();
}

function loadSettings() {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored) {
    try {
      state.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
      state.settings = { ...DEFAULT_SETTINGS };
    }
  }
  state.settings.musicVolume = Number(state.settings.musicVolume) || DEFAULT_SETTINGS.musicVolume;
  elements.settingSound.value = state.settings.sound;
  elements.settingMusic.value = state.settings.music;
  elements.settingMusicVolume.value = state.settings.musicVolume;
  elements.settingOptimization.value = state.settings.optimization;
  elements.settingCardSize.value = state.settings.cardSize;
  elements.settingFontSize.value = state.settings.fontSize;
  elements.settingAutoEnd.value = state.settings.autoEnd;
  elements.settingConfirmEnd.value = state.settings.confirmEndTurn;
  elements.settingDifficulty.value = state.settings.difficulty;
  elements.settingTheme.value = state.settings.theme;
  elements.settingContrast.value = state.settings.contrast;
  applySettings();
}

function saveSettings() {
  state.settings.sound = elements.settingSound.value;
  state.settings.music = elements.settingMusic.value;
  state.settings.musicVolume = Number(elements.settingMusicVolume.value);
  state.settings.optimization = elements.settingOptimization.value;
  state.settings.cardSize = elements.settingCardSize.value;
  state.settings.fontSize = elements.settingFontSize.value;
  state.settings.autoEnd = elements.settingAutoEnd.value;
  state.settings.confirmEndTurn = elements.settingConfirmEnd.value;
  state.settings.difficulty = elements.settingDifficulty.value;
  state.settings.theme = elements.settingTheme.value;
  state.settings.contrast = elements.settingContrast.value;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
  applySettings();
}

function checkIdleTimers() {
  if (!state.turn.playerPhase || state.gameOver) {
    state.inactiveHint = false;
    return;
  }
  const idleFor = Date.now() - state.lastActionAt;
  const wasHint = state.inactiveHint;
  state.inactiveHint = idleFor >= INACTIVE_HINT_MS;
  if (wasHint !== state.inactiveHint) {
    render();
  }
  if (state.settings.autoEnd === "on" && idleFor >= AUTO_END_MS) {
    endPlayerTurn();
  }
}

function startGame() {
  clearSavedMatch();
  state.mode = elements.modeSelect.value;
  state.log = [];
  state.gameOver = false;
  state.selectedTargetIndex = null;
  state.turn = {
    number: 1,
    activeIndex: 0,
    playerPhase: true,
    firstCardPlayed: false,
  };

  const playerTotal = state.mode === "pvp" ? Number(elements.playerCount.value) : 1;
  const configs = readStartPlayers();
  state.players = [];
  for (let i = 0; i < playerTotal; i += 1) {
    const config = configs[i] || { name: `Runner ${i + 1}`, color: DEFAULT_COLORS[i % DEFAULT_COLORS.length] };
    const player = createPlayer(config.name);
    player.color = config.color;
    initializeDeck(player, state.loadoutCards);
    drawCards(player, HAND_SIZE);
    state.players.push(player);
  }

  if (state.mode === "ai") {
    pickRandomEnemy();
    const diff = getDifficultySettings();
    state.enemy.maxHp = Math.round(state.enemy.maxHp * diff.enemyHp);
    state.enemy.hp = state.enemy.maxHp;
    state.enemy.damageMultiplier = diff.enemyDamage;
  }

  logEvent("Core online. Keep the heat under control.");
  logEvent(START_TIPS[Math.floor(Math.random() * START_TIPS.length)]);
  render();
  elements.startScreen.classList.add("hidden");
  elements.game.classList.remove("hidden");
  closeModal(elements.endModal);
  applyMusicSettings();
  markAction();
  saveMatchState();
}

function confirmRestart() {
  if (window.confirm("Restart the run? Current progress will be lost.")) {
    startGame();
  }
}

function bindModalEvents() {
  document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const modal = event.target.closest(".modal");
      if (modal) {
        closeModal(modal);
      }
    });
  });
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });
}

loadSettings();
loadSounds();
buildInfoMenu();
loadLoadout();
updateDeckBuilderLabel();
loadStats();
setMenuState();
renderStartPlayers();
elements.game.classList.add("hidden");
updateContinueButton();

elements.modeSelect.addEventListener("change", () => {
  setMenuState();
  renderStartPlayers();
});
elements.playerCount.addEventListener("change", renderStartPlayers);
elements.startRun.addEventListener("click", () => {
  playSound("click");
  startGame();
});
elements.endTurn.addEventListener("click", () => {
  playSound("click");
  if (
    state.settings.confirmEndTurn === "on" &&
    state.turn.playerPhase &&
    !state.gameOver &&
    hasPlayableCard(getActivePlayer())
  ) {
    if (!window.confirm("You still have playable cards. End turn?")) {
      return;
    }
  }
  endPlayerTurn();
});
elements.restartButton.addEventListener("click", confirmRestart);
elements.infoButton.addEventListener("click", () => openModal(elements.infoModal));
elements.settingsButton.addEventListener("click", () => openModal(elements.settingsModal));
elements.deckButton.addEventListener("click", () => {
  renderDeckModal();
  openModal(elements.deckModal);
});
elements.discardButton.addEventListener("click", () => {
  renderDiscardList();
  openModal(elements.discardModal);
});
elements.deckFilter.addEventListener("change", renderDeckModal);
elements.deckBuilderButton.addEventListener("click", () => {
  buildDeckBuilder();
  if (elements.presetSelect) {
    elements.presetSelect.value = "balanced";
  }
  openModal(elements.deckBuilderModal);
});
if (elements.presetSelect) {
  elements.presetSelect.addEventListener("change", (event) => {
    applyPreset(event.target.value);
  });
}
elements.deckSave.addEventListener("click", () => {
  const selected = Array.from(elements.deckBuilder.selectedOptions).map((option) => option.value);
  if (selected.length > MAX_BONUS_CARDS) {
    window.alert(`Pick up to ${MAX_BONUS_CARDS} cards.`);
    return;
  }
  saveLoadout(selected);
  closeModal(elements.deckBuilderModal);
});
elements.deckClear.addEventListener("click", () => {
  Array.from(elements.deckBuilder.options).forEach((option) => {
    option.selected = false;
  });
  saveLoadout([]);
});
elements.targetSelect.addEventListener("change", (event) => {
  state.selectedTargetIndex = Number(event.target.value);
  render();
});
elements.playAgain.addEventListener("click", () => {
  closeModal(elements.endModal);
  startGame();
});
elements.backToMenu.addEventListener("click", backToMenu);
elements.settingSound.addEventListener("change", saveSettings);
elements.settingMusic.addEventListener("change", saveSettings);
elements.settingMusicVolume.addEventListener("input", saveSettings);
elements.settingOptimization.addEventListener("change", saveSettings);
elements.settingCardSize.addEventListener("change", saveSettings);
elements.settingFontSize.addEventListener("change", saveSettings);
elements.settingAutoEnd.addEventListener("change", saveSettings);
elements.settingConfirmEnd.addEventListener("change", saveSettings);
elements.settingDifficulty.addEventListener("change", saveSettings);
elements.settingTheme.addEventListener("change", saveSettings);
elements.settingContrast.addEventListener("change", saveSettings);
if (elements.continueRun) {
  elements.continueRun.addEventListener("click", continueMatch);
}
if (elements.statsButton) {
  elements.statsButton.addEventListener("click", () => {
    renderStatsModal();
    openModal(elements.statsModal);
  });
}
if (elements.statsButtonTop) {
  elements.statsButtonTop.addEventListener("click", () => {
    renderStatsModal();
    openModal(elements.statsModal);
  });
}

document.addEventListener("pointerdown", markAction);
document.addEventListener("keydown", (event) => {
  markAction();
  handleHotkeys(event);
});

bindModalEvents();
setInterval(checkIdleTimers, 1000);

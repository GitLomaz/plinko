/**
 * TokenConfig.js
 * Configuration for prestige token upgrades
 */

export const TOKEN_CONFIGS = [
  {
    id: 0,
    name: "Ball Value Multiplier",
    level: 1,
    valueModifier: 1.1,
    value: 100,
    costModifier: 1.8,
    cost: 5,
    maxLevel: null
  },
  {
    id: 1,
    name: "Despawn Chance Reduction",
    level: 1,
    value: 30,
    costModifier: 1.8,
    cost: 10,
    maxLevel: 31
  },
  {
    id: 2,
    name: "2x Ball Spawn Chance",
    level: 1,
    value: 0,
    costModifier: 1.8,
    cost: 7.5,
    maxLevel: 51
  },
  {
    id: 3,
    name: "Click Explosion Size",
    level: 1,
    value: 100,
    costModifier: 1.8,
    cost: 2,
    maxLevel: 11
  },
  {
    id: 4,
    name: "Click Explosion Multiplier",
    level: 1,
    valueModifier: 1.1,
    value: 125,
    costModifier: 1.8,
    cost: 12,
    maxLevel: null
  },
  {
    id: 5,
    name: "Zone Cost Reduction",
    level: 1,
    value: 0,
    costModifier: 1.8,
    cost: 7.5,
    maxLevel: 51
  },
  {
    id: 6,
    name: "Zone Modifier Increase",
    level: 1,
    valueModifier: 1.1,
    value: 100,
    costModifier: 1.8,
    cost: 5,
    maxLevel: null
  },
  {
    id: 7,
    name: "Token Gain Multiplier",
    level: 1,
    valueModifier: 1.1,
    value: 100,
    costModifier: 1.8,
    cost: 10,
    maxLevel: null
  }
];

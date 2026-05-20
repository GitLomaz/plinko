/**
 * SpawnConfig.js
 * Configuration for ball spawn types
 */

export const SPAWN_CONFIGS = [
  {
    id: 0,
    cooldown: 300,
    value: 55,
    y: 90,
    stage: 1,
    speedModifier: 25,
    costModifier: 4.5,
    valueModifier: 1.8,
    cost: 20
  },
  {
    id: 1,
    cooldown: 350,
    value: 80,
    y: 70,
    stage: 1,
    speedModifier: 29,
    costModifier: 4.3,
    valueModifier: 1.8,
    cost: 100
  },
  {
    id: 2,
    cooldown: 400,
    value: 110,
    y: 50,
    stage: 1,
    speedModifier: 32,
    costModifier: 4.1,
    valueModifier: 1.8,
    cost: 1000
  },
  {
    id: 3,
    cooldown: 450,
    value: 150,
    y: 1530,
    stage: 2,
    speedModifier: 35,
    costModifier: 3.9,
    valueModifier: 1.85,
    cost: 7500
  },
  {
    id: 4,
    cooldown: 500,
    value: 170,
    y: 1550,
    stage: 2,
    speedModifier: 38,
    costModifier: 3.7,
    valueModifier: 1.85,
    cost: 20000
  },
  {
    id: 5,
    cooldown: 600,
    value: 190,
    y: 3070,
    stage: 3,
    speedModifier: 45,
    costModifier: 3.5,
    valueModifier: 1.88,
    cost: 60000
  },
  {
    id: 6,
    cooldown: 700,
    value: 220,
    y: 4570,
    stage: 4,
    speedModifier: 60,
    costModifier: 3.3,
    valueModifier: 1.89,
    cost: 250000
  },
  {
    id: 7,
    cooldown: 900,
    value: 250,
    y: 6070,
    stage: 5,
    speedModifier: 65,
    costModifier: 3.1,
    valueModifier: 1.92,
    cost: 1250000
  },
  {
    id: 8,
    cooldown: 1000,
    value: 320,
    y: 7570,
    stage: 6,
    speedModifier: 70,
    costModifier: 2.9,
    valueModifier: 1.95,
    cost: 5000000
  },
  {
    id: 9,
    cooldown: 1500,
    value: 780,
    y: 9070,
    stage: 6,
    speedModifier: 11,
    costModifier: 2.7,
    valueModifier: 2,
    cost: 500000000
  }
];

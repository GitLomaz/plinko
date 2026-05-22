/**
 * GameConfig.js
 * Central configuration for the Plinko game
 */

export const GAME_CONFIG = {
  width: 1108,
  height: 595,
  gravity: { x: 0, y: 0.0005, scale: 1 },
  physics: {
    default: 'matter',
    matter: {
      enableSleeping: false,
      gravityY: 0.0005,
      setBounds: {
        x: 0,
        y: 0,
        width: 1108,
        height: 2000
      }
    }
  },
  ball: {
    friction: 0.01,
    bounce: 0.5,
    maxBalls: 700
  },
  zone: {
    height: 1500,
    maxZones: 8,
    baseModifier: 0.8,
    modifierIncrement: 0.1,
    levelModifierIncrement: 0.05
  },
  ad: {
    initialCooldown: 60 * 30,  // 30 seconds in frames
    noadCooldown: 60 * 30,
    adCooldown: 60 * 90,
    bonusDuration: 180  // seconds
  },
  save: {
    autoSaveInterval: 2000  // frames
  }
};

export const ZONE_PRICES = [
  500,
  2500,
  50000,
  750000,
  15000000,
  150000000,
  2500000000,
  55000000000
];

export const ZONE_EFFECTS = [
  "Shrinks Zone Diamonds",
  "Increase Cross Rotation",
  "Shrinks Ramp Width",
  "Decrease Circle Radius",
  "Straightens Lines",
  "Increases Pusher Speed",
  "Increases Convayer Speed",
  "Widens Channel"
];

export const NUMBER_SUFFIXES = [
  "M", "B", "T", "Qd", "Qn", "Sx", "Sp", "Oc", "N", "Dc",
  "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NDc", "Vi"
];

export const PHASER_CONFIG = {
  type: Phaser.AUTO,
  width: GAME_CONFIG.width,
  height: GAME_CONFIG.height,
  parent: 'wrapper',
  physics: GAME_CONFIG.physics,
  render: {
    pixelArt: false,
    antialias: true,
    // roundPixels: true
  }
};

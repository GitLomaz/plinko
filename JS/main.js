/**
 * main.js
 * Main entry point for the Plinko game
 */

import { PHASER_CONFIG } from './config/GameConfig.js';
import { TitleScene } from './scenes/TitleScene.js';
import { GameScene } from './scenes/GameScene.js';

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const config = {
    ...PHASER_CONFIG,
    scene: [TitleScene, GameScene]
  };

  window.plinkoGame = new Phaser.Game(config);
});

// Export for use in other contexts if needed
export { TitleScene, GameScene };

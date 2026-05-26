/**
 * BallManager.js
 * Manages ball creation, physics, and lifecycle
 */

import { Ball } from '../entities/Ball.js';

export class BallManager {
  constructor(scene, gameState) {
    this.scene = scene;
    this.gameState = gameState;
    this.balls = [];
  }

  /**
   * Create a new ball
   * @param {number} x - X position (-1 for random)
   * @param {number} y - Y position
   * @param {number} spriteFrame - Ball sprite frame
   * @param {number} delayFrames - Animation delay
   * @param {number} stage - Starting stage
   * @param {Decimal} value - Ball value
   * @param {number} level - Spawn level
   */
  createBall(x, y, spriteFrame, delayFrames, stage, value, level) {
    if (x === -1) {
      x = Phaser.Math.Between(10, 670);
    }

    // Apply double spawn chance
    const doubleSpawnChance = 100 - this.gameState.tokenUpgrades[2].value
      .plus(this.gameState.tokenUpgrades[2].level - 1)
      .toNumber();
    
    if (Phaser.Math.Between(0, 100) > doubleSpawnChance) {
      value = value.mul(2);
    }

    const ball = new Ball(this.scene, x, y, spriteFrame, stage, value, level);
    
    // Animate ball spawn
    ball.animateSpawn(delayFrames, (completedBall) => {
      this.balls.push(completedBall);
    });
  }

  /**
   * Update all balls - check for stage completion
   * @param {Function} onBallScore - Callback when ball scores
   * @param {number} maxStage - Maximum stage number
   * @param {BonusManager} adManager - Reference to bonus manager
   */
  update(onBallScore, maxStage, adManager) {
    for (let i = this.balls.length - 1; i >= 0; i--) {
      const ball = this.balls[i];
      
      if (ball.hasReachedStageEnd()) {
        onBallScore(ball);
        
        const despawnChance = 100 - this.gameState.tokenUpgrades[1].value
          .plus(this.gameState.tokenUpgrades[1].level - 1)
          .toNumber();
        const shouldDespawn = adManager.noDespawn ? 
          false : 
          (Phaser.Math.Between(0, 100) < despawnChance && ball.stage < maxStage);
        if (shouldDespawn || this.balls.length > 700) {
          ball.cleanup();
          this.balls.splice(i, 1);
        } else {
          ball.advanceStage();
        }
      }
    }
  }

  /**
   * Explode balls near a point (click mechanic)
   * @param {number} x - X position
   * @param {number} y - Y position
   * @returns {number} - Number of balls affected
   */
  explodeBalls(x, y, showFloatingText = true) {
    const scale = 0.08 * ((this.gameState.tokenUpgrades[3].level - 1) * 0.5 + 1);
    const radius = 40 + scale * 250;
    let ballCount = 0;
    let total = new Decimal(0);

    for (let i = this.balls.length - 1; i >= 0; i--) {
      const ball = this.balls[i];
      
      if (ball.isNear(x, y, radius)) {
        ballCount++;
        
        // Apply explosion multiplier
        const multiplier = this.gameState.tokenUpgrades[4].value
          .mul(this.gameState.tokenUpgrades[4].valueModifier.pow(this.gameState.tokenUpgrades[4].level - 1))
          .div(100);
        
        ball.multiplyValue(multiplier);
        
        // Apply double points if active
        if (this.scene.adManager && this.scene.adManager.doublePoints) {
          ball.multiplyValue(new Decimal(2));
        }
        
        // Add score
        this.gameState.addGold(ball.value);

        total = total.plus(ball.value);
        
        // Show floating text
        
        // Destroy ball and remove from array
        ball.cleanup();
        this.balls.splice(i, 1);
      }
    }

    if (showFloatingText && ballCount > 0) {
      const text = this.scene.add.text(
        x, 
        y, 
        this.scene.uiManager.formatter.format(total),
        {
          fontFamily: 'Arial',
          fontSize: '14px',
          color: '#ffff00'
        }
      );
      
      this.scene.tweens.add({
        targets: text,
        y: y - 50,
        duration: 700,
        ease: 'Linear',
        onComplete: () => text.destroy()
      });
    }

    return ballCount;
  }

  /**
   * Get all balls
   * @returns {Array} - Array of ball sprites
   */
  getBalls() {
    return this.balls;
  }

  /**
   * Clear all balls
   */
  clearAll() {
    for (let i = this.balls.length - 1; i >= 0; i--) {
      this.balls[i].destroy();
    }
    this.balls = [];
  }
}

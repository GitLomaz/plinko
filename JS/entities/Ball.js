/**
 * Ball.js
 * Ball entity class extending Phaser Matter Sprite
 */

export class Ball extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, spriteFrame, stage, value, level) {
    super(scene.matter.world, x, y, 'balls', spriteFrame);
    
    this.scene = scene;
    this.stage = stage;
    this.value = value;
    this.level = level;
    this.spriteFrame = spriteFrame;
    
    // Add to scene
    scene.add.existing(this);
    
    // Set initial scale for animation
    this.setScale(0.05);
    this.setStatic(true);
  }

  /**
   * Animate the ball spawning
   * @param {number} delayFrames - Animation duration in frames (at 100 FPS)
   * @param {Function} onComplete - Callback when animation completes
   */
  animateSpawn(delayFrames, onComplete) {
    // Convert frames to milliseconds (100 FPS = 10ms per frame)
    const durationMs = delayFrames * 10;
    
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: durationMs,
      ease: 'Linear',
      onComplete: () => {
        this.activatePhysics();
        if (onComplete) onComplete(this);
      }
    });
  }

  /**
   * Activate physics for the ball
   */
  activatePhysics() {
    this.setStatic(false);
    this.setCircle();
    this.setFriction(0.01);
    this.setBounce(0.5);
  }

  /**
   * Multiply the ball's value
   * @param {Decimal} multiplier - Value multiplier
   */
  multiplyValue(multiplier) {
    this.value = this.value.mul(multiplier);
  }

  /**
   * Check if ball is at a position
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} radius - Check radius
   * @returns {boolean}
   */
  isNear(x, y, radius) {
    const distance = Math.abs(this.x - x) + Math.abs(this.y - y);
    return distance < radius;
  }

  /**
   * Get current stage Y threshold
   * @returns {number}
   */
  getStageThreshold() {
    return this.stage * 1500 - 70;
  }

  /**
   * Check if ball has reached stage end
   * @returns {boolean}
   */
  hasReachedStageEnd() {
    return this.y > this.getStageThreshold();
  }

  /**
   * Advance to next stage
   */
  advanceStage() {
    this.stage++;
  }

  /**
   * Cleanup and destroy
   */
  cleanup() {
    this.destroy();
  }
}

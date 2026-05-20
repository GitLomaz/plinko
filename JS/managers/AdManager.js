/**
 * AdManager.js
 * Manages ad system and bonuses
 */

import { GAME_CONFIG } from '../config/GameConfig.js';

export class AdManager extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, -100, 100);
    
    this.scene = scene;
    this.setSize(196, 48);
    this.setInteractive();
    this.setScrollFactor(0);
    
    this.bonuses = ['Double Points', 'Double Spawn', 'No Despawn'];
    this.bonus = Phaser.Math.Between(0, 2);
    this.transition = false;
    this.bonusActive = false;
    this.cooldown = GAME_CONFIG.ad.initialCooldown;
    this.cooldownType = 'noad';
    
    // Active bonus flags
    this.doublePoints = false;
    this.doubleSpawn = false;
    this.noDespawn = false;
    
    this.end = null;
    this.playingAd = false;
    
    this.createUI();
    this.setupEvents();
    
    scene.add.existing(this);
    this.setDepth(10);
  }

  createUI() {
    const background = this.scene.add.rectangle(0, 0, this.width, this.height, 0xaed7fc);
    background.alpha = 0.8;
    
    this.topText = this.scene.add.text(0, -10, 'Top Text', {
      color: '#000',
      fontSize: '14px'
    }).setOrigin(0.5);

    this.bottomText = this.scene.add.text(0, 10, 'bottom Text', {
      color: '#000',
      fontSize: '14px'
    }).setOrigin(0.5);
    
    this.add(background);
    this.add(this.topText);
    this.add(this.bottomText);
  }

  setupEvents() {
    this.on('pointerup', () => {
      if (!this.bonusActive && !this.transition) {
        if (typeof displayRewardedVideo === 'function') {
          displayRewardedVideo();
        }
      }
    });
  }

  tick() {
    if (this.playingAd) {
      return;
    }
    
    if (this.cooldown === 0 && !this.bonusActive) {
      switch (this.cooldownType) {
        case 'noad':
          this.prompt();
          this.cooldown = GAME_CONFIG.ad.noadCooldown;
          break;
        case 'ad':
          this.hide();
          this.cooldown = GAME_CONFIG.ad.adCooldown;
          break;
      }
    } else if (!this.bonusActive) {
      this.cooldown--;
    } else {
      const now = Math.floor(new Date().getTime() / 1000);
      const remaining = this.end - now;
      this.bottomText.setText(remaining + 's Remaining');
      
      if (remaining < 0) {
        this.deactivateBonus();
      }
    }
  }

  prompt() {
    this.bonus = Phaser.Math.Between(0, 2);
    this.transition = true;
    this.topText.setText(this.bonuses[this.bonus]);
    this.bottomText.setText('Watch Ad');
    
    this.scene.tweens.add({
      targets: this,
      x: 80,
      ease: 'Linear',
      duration: 800,
      onComplete: () => {
        this.cooldownType = 'ad';
        this.transition = false;
      }
    });
  }

  hide() {
    this.transition = true;
    this.scene.tweens.add({
      targets: this,
      x: -100,
      ease: 'Linear',
      duration: 800,
      onComplete: () => {
        this.cooldownType = 'noad';
        this.cooldown = GAME_CONFIG.ad.adCooldown;
        this.transition = false;
      }
    });
  }

  completeAd() {
    this.playingAd = false;
    this.activateBonus();
  }

  activateBonus() {
    this.x = 80;
    this.bonusActive = true;
    this.end = Math.floor(new Date().getTime() / 1000) + GAME_CONFIG.ad.bonusDuration;
    this.bottomText.setText(GAME_CONFIG.ad.bonusDuration + 's Remaining');
    
    // Reset all bonuses
    this.doublePoints = false;
    this.doubleSpawn = false;
    this.noDespawn = false;
    
    // Activate selected bonus
    switch (this.bonus) {
      case 0:
        this.doublePoints = true;
        break;
      case 1:
        this.doubleSpawn = true;
        break;
      case 2:
        this.noDespawn = true;
        break;
    }
  }

  deactivateBonus() {
    this.bottomText.setText('0s Remaining');
    this.doublePoints = false;
    this.doubleSpawn = false;
    this.noDespawn = false;
    this.bonusActive = false;
    this.cooldownType = 'noad';
    this.cooldown = GAME_CONFIG.ad.adCooldown;
    this.hide();
  }
}

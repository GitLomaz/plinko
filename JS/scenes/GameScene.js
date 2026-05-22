/**
 * GameScene.js
 * Main game scene with full gameplay logic
 */

import { GameState } from '../managers/GameState.js';
import { SaveManager } from '../managers/SaveManager.js';
import { PhaserUIManager } from '../ui/PhaserUIManager.js';
import { BallManager } from '../managers/BallManager.js';
import { ZoneManager } from '../managers/ZoneManager.js';
import { AdManager } from '../managers/AdManager.js';
import { GAME_CONFIG } from '../config/GameConfig.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    
    this.counter = 0;
    this.pointerdown = false;
    this.isDragging = false;
    this.startY = 0;
    this.lastY = 0;
    this.dirY = 0;
  }

  preload() {
    this.load.image('rectangle', 'assets/images/rectangle.png');
    this.load.image('clearRectangle', 'assets/images/clearRectangle.png');
    this.load.image('circle', 'assets/images/circle.png');
    this.load.image('ball', 'assets/images/ball.png');
    this.load.image('pres', 'assets/images/pres.png');
    this.load.image('zone', 'assets/images/zone.png');
    this.load.image('locked', 'assets/images/locked.png');
    this.load.image('unlocked', 'assets/images/unlocked.png');
    this.load.image('lockedUpgrade', 'assets/images/lockedUpgrade.png');
    this.load.image('lockedStage', 'assets/images/lockedStage.png');
    this.load.image('coin', 'assets/images/coin.png');
    this.load.image('token', 'assets/images/token.png');
    this.load.image('help', 'assets/images/help.png');
    this.load.image('idea', 'assets/images/idea.png');
    this.load.spritesheet('balls', 'assets/images/balls.png', {
      frameWidth: 17,
      frameHeight: 17
    });
  }

  create() {
    this.generateGradientTexture(168, 32, 8, '#ce9c4f', '#6d6038', 'currencyBorder');
    this.generateGradientTexture(168, 32, 8, '#238d9a', '#0f4b56', 'prestigeBorder');
    this.generateGradientTexture(398, 559, 12, '#37424e', '#222c34', 'menuBorder');
    this.generateGradientTexture(398 - 6, 559 - 6, 12, '#232c34', '#1f262c', 'menuBG');
    this.generateGradientTexture(40, 40, 8, '#97a3b4', '#121316', 'scrollBorder');

    this.generateGradientTexture(40 - 4, 40 - 4, 8, '#2d3742', '#27323a', 'scrollBG');
    this.generateGradientTexture(40 - 4, 40 - 4, 8, '#3c4a58', '#35444f', 'scrollBGOver');

    this.generateGradientTexture(64, 48, 8, '#37424e', '#36444f', 'tabBorder');
    this.generateGradientTexture(64, 48, 8, '#e8b16f', '#e8b16f', 'tabBorderSelected');
    this.generateGradientTexture(64 - 2, 48 - 2, 8, '#2d3742', '#27323a', 'tabBG');
    this.generateGradientTexture(64 - 2, 48 - 2, 8, '#3c4a58', '#35444f', 'tabBGOver');

    this.generateGradientTexture(330, 40, 8, '#37424e', '#36444f', 'tipBorder');
    this.generateGradientTexture(330 - 4, 40 - 4, 8,'#2d3742', '#27323a', 'tipBG');

    // Initialize camera and physics
    this.cameras.main.setBackgroundColor('rgba(255, 255, 225, 0.5)');
    this.matter.world.setGravity(0, GAME_CONFIG.gravity.y, GAME_CONFIG.gravity.scale);

    // Initialize managers
    this.gameState = new GameState();
    this.saveManager = new SaveManager();
    this.ballManager = new BallManager(this, this.gameState);
    this.zoneManager = new ZoneManager(this, this.gameState);
    this.adManager = new AdManager(this);

    // Load saved game or start new
    this.loadGame();

    // Initialize Phaser UI (must be after loadGame)
    this.uiManager = new PhaserUIManager(this, this.gameState);

    // Setup input handlers
    this.setupInputHandlers();

    // Setup event handlers
    this.setupEventHandlers();

    // Expose scene globally for ad callbacks
    window.scene = this;
  }

  setupEventHandlers() {
    // Handle UI events
    this.events.on('zone-upgrade-requested', (index) => {
      if (this.zoneManager.upgradeZone(index)) {
        this.uiManager.updateShopPanel();
      }
    });

    this.events.on('zone-price-updated', () => {
      this.zoneManager.updateLockedPrice();
      this.uiManager.updateShopPanel();
    });

    this.events.on('prestige-requested', () => {
      this.prestige();
    });

    this.events.on('save-requested', () => {
      this.saveGame();
    });

    this.events.on('reset-requested', () => {
      this.hardReset();
    });
  }

  setupInputHandlers() {
    // Mouse/touch drag
    this.input.on('pointermove', (ptr) => {
      if (this.pointerdown && !this.isDragging) {
        if (ptr.y - this.startY) {
          this.isDragging = true;
          this.lastY = ptr.y;
        }
      }
      if (this.isDragging) {
        const dy = ptr.y - this.lastY;
        this.dirY += dy;
        this.lastY = ptr.y;
      }
    });

    this.input.on('pointerup', (ptr, gameobs) => {
      this.pointerdown = false;
      this.isDragging = false;
    });

    // Mouse wheel
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      this.cameras.main.scrollY += deltaY * 0.5;
    });

    // Click to explode balls
    this.input.on('pointerdown', (ptr) => {
      const scale = 0.08 * ((this.gameState.tokenUpgrades[3].level - 1) * 0.5 + 1);
      const target = this.add.image(ptr.worldX, ptr.worldY, 'circle')
        .setScale(scale)
        .setAlpha(0.3);

      const ballCount = this.ballManager.explodeBalls(ptr.worldX, ptr.worldY);

      if (ballCount > 0) {
        this.uiManager.updateCurrency();
        this.uiManager.updateShopPanel();
      }

      this.tweens.add({
        targets: target,
        alpha: 0,
        duration: 300,
        ease: 'Linear',
        onComplete: () => target.destroy()
      });

      this.pointerdown = true;
      this.startY = ptr.y;
      this.dirY = 0;
    });
  }

  update() {
    // Update UI manager (handles panel scrolling)
    this.uiManager.update();
    
    // Update ad manager
    this.adManager.tick();

    // Handle scrolling
    const scrollState = this.uiManager.getScrollState();
    if (scrollState.down) {
      this.dirY = -75;
    }
    if (scrollState.up) {
      this.dirY = 75;
    }

    // Apply camera scroll
    this.cameras.main.scrollY -= this.dirY / 0.15 / 100;
    this.dirY -= this.dirY / 0.6 / 100;
    if (this.dirY < 3 && this.dirY > -3) {
      this.dirY = 0;
    }

    // Spawn balls
    this.spawnBalls();

    // Update balls
    this.ballManager.update(
      (ball) => this.scoreBall(ball),
      this.zoneManager.getZoneCount(),
      this.adManager
    );

    // Auto-save periodically
    if (this.counter % GAME_CONFIG.save.autoSaveInterval === 0) {
      this.saveGame();
    }

    // Handle mouse out of bounds
    if (this.input.mousePointer.y > 575 || 
        this.input.mousePointer.x > 680 ||
        this.input.mousePointer.y < 15 || 
        this.input.mousePointer.x < 0) {
      this.pointerdown = false;
      this.isDragging = false;
    }

    this.counter++;
  }

  spawnBalls() {
    for (let i = 0; i < this.gameState.spawns.length; i++) {
      const spawn = this.gameState.spawns[i];
      
      if (spawn.level > 0 && this.gameState.zones[spawn.stage - 1]) {
        let delayFrame = spawn.cooldown - spawn.speedModifier * (spawn.level - 1);
        if (spawn.level > 10) {
          delayFrame = spawn.cooldown - spawn.speedModifier * 10;
        }
        
        if (this.adManager.doubleSpawn) {
          delayFrame = Math.floor(delayFrame / 2);
        }

        if (this.counter % delayFrame === 0) {
          const value = this.gameState.getSpawnValue(i);
          this.ballManager.createBall(
            -1, // random x
            spawn.y,
            i, // sprite frame
            delayFrame,
            spawn.stage,
            value,
            spawn.level
          );
        }
      }
    }
  }

  scoreBall(ball) {
    const zone = this.gameState.zones[ball.stage - 1];
    if (!zone) return;

    const zoneModBonus = this.gameState.tokenUpgrades[6].value
      .mul(this.gameState.tokenUpgrades[6].valueModifier.pow(this.gameState.tokenUpgrades[6].level - 1))
      .div(100);
    
    const modifier = new Decimal(zone.modifier).mul(zoneModBonus);
    let score = new Decimal(ball.value).mul(modifier);

    if (this.adManager.doublePoints) {
      score = score.mul(2);
    }

    this.gameState.addGold(score);
    this.uiManager.updateCurrency();

    // Show score text if visible
    if (ball.y > this.cameras.main.scrollY && ball.y < this.cameras.main.scrollY + 600) {
      const text = this.add.text(ball.x, ball.y, this.uiManager.formatter.format(score), {
        fontFamily: 'Arial',
        fontSize: 12,
        color: '#ffff00'
      });

      this.tweens.add({
        targets: text,
        y: ball.y - 50,
        duration: 700,
        ease: 'Linear',
        onComplete: () => text.destroy()
      });
    }

    this.zoneManager.updateLockedState();
    this.uiManager.updateShopPanel();
  }

  saveGame() {
    this.saveManager.save({
      spawns: this.gameState.spawns,
      tokenUpgrades: this.gameState.tokenUpgrades,
      currentScore: this.gameState.currentScore,
      totalScore: this.gameState.totalScore,
      tokens: this.gameState.tokens,
      zones: this.gameState.zones,
      numberFormat: this.gameState.numberFormat
    });
  }

  loadGame() {
    const saveData = this.saveManager.load();
    
    if (saveData) {
      // Load currency
      this.gameState.currentScore = new Decimal(saveData.money || 0);
      this.gameState.totalScore = new Decimal(saveData.totalMoney || 0);
      this.gameState.tokens = new Decimal(saveData.tokens || 0);
      this.gameState.numberFormat = saveData.numberFormat || 'eng';

      // Load spawns
      if (saveData.spawns && saveData.spawns.length > 0) {
        saveData.spawns.forEach((savedSpawn, index) => {
          const spawn = this.gameState.spawns[index];
          spawn.level = savedSpawn.level;
          spawn.enabled = savedSpawn.enabled;
        });
      }

      // Load token upgrades
      if (saveData.tokenUpgrades && saveData.tokenUpgrades.length > 0) {
        saveData.tokenUpgrades.forEach((savedToken, index) => {
          const token = this.gameState.tokenUpgrades[index];
          token.level = savedToken.level;
        });
      }

      // Load zones
      if (saveData.zones && saveData.zones.length > 0) {
        saveData.zones.forEach(zoneData => {
          this.zoneManager.createZone(zoneData.level);
        });
      } else {
        this.zoneManager.createZone();
      }

      // Calculate offline progress
      if (saveData.time) {
        this.gameState.currentTime = saveData.time;
        this.updateOfflineProgress();
      }
    } else {
      // New game - create first zone
      this.zoneManager.createZone();
    }
  }

  updateOfflineProgress() {
    const now = Date.now();
    const secondsElapsed = (now - this.gameState.currentTime) / 1000;
    
    if (secondsElapsed > 30) {
      const scorePerSecond = this.gameState.calculateScorePerSecond();
      const addedScore = scorePerSecond.mul(secondsElapsed);
      
      this.gameState.addGold(addedScore);
      
      // Only show UI if uiManager is initialized
      if (this.uiManager) {
        this.uiManager.showOfflineProgress(secondsElapsed, addedScore);
        this.uiManager.updateShopPanel();
      }
    }
    
    this.gameState.currentTime = now;
  }

  prestige() {
    // Calculate and add tokens
    const tokensEarned = this.gameState.calculatePrestigeTokens();
    this.gameState.addTokens(tokensEarned);

    // Clear game state
    this.ballManager.clearAll();
    this.zoneManager.clearAll();
    
    // Reset game state
    this.gameState.resetForPrestige();

    // Save and restart scene
    this.saveGame();
    this.scene.restart();
  }

  hardReset() {
    this.saveManager.deleteSave();
    location.reload();
  }

  generateGradientTexture(width, height, radius, colorTop, colorBottom, key) {
    const rt = this.textures.createCanvas(key, width, height);
    const ctx = rt.getContext();

    // gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, colorTop);
    gradient.addColorStop(1, colorBottom);

    // rounded rect path
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(width - radius, 0);
    ctx.quadraticCurveTo(width, 0, width, radius);
    ctx.lineTo(width, height - radius);
    ctx.quadraticCurveTo(width, height, width - radius, height);
    ctx.lineTo(radius, height);
    ctx.quadraticCurveTo(0, height, 0, height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    rt.refresh();
    return rt;
  }

  drawBorders() {
    const left = this.add.graphics().setScrollFactor(0);
    left.fillGradientStyle(
        0x000000,
        0x000000,
        0x000000,
        0x000000,
        0.3,
        0,
        0.3,
        0
    );

    left.fillRect(
        0,
        0,
        60,
        700
    );
    const right = this.add.graphics().setScrollFactor(0);
    right.fillGradientStyle(
        0x000000,
        0x000000,
        0x000000,
        0x000000,
        0,
        0.3,
        0,
        0.3
    );

    right.fillRect(
        620,
        0,
        60,
        700
    );
  }
}

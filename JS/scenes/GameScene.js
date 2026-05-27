/**
 * GameScene.js
 * Main game scene with full gameplay logic
 */

import { GameState } from '../managers/GameState.js';
import { SaveManager } from '../managers/SaveManager.js';
import { PhaserUIManager } from '../ui/PhaserUIManager.js';
import { BallManager } from '../managers/BallManager.js';
import { ZoneManager } from '../managers/ZoneManager.js';
import { BonusManager } from '../managers/BonusManager.js';
import { GAME_CONFIG } from '../config/GameConfig.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    
    this.elapsedTime = 0; // Time in milliseconds
    this.pointerdown = false;
    this.isDragging = false;
    this.startY = 0;
    this.lastY = 0;
    this.dirY = 0;
    
    // Target 100 FPS (10ms per frame)
    this.TARGET_DELTA = 10;
    
    // Store offline progress data to show after UI is ready
    this.pendingOfflineProgress = null;
  }

  preload() {
    this.load.image('rectangle', 'assets/images/rectangle.png');
    this.load.image('clearRectangle', 'assets/images/clearRectangle.png');
    this.load.image('circle', 'assets/images/circle.png');
    this.load.image('ball', 'assets/images/ball.png');
    this.load.image('pres', 'assets/images/pres.png');
    this.load.image('zone', 'assets/images/zone.png');
    this.load.image('cursor', 'assets/images/cursor.png');
    this.load.image('locked', 'assets/images/locked.png');
    this.load.image('unlocked', 'assets/images/unlocked.png');
    this.load.image('lockedUpgrade', 'assets/images/lockedUpgrade.png');
    this.load.image('lockedStage', 'assets/images/lockedStage.png');
    this.load.image('coin', 'assets/images/coin.png');
    this.load.image('token', 'assets/images/token.png');
    this.load.image('help', 'assets/images/help.png');
    this.load.image('lock', 'assets/images/lock.png');
    this.load.image('idea', 'assets/images/idea.png');
    this.load.image('testBg', 'assets/images/testbg.png');
    this.load.spritesheet('balls', 'assets/images/balls.png', {
      frameWidth: 17,
      frameHeight: 17
    });
  }

  create() {
    this.generateTextures();
    this.setupScene();
  }

  generateTextures() {
    const isDark = !this.gameState || this.gameState.theme === 'dark';
    
    if (isDark) {
      // Dark mode (current theme)
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

    this.generateGradientTexture(128, 48, 8, '#97a3b4', '#121316', 'adBorder');
    this.generateGradientTexture(128 - 4, 48 - 4, 8, '#2d3742', '#27323a', 'adBG');
    this.generateGradientTexture(128 - 4, 48 - 4, 8, '#3c4a58', '#35444f', 'adBGOver');

    this.generateGradientTexture(172, 70, 8, '#37424e', '#36444f', 'ballButtonDisabledBorder');
    this.generateGradientTexture(172 - 4, 70 - 4, 8,'#2d3742', '#27323a', 'ballButtonDisabledBG');
    this.generateGradientTexture(172, 70, 8, '#496249', '#3a4e3a', 'ballButtonBorder');
    this.generateGradientTexture(172 - 4, 70 - 4, 8, '#36463a', '#36463a', 'ballButtonBG');
    this.generateGradientTexture(172 - 4, 70 - 4, 8, '#3c5041', '#3c5041', 'ballButtonBGOver');

    this.generateGradientTexture(350, 36, 8, '#37424e', '#36444f', 'zoneButtonDisabledBorder');
    this.generateGradientTexture(350 - 4, 36 - 4, 8,'#2d3742', '#27323a', 'zoneButtonDisabledBG');
    this.generateGradientTexture(350, 36, 8, '#496249', '#3a4e3a', 'zoneButtonBorder');
    this.generateGradientTexture(350 - 4, 36 - 4, 8, '#36463a', '#36463a', 'zoneButtonBG');
    this.generateGradientTexture(350 - 4, 36 - 4, 8, '#3c5041', '#3c5041', 'zoneButtonBGOver');

    this.generateGradientTexture(112, 40, 8, '#97a3b4', '#121316', 'buttonBorder');
    this.generateGradientTexture(112 - 4, 40 - 4, 8, '#2d3742', '#27323a', 'buttonBG');
    this.generateGradientTexture(112 - 4, 40 - 4, 8, '#3c4a58', '#35444f', 'buttonBGOver');
    this.generateGradientTexture(112 - 4, 40 - 4, 8, '#41586f', '#3e5b6f', 'buttonBGSelected');

    this.generateGradientTexture(112, 40, 8, '#b49797', '#161212', 'buttonDangerBorder');
    this.generateGradientTexture(112 - 4, 40 - 4, 8, '#422d2d', '#3a2727', 'buttonDangerBG');
    this.generateGradientTexture(112 - 4, 40 - 4, 8, '#583c3c', '#4f3535', 'buttonDangerBGOver');

    this.generateGradientTexture(200, 125, 8, '#97a3b4', '#121316', 'idleBorder');
      this.generateGradientTexture(200 - 4, 125 - 4, 8, '#2d3742', '#27323a', 'idleBG');
      this.generateGradientTexture(200 - 4, 125 - 4, 8, '#3c4a58', '#35444f', 'idleBGOver');
    } else {
      // Light mode (high contrast, colorblind-friendly)
      this.generateGradientTexture(168, 32, 8, '#b8862f', '#8a6528', 'currencyBorder');
      this.generateGradientTexture(168, 32, 8, '#1a6d7a', '#0d4752', 'prestigeBorder');
      this.generateGradientTexture(398, 559, 12, '#707070', '#808080', 'menuBorder');
      this.generateGradientTexture(398 - 6, 559 - 6, 12, '#f0f0f0', '#e8e8e8', 'menuBG');

      this.generateGradientTexture(40, 40, 8, '#505050', '#606060', 'scrollBorder');
      this.generateGradientTexture(40 - 4, 40 - 4, 8, '#d8d8d8', '#d0d0d0', 'scrollBG');
      this.generateGradientTexture(40 - 4, 40 - 4, 8, '#c0c0c0', '#b8b8b8', 'scrollBGOver');

      this.generateGradientTexture(64, 48, 8, '#707070', '#808080', 'tabBorder');
      this.generateGradientTexture(64, 48, 8, '#b8862f', '#b8862f', 'tabBorderSelected');
      this.generateGradientTexture(64 - 2, 48 - 2, 8, '#d8d8d8', '#d0d0d0', 'tabBG');
      this.generateGradientTexture(64 - 2, 48 - 2, 8, '#c0c0c0', '#b8b8b8', 'tabBGOver');

      this.generateGradientTexture(330, 40, 8, '#707070', '#808080', 'tipBorder');
      this.generateGradientTexture(330 - 4, 40 - 4, 8, '#e0e8f0', '#d8e0e8', 'tipBG');

      this.generateGradientTexture(128, 48, 8, '#505050', '#606060', 'adBorder');
      this.generateGradientTexture(128 - 4, 48 - 4, 8, '#d8d8d8', '#d0d0d0', 'adBG');
      this.generateGradientTexture(128 - 4, 48 - 4, 8, '#c0c0c0', '#b8b8b8', 'adBGOver');

      this.generateGradientTexture(172, 70, 8, '#707070', '#808080', 'ballButtonDisabledBorder');
      this.generateGradientTexture(172 - 4, 70 - 4, 8, '#d8d8d8', '#d0d0d0', 'ballButtonDisabledBG');
      this.generateGradientTexture(172, 70, 8, '#2d8659', '#1f5d3d', 'ballButtonBorder');
      this.generateGradientTexture(172 - 4, 70 - 4, 8, '#3fa570', '#3fa570', 'ballButtonBG');
      this.generateGradientTexture(172 - 4, 70 - 4, 8, '#35925f', '#35925f', 'ballButtonBGOver');

      this.generateGradientTexture(350, 36, 8, '#707070', '#808080', 'zoneButtonDisabledBorder');
      this.generateGradientTexture(350 - 4, 36 - 4, 8, '#d8d8d8', '#d0d0d0', 'zoneButtonDisabledBG');
      this.generateGradientTexture(350, 36, 8, '#2d8659', '#1f5d3d', 'zoneButtonBorder');
      this.generateGradientTexture(350 - 4, 36 - 4, 8, '#3fa570', '#3fa570', 'zoneButtonBG');
      this.generateGradientTexture(350 - 4, 36 - 4, 8, '#35925f', '#35925f', 'zoneButtonBGOver');

      this.generateGradientTexture(112, 40, 8, '#505050', '#606060', 'buttonBorder');
      this.generateGradientTexture(112 - 4, 40 - 4, 8, '#d8d8d8', '#d0d0d0', 'buttonBG');
      this.generateGradientTexture(112 - 4, 40 - 4, 8, '#c0c0c0', '#b8b8b8', 'buttonBGOver');
      this.generateGradientTexture(112 - 4, 40 - 4, 8, '#4a90e2', '#357abd', 'buttonBGSelected');

      this.generateGradientTexture(112, 40, 8, '#8a3030', '#6a2020', 'buttonDangerBorder');
      this.generateGradientTexture(112 - 4, 40 - 4, 8, '#e85555', '#d84444', 'buttonDangerBG');
      this.generateGradientTexture(112 - 4, 40 - 4, 8, '#d04444', '#c03333', 'buttonDangerBGOver');

      this.generateGradientTexture(200, 125, 8, '#505050', '#606060', 'idleBorder');
      this.generateGradientTexture(200 - 4, 125 - 4, 8, '#d8d8d8', '#d0d0d0', 'idleBG');
      this.generateGradientTexture(200 - 4, 125 - 4, 8, '#c0c0c0', '#b8b8b8', 'idleBGOver');
    }
  }

  setupScene() {
    // Initialize camera and physics
    const bgColor = (!this.gameState || this.gameState.theme === 'dark') 
      ? 'rgba(255, 255, 225, 0.5)' 
      : 'rgba(240, 240, 255, 0.9)';
    this.cameras.main.setBackgroundColor(bgColor);
    this.matter.world.setGravity(0, GAME_CONFIG.gravity.y, GAME_CONFIG.gravity.scale);

    // Create tiled background that scrolls with the game
    // Position at center (340) with default centering, and make extra wide for full coverage
    this.tiledBackground = this.add.tileSprite(340, 5250, 1000, 10500, 'testBg')
      .setDepth(-100); // Behind everything

    // Initialize managers
    this.gameState = new GameState();
    this.saveManager = new SaveManager();
    this.ballManager = new BallManager(this, this.gameState);
    this.zoneManager = new ZoneManager(this, this.gameState);
    this.adManager = new BonusManager(this);

    // Load saved game or start new
    this.loadGame();

    // Initialize Phaser UI (must be after loadGame)
    this.uiManager = new PhaserUIManager(this, this.gameState);

    // Show offline progress if there was any
    if (this.pendingOfflineProgress) {
      this.uiManager.showOfflineProgress(
        this.pendingOfflineProgress.secondsElapsed,
        this.pendingOfflineProgress.addedScore
      );
      this.uiManager.updateShopPanel();
      this.pendingOfflineProgress = null;
    }

    // Setup input handlers
    this.setupInputHandlers();

    // Setup event handlers
    this.setupEventHandlers();

    this.drawBorders();

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

    this.events.on('theme-change', (theme) => {
      this.changeTheme(theme);
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

  update(time, delta) {
    // Normalize delta to 100 FPS (10ms per frame)
    const deltaMultiplier = delta / this.TARGET_DELTA;
    
    // Track elapsed time
    this.elapsedTime += delta;
    
    // Update UI manager (handles panel scrolling)
    this.uiManager.update(deltaMultiplier);
    
    // Update ad manager
    this.adManager.tick(delta);

    // Handle scrolling
    const scrollState = this.uiManager.getScrollState();
    if (scrollState.down) {
      this.dirY = -75;
    }
    if (scrollState.up) {
      this.dirY = 75;
    }

    // Apply camera scroll with delta correction
    this.cameras.main.scrollY -= (this.dirY / 0.15 / 100) * deltaMultiplier;
    this.dirY -= (this.dirY / 0.6 / 100) * deltaMultiplier;
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

    // Auto-save periodically (every 20 seconds)
    if (this.elapsedTime % GAME_CONFIG.save.autoSaveInterval < delta) {
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
  }

  spawnBalls() {
    for (let i = 0; i < this.gameState.spawns.length; i++) {
      const spawn = this.gameState.spawns[i];
      
      if (spawn.level > 0 && this.gameState.zones[spawn.stage - 1]) {
        // Calculate delay in milliseconds (at 100 FPS, delayFrame * 10ms)
        let delayFrame = spawn.cooldown - spawn.speedModifier * (spawn.level - 1);
        if (spawn.level > 10) {
          delayFrame = spawn.cooldown - spawn.speedModifier * 10;
        }
        
        if (this.adManager.doubleSpawn) {
          delayFrame = Math.floor(delayFrame / 2);
        }
        
        const delayMs = delayFrame * this.TARGET_DELTA;

        // Use modulo with elapsed time instead of frame counter
        if (this.elapsedTime % delayMs < this.TARGET_DELTA) {
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
          
          // Track ball spawned
          this.gameState.stats.totalBallsSpawned++;
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

  saveGame(uploadStats = false) {
    // Update playtime before saving
    const now = Date.now();
    const sessionTime = (now - this.gameState.stats.lastPlayTime) / 1000;
    this.gameState.stats.totalPlayTime += sessionTime;
    this.gameState.stats.lastPlayTime = now;
    
    this.saveManager.save({
      spawns: this.gameState.spawns,
      tokenUpgrades: this.gameState.tokenUpgrades,
      currentScore: this.gameState.currentScore,
      totalScore: this.gameState.totalScore,
      tokens: this.gameState.tokens,
      zones: this.gameState.zones,
      numberFormat: this.gameState.numberFormat,
      theme: this.gameState.theme,
      stats: this.gameState.stats
    });

    // Auto-submit stats on save
    if (uploadStats) {
      this.submitStats();
    }
  }

  loadGame() {
    const saveData = this.saveManager.load();
    
    if (saveData) {
      // Load currency
      this.gameState.currentScore = new Decimal(saveData.money || 0);
      this.gameState.totalScore = new Decimal(saveData.totalMoney || 0);
      this.gameState.tokens = new Decimal(saveData.tokens || 0);
      this.gameState.numberFormat = saveData.numberFormat || 'eng';
      this.gameState.theme = saveData.theme || 'dark';

      // Load statistics
      if (saveData.stats) {
        this.gameState.stats = {
          ...this.gameState.stats,
          ...saveData.stats,
          lastPlayTime: Date.now() // Reset session timer
        };
      }

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
      
      // Store offline progress to show after UI manager is ready
      this.pendingOfflineProgress = {
        secondsElapsed,
        addedScore
      };
    }
    
    this.gameState.currentTime = now;
  }

  prestige() {
    // Calculate and add tokens
    const tokensEarned = this.gameState.calculatePrestigeTokens();
    this.gameState.addTokens(tokensEarned);

    // Submit stats before resetting
    this.submitStats();

    // Clear game state
    this.ballManager.clearAll();
    this.zoneManager.clearAll();
    
    // Reset game state
    this.gameState.resetForPrestige();

    // Save and restart scene
    this.saveGame(true);
    this.scene.restart();
  }

  hardReset() {
    this.saveManager.deleteSave();
    location.reload();
  }

  submitStats() {
    // Calculate total upgrades
    const totalBallUpgrades = this.gameState.spawns.reduce((sum, spawn) => sum + spawn.level, 0);
    const totalTokenUpgrades = this.gameState.tokenUpgrades.reduce((sum, token) => sum + token.level, 0);
    const totalZoneUpgrades = this.gameState.zones.reduce((sum, zone) => sum + zone.level, 0);
    
    const data = {
      totalTokensEarned: Math.floor(this.gameState.stats.totalTokensEarned),
      totalGoldEarned: this.gameState.totalScore.toString(),
      totalAdsWatched: Math.floor(this.gameState.stats.totalAdsWatched),
      totalPrestiges: Math.floor(this.gameState.stats.totalPrestiges),
      highestZone: Math.floor(this.gameState.stats.highestZone),
      totalBallsSpawned: Math.floor(this.gameState.stats.totalBallsSpawned),
      totalPlayTime: Math.floor(this.gameState.stats.totalPlayTime),
      totalBallUpgrades: Math.floor(totalBallUpgrades),
      totalTokenUpgrades: Math.floor(totalTokenUpgrades),
      totalZoneUpgrades: Math.floor(totalZoneUpgrades),
      currentTokens: this.gameState.tokens.toString(),
      currentGold: this.gameState.currentScore.toString()
    };

    // Use fetch API for submission
    fetch('https://scores.lomazgames.com/statistic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ game: 'plinko', data: data })
    }).then(response => {
      if (response.ok) {
        // Statistics submitted successfully
      }
    }).catch(error => {
      console.error('Error submitting statistics:', error);
    });
  }

  changeTheme(theme) {
    this.gameState.theme = theme;
    
    // Save current panel state
    const currentPanel = this.uiManager ? this.uiManager.currentPanel : 'ball';
    
    // Destroy existing textures
    const textureKeys = [
      'currencyBorder', 'prestigeBorder', 'menuBorder', 'menuBG',
      'scrollBorder', 'scrollBG', 'scrollBGOver',
      'tabBorder', 'tabBorderSelected', 'tabBG', 'tabBGOver',
      'tipBorder', 'tipBG',
      'adBorder', 'adBG', 'adBGOver',
      'ballButtonDisabledBorder', 'ballButtonDisabledBG', 'ballButtonBorder', 'ballButtonBG', 'ballButtonBGOver',
      'zoneButtonDisabledBorder', 'zoneButtonDisabledBG', 'zoneButtonBorder', 'zoneButtonBG', 'zoneButtonBGOver',
      'buttonBorder', 'buttonBG', 'buttonBGOver', 'buttonBGSelected',
      'buttonDangerBorder', 'buttonDangerBG', 'buttonDangerBGOver',
      'idleBorder', 'idleBG', 'idleBGOver'
    ];
    
    textureKeys.forEach(key => {
      if (this.textures.exists(key)) {
        this.textures.remove(key);
      }
    });
    
    // Regenerate textures with new theme
    this.generateTextures();
    
    // Update background color
    const bgColor = theme === 'dark' 
      ? 'rgba(255, 255, 225, 0.5)' 
      : 'rgba(240, 240, 255, 0.9)';
    this.cameras.main.setBackgroundColor(bgColor);
    
    // Recreate UI
    if (this.uiManager) {
      this.uiManager.destroy();
      this.uiManager = new PhaserUIManager(this, this.gameState);
      // Restore the panel that was open
      this.uiManager.switchPanel(currentPanel);
    }
    
    // Save the theme preference
    this.saveGame();
  }

  generateGradientTexture(width, height, radius, colorTop, colorBottom, key) {
    if (this.textures.exists(key)) {
      return this.textures.get(key);
    }
    
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

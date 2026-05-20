/**
 * PhaserUIManager.js
 * Main UI manager for Phaser-based interface
 */

import { CurrencyDisplay } from './components/CurrencyDisplay.js';
import { TabButton } from './components/TabButton.js';
import { Button } from './components/Button.js';
import { BallShopPanel } from './panels/BallShopPanel.js';
import { ZoneShopPanel } from './panels/ZoneShopPanel.js';
import { TokenShopPanel } from './panels/TokenShopPanel.js';
import { HelpPanel } from './panels/HelpPanel.js';
import { NumberFormatter } from '../utils/NumberFormatter.js';

export class PhaserUIManager {
  constructor(scene, gameState) {
    this.scene = scene;
    this.gameState = gameState;
    this.formatter = new NumberFormatter();
    this.formatter.setFormat(gameState.numberFormat);
    
    this.currentPanel = 'ball';
    this.panels = {};
    this.tabs = {};
    
    this.createUI();
  }

  createUI() {
    // Currency displays at top
    const goldX = this.scene.cameras.main.width - 360;
    const goldY = 10;
    
    this.goldDisplay = new CurrencyDisplay(
      this.scene,
      goldX,
      goldY,
      'coin',
      0xce9c4f,
      '0'
    );

    this.tokenDisplay = new CurrencyDisplay(
      this.scene,
      goldX + 185,
      goldY,
      'token',
      0x50979c,
      '0'
    );

    // Main menu panel background
    const menuX = this.scene.cameras.main.width - 428;
    const menuY = 0;
    const menuWidth = 428;
    const menuHeight = this.scene.cameras.main.height;

    this.menuBackground = this.scene.add.rectangle(
      menuX,
      menuY,
      menuWidth,
      menuHeight,
      0x8a8a88
    );
    this.menuBackground.setOrigin(0, 0);
    this.menuBackground.setScrollFactor(0);
    this.menuBackground.setDepth(90);

    // Tab buttons
    const tabY = 70;
    const tabSpacing = 62;
    const tabStartX = menuX + 60;

    const tabs = [
      { key: 'ball', texture: 'ball' },
      { key: 'zone', texture: 'zone' },
      { key: 'token', texture: 'pres' },
      { key: 'help', texture: 'help' }
    ];

    tabs.forEach((tab, index) => {
      const tabButton = new TabButton(
        this.scene,
        tabStartX + index * tabSpacing,
        tabY,
        tab.texture,
        () => this.switchPanel(tab.key)
      );
      tabButton.setScrollFactor(0);
      tabButton.setDepth(100);
      this.tabs[tab.key] = tabButton;
    });

    // Set initial selected tab
    this.tabs.ball.setSelected(true);

    // Create panels
    const panelX = menuX + 30;
    const panelY = 130;
    const panelWidth = 368;
    const panelHeight = menuHeight - 150;

    this.panels.ball = new BallShopPanel(
      this.scene,
      panelX,
      panelY,
      panelWidth,
      panelHeight,
      this.gameState,
      this.formatter,
      (index) => this.handleSpawnUpgrade(index)
    );

    this.panels.zone = new ZoneShopPanel(
      this.scene,
      panelX,
      panelY,
      panelWidth,
      panelHeight,
      this.gameState,
      this.formatter,
      (index) => this.handleZoneUpgrade(index)
    );

    this.panels.token = new TokenShopPanel(
      this.scene,
      panelX,
      panelY,
      panelWidth,
      panelHeight,
      this.gameState,
      this.formatter,
      (index) => this.handleTokenUpgrade(index),
      () => this.handlePrestige()
    );

    this.panels.help = new HelpPanel(
      this.scene,
      panelX,
      panelY,
      panelWidth,
      panelHeight,
      this.formatter,
      () => this.handleSave(),
      () => this.handleReset(),
      (format) => this.handleFormatChange(format)
    );

    // Hide all panels except first
    Object.keys(this.panels).forEach(key => {
      if (key !== 'ball') {
        this.panels[key].hide();
      }
    });

    // Scroll buttons (far left)
    this.createScrollButtons(menuX + 10, menuHeight);

    // Offline progress popup
    this.createOfflinePopup();
  }

  createScrollButtons(x, menuHeight) {
    const buttonWidth = 40;
    const buttonHeight = 25;

    this.scrollUpButton = new Button(
      this.scene,
      x,
      20,
      buttonWidth,
      buttonHeight,
      '▲',
      () => { this.scrollUp = true; },
      { fontSize: '16px', backgroundColor: 0x7f7f70, hoverColor: 0x9f9f90 }
    );
    this.scrollUpButton.setScrollFactor(0);
    this.scrollUpButton.setDepth(110);

    this.scrollDownButton = new Button(
      this.scene,
      x,
      menuHeight - 35,
      buttonWidth,
      buttonHeight,
      '▼',
      () => { this.scrollDown = true; },
      { fontSize: '16px', backgroundColor: 0x7f7f70, hoverColor: 0x9f9f90 }
    );
    this.scrollDownButton.setScrollFactor(0);
    this.scrollDownButton.setDepth(110);

    // Handle mouse up to stop scrolling
    this.scene.input.on('pointerup', () => {
      this.scrollUp = false;
      this.scrollDown = false;
    });

    this.scrollUp = false;
    this.scrollDown = false;
  }

  createOfflinePopup() {
    // Offline progress panel (hidden by default)
    this.offlinePanel = this.scene.add.container(200, 230);
    this.offlinePanel.setScrollFactor(0);
    this.offlinePanel.setDepth(300);
    this.offlinePanel.setVisible(false);

    const bg = this.scene.add.rectangle(0, 0, 250, 120, 0xb39667);
    bg.setStrokeStyle(2, 0x000000);
    this.offlinePanel.add(bg);

    this.offlineText = this.scene.add.text(0, -30, '', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#000000',
      align: 'center',
      wordWrap: { width: 230 }
    });
    this.offlineText.setOrigin(0.5);
    this.offlinePanel.add(this.offlineText);

    const closeBtn = new Button(
      this.scene,
      0,
      35,
      80,
      30,
      'Ok!',
      () => this.offlinePanel.setVisible(false),
      { fontSize: '14px' }
    );
    this.offlinePanel.add(closeBtn);
  }

  switchPanel(panelKey) {
    // Hide all panels
    Object.keys(this.panels).forEach(key => {
      this.panels[key].hide();
    });

    // Show selected panel
    this.panels[panelKey].show();
    this.currentPanel = panelKey;

    // Update tab selection
    Object.keys(this.tabs).forEach(key => {
      this.tabs[key].setSelected(key === panelKey);
    });

    // Update panel content
    this.updateShopPanel();
  }

  updateCurrency() {
    this.goldDisplay.setValue(this.formatter.format(this.gameState.currentScore));
    this.tokenDisplay.setValue(this.formatter.format(this.gameState.tokens));
  }

  updateShopPanel() {
    this.updateCurrency();
    
    if (this.panels[this.currentPanel]) {
      this.panels[this.currentPanel].update();
    }
  }

  handleSpawnUpgrade(index) {
    const spawn = this.gameState.spawns[index];
    const cost = this.gameState.getSpawnUpgradeCost(index);
    
    if (this.gameState.spendGold(cost)) {
      spawn.level++;
      this.updateShopPanel();
      
      // Notify scene
      this.scene.events.emit('spawn-upgraded', index);
    }
  }

  handleZoneUpgrade(index) {
    // Notify scene to handle zone upgrade
    this.scene.events.emit('zone-upgrade-requested', index);
    this.updateShopPanel();
  }

  handleTokenUpgrade(index) {
    const token = this.gameState.tokenUpgrades[index];
    const cost = this.gameState.getTokenUpgradeCost(index);
    
    if (token.maxLevel && token.level >= token.maxLevel) {
      return;
    }
    
    if (this.gameState.spendTokens(cost)) {
      token.level++;
      
      // Update zone prices if zone cost reduction was upgraded
      if (index === 5) {
        this.scene.events.emit('zone-price-updated');
      }
      
      this.updateShopPanel();
    }
  }

  handlePrestige() {
    this.scene.events.emit('prestige-requested');
  }

  handleSave() {
    this.scene.events.emit('save-requested');
  }

  handleReset() {
    this.scene.events.emit('reset-requested');
  }

  handleFormatChange(format) {
    this.gameState.numberFormat = format;
    this.updateShopPanel();
  }

  showOfflineProgress(seconds, earned) {
    this.offlineText.setText(
      `Inactive for ${this.formatter.addCommas(Math.floor(seconds))} seconds\n\n` +
      `Total Earned:\n${this.formatter.format(earned)}`
    );
    this.offlinePanel.setVisible(true);
  }

  update() {
    // Handle panel scrolling
    const currentPanel = this.panels[this.currentPanel];
    if (currentPanel && currentPanel.config.scrollable) {
      const scrollSpeed = 15;
      
      if (this.scrollUp) {
        currentPanel.setScrollOffset(currentPanel.scrollOffset - scrollSpeed);
      }
      
      if (this.scrollDown) {
        currentPanel.setScrollOffset(currentPanel.scrollOffset + scrollSpeed);
      }
    }
  }

  getScrollState() {
    return { down: this.scrollDown, up: this.scrollUp };
  }

  destroy() {
    // Cleanup all UI elements
    Object.values(this.panels).forEach(panel => panel.destroy());
    Object.values(this.tabs).forEach(tab => tab.destroy());
    this.goldDisplay.destroy();
    this.tokenDisplay.destroy();
    this.menuBackground.destroy();
    this.offlinePanel.destroy();
    if (this.scrollUpButton) this.scrollUpButton.destroy();
    if (this.scrollDownButton) this.scrollDownButton.destroy();
  }
}

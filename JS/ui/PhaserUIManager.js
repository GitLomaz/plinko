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

  getTextColor() {
    return this.gameState.theme === 'dark' ? '#ffffff' : '#222222';
  }

  createUI() {

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
      0x171e26
    );
    this.menuBackground.setOrigin(0, 0);
    this.menuBackground.setScrollFactor(0);

    this.menuShadow = this.scene.add.image(696, 18, 'menuBorder').setOrigin(0);
    this.menuShadow.setOrigin(0, 0);
    this.menuShadow.setScrollFactor(0);    
    this.menuBackground = this.scene.add.image(696 + 3, 18 + 3, 'menuBG').setOrigin(0);
    this.menuBackground.setOrigin(0, 0);
    this.menuBackground.setScrollFactor(0);
    
    this.goldDisplay = new CurrencyDisplay(
      this.scene,
      710,
      35,
      'currency',
    );

    this.tokenDisplay = new CurrencyDisplay(
      this.scene,
      910,
      35,
      'token',
    );

    // Tab buttons
    const tabY = 100;
    const tabSpacing = 90;
    const tabStartX = menuX + 80;

    const tabs = [
      { key: 'ball', texture: 'ball', label: 'Balls' },
      { key: 'zone', texture: 'zone', label: 'Zones' },
      { key: 'token', texture: 'pres', label: 'Tokens' },
      { key: 'help', texture: 'help', label: 'Settings' }
    ];

    tabs.forEach((tab, index) => {
      const tabButton = new TabButton(
        this.scene,
        tabStartX + index * tabSpacing,
        tabY,
        tab.texture,
        tab.label,
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
      this.gameState,
      () => this.handleSave(),
      () => this.handleReset(),
      (format) => this.handleFormatChange(format),
      (theme) => this.handleThemeChange(theme)
    );

    // Hide all panels except first
    Object.keys(this.panels).forEach(key => {
      if (key !== 'ball') {
        this.panels[key].hide();
      }
    });

    // Scroll buttons (far left)
    this.createScrollButtons(menuX - 40, menuHeight);

    // Offline progress popup
    this.createOfflinePopup();
    this.updateCurrency();
  }

  createScrollButtons(x, menuHeight) {
    const shadow1 = this.scene.add.image(625, 12, 'scrollBorder').setOrigin(0).setScrollFactor(0).setDepth(1000);
    const bg1 = this.scene.add.image(627, 14, 'scrollBG').setOrigin(0).setScrollFactor(0).setInteractive({ cursor: 'pointer' }).setDepth(1001);
    bg1.on('pointerover', () => bg1.setTexture('scrollBGOver'));
    bg1.on('pointerout', () => bg1.setTexture('scrollBG'));
    bg1.on('pointerdown', () => { this.scrollUp = true; });
    const icon1 = this.scene.add.text(645, 32, '▲', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#c3c3c1'
    }).setOrigin(0.5).setScrollFactor(0).setScale(1, .75).setDepth(1002);

    const shadow2 = this.scene.add.image(625, 595 - 12 - 40, 'scrollBorder').setOrigin(0).setScrollFactor(0).setDepth(1000);
    const bg2 = this.scene.add.image(627, 595 - 12 - 38, 'scrollBG').setOrigin(0).setScrollFactor(0).setInteractive({ cursor: 'pointer' }).setDepth(1001);
    bg2.on('pointerover', () => bg2.setTexture('scrollBGOver'));
    bg2.on('pointerout', () => bg2.setTexture('scrollBG'));
    bg2.on('pointerdown', () => { this.scrollDown = true; });
    const icon2 = this.scene.add.text(645, 595 - 12 - 20, '▼', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#c3c3c1'
    }).setOrigin(0.5).setScrollFactor(0).setScale(1, .75).setDepth(1002);

    this.scene.input.on('pointerup', () => {
      this.scrollUp = false;
      this.scrollDown = false;
    });
    this.scrollUp = false;
    this.scrollDown = false;
  }

  createOfflinePopup() {
    // Offline progress panel (hidden by default)
    this.offlinePanel = this.scene.add.container(330, 330);
    this.offlinePanel.setScrollFactor(0);
    this.offlinePanel.setDepth(300);
    this.offlinePanel.setVisible(false);

    const shadow = this.scene.add.image(0, 0, 'idleBorder').setOrigin(0.5);
    this.offlinePanel.add(shadow);

    const bg = this.scene.add.image(0, 0, 'idleBG').setOrigin(0.5);
    this.offlinePanel.add(bg);

    this.offlineText = this.scene.add.text(0, -20, '', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 180 }
    });
    this.offlineText.setOrigin(0.5);
    this.offlinePanel.add(this.offlineText);

    const closeBtn = new Button(
      this.scene,
      0,
      40,
      80,
      30,
      'Ok!',
      () => this.offlinePanel.setVisible(false),
      { fontSize: '16px' }
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
    this.scene.saveGame(true);
  }

  handleZoneUpgrade(index) {
    // Notify scene to handle zone upgrade
    this.scene.events.emit('zone-upgrade-requested', index);
    this.updateShopPanel();
    this.scene.saveGame(true);
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
    this.scene.saveGame(true);
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

  handleThemeChange(theme) {
    this.scene.events.emit('theme-change', theme);
  }

  showOfflineProgress(seconds, earned) {
    this.offlineText.setText(
      `Inactive for ${this.formatter.addCommas(Math.floor(seconds))} seconds\n\n` +
      `Total Earned:\n${this.formatter.format(earned)}`
    );
    this.offlinePanel.setVisible(true);
  }

  update(deltaMultiplier = 1) {
    // Handle panel scrolling with delta correction
    const currentPanel = this.panels[this.currentPanel];
    if (currentPanel && currentPanel.config.scrollable) {
      const scrollSpeed = 15 * deltaMultiplier;
      
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

  updateTheme() {
    // Update menu textures
    if (this.menuShadow) {
      this.menuShadow.setTexture('menuBorder');
    }
    if (this.menuBackground) {
      this.menuBackground.setTexture('menuBG');
    }

    // Update all panels
    Object.values(this.panels).forEach(panel => {
      if (panel.updateTheme) {
        panel.updateTheme();
      }
    });

    // Update all tabs
    Object.values(this.tabs).forEach(tab => {
      if (tab.updateTheme) {
        tab.updateTheme();
      }
    });

    // Update currency displays
    if (this.goldDisplay && this.goldDisplay.updateTheme) {
      this.goldDisplay.updateTheme();
    }
    if (this.tokenDisplay && this.tokenDisplay.updateTheme) {
      this.tokenDisplay.updateTheme();
    }
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

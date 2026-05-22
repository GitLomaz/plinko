/**
 * BallShopPanel.js
 * Panel for ball upgrades
 */

import { UIPanel } from '../components/UIPanel.js';
import { UpgradeCard } from '../components/UpgradeCard.js';

export class BallShopPanel extends UIPanel {
  constructor(scene, x, y, width, height, gameState, formatter, onUpgrade) {
    super(scene, x, y, width, height, {
      backgroundColor: 0xFF3a3a,
      scrollable: true
    });
    
    this.gameState = gameState;
    this.formatter = formatter;
    this.onUpgrade = onUpgrade;
    this.cards = [];
    
    this.createContent();
  }

  createContent() {

    this.tipShadow = this.scene.add.image(18, 6, 'tipBorder').setOrigin(0);
    this.tipBackground = this.scene.add.image(20, 8, 'tipBG').setOrigin(0);

    this.add(this.tipShadow);
    this.add(this.tipBackground);

    // Lightbulb icon (using a simple circle with yellow color as placeholder)

    this.icon = this.scene.add.image(40, 28, "idea")
    this.add(this.icon);

    // Tip text
    const tipText = this.scene.add.text(
      this.config.padding + 56,
      this.config.padding + 1,
      'Tip: Upgrading balls increases their value\nand spawn frequency.',
      {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#ffffff',
        wordWrap: { width: this.panelWidth - this.config.padding * 2 - 50 }
      }
    );
    tipText.setOrigin(0, 0);
    this.add(tipText);

    // Create upgrade cards
    let yPos = this.config.padding + 45;
    const cardWidth = (this.panelWidth - this.config.padding * 3) / 2;
    const cardHeight = 70;
    const spacing = 8;

    for (let i = 0; i < this.gameState.spawns.length; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = this.config.padding + col * (cardWidth + spacing) - 10;
      const y = yPos + row * (cardHeight + spacing);

      const card = new UpgradeCard(
        this.scene,
        x + cardWidth / 2,
        y + cardHeight / 2,
        cardWidth,
        cardHeight,
        { spriteFrame: i },
        () => this.onUpgrade(i)
      );
      
      this.add(card);
      this.cards.push(card);
    }
    
    // Calculate content height for scrolling
    this.calculateContentHeight();
    // Ensure all children ignore camera scroll
    this.setChildrenScrollFactor();
  }

  update() {
    this.cards.forEach((card, index) => {
      const spawn = this.gameState.spawns[index];
      const zone = this.gameState.zones[spawn.stage - 1];

      if (!zone) {
        // Locked
        card.setLocked(true);
        card.setSelected(false);
        card.updateInfo(['Locked', 'Unlock zone first']);
      } else {
        card.setLocked(false);
        
        // Set selected state based on level (level > 0 means purchased)
        card.setSelected(spawn.level > 0);
        
        const value = this.gameState.getSpawnValue(index);
        const cost = this.gameState.getSpawnUpgradeCost(index);
        const cooldown = spawn.level > 0 ? 
          spawn.cooldown - spawn.speedModifier * Math.min(spawn.level - 1, 10) : 
          spawn.cooldown;

        const lines = [
          `Value: ${this.formatter.format(value)}`,
          `Cooldown: ${cooldown}`,
          `Level: ${spawn.level}`,
          `Cost: ${this.formatter.format(cost)}`
        ];

        card.updateInfo(lines);
        card.setCostColor(this.gameState.currentScore.gte(cost));
      }
    });
  }
}

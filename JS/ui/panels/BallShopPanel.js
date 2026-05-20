/**
 * BallShopPanel.js
 * Panel for ball upgrades
 */

import { UIPanel } from '../components/UIPanel.js';
import { UpgradeCard } from '../components/UpgradeCard.js';

export class BallShopPanel extends UIPanel {
  constructor(scene, x, y, width, height, gameState, formatter, onUpgrade) {
    super(scene, x, y, width, height, {
      backgroundColor: 0xb39667,
      scrollable: true
    });
    
    this.gameState = gameState;
    this.formatter = formatter;
    this.onUpgrade = onUpgrade;
    this.cards = [];
    
    this.createContent();
  }

  createContent() {
    // Tip text
    const tipText = this.scene.add.text(
      this.config.padding,
      this.config.padding,
      'Tip: Upgrading balls increases their value\nand spawn frequency.',
      {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#000000',
        wordWrap: { width: this.panelWidth - this.config.padding * 2 }
      }
    );
    tipText.setOrigin(0, 0);
    this.add(tipText);

    // Create upgrade cards
    let yPos = tipText.y + tipText.height + 15;
    const cardWidth = (this.panelWidth - this.config.padding * 3) / 2;
    const cardHeight = 65;
    const spacing = 8;

    for (let i = 0; i < this.gameState.spawns.length; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = this.config.padding + col * (cardWidth + spacing);
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
        card.updateInfo(['Locked', 'Unlock zone first']);
      } else {
        card.setLocked(false);
        
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

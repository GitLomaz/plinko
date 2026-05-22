/**
 * ZoneShopPanel.js
 * Panel for zone upgrades
 */

import { UIPanel } from '../components/UIPanel.js';
import { UpgradeCard } from '../components/UpgradeCard.js';
import { ZONE_PRICES, ZONE_EFFECTS } from '../../config/GameConfig.js';

export class ZoneShopPanel extends UIPanel {
  constructor(scene, x, y, width, height, gameState, formatter, onUpgrade) {
    super(scene, x, y, width, height, {
      backgroundColor: 0x3a3a3a,
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
      'Tip: Upgrading zones increases payouts\nand has unique benefits.',
      {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#ffffff',
        wordWrap: { width: this.panelWidth - this.config.padding * 2 }
      }
    );
    tipText.setOrigin(0, 0);
    this.add(tipText);

    // Create upgrade cards
    let yPos = tipText.y + tipText.height + 15;
    const cardWidth = this.panelWidth - this.config.padding * 2;
    const cardHeight = 45;
    const spacing = 8;

    for (let i = 0; i < 8; i++) {
      const x = this.config.padding;
      const y = yPos + i * (cardHeight + spacing);

      const card = new UpgradeCard(
        this.scene,
        x + cardWidth / 2,
        y + cardHeight / 2,
        cardWidth,
        cardHeight,
        {},
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
      const zone = this.gameState.zones[index];

      if (!zone) {
        // Locked
        card.setLocked(true);
        card.updateInfo(['Zone not unlocked', 'Effect: ???']);
      } else {
        card.setLocked(false);
        
        const cost = this.gameState.getZoneUpgradeCost(index, ZONE_PRICES[index]);
        const mod = this.gameState.tokenUpgrades[6].value
          .mul(this.gameState.tokenUpgrades[6].valueModifier.pow(this.gameState.tokenUpgrades[6].level - 1))
          .div(100);
        const modifier = new Decimal(zone.modifier).mul(mod);

        const lines = [
          `${ZONE_EFFECTS[index]}`,
          `Modifier: ${this.formatter.formatPercent(modifier.toNumber())} | Level: ${zone.level}`,
          `Cost: ${this.formatter.format(cost)}`
        ];

        card.updateInfo(lines);
        card.setCostColor(this.gameState.currentScore.gte(cost));
      }
    });
  }
}

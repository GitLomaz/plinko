/**
 * TokenShopPanel.js
 * Panel for token upgrades
 */

import { UIPanel } from '../components/UIPanel.js';
import { UpgradeCard } from '../components/UpgradeCard.js';
import { Button } from '../components/Button.js';
import { TOKEN_CONFIGS } from '../../config/TokenConfig.js';

export class TokenShopPanel extends UIPanel {
  constructor(scene, x, y, width, height, gameState, formatter, onUpgrade, onPrestige) {
    super(scene, x, y, width, height, {
      backgroundColor: 0x3a3a3a,
      scrollable: true
    });
    
    this.gameState = gameState;
    this.formatter = formatter;
    this.onUpgrade = onUpgrade;
    this.onPrestige = onPrestige;
    this.cards = [];
    this.prestigeConfirm = false;
    
    this.createContent();
  }

  createContent() {
    // Tip text
    const tipText = this.scene.add.text(
      this.config.padding,
      this.config.padding,
      'Tip: Prestiging resets progress but\ngrants permanent bonuses.',
      {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#ffffff',
        wordWrap: { width: this.panelWidth - this.config.padding * 2 }
      }
    );
    tipText.setOrigin(0, 0);
    this.add(tipText);

    // Prestige section
    let yPos = tipText.y + tipText.height + 10;
    
    this.prestigeTokenText = this.scene.add.text(
      this.config.padding + 10,
      yPos,
      'Tokens: 0',
      {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#ffffff'
      }
    );
    this.prestigeTokenText.setOrigin(0, 0);
    this.add(this.prestigeTokenText);

    this.prestigeButton = new Button(
      this.scene,
      this.panelWidth - 80,
      yPos + 10,
      120,
      30,
      'Prestige',
      () => this.handlePrestige()
    );
    this.add(this.prestigeButton);

    // Create upgrade cards
    yPos += 50;
    const cardWidth = (this.panelWidth - this.config.padding * 3) / 2;
    const cardHeight = 65;
    const spacing = 8;

    for (let i = 0; i < TOKEN_CONFIGS.length; i++) {
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

  handlePrestige() {
    if (!this.prestigeConfirm) {
      this.prestigeConfirm = true;
      this.prestigeButton.setText('Confirm?');
      setTimeout(() => {
        this.prestigeConfirm = false;
        this.prestigeButton.setText('Prestige');
      }, 3000);
    } else {
      this.onPrestige();
      this.prestigeConfirm = false;
      this.prestigeButton.setText('Prestige');
    }
  }

  update() {
    // Update prestige token count
    const tokensEarned = this.gameState.calculatePrestigeTokens();
    this.prestigeTokenText.setText(`Earn: ${this.formatter.format(tokensEarned)} tokens`);

    // Update cards
    this.cards.forEach((card, index) => {
      const token = this.gameState.tokenUpgrades[index];
      const cost = this.gameState.getTokenUpgradeCost(index);
      const atMaxLevel = token.maxLevel && token.level >= token.maxLevel;

      let valueStr = '';
      if ([1, 2, 5].includes(index)) {
        // Linear increase
        const current = token.value.plus(token.level - 1);
        valueStr = atMaxLevel ? 
          `${this.formatter.format(current)}% (MAX)` :
          `${this.formatter.format(current)}% → ${this.formatter.format(current.plus(1))}%`;
      } else if (index === 3) {
        // Special scaling
        const current = token.value.plus((token.level - 1) * 50);
        valueStr = atMaxLevel ?
          `${this.formatter.format(current)}% (MAX)` :
          `${this.formatter.format(current)}% → ${this.formatter.format(current.plus(50))}%`;
      } else {
        // Multiplicative
        const current = token.value.mul(token.valueModifier.pow(token.level - 1));
        const next = token.value.mul(token.valueModifier.pow(token.level));
        valueStr = `${this.formatter.format(current)}% → ${this.formatter.format(next)}%`;
      }

      const lines = [
        TOKEN_CONFIGS[index].name,
        valueStr,
        `Lvl: ${token.level - 1}`,
        atMaxLevel ? 'MAX' : `Cost: ${this.formatter.format(cost)}`
      ];

      card.updateInfo(lines);
      if (!atMaxLevel) {
        card.setCostColor(this.gameState.tokens.gte(cost));
      }
    });
  }
}

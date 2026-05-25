/**
 * TokenShopPanel.js
 * Panel for token upgrades
 */

import { UIPanel } from '../components/UIPanel.js';
import { TokenUpgradeCard } from '../components/TokenUpgradeCard.js';
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
      'Tip: Starting over again sounds like a lot of work, but it\'s worth it',
      {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#ffffff',
        wordWrap: { width: this.panelWidth - this.config.padding * 2 - 50 }
      }
    );
    tipText.setOrigin(0, 0);
    this.add(tipText);

    this.prestigeBtnBorder = this.scene.add.image(182, 416, 'zoneButtonBorder');
    this.prestigeBtnBg = this.scene.add.image(182, 416, 'zoneButtonBG');
    this.prestigeBtnBg.setInteractive({ cursor: 'pointer' });
    this.prestigeBtnBg.on('pointerover', () => this.prestigeBtnBg.setTexture('zoneButtonBGOver'));
    this.prestigeBtnBg.on('pointerout', () => this.prestigeBtnBg.setTexture('zoneButtonBG'));
    this.prestigeBtnBg.on('pointerdown', () => this.handlePrestige());
    this.add(this.prestigeBtnBorder);
    this.add(this.prestigeBtnBg);

    this.iconLeft = this.scene.add.image(30, 415, 'pres');
    this.add(this.iconLeft);
    this.iconRight = this.scene.add.image(332, 415, 'pres');
    this.add(this.iconRight);
    
    this.prestigeTokenText = this.scene.add.text(
      181, 407,
      'Tokens: 0',
      {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#ffffff'
      }
    );
    this.prestigeTokenText.setOrigin(0.5, 0);
    this.add(this.prestigeTokenText);

    // this.prestigeButton = new Button(
    //   this.scene,
    //   this.panelWidth - 80,
    //   yPos + 10,
    //   120,
    //   30,
    //   'Prestige',
    //   () => this.handlePrestige()
    // );
    // this.add(this.prestigeButton);

    // Create upgrade cards
    const yPos = this.config.padding + 45;
    const cardWidth = (this.panelWidth - this.config.padding * 3) / 2;
    const cardHeight = 70;
    const spacing = 8;

    for (let i = 0; i < TOKEN_CONFIGS.length; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = this.config.padding + col * (cardWidth + spacing) - 10;
      const y = yPos + row * (cardHeight + spacing);

      const card = new TokenUpgradeCard(
        this.scene,
        x + cardWidth / 2,
        y + cardHeight / 2,
        cardWidth,
        cardHeight,
        i,
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
      this.prestigeTokenText.setText('Confirm?');
      setTimeout(() => {
        this.prestigeConfirm = false;
        this.prestigeTokenText.setText('Prestige');
      }, 3000);
    } else {
      this.onPrestige();
      this.prestigeConfirm = false;
      this.prestigeTokenText.setText('Prestige');
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

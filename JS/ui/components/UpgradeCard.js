/**
 * UpgradeCard.js
 * Card component for displaying upgrades
 */

import { Button } from './Button.js';

export class UpgradeCard extends Button {
  constructor(scene, x, y, width, height, upgradeData, onClick) {
    super(scene, x, y, width, height, '', onClick);
    
    this.upgradeData = upgradeData;
    this.locked = false;
    
    // Remove default label
    this.label.destroy();
    this.remove(this.label);
    
    this.createCardContent();
  }

  createCardContent() {
    const padding = 8;
    const startX = -this.buttonWidth / 2 + padding;
    const startY = -this.buttonHeight / 2 + padding;

    // Icon (if sprite frame provided)
    if (this.upgradeData.spriteFrame !== undefined) {
      this.icon = this.scene.add.sprite(startX + 8, startY + 8, 'balls', this.upgradeData.spriteFrame);
      this.icon.setOrigin(0, 0);
      this.add(this.icon);
    }

    // Info text container
    const textStartX = this.icon ? startX + 25 : startX;
    
    this.infoTexts = [];
    this.createInfoText(textStartX, startY, '');
    
    // Lock overlay
    this.lockOverlay = this.scene.add.rectangle(0, 0, this.buttonWidth, this.buttonHeight, 0x000000, 0.7);
    this.lockOverlay.setVisible(false);
    this.add(this.lockOverlay);

    this.lockIcon = this.scene.add.image(0, 0, 'locked');
    this.lockIcon.setScale(0.5);
    this.lockIcon.setVisible(false);
    this.add(this.lockIcon);
  }

  createInfoText(x, y, text) {
    const textObj = this.scene.add.text(x, y, text, {
      fontFamily: 'Arial',
      fontSize: '11px',
      color: '#000000'
    });
    textObj.setOrigin(0, 0);
    this.add(textObj);
    this.infoTexts.push(textObj);
    return textObj;
  }

  updateInfo(lines) {
    // Ensure we have enough text objects
    while (this.infoTexts.length < lines.length) {
      const lastText = this.infoTexts[this.infoTexts.length - 1];
      const newY = lastText.y + 14;
      this.createInfoText(lastText.x, newY, '');
    }

    // Update text content
    lines.forEach((line, index) => {
      if (this.infoTexts[index]) {
        this.infoTexts[index].setText(line);
      }
    });
  }

  setLocked(locked) {
    this.locked = locked;
    this.lockOverlay.setVisible(locked);
    this.lockIcon.setVisible(locked);
    this.setEnabled(!locked);
  }

  setCostColor(canAfford) {
    // Update last text color (cost) based on affordability
    if (this.infoTexts.length > 0) {
      const costText = this.infoTexts[this.infoTexts.length - 1];
      costText.setColor(canAfford ? '#000000' : '#ff0000');
    }
  }
}

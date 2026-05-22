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
    this.selected = false;
    
    // Remove default button background and label
    this.bg.destroy();
    this.remove(this.bg);
    this.label.destroy();
    this.remove(this.label);
    
    this.createCardContent();
  }

  createCardContent() {
    const padding = 8;
    const startX = -this.buttonWidth / 2 + padding;
    const startY = -this.buttonHeight / 2 + padding;

    // Card background with rounded corners
    this.bgGraphics = this.scene.add.graphics();
    this.updateBackground();
    this.add(this.bgGraphics);

    // Icon (if sprite frame provided)
    if (this.upgradeData.spriteFrame !== undefined) {
      this.icon = this.scene.add.sprite(startX + 12, startY + 12, 'balls', this.upgradeData.spriteFrame);
      this.icon.setOrigin(0, 0);
      this.icon.setScale(1.2);
      this.add(this.icon);
    }

    // Info text container
    const textStartX = this.icon ? startX + 40 : startX;
    
    this.infoTexts = [];
    this.createInfoText(textStartX, startY + 5, '');
    
    // Lock overlay
    this.lockOverlay = this.scene.add.graphics();
    this.lockOverlay.setVisible(false);
    this.add(this.lockOverlay);

    this.lockIcon = this.scene.add.image(0, 0, 'locked');
    this.lockIcon.setScale(0.5);
    this.lockIcon.setVisible(false);
    this.add(this.lockIcon);
  }

  updateBackground() {
    this.bgGraphics.clear();
    
    // Fill
    this.bgGraphics.fillStyle(0x2a2a2a, 1);
    this.bgGraphics.fillRoundedRect(
      -this.buttonWidth / 2,
      -this.buttonHeight / 2,
      this.buttonWidth,
      this.buttonHeight,
      8
    );
    
    // Border (if selected)
    if (this.selected) {
      this.bgGraphics.lineStyle(2, 0xce9c4f, 1);
      this.bgGraphics.strokeRoundedRect(
        -this.buttonWidth / 2,
        -this.buttonHeight / 2,
        this.buttonWidth,
        this.buttonHeight,
        8
      );
    }
  }

  createInfoText(x, y, text) {
    const textObj = this.scene.add.text(x, y, text, {
      fontFamily: 'Arial',
      fontSize: '11px',
      color: '#ffffff'
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
      const newY = lastText.y + 16;
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
    
    if (locked) {
      this.lockOverlay.setVisible(true);
      this.lockOverlay.clear();
      this.lockOverlay.fillStyle(0x000000, 0.7);
      this.lockOverlay.fillRoundedRect(
        -this.buttonWidth / 2,
        -this.buttonHeight / 2,
        this.buttonWidth,
        this.buttonHeight,
        8
      );
    } else {
      this.lockOverlay.setVisible(false);
    }
    
    this.lockIcon.setVisible(locked);
    this.setEnabled(!locked);
  }

  setSelected(selected) {
    this.selected = selected;
    this.updateBackground();
  }

  setCostColor(canAfford) {
    // Update last text color (cost) based on affordability
    if (this.infoTexts.length > 0) {
      const costText = this.infoTexts[this.infoTexts.length - 1];
      costText.setColor(canAfford ? '#ce9c4f' : '#ff6b6b');
    }
  }
}

/**
 * TokenUpgradeCard.js
 * Card component for displaying token upgrades
 */
export class TokenUpgradeCard extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, upgradeData, onClick) {
    super(scene, Math.floor(x), Math.floor(y));
    this.fixedPosition = true;
    
    const getThemed = (name) => name + '_' + scene.gameState.theme;
    
    this.shadow = this.scene.add.image(10, 0, getThemed('ballButtonBorder'))
    this.background = this.scene.add.image(10, 0, getThemed('ballButtonBG')).setInteractive({ cursor: 'pointer' });
    this.background.on('pointerover', () => this.background.setTexture(getThemed('ballButtonBGOver')));
    this.background.on('pointerout', () => this.background.setTexture(getThemed('ballButtonBG')));
    this.background.on('pointerdown', () => onClick());
    this.add(this.shadow);
    this.add(this.background);

    this.upgradeData = upgradeData;
    this.locked = false;
    this.selected = false;

    this.words = this.scene.add.text(-40, -28, "Value: 123\r\nCooldown: 123\r\nLevel: 1", {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffffff'
    });
    this.add(this.words);

    this.costText = this.scene.add.text(-40, 18, "Cost: 124", {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffffff',
      fontWeight: 'bold'
    });
    this.costText.setColor(true ? '#cf7c00' : '#f81515');
    this.add(this.costText);

    if (upgradeData < 3) {
      this.icon = this.scene.add.sprite(-70, -20, 'balls', this.upgradeData.spriteFrame);
    } else if (upgradeData < 5) {
      this.icon = this.scene.add.image(-70, -20, 'cursor');
    } else if (upgradeData < 7) {
      this.icon = this.scene.add.image(-89, -35, 'zone');
    } else {
      this.icon = this.scene.add.image(-89, -35, 'pres');
    }
    this.icon.setOrigin(0, 0);
    this.icon.setScale(1.2);
    this.add(this.icon);
  }

  updateInfo(lines) {
    const price = lines.pop();
    this.costText.setText(price);
    this.costText.setColor(true ? '#cf7c00' : '#f81515');
    const str = lines.join('\r\n');
    this.words.setText(str);
  }

  setLocked(locked) {
    this.locked = locked;
    const getThemed = (name) => name + '_' + this.scene.gameState.theme;
    this.words.setAlpha(locked ? 0 : 1);
    this.costText.setAlpha(locked ? 0 : 1);
    this.icon.setAlpha(locked ? 0 : 1);
    this.shadow.setTexture(locked ? getThemed('ballButtonDisabledBorder') : getThemed('ballButtonBorder'));
    this.background.setTexture(locked ? getThemed('ballButtonDisabledBG') : getThemed('ballButtonBG'));


    if (locked) {
      this.background.removeInteractive();
    } else {
      this.background.setInteractive({ cursor: 'pointer' });
    }
  }

  updateTheme() {
    const getThemed = (name) => name + '_' + this.scene.gameState.theme;
    const textColor = this.scene.gameState.theme === 'dark' ? '#ffffff' : '#222222';
    
    // Update textures based on locked state
    if (this.locked) {
      this.shadow.setTexture(getThemed('ballButtonDisabledBorder'));
      this.background.setTexture(getThemed('ballButtonDisabledBG'));
    } else {
      this.shadow.setTexture(getThemed('ballButtonBorder'));
      this.background.setTexture(getThemed('ballButtonBG'));
      
      // Re-setup hover handlers with new theme
      this.background.removeAllListeners('pointerover');
      this.background.removeAllListeners('pointerout');
      this.background.on('pointerover', () => this.background.setTexture(getThemed('ballButtonBGOver')));
      this.background.on('pointerout', () => this.background.setTexture(getThemed('ballButtonBG')));
    }
    
    // Update text colors
    this.words.setColor(textColor);
    this.costText.setColor(textColor);
  }

  setCostColor(canAfford) {
    this.costText.setColor(canAfford ? '#cf7c00' : '#f81515');
  }
}

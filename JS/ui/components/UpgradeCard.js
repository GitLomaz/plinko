/**
 * UpgradeCard.js
 * Card component for displaying upgrades
 */
export class UpgradeCard extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, upgradeData, onClick) {
    super(scene, Math.floor(x), Math.floor(y));

    const getThemed = (name) => name + '_' + scene.gameState.theme;

    this.shadow = this.scene.add.image(10, 0, getThemed('ballButtonBorder'))
    this.background = this.scene.add.image(10, 0, getThemed('ballButtonBG')).setScrollFactor(0).setInteractive({ cursor: 'pointer' });
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

    this.lockText = this.scene.add.text(-20, -20, "Locked", {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
    }).setAlpha(0);
    this.add(this.lockText);


    this.lockSubtext = this.scene.add.text(-20, 0, "Unlock zone first", {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#dcdcdc',
    }).setAlpha(0);
    this.add(this.lockSubtext);
    
    this.icon = this.scene.add.sprite(-70, -20, 'balls', this.upgradeData.spriteFrame);
    this.icon.setOrigin(0, 0);
    this.icon.setScale(1.2);
    this.add(this.icon);
    
    this.lockIcon = this.scene.add.image(-60, -15, 'lock');
    this.lockIcon.setOrigin(0, 0);
    this.lockIcon.setScale(.1);
    this.lockIcon.setAlpha(0);
    this.add(this.lockIcon);
    this.updateTheme();
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
    this.lockText.setAlpha(locked ? 1 : 0);
    this.lockSubtext.setAlpha(locked ? 1 : 0);
    this.lockIcon.setAlpha(locked ? 1 : 0);
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
    this.lockText.setColor(textColor);
    this.lockSubtext.setColor(textColor);
  }

  setCostColor(canAfford) {
    this.costText.setColor(canAfford ? '#cf7c00' : '#f81515');
  }
}

/**
 * ZoneUpgradeCard.js
 * Card component for displaying zone upgrades
 */
export class ZoneUpgradeCard extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, upgradeData, onClick) {
    super(scene, Math.floor(x), Math.floor(y));

    const getThemed = (name) => name + '_' + scene.gameState.theme;

    this.shadow = this.scene.add.image(10, 0, getThemed('zoneButtonBorder'))
    this.background = this.scene.add.image(10, 0, getThemed('zoneButtonBG')).setInteractive({ cursor: 'pointer' });
    this.background.on('pointerover', () => this.background.setTexture(getThemed('zoneButtonBGOver')));
    this.background.on('pointerout', () => this.background.setTexture(getThemed('zoneButtonBG')));
    this.background.on('pointerdown', () => onClick());
    this.add(this.shadow);
    this.add(this.background);

    this.upgradeData = upgradeData;
    this.locked = false;
    this.selected = false;

    this.words = this.scene.add.text(-150, -8, "Value: 123\r\nCooldown: 123\r\nLevel: 1", {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    });
    this.add(this.words);

    this.costText = this.scene.add.text(180, 8, "Cost: 124", {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(1, .5);
    this.costText.setColor(true ? '#cf7c00' : '#f81515');
    this.add(this.costText);

    this.levelText = this.scene.add.text(180, -8, "Level: 1", {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(1, .5);
    this.add(this.levelText);

    this.lockText = this.scene.add.text(-100, -10, "Locked", {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
    }).setAlpha(0);
    this.add(this.lockText);


    this.lockSubtext = this.scene.add.text(-20, -8, "Unlock zone first", {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#dcdcdc',
    }).setAlpha(0);
    this.add(this.lockSubtext);
    
    this.lockIcon = this.scene.add.image(-130, -13, 'lock');
    this.lockIcon.setOrigin(0, 0);
    this.lockIcon.setScale(.1);
    this.lockIcon.setAlpha(0);
    this.add(this.lockIcon);
    this.updateTheme();
  }

  /*
  const lines = [
    `${ZONE_EFFECTS[index]} - ${this.formatter.formatPercent(modifier.toNumber())}`,
    `Level: ${zone.level}`,
    `Cost: ${this.formatter.format(cost)}`
  ];
  */
  updateInfo(lines) {
    const price = lines.pop();
    this.costText.setText(price);
    this.costText.setColor(true ? '#cf7c00' : '#f81515');
    this.levelText.setText(lines.pop());
    this.words.setText(lines.pop());
  }

  setLocked(locked) {
    this.locked = locked;
    const getThemed = (name) => name + '_' + this.scene.gameState.theme;
    this.words.setAlpha(locked ? 0 : 1);
    this.levelText.setAlpha(locked ? 0 : 1);
    this.costText.setAlpha(locked ? 0 : 1);
    this.lockText.setAlpha(locked ? 1 : 0);
    this.lockSubtext.setAlpha(locked ? 1 : 0);
    this.lockIcon.setAlpha(locked ? 1 : 0);
    this.shadow.setTexture(locked ? getThemed('zoneButtonDisabledBorder') : getThemed('zoneButtonBorder'));
    this.background.setTexture(locked ? getThemed('zoneButtonDisabledBG') : getThemed('zoneButtonBG'));


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
      this.shadow.setTexture(getThemed('zoneButtonDisabledBorder'));
      this.background.setTexture(getThemed('zoneButtonDisabledBG'));
    } else {
      this.shadow.setTexture(getThemed('zoneButtonBorder'));
      this.background.setTexture(getThemed('zoneButtonBG'));
      
      // Re-setup hover handlers with new theme
      this.background.removeAllListeners('pointerover');
      this.background.removeAllListeners('pointerout');
      this.background.on('pointerover', () => this.background.setTexture(getThemed('zoneButtonBGOver')));
      this.background.on('pointerout', () => this.background.setTexture(getThemed('zoneButtonBG')));
    }
    
    // Update text colors
    this.words.setColor(textColor);
    this.levelText.setColor(textColor);
    this.lockText.setColor(textColor);
    this.lockSubtext.setColor(textColor);
  }

  setCostColor(canAfford) {
    this.costText.setColor(canAfford ? '#cf7c00' : '#f81515');
  }
}

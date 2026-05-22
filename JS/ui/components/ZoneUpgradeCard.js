/**
 * ZoneUpgradeCard.js
 * Card component for displaying zone upgrades
 */
export class ZoneUpgradeCard extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, upgradeData, onClick) {
    super(scene, Math.floor(x), Math.floor(y));

    this.shadow = this.scene.add.image(10, 0, 'zoneButtonBorder')
    this.background = this.scene.add.image(10, 0, 'zoneButtonBG').setInteractive({ cursor: 'pointer' });
    this.background.on('pointerover', () => this.background.setTexture('zoneButtonBGOver'));
    this.background.on('pointerout', () => this.background.setTexture('zoneButtonBG'));
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
    this.costText.setColor(true ? '#ffb547' : '#f81515');
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
    this.costText.setColor(true ? '#ffb547' : '#f81515');
    this.levelText.setText(lines.pop());
    this.words.setText(lines.pop());
  }

  setLocked(locked) {
    this.locked = locked;
    this.words.setAlpha(locked ? 0 : 1);
    this.levelText.setAlpha(locked ? 0 : 1);
    this.costText.setAlpha(locked ? 0 : 1);
    this.lockText.setAlpha(locked ? 1 : 0);
    this.lockSubtext.setAlpha(locked ? 1 : 0);
    this.lockIcon.setAlpha(locked ? 1 : 0);
    this.shadow.setTexture(locked ? 'zoneButtonDisabledBorder' : 'zoneButtonBorder');
    this.background.setTexture(locked ? 'zoneButtonDisabledBG' : 'zoneButtonBG');


    if (locked) {
      this.background.removeInteractive();
    } else {
      this.background.setInteractive({ cursor: 'pointer' });
    }
  }

  setCostColor(canAfford) {
    this.costText.setColor(canAfford ? '#ffb547' : '#f81515');
  }
}

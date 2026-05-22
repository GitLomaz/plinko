/**
 * TokenUpgradeCard.js
 * Card component for displaying token upgrades
 */
export class TokenUpgradeCard extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, upgradeData, onClick) {
    super(scene, Math.floor(x), Math.floor(y));

    this.shadow = this.scene.add.image(10, 0, 'ballButtonBorder')
    this.background = this.scene.add.image(10, 0, 'ballButtonBG').setInteractive({ cursor: 'pointer' });
    this.background.on('pointerover', () => this.background.setTexture('ballButtonBGOver'));
    this.background.on('pointerout', () => this.background.setTexture('ballButtonBG'));
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
    this.costText.setColor(true ? '#ffb547' : '#f81515');
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
  }

  updateInfo(lines) {
    const price = lines.pop();
    this.costText.setText(price);
    this.costText.setColor(true ? '#ffb547' : '#f81515');
    const str = lines.join('\r\n');
    this.words.setText(str);
  }

  setLocked(locked) {
    this.locked = locked;
    this.words.setAlpha(locked ? 0 : 1);
    this.costText.setAlpha(locked ? 0 : 1);
    this.icon.setAlpha(locked ? 0 : 1);
    this.lockText.setAlpha(locked ? 1 : 0);
    this.lockSubtext.setAlpha(locked ? 1 : 0);
    this.lockIcon.setAlpha(locked ? 1 : 0);
    this.shadow.setTexture(locked ? 'ballButtonDisabledBorder' : 'ballButtonBorder');
    this.background.setTexture(locked ? 'ballButtonDisabledBG' : 'ballButtonBG');


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

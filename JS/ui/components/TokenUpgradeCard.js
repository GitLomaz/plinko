/**
 * TokenUpgradeCard.js
 * Card component for displaying token upgrades
 */
export class TokenUpgradeCard extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, upgradeData, onClick) {
    super(scene, Math.floor(x), Math.floor(y));
    this.fixedPosition = true;
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

    console.log(upgradeData);

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
    this.costText.setColor(true ? '#ffb547' : '#f81515');
    const str = lines.join('\r\n');
    this.words.setText(str);
  }

  setLocked(locked) {
    this.locked = locked;
    this.words.setAlpha(locked ? 0 : 1);
    this.costText.setAlpha(locked ? 0 : 1);
    this.icon.setAlpha(locked ? 0 : 1);
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

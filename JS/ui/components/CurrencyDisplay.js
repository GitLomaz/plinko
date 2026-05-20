/**
 * CurrencyDisplay.js
 * Currency display component with icon and value
 */

export class CurrencyDisplay extends Phaser.GameObjects.Container {
  constructor(scene, x, y, iconTexture, backgroundColor, value = '0') {
    super(scene, x, y);
    
    this.iconTexture = iconTexture;
    this.backgroundColor = backgroundColor;
    
    this.createBackground();
    this.createIcon();
    this.createValue(value);
    
    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(200);
  }

  createBackground() {
    this.bg = this.scene.add.rectangle(0, 0, 170, 34, this.backgroundColor);
    this.bg.setOrigin(0, 0);
    this.bg.setStrokeStyle(1, 0x000000);
    this.add(this.bg);
  }

  createIcon() {
    this.icon = this.scene.add.image(15, 17, this.iconTexture);
    this.icon.setScale(0.8);
    this.add(this.icon);
  }

  createValue(text) {
    this.valueText = this.scene.add.text(40, 17, text, {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#000000'
    });
    this.valueText.setOrigin(0, 0.5);
    this.add(this.valueText);
  }

  setValue(value) {
    this.valueText.setText(value);
  }
}

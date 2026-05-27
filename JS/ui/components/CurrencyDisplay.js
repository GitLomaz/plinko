/**
 * CurrencyDisplay.js
 * Currency display component with icon and value
 */

export class CurrencyDisplay extends Phaser.GameObjects.Container {
  constructor(scene, x, y, type) {
    super(scene, x, y);
    this.type = type;
    this.iconTexture = type === 'currency' ? 'coin' : 'token';
    this.backgroundColor = type === 'currency' ? 0x433d2c : 0x0f454f;
    this.createBackground();
    this.createIcon();
    this.createValue('0');
    
    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(200);
  }

  createBackground() {
    const graphics = this.scene.add.graphics();
    const shadow = this.scene.add.image(0, 0, this.type === 'currency' ? 'currencyBorder' : 'prestigeBorder').setOrigin(0);
    this.add(shadow);
    graphics.fillStyle(this.backgroundColor, 1);
    graphics.fillRoundedRect(2, 2, 164, 28, 8);
    this.add(graphics);
    this.bg = graphics;
  }

  createIcon() {
    this.icon = this.scene.add.image(15, 16, this.iconTexture);
    this.icon.setScale(this.type === 'currency' ? 0.6 : 1);
    this.add(this.icon);
  }

  createValue(text) {
    this.valueText = this.scene.add.text(40, 18, text, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
    });
    this.valueText.setOrigin(0, 0.5);
    this.add(this.valueText);
  }

  setValue(value) {
    this.valueText.setText(value);
  }

  updateTheme() {
    const textColor = this.scene.gameState.theme === 'dark' ? '#ffffff' : '#222222';
    
    // Update border texture
    const borderTexture = this.type === 'currency' ? 'currencyBorder' : 'prestigeBorder';
    if (this.list[0] && this.list[0].setTexture) {
      this.list[0].setTexture(borderTexture);
    }
    
    // Update text color
    this.valueText.setColor(textColor);
  }
}

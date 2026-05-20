/**
 * TextDisplay.js
 * Text display component with label and value
 */

export class TextDisplay extends Phaser.GameObjects.Container {
  constructor(scene, x, y, label, value = '', config = {}) {
    super(scene, x, y);
    
    this.config = {
      labelColor: config.labelColor || '#000000',
      valueColor: config.valueColor || '#000000',
      fontSize: config.fontSize || '14px',
      spacing: config.spacing || 5,
      ...config
    };

    this.createLabel(label);
    this.createValue(value);
    
    scene.add.existing(this);
  }

  createLabel(text) {
    this.label = this.scene.add.text(0, 0, text, {
      fontFamily: 'Arial',
      fontSize: this.config.fontSize,
      color: this.config.labelColor
    });
    this.label.setOrigin(0, 0);
    this.add(this.label);
  }

  createValue(text) {
    const x = this.label.width + this.config.spacing;
    this.valueText = this.scene.add.text(x, 0, text, {
      fontFamily: 'Arial',
      fontSize: this.config.fontSize,
      color: this.config.valueColor
    });
    this.valueText.setOrigin(0, 0);
    this.add(this.valueText);
  }

  setValue(value) {
    this.valueText.setText(value);
  }

  setValueColor(color) {
    this.valueText.setColor(color);
  }

  setLabel(text) {
    this.label.setText(text);
    const x = this.label.width + this.config.spacing;
    this.valueText.setX(x);
  }
}

/**
 * Button.js
 * Interactive button component
 */

export class Button extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, text, onClick, config = {}) {
    super(scene, x, y);
    
    this.buttonWidth = width;
    this.buttonHeight = height;
    this.onClick = onClick;
    this.config = {
      backgroundColor: config.backgroundColor || 0x82b194,
      hoverColor: config.hoverColor || 0x90c7a6,
      textColor: config.textColor || '#000000',
      fontSize: config.fontSize || '14px',
      enabled: config.enabled !== false,
      ...config
    };

    this.createButton();
    this.createText(text);
    this.setupInteractivity();
    
    scene.add.existing(this);
  }

  createButton() {
    this.bg = this.scene.add.rectangle(0, 0, this.buttonWidth, this.buttonHeight, this.config.backgroundColor);
    this.bg.setStrokeStyle(1, 0x000000);
    this.add(this.bg);
  }

  createText(text) {
    this.label = this.scene.add.text(0, 0, text, {
      fontFamily: 'Arial',
      fontSize: this.config.fontSize,
      color: this.config.textColor
    });
    this.label.setOrigin(0.5);
    this.add(this.label);
  }

  setupInteractivity() {
    this.setSize(this.buttonWidth, this.buttonHeight);
    this.setInteractive();

    this.on('pointerover', () => {
      if (this.config.enabled) {
        this.bg.setFillStyle(this.config.hoverColor);
        this.scene.input.setDefaultCursor('pointer');
      }
    });

    this.on('pointerout', () => {
      this.bg.setFillStyle(this.config.backgroundColor);
      this.scene.input.setDefaultCursor('default');
    });

    this.on('pointerdown', () => {
      if (this.config.enabled && this.onClick) {
        this.onClick();
      }
    });
  }

  setText(text) {
    this.label.setText(text);
  }

  setEnabled(enabled) {
    this.config.enabled = enabled;
    this.setAlpha(enabled ? 1 : 0.5);
  }

  setBackgroundColor(color) {
    this.config.backgroundColor = color;
    this.bg.setFillStyle(color);
  }
}

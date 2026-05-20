/**
 * TabButton.js
 * Tab button for switching panels
 */

export class TabButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, iconTexture, onClick) {
    super(scene, x, y);
    
    this.isSelected = false;
    this.onClick = onClick;
    
    this.createButton();
    this.createIcon(iconTexture);
    this.setupInteractivity();
    
    scene.add.existing(this);
  }

  createButton() {
    this.bg = this.scene.add.rectangle(0, 0, 50, 50, 0xc9a874);
    this.bg.setStrokeStyle(1, 0x000000);
    this.add(this.bg);
  }

  createIcon(texture) {
    this.icon = this.scene.add.image(0, 0, texture);
    this.icon.setScale(0.8);
    this.add(this.icon);
  }

  setupInteractivity() {
    this.setSize(50, 50);
    this.setInteractive();

    this.on('pointerover', () => {
      if (!this.isSelected) {
        this.bg.setFillStyle(0xb39667);
      }
      this.scene.input.setDefaultCursor('pointer');
    });

    this.on('pointerout', () => {
      if (!this.isSelected) {
        this.bg.setFillStyle(0xc9a874);
      }
      this.scene.input.setDefaultCursor('default');
    });

    this.on('pointerdown', () => {
      if (this.onClick) {
        this.onClick();
      }
    });
  }

  setSelected(selected) {
    this.isSelected = selected;
    this.bg.setFillStyle(selected ? 0xb39667 : 0xc9a874);
  }
}

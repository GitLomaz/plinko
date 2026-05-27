/**
 * TabButton.js
 * Tab button for switching panels
 */

export class TabButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, iconTexture, label, onClick) {
    super(scene, x, y);
    
    this.isSelected = false;
    this.onClick = onClick;
    
    this.createButton();
    this.createIcon(iconTexture);
    this.createLabel(label);
    
    scene.add.existing(this);
  }

  createButton() {
    const getThemed = (name) => name + '_' + this.scene.gameState.theme;
    
    this.shadow = this.scene.add.image(0, 0, getThemed('tabBorder')).setOrigin(0.5).setScrollFactor(0);
    this.bg = this.scene.add.image(0, 0, getThemed('tabBG')).setOrigin(0.5).setScrollFactor(0).setInteractive({ cursor: 'pointer' });
    this.bg.on('pointerover', () => this.bg.setTexture(getThemed('tabBGOver')));
    this.bg.on('pointerout', () => this.bg.setTexture(getThemed('tabBG')));
    this.bg.on('pointerdown', () => this.onClick());

    this.add(this.shadow);
    this.add(this.bg);
  }

  createIcon(texture) {
    this.icon = this.scene.add.image(0, -8, texture);
    this.icon.setScale(0.8);
    this.add(this.icon);
  }

  createLabel(text) {
    this.labelText = this.scene.add.text(0, 6, text, {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffffff'
    });
    this.labelText.setOrigin(0.5, 0);
    this.add(this.labelText);
  }

  setSelected(selected) {
    this.isSelected = selected;
    const getThemed = (name) => name + '_' + this.scene.gameState.theme;
    this.shadow.setTexture(selected ? getThemed('tabBorderSelected') : getThemed('tabBorder'));
  }

  updateTheme() {
    const textColor = this.scene.gameState.theme === 'dark' ? '#ffffff' : '#222222';
    const getThemed = (name) => name + '_' + this.scene.gameState.theme;
    
    // Update button textures
    this.shadow.setTexture(this.isSelected ? getThemed('tabBorderSelected') : getThemed('tabBorder'));
    this.bg.setTexture(getThemed('tabBG'));
    
    // Re-setup hover handlers with new theme
    this.bg.removeAllListeners();
    this.bg.on('pointerover', () => this.bg.setTexture(getThemed('tabBGOver')));
    this.bg.on('pointerout', () => this.bg.setTexture(getThemed('tabBG')));
    this.bg.on('pointerdown', () => this.onClick());
    
    // Update text color
    this.labelText.setColor(textColor);
  }
}

/**
 * HelpPanel.js
 * Panel for help and settings
 */

import { UIPanel } from '../components/UIPanel.js';
import { Button } from '../components/Button.js';

export class HelpPanel extends UIPanel {
  constructor(scene, x, y, width, height, formatter, gameState, onSave, onReset, onFormatChange, onThemeChange) {
    super(scene, x, y, width, height, {
      backgroundColor: 0x3a3a3a
    });
    
    this.formatter = formatter;
    this.gameState = gameState;
    this.onSave = onSave;
    this.onReset = onReset;
    this.onFormatChange = onFormatChange;
    this.onThemeChange = onThemeChange;
    this.resetCounter = 0;
    
    this.createContent();
  }

  createContent() {

    this.tipShadow = this.scene.add.image(18, 6, 'tipBorder').setOrigin(0);
    this.tipBackground = this.scene.add.image(20, 8, 'tipBG').setOrigin(0);

    this.add(this.tipShadow);
    this.add(this.tipBackground);

    // Lightbulb icon (using a simple circle with yellow color as placeholder)

    this.icon = this.scene.add.image(40, 28, "idea")
    this.add(this.icon);

    // Tip text
    const tipText = this.scene.add.text(
      this.config.padding + 56,
      this.config.padding + 1,
      'Tip: If you\'re lucky, I will update this game at LEAST once a decade!',
      {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#ffffff',
        wordWrap: { width: this.panelWidth - this.config.padding * 2 - 50 }
      }
    );
    tipText.setOrigin(0, 0);
    this.add(tipText);
    // Help text
    const helpText = this.scene.add.text(
      this.config.padding,
      this.config.padding,
      'Click balls before they reach the zone\nbottom for bonus multipliers!\n\nBalls that reach the bottom earn\ntheir value × zone modifier.\n\nSome balls survive to the next zone.',
      {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#ffffff',
        wordWrap: { width: this.panelWidth - this.config.padding * 2 },
        lineSpacing: 4
      }
    );
    helpText.setOrigin(0, 0).setAlpha(0);
    this.add(helpText);

    let yPos = helpText.y + helpText.height + 20;

    // Number format section
    const formatTitle = this.scene.add.text(
      this.panelWidth / 2,
      yPos,
      'Number Format',
      {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#ffffff'
      }
    );
    formatTitle.setOrigin(0.5, 0);
    this.add(formatTitle);

    yPos += 40;

    // Format buttons
    const formats = [
      { label: 'Engineering', value: 'eng' },
      { label: 'Scientific', value: 'sci' },
      { label: 'Traditional', value: 'bad' }
    ];

    const buttonWidth = 110;
    const spacing = 10;
    const totalWidth = formats.length * buttonWidth + (formats.length - 1) * spacing;
    const startX = (this.panelWidth - totalWidth) / 2;

    this.formatButtons = [];
    formats.forEach((format, index) => {
      const x = startX + index * (buttonWidth + spacing) + buttonWidth / 2;
      const border = this.scene.add.image(x, yPos, 'buttonBorder').setOrigin(0.5);
      const background = this.scene.add.image(x, yPos, 'buttonBG').setScrollFactor(0).setInteractive({ cursor: 'pointer' });
      background.on('pointerover', () => background.setTexture('buttonBGOver'));
      background.on('pointerout', () => {
        if (background.isSelected) {
          background.setTexture('buttonBGSelected');
        } else {
          background.setTexture('buttonBG');
        }
      });
      background.on('pointerdown', () => this.selectFormat(format.value));
      const label = this.scene.add.text(x, yPos, format.label, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#ffffff'
      });
      label.setOrigin(0.5);
      this.add(border);
      this.add(background);
      this.add(label);
      this.formatButtons.push({ button: background, value: format.value });
    });

    yPos += 40;

    // Theme section
    const themeTitle = this.scene.add.text(
      this.panelWidth / 2,
      yPos,
      'Theme',
      {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#ffffff'
      }
    );
    themeTitle.setOrigin(0.5, 0);
    this.add(themeTitle);

    yPos += 40;

    // Theme buttons
    const themes = [
      { label: 'Dark Mode', value: 'dark' },
      { label: 'Light Mode', value: 'light' }
    ];

    const themeButtonWidth = 110;
    const themeSpacing = 10;
    const themeTotalWidth = themes.length * themeButtonWidth + (themes.length - 1) * themeSpacing;
    const themeStartX = (this.panelWidth - themeTotalWidth) / 2;

    this.themeButtons = [];
    themes.forEach((theme, index) => {
      const x = themeStartX + index * (themeButtonWidth + themeSpacing) + themeButtonWidth / 2;
      const border = this.scene.add.image(x, yPos, 'buttonBorder').setOrigin(0.5);
      const background = this.scene.add.image(x, yPos, 'buttonBG').setScrollFactor(0).setInteractive({ cursor: 'pointer' });
      background.on('pointerover', () => background.setTexture('buttonBGOver'));
      background.on('pointerout', () => {
        if (background.isSelected) {
          background.setTexture('buttonBGSelected');
        } else {
          background.setTexture('buttonBG');
        }
      });
      background.on('pointerdown', () => this.selectTheme(theme.value));
      const label = this.scene.add.text(x, yPos, theme.label, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#ffffff'
      });
      label.setOrigin(0.5);
      this.add(border);
      this.add(background);
      this.add(label);
      this.themeButtons.push({ button: background, value: theme.value });
    });

    yPos += 40;

    // Save/Reset section
    const saveTitle = this.scene.add.text(
      this.panelWidth / 2,
      yPos,
      'Game State',
      {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#ffffff'
      }
    );
    saveTitle.setOrigin(0.5, 0);
    this.add(saveTitle);

    yPos += 40;

    // Save button
    const saveX = this.panelWidth / 2 - 60;
    const saveBorder = this.scene.add.image(saveX, yPos, 'buttonBorder').setOrigin(0.5);
    const saveBackground = this.scene.add.image(saveX, yPos, 'buttonBG').setScrollFactor(0).setInteractive({ cursor: 'pointer' });
    saveBackground.on('pointerover', () => saveBackground.setTexture('buttonBGOver'));
    saveBackground.on('pointerout', () => saveBackground.setTexture('buttonBG'));
    saveBackground.on('pointerdown', () => this.handleSave());
    this.saveLabel = this.scene.add.text(saveX, yPos, 'Save Game', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffffff'
    });
    this.saveLabel.setOrigin(0.5);
    this.add(saveBorder);
    this.add(saveBackground);
    this.add(this.saveLabel);

    // Reset button
    const resetX = this.panelWidth / 2 + 60;
    const resetBorder = this.scene.add.image(resetX, yPos, 'buttonDangerBorder').setOrigin(0.5);
    this.resetBackground = this.scene.add.image(resetX, yPos, 'buttonDangerBG').setScrollFactor(0).setInteractive({ cursor: 'pointer' });
    this.resetBackground.on('pointerover', () => this.resetBackground.setTexture('buttonDangerBGOver'));
    this.resetBackground.on('pointerout', () => this.resetBackground.setTexture('buttonDangerBG'));
    this.resetBackground.on('pointerdown', () => this.handleReset());
    this.resetLabel = this.scene.add.text(resetX, yPos, 'Hard Reset', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffffff'
    });
    this.resetLabel.setOrigin(0.5);
    this.add(resetBorder);
    this.add(this.resetBackground);
    this.add(this.resetLabel);
  }

  selectFormat(format) {
    this.formatter.setFormat(format);
    this.onFormatChange(format);
    this.updateFormatButtons();
  }

  selectTheme(theme) {
    // Don't update buttons here - the UI will be recreated with the correct state
    this.onThemeChange(theme);
  }

  updateFormatButtons() {
    this.formatButtons.forEach(({ button, value }) => {
      if (value === this.formatter.formatType) {
        button.setTexture('buttonBGSelected');
        button.isSelected = true;
      } else {
        button.setTexture('buttonBG');
        button.isSelected = false;
      }
    });
  }

  updateThemeButtons() {
    this.themeButtons.forEach(({ button, value }) => {
      if (value === this.gameState.theme) {
        button.setTexture('buttonBGSelected');
        button.isSelected = true;
      } else {
        button.setTexture('buttonBG');
        button.isSelected = false;
      }
    });
  }

  handleSave() {
    if (this.saveLabel.text !== 'Saved!') {
      this.saveLabel.setText('Saved!');
      this.onSave();
      setTimeout(() => {
        this.saveLabel.setText('Save Game');
      }, 2000);
    }
    
    // Ensure all children ignore camera scroll
    this.setChildrenScrollFactor();
  }

  handleReset() {
    this.resetCounter++;
    const labels = ['Confirm', 'Ya Sure?', '100%?', 'RESET!'];
    
    if (this.resetCounter < 4) {
      this.resetLabel.setText(labels[this.resetCounter - 1]);
    } else {
      this.onReset();
    }

    // Reset counter after timeout
    setTimeout(() => {
      this.resetCounter = 0;
      this.resetLabel.setText('Hard Reset');
    }, 3000);
  }

  show() {
    super.show();
    this.updateFormatButtons();
    this.updateThemeButtons();
  }
}

/**
 * HelpPanel.js
 * Panel for help and settings
 */

import { UIPanel } from '../components/UIPanel.js';
import { Button } from '../components/Button.js';

export class HelpPanel extends UIPanel {
  constructor(scene, x, y, width, height, formatter, onSave, onReset, onFormatChange) {
    super(scene, x, y, width, height, {
      backgroundColor: 0x3a3a3a
    });
    
    this.formatter = formatter;
    this.onSave = onSave;
    this.onReset = onReset;
    this.onFormatChange = onFormatChange;
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

    const buttonWidth = 100;
    const spacing = 10;
    const totalWidth = formats.length * buttonWidth + (formats.length - 1) * spacing;
    const startX = (this.panelWidth - totalWidth) / 2;

    this.formatButtons = [];
    formats.forEach((format, index) => {
      const x = startX + index * (buttonWidth + spacing) + buttonWidth / 2;
      const btn = new Button(
        this.scene,
        x,
        yPos,
        buttonWidth,
        30,
        format.label,
        () => this.selectFormat(format.value),
        { fontSize: '12px' }
      );
      this.add(btn);
      this.formatButtons.push({ button: btn, value: format.value });
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

    yPos += 50;

    // Save button
    this.saveButton = new Button(
      this.scene,
      this.panelWidth / 2 - 60,
      yPos,
      100,
      35,
      'Save Game',
      () => this.handleSave(),
      { fontSize: '12px' }
    );
    this.add(this.saveButton);

    // Reset button
    this.resetButton = new Button(
      this.scene,
      this.panelWidth / 2 + 60,
      yPos,
      100,
      35,
      'Hard Reset',
      () => this.handleReset(),
      { fontSize: '12px', backgroundColor: 0xcd5c5c, hoverColor: 0xe07070 }
    );
    this.add(this.resetButton);
  }

  selectFormat(format) {
    this.formatter.setFormat(format);
    this.onFormatChange(format);
    this.updateFormatButtons();
  }

  updateFormatButtons() {
    this.formatButtons.forEach(({ button, value }) => {
      if (value === this.formatter.formatType) {
        button.setBackgroundColor(0x7375ff);
      } else {
        button.setBackgroundColor(0x82b194);
      }
    });
  }

  handleSave() {
    if (this.saveButton.label.text !== 'Saved!') {
      this.saveButton.setText('Saved!');
      this.onSave();
      setTimeout(() => {
        this.saveButton.setText('Save Game');
      }, 2000);
    }
    
    // Ensure all children ignore camera scroll
    this.setChildrenScrollFactor();
  }

  handleReset() {
    this.resetCounter++;
    const labels = ['Confirm', 'Ya Sure?', '100%?', 'RESET!'];
    
    if (this.resetCounter < 4) {
      this.resetButton.setText(labels[this.resetCounter - 1]);
    } else {
      this.onReset();
    }

    // Reset counter after timeout
    setTimeout(() => {
      this.resetCounter = 0;
      this.resetButton.setText('Hard Reset');
    }, 3000);
  }

  show() {
    super.show();
    this.updateFormatButtons();
  }
}

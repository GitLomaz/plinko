/**
 * UIPanel.js
 * Base UI panel component
 */

export class UIPanel extends Phaser.GameObjects.Container {
  constructor(scene, x, y, width, height, config = {}) {
    super(scene, x, y);
    
    this.panelWidth = width;
    this.panelHeight = height;
    this.config = {
      backgroundColor: config.backgroundColor || 0xb39667,
      alpha: config.alpha || 1,
      padding: config.padding || 10,
      scrollable: config.scrollable || false,
      ...config
    };

    this.scrollOffset = 0;
    this.contentHeight = 0;
    
    this.createBackground();
    // Note: createContent() must be called by child class after initialization
    
    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setDepth(100);
    
    // Ensure all children have scroll factor 0
    this.setChildrenScrollFactor();
  }

  /**
   * Recursively set scroll factor on all children
   */
  setChildrenScrollFactor() {
    this.list.forEach(child => {
      if (child.setScrollFactor) {
        child.setScrollFactor(0);
      }
      // If child is a container, set its children too
      if (child.list) {
        child.list.forEach(grandchild => {
          if (grandchild.setScrollFactor) {
            grandchild.setScrollFactor(0);
          }
        });
      }
    });
  }

  createBackground() {
    this.background = this.scene.add.rectangle(
      0, 0,
      this.panelWidth,
      this.panelHeight,
      this.config.backgroundColor
    );
    this.background.setOrigin(0, 0);
    this.background.setAlpha(this.config.alpha);
    this.add(this.background);
    
    // Note: Mask removed - it was causing rendering issues when camera scrolls
  }

  createContent() {
    // Override in subclasses
  }

  show() {
    this.setVisible(true);
  }

  hide() {
    this.setVisible(false);
  }

  clear() {
    // Remove all children except background
    this.list.forEach((child, index) => {
      if (index > 0) { // Skip background
        child.destroy();
      }
    });
    this.list = [this.background];
  }

  setScrollOffset(offset) {
    this.scrollOffset = Math.max(0, Math.min(offset, Math.max(0, this.contentHeight - this.panelHeight)));
    this.updateScroll();
  }

  updateScroll() {
    // Move all children except background by scroll offset
    this.list.forEach((child, index) => {
      if (index > 0 && child !== this.background) {
        // Store original Y if not already stored
        if (child.originalY === undefined) {
          child.originalY = child.y;
        }
        // Update Y position based on scroll offset
        child.y = child.originalY - this.scrollOffset;
      }
    });
  }

  /**
   * Calculate total content height for scrolling
   */
  calculateContentHeight() {
    let maxY = 0;
    this.list.forEach((child, index) => {
      if (index > 0 && child !== this.background) {
        const childBottom = child.y + (child.displayHeight || child.height || 0);
        if (childBottom > maxY) {
          maxY = childBottom;
        }
      }
    });
    this.contentHeight = maxY + this.config.padding;
    return this.contentHeight;
  }
}

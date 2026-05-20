/**
 * ZoneManager.js
 * Manages game zones/levels and obstacles
 */

import { GAME_CONFIG, ZONE_PRICES } from '../config/GameConfig.js';

export class ZoneManager {
  constructor(scene, gameState) {
    this.scene = scene;
    this.gameState = gameState;
    this.zoneCount = 0;
    this.lockedContainer = null;
  }

  /**
   * Create a new zone
   * @param {number} level - Initial level of the zone (default 0)
   */
  createZone(level = 0) {
    const zone = {
      type: this.zoneCount,
      shapes: [],
      tweens: [],
      level: level,
      modifier: 0.8 + this.zoneCount * 0.1 + level * 0.05,
      costModifier: new Decimal(4.5)
    };

    const effectiveLevel = Math.min(zone.level, 9);
    this.gameState.zones.push(zone);
    this.zoneCount++;

    // Update world bounds
    this.scene.matter.world.setBounds(
      0, 0, 680, this.zoneCount * 1500,
      32, true, true, true, false
    );
    
    this.scene.cameras.main.setBounds(0, 0, 680, this.zoneCount * 1500);

    // Create zone obstacles based on type
    this.createZoneObstacles(zone, effectiveLevel);

    // Create visual separator
    this.createZoneSeparator(zone);

    // Update locked zone button
    this.updateLockedZone();

    return zone;
  }

  createZoneSeparator(zone) {
    const yPos = zone.type * 1500 + 1430;
    
    for (let j = 0; j < 70; j++) {
      if (j % 2 === 0) {
        this.scene.add.line(0, 0, j * 10, yPos, j * 10 + 10, yPos, 0xf84d3e, 0.4);
      }
    }

    // Add spawn lines based on zone
    this.addSpawnLines(zone);
  }

  addSpawnLines(zone) {
    const lines = [
      { zone: 0, positions: [90, 70, 50], colors: [0xf84d3e, 0x0085f3, 0xd06ab8] },
      { zone: 1, positions: [1530, 1550], colors: [0x508a36, 0x108a80] },
      { zone: 2, positions: [3070], colors: [0xffb45a] },
      { zone: 3, positions: [4570], colors: [0xa57b36] },
      { zone: 4, positions: [6070], colors: [0x727272] },
      { zone: 5, positions: [7570], colors: [0x673eab] },
      { zone: 6, positions: [9070], colors: [0x833b21] }
    ];

    const lineData = lines.find(l => l.zone === zone.type);
    if (lineData) {
      lineData.positions.forEach((y, idx) => {
        this.scene.add.line(0, 0, 0, y, 2000, y, lineData.colors[idx], 0.6);
      });

      // Enable spawns for this zone
      this.enableSpawnsForZone(zone.type);
    }
  }

  enableSpawnsForZone(zoneType) {
    const spawnMapping = {
      1: [3, 4],
      2: [5],
      3: [6],
      4: [7],
      5: [8],
      6: [8]
    };

    const spawnsToEnable = spawnMapping[zoneType];
    if (spawnsToEnable) {
      spawnsToEnable.forEach(spawnId => {
        if (this.gameState.spawns[spawnId]) {
          this.gameState.spawns[spawnId].enabled = true;
        }
      });
    }
  }

  createZoneObstacles(zone, level) {
    switch (zone.type) {
      case 0:
        this.createDiamondZone(zone, level);
        break;
      case 1:
        this.createCrossZone(zone, level);
        break;
      case 2:
        this.createRampZone(zone, level);
        break;
      case 3:
        this.createCircleZone(zone, level);
        break;
      case 4:
        this.createLineZone(zone, level);
        break;
      case 5:
        this.createPusherZone(zone, level);
        break;
      case 6:
        this.createConveyorZone(zone, level);
        break;
      case 7:
        this.createChannelZone(zone, level);
        break;
    }
  }

  createDiamondZone(zone, level) {
    zone.levels = [3, 2.8, 2.6, 2.4, 2.2, 2, 1.8, 1.6, 1.4, 1.2, 1];
    const baseY = zone.type * 1500;

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 8; j++) {
        const shape1 = this.scene.matter.add.image(
          i * 68.5,
          baseY + 200 + j * 150,
          'rectangle',
          null,
          { isStatic: true }
        ).setScale(zone.levels[level]).setAngle(45);

        const shape2 = this.scene.matter.add.image(
          34 + i * 68.5,
          baseY + 275 + j * 150,
          'rectangle',
          null,
          { isStatic: true }
        ).setScale(zone.levels[level]).setAngle(45);

        zone.shapes.push(shape1, shape2);
      }
    }
  }

  createCrossZone(zone, level) {
    zone.levels = [125, 115, 105, 95, 85, 75, 65, 55, 45, 35];
    const baseY = zone.type * 1500;

    for (let i = 0; i < 3; i++) {
      this.scene.matter.add.image(125, baseY + 200 + i * 400, 'rectangle', null, { isStatic: true })
        .setScale(30, 1).setAngle(10);
      this.scene.matter.add.image(550, baseY + 200 + i * 400, 'rectangle', null, { isStatic: true })
        .setScale(30, 1).setAngle(-10);

      const ramp1 = this.scene.matter.add.image(340, baseY + 400 + i * 400, 'rectangle', null, { isStatic: true })
        .setScale(40, 1).setAngle(0);
      const ramp2 = this.scene.matter.add.image(340, baseY + 400 + i * 400, 'rectangle', null, { isStatic: true })
        .setScale(40, 1).setAngle(90);

      this.scene.tweens.add({
        targets: ramp1,
        rotation: Phaser.Math.DegToRad(360),
        duration: zone.levels[level] * 800,
        ease: 'Linear',
        repeat: -1
      });

      this.scene.tweens.add({
        targets: ramp2,
        rotation: Phaser.Math.DegToRad(450),
        duration: zone.levels[level] * 800,
        ease: 'Linear',
        repeat: -1
      });

      zone.shapes.push(ramp1, ramp2);
    }
  }

  createRampZone(zone, level) {
    zone.levels = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180];
    const baseY = zone.type * 1500;

    for (let i = 0; i < 6; i++) {
      const shape1 = this.scene.matter.add.image(
        240 - zone.levels[level],
        baseY + 200 + i * 200,
        'rectangle',
        null,
        { isStatic: true }
      ).setScale(50, 1).setAngle(10);

      const shape2 = this.scene.matter.add.image(
        440 + zone.levels[level],
        baseY + 300 + i * 200,
        'rectangle',
        null,
        { isStatic: true }
      ).setScale(50, 1).setAngle(-10);

      zone.shapes.push(shape1, shape2);
    }
  }

  createCircleZone(zone, level) {
    zone.levels = [0.5, 0.47, 0.43, 0.4, 0.37, 0.33, 0.3, 0.27, 0.23, 0.2];
    const baseY = zone.type * 1500;

    for (let i = 0; i < 3; i++) {
      const positions = [
        { x: 0, y: 275 },
        { x: 480, y: 275 },
        { x: 240, y: 475 },
        { x: 720, y: 475 }
      ];

      positions.forEach(pos => {
        const shape = this.scene.matter.add.image(pos.x, baseY + pos.y + i * 400, 'circle')
          .setScale(zone.levels[level])
          .setCircle(zone.levels[level] * 250, { isStatic: true });
        zone.shapes.push(shape);
      });
    }
  }

  createLineZone(zone, level) {
    zone.levels = [
      [30, 150], [35, 145], [40, 140], [45, 135], [50, 130],
      [60, 120], [70, 110], [75, 105], [80, 100], [85, 95]
    ];
    const baseY = zone.type * 1500;

    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 8; j++) {
        const shape1 = this.scene.matter.add.image(
          10 + i * 60,
          baseY + 200 + j * 150,
          'rectangle',
          null,
          { isStatic: true }
        ).setScale(7, 1).setAngle(zone.levels[level][0]);

        const shape2 = this.scene.matter.add.image(
          40 + i * 60,
          baseY + 275 + j * 150,
          'rectangle',
          null,
          { isStatic: true }
        ).setScale(7, 1).setAngle(zone.levels[level][1]);

        zone.shapes.push(shape1, shape2);
      }
    }
  }

  createPusherZone(zone, level) {
    zone.levels = [125, 115, 105, 95, 85, 75, 65, 55, 45, 35];
    const baseY = zone.type * 1500;

    for (let i = 0; i < 3; i++) {
      // Static obstacles
      this.scene.matter.add.image(200, baseY + 400 + i * 400, 'rectangle', null, { isStatic: true })
        .setScale(8).setAngle(45);
      this.scene.matter.add.image(480, baseY + 400 + i * 400, 'rectangle', null, { isStatic: true })
        .setScale(8).setAngle(45);
      this.scene.matter.add.image(340, baseY + 400 + i * 400, 'rectangle', null, { isStatic: true })
        .setScale(20, 1);
      
      // Moving pushers
      const pusher1 = this.scene.matter.add.image(200, baseY + 400 + i * 400, 'rectangle', null, { isStatic: true })
        .setScale(1, 12);
      const pusher2 = this.scene.matter.add.image(480, baseY + 400 + i * 400, 'rectangle', null, { isStatic: true })
        .setScale(1, 12);

      this.scene.tweens.add({
        targets: pusher1,
        x: 480,
        duration: zone.levels[level] * 300,
        ease: 'Linear',
        repeat: -1
      });

      this.scene.tweens.add({
        targets: pusher2,
        x: 200,
        duration: zone.levels[level] * 300,
        ease: 'Linear',
        repeat: -1
      });

      zone.shapes.push(pusher1, pusher2);
    }
  }

  createConveyorZone(zone, level) {
    zone.levels = [125, 115, 105, 95, 85, 75, 65, 55, 45, 35];
    const baseY = zone.type * 1500;

    for (let i = 0; i < 3; i++) {
      // Right-moving conveyor
      for (let j = -50; j < 600; j += 50) {
        const shape = this.scene.matter.add.image(
          j,
          baseY + 290 + i * 400 - j / 5,
          'rectangle',
          null,
          { isStatic: true }
        ).setScale(4, 2).setAngle(10);

        this.scene.tweens.add({
          targets: shape,
          x: '+=50',
          y: '-=10',
          duration: zone.levels[level] * 100,
          ease: 'Linear',
          repeat: -1
        });

        zone.shapes.push(shape);
      }

      // Left-moving conveyor
      for (let j = 700; j > 100; j -= 50) {
        const shape = this.scene.matter.add.image(
          j,
          baseY + 340 + i * 400 + j / 5,
          'rectangle',
          null,
          { isStatic: true }
        ).setScale(4, 2).setAngle(-10);

        this.scene.tweens.add({
          targets: shape,
          x: '-=50',
          y: '-=10',
          duration: zone.levels[level] * 100,
          ease: 'Linear',
          repeat: -1
        });

        zone.shapes.push(shape);
      }
    }
  }

  createChannelZone(zone, level) {
    zone.levels = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135];
    const baseY = zone.type * 1500;

    // Left channel
    for (let i = 0; i < 6; i++) {
      const shape1 = this.scene.matter.add.image(
        200 - zone.levels[level],
        baseY + 200 + i * 200,
        'rectangle',
        null,
        { isStatic: true }
      ).setScale(70, 1).setAngle(10);

      const shape2 = this.scene.matter.add.image(
        200 - zone.levels[level],
        baseY + 330 + i * 200,
        'rectangle',
        null,
        { isStatic: true }
      ).setScale(70, 1).setAngle(-10);

      zone.shapes.push(shape1, shape2);
    }

    // Right channel
    for (let i = 0; i < 5; i++) {
      const shape1 = this.scene.matter.add.image(
        550 + zone.levels[level],
        baseY + 300 + i * 200,
        'rectangle',
        null,
        { isStatic: true }
      ).setScale(70, 1).setAngle(-10);

      const shape2 = this.scene.matter.add.image(
        550 + zone.levels[level],
        baseY + 430 + i * 200,
        'rectangle',
        null,
        { isStatic: true }
      ).setScale(70, 1).setAngle(10);

      zone.shapes.push(shape1, shape2);
    }
  }

  updateLockedZone() {
    if (this.zoneCount >= GAME_CONFIG.zone.maxZones) {
      if (this.lockedContainer) {
        this.lockedContainer.destroy();
        this.lockedContainer = null;
      }
      return;
    }

    if (!this.lockedContainer) {
      const lockedButton = this.scene.add.sprite(20, 20, 'locked');
      const lockedText = this.scene.add.text(-75, 11, '', {
        fontFamily: 'Arial',
        fontSize: 16,
        color: '#f61a06',
        lineSpacing: 40
      }).setFontStyle('bold');

      this.lockedContainer = this.scene.add.container(
        140,
        this.zoneCount * 1500 - 55,
        [lockedButton, lockedText]
      ).setAlpha(0.8).setSize(280, 55).setInteractive();

      this.lockedContainer.on('pointerup', () => this.handleLockedClick());
    } else {
      this.lockedContainer.y = this.zoneCount * 1500 - 55;
    }

    this.updateLockedPrice();
  }

  updateLockedPrice() {
    if (!this.lockedContainer || this.zoneCount >= GAME_CONFIG.zone.maxZones) {
      return;
    }

    const mod = (100 - this.gameState.tokenUpgrades[5].level + 1) / 100;
    const lockPrice = new Decimal(ZONE_PRICES[this.zoneCount] * mod);
    
    this.lockedContainer.price = lockPrice;
    this.lockedContainer.list[1].setText(lockPrice.toFixed(0));
    this.updateLockedState();
  }

  updateLockedState() {
    if (!this.lockedContainer) return;

    const canAfford = this.gameState.currentScore.gte(this.lockedContainer.price);
    this.lockedContainer.locked = !canAfford;

    if (canAfford) {
      this.lockedContainer.list[0].setTexture('unlocked');
      this.lockedContainer.list[1].setColor('green');
    } else {
      this.lockedContainer.list[0].setTexture('locked');
      this.lockedContainer.list[1].setColor('#f61a06');
    }
  }

  handleLockedClick() {
    if (!this.lockedContainer || this.lockedContainer.locked) {
      return;
    }

    if (this.gameState.spendGold(this.lockedContainer.price)) {
      this.createZone();
    }
  }

  /**
   * Upgrade a zone
   * @param {number} zoneIndex - Index of zone to upgrade
   * @returns {boolean} - True if upgrade was successful
   */
  upgradeZone(zoneIndex) {
    const zone = this.gameState.zones[zoneIndex];
    if (!zone) return false;

    const cost = this.gameState.getZoneUpgradeCost(zoneIndex, ZONE_PRICES[zone.type]);
    if (!this.gameState.spendGold(cost)) {
      return false;
    }

    zone.level++;
    zone.modifier = 0.8 + zone.type * 0.1 + zone.level * 0.05;

    if (zone.level <= 9) {
      this.rebuildZone(zone);
    }

    return true;
  }

  rebuildZone(zone) {
    // Destroy existing shapes and tweens
    zone.shapes.forEach(shape => {
      this.scene.tweens.killTweensOf(shape);
      shape.destroy();
    });
    zone.shapes = [];

    // Recreate with new level
    const level = Math.min(zone.level, 9);
    this.createZoneObstacles(zone, level);
  }

  getZoneCount() {
    return this.zoneCount;
  }

  clearAll() {
    this.gameState.zones.forEach(zone => {
      zone.shapes.forEach(shape => {
        this.scene.tweens.killTweensOf(shape);
        shape.destroy();
      });
    });
    
    this.zoneCount = 0;
    if (this.lockedContainer) {
      this.lockedContainer.destroy();
      this.lockedContainer = null;
    }
  }
}

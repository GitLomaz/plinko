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

    // Track highest zone reached
    if (this.zoneCount > this.gameState.stats.highestZone) {
      this.gameState.stats.highestZone = this.zoneCount;
    }

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

  /**
   * Creates a shape with a shadow effect
   * @param {string} texture - The texture key
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {object} options - Matter.js options
   * @param {number} scaleX - X scale
   * @param {number} scaleY - Y scale (defaults to scaleX if not provided)
   * @param {number} angle - Rotation angle in degrees
   * @param {boolean} isCircle - Whether to use circle body
   * @param {number} circleRadius - Radius for circle body
   * @returns {object} - Object containing {shape, shadow}
   */
  createShapeWithShadow(texture, x, y, options, scaleX = 1, scaleY = null, angle = 0, isCircle = false, circleRadius = null) {
    // Add fixed amount to scale for uniform 2-3px border on all sides
    // This prevents disproportionate shadows on thin objects
    const shadowOffset = 0.4; // Fixed scale offset for uniform border on rectangles
    const circleShadowOffset = 3; // Fixed pixel offset for circles
    
    const finalScaleY = scaleY === null ? scaleX : scaleY;
    
    // For circles, calculate the scale offset based on the radius to get consistent pixel border
    let shadowScaleX, shadowScaleY;
    
    if (isCircle && circleRadius) {
      // For circles, we need to scale proportionally to add fixed pixels
      // If radius is 100 and we want 3px bigger, scale should be 103/100 = 1.03x
      const circleScaleFactor = (circleRadius + circleShadowOffset) / circleRadius;
      shadowScaleX = scaleX * circleScaleFactor;
      shadowScaleY = finalScaleY * circleScaleFactor;
    } else {
      // For rectangles, add fixed offset to each dimension independently
      shadowScaleX = scaleX + shadowOffset;
      shadowScaleY = finalScaleY + shadowOffset;
    }
    
    // Merge obstacle physics properties with provided options
    const physicsOptions = {
      ...options,
      friction: 1.0,
      frictionStatic: 0.8
    };
    
    // Create shadow first (renders behind) - centered at same position
    const shadow = this.scene.matter.add.image(x, y, texture, null, { ...physicsOptions, isSensor: true })
      .setScale(shadowScaleX, shadowScaleY)
      .setAngle(angle)
      .setTint(0x000000)
      .setAlpha(0.9) // Very solid black shadow
      .setDepth(-1); // Ensure shadow renders behind
    
    if (isCircle && circleRadius) {
      shadow.setCircle(circleRadius + circleShadowOffset, { ...physicsOptions, isSensor: true });
    }
    
    // Create main shape on top
    const shape = this.scene.matter.add.image(x, y, texture, null, physicsOptions)
      .setScale(scaleX, finalScaleY)
      .setAngle(angle)
      .setDepth(0); // Main shape renders on top
    
    if (isCircle && circleRadius) {
      shape.setCircle(circleRadius, physicsOptions);
    }
    
    return { shape, shadow };
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
        const obj1 = this.createShapeWithShadow(
          'rectangle',
          i * 68.5,
          baseY + 200 + j * 150,
          { isStatic: true },
          zone.levels[level],
          null,
          45
        );

        const obj2 = this.createShapeWithShadow(
          'rectangle',
          34 + i * 68.5,
          baseY + 275 + j * 150,
          { isStatic: true },
          zone.levels[level],
          null,
          45
        );

        zone.shapes.push(obj1.shadow, obj1.shape, obj2.shadow, obj2.shape);
      }
    }
  }

  createCrossZone(zone, level) {
    zone.levels = [125, 115, 105, 95, 85, 75, 65, 55, 45, 35];
    const baseY = zone.type * 1500;

    for (let i = 0; i < 3; i++) {
      const static1 = this.createShapeWithShadow('rectangle', 125, baseY + 200 + i * 400, { isStatic: true }, 30, 1, 10);
      const static2 = this.createShapeWithShadow('rectangle', 550, baseY + 200 + i * 400, { isStatic: true }, 30, 1, -10);
      zone.shapes.push(static1.shadow, static1.shape, static2.shadow, static2.shape);

      const obj1 = this.createShapeWithShadow('rectangle', 340, baseY + 400 + i * 400, { isStatic: true }, 40, 1, 0);
      const obj2 = this.createShapeWithShadow('rectangle', 340, baseY + 400 + i * 400, { isStatic: true }, 40, 1, 90);

      this.scene.tweens.add({
        targets: [obj1.shape, obj1.shadow],
        rotation: Phaser.Math.DegToRad(360),
        duration: zone.levels[level] * 800,
        ease: 'Linear',
        repeat: -1
      });

      this.scene.tweens.add({
        targets: [obj2.shape, obj2.shadow],
        rotation: Phaser.Math.DegToRad(450),
        duration: zone.levels[level] * 800,
        ease: 'Linear',
        repeat: -1
      });

      zone.shapes.push(obj1.shadow, obj1.shape, obj2.shadow, obj2.shape);
    }
  }

  createRampZone(zone, level) {
    zone.levels = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180];
    const baseY = zone.type * 1500;

    for (let i = 0; i < 6; i++) {
      const obj1 = this.createShapeWithShadow(
        'rectangle',
        240 - zone.levels[level],
        baseY + 200 + i * 200,
        { isStatic: true },
        50,
        1,
        10
      );

      const obj2 = this.createShapeWithShadow(
        'rectangle',
        440 + zone.levels[level],
        baseY + 300 + i * 200,
        { isStatic: true },
        50,
        1,
        -10
      );

      zone.shapes.push(obj1.shadow, obj1.shape, obj2.shadow, obj2.shape);
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
        const obj = this.createShapeWithShadow(
          'circle',
          pos.x,
          baseY + pos.y + i * 400,
          { isStatic: true },
          zone.levels[level],
          null,
          0,
          true,
          zone.levels[level] * 250
        );
        zone.shapes.push(obj.shadow, obj.shape);
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
        const obj1 = this.createShapeWithShadow(
          'rectangle',
          10 + i * 60,
          baseY + 200 + j * 150,
          { isStatic: true },
          7,
          1,
          zone.levels[level][0]
        );

        const obj2 = this.createShapeWithShadow(
          'rectangle',
          40 + i * 60,
          baseY + 275 + j * 150,
          { isStatic: true },
          7,
          1,
          zone.levels[level][1]
        );

        zone.shapes.push(obj1.shadow, obj1.shape, obj2.shadow, obj2.shape);
      }
    }
  }

  createPusherZone(zone, level) {
    zone.levels = [125, 115, 105, 95, 85, 75, 65, 55, 45, 35];
    const baseY = zone.type * 1500;

    for (let i = 0; i < 3; i++) {
      // Static obstacles
      const static1 = this.createShapeWithShadow('rectangle', 200, baseY + 400 + i * 400, { isStatic: true }, 8, null, 45);
      const static2 = this.createShapeWithShadow('rectangle', 480, baseY + 400 + i * 400, { isStatic: true }, 8, null, 45);
      const static3 = this.createShapeWithShadow('rectangle', 340, baseY + 400 + i * 400, { isStatic: true }, 20, 1, 0);
      zone.shapes.push(static1.shadow, static1.shape, static2.shadow, static2.shape, static3.shadow, static3.shape);
      
      // Moving pushers
      const obj1 = this.createShapeWithShadow('rectangle', 200, baseY + 400 + i * 400, { isStatic: true }, 1, 12, 0);
      const obj2 = this.createShapeWithShadow('rectangle', 480, baseY + 400 + i * 400, { isStatic: true }, 1, 12, 0);

      this.scene.tweens.add({
        targets: [obj1.shape, obj1.shadow],
        x: 480,
        duration: zone.levels[level] * 300,
        ease: 'Linear',
        repeat: -1
      });

      this.scene.tweens.add({
        targets: [obj2.shape, obj2.shadow],
        x: 200,
        duration: zone.levels[level] * 300,
        ease: 'Linear',
        repeat: -1
      });

      zone.shapes.push(obj1.shadow, obj1.shape, obj2.shadow, obj2.shape);
    }
  }

  createConveyorZone(zone, level) {
    zone.levels = [125, 115, 105, 95, 85, 75, 65, 55, 45, 35];
    const baseY = zone.type * 1500;

    for (let i = 0; i < 3; i++) {
      // Right-moving conveyor
      for (let j = -50; j < 600; j += 50) {
        const obj = this.createShapeWithShadow(
          'rectangle',
          j,
          baseY + 290 + i * 400 - j / 5,
          { isStatic: true },
          4,
          2,
          10
        );

        this.scene.tweens.add({
          targets: [obj.shape, obj.shadow],
          x: '+=50',
          y: '-=10',
          duration: zone.levels[level] * 100,
          ease: 'Linear',
          repeat: -1
        });

        zone.shapes.push(obj.shadow, obj.shape);
      }

      // Left-moving conveyor
      for (let j = 700; j > 100; j -= 50) {
        const obj = this.createShapeWithShadow(
          'rectangle',
          j,
          baseY + 340 + i * 400 + j / 5,
          { isStatic: true },
          4,
          2,
          -10
        );

        this.scene.tweens.add({
          targets: [obj.shape, obj.shadow],
          x: '-=50',
          y: '-=10',
          duration: zone.levels[level] * 100,
          ease: 'Linear',
          repeat: -1
        });

        zone.shapes.push(obj.shadow, obj.shape);
      }
    }
  }

  createChannelZone(zone, level) {
    zone.levels = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135];
    const baseY = zone.type * 1500;

    // Left channel
    for (let i = 0; i < 6; i++) {
      const obj1 = this.createShapeWithShadow(
        'rectangle',
        200 - zone.levels[level],
        baseY + 200 + i * 200,
        { isStatic: true },
        70,
        1,
        10
      );

      const obj2 = this.createShapeWithShadow(
        'rectangle',
        200 - zone.levels[level],
        baseY + 330 + i * 200,
        { isStatic: true },
        70,
        1,
        -10
      );

      zone.shapes.push(obj1.shadow, obj1.shape, obj2.shadow, obj2.shape);
    }

    // Right channel
    for (let i = 0; i < 5; i++) {
      const obj1 = this.createShapeWithShadow(
        'rectangle',
        550 + zone.levels[level],
        baseY + 300 + i * 200,
        { isStatic: true },
        70,
        1,
        -10
      );

      const obj2 = this.createShapeWithShadow(
        'rectangle',
        550 + zone.levels[level],
        baseY + 430 + i * 200,
        { isStatic: true },
        70,
        1,
        10
      );

      zone.shapes.push(obj1.shadow, obj1.shape, obj2.shadow, obj2.shape);
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
    this.lockedContainer.list[1].setText(this.displayNumber(lockPrice));
    this.updateLockedState();
  }

  displayNumber(y) {
    try {
      if (y.e < 9) {
        return y
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        let ret = "";
        let str = y.toPrecision(y.e + 1).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let s0 = str.split(",")[0];
        let s1 = str.split(",")[1].substring(0, 4 - s0.length);
        let e = (str.split(",").length - 1) * 3;
        switch (numberFormat) {
          case "eng":
            ret = s0 + "." + s1 + "e+" + e;
            break;
          case "bad":
            ret = s0 + "." + s1 + " " + suffixes[str.split(",").length - 1 - 2];
            break;
          case "sci":
            ret = y.toPrecision(4);
          default:
            break;
        }
        return ret;
      }
    } catch (err) {
      return y;
    }
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

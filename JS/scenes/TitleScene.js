/**
 * TitleScene.js
 * Title screen with animated balls and logo
 */

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
    this.balls = [];
    this.elapsedTime = 0;
    // Target 100 FPS (10ms per frame)
    this.TARGET_DELTA = 10;
  }

  preload() {
    this.load.image('logo', 'assets/images/logo.png');
    this.load.image('start', 'assets/images/start.png');
    this.load.json('logo', 'assets/images/logo.json');
    this.load.spritesheet('balls', 'assets/images/balls.png', {
      frameWidth: 17,
      frameHeight: 17
    });
  }

  create() {
    console.log('Plinko Game v2.0 - Rewritten');
    
    this.cameras.main.setBackgroundColor('rgba(255, 255, 225, 0.5)');
    this.matter.world.setGravity(0, 0.0005, 1);

    // Add colored lines
    this.add.line(0, 0, 0, 30, 3000, 30, 0xf84d3e, 0.6);
    this.add.line(0, 0, 0, 70, 3000, 70, 0x0085f3, 0.6);
    this.add.line(0, 0, 0, 50, 3000, 50, 0xd06ab8, 0.6);

    // Create logo physics
    this.createLogoPhysics();

    // Add logo sprite
    this.add.sprite(540, 250, 'logo');

    // Create start button
    const startBtn = this.matter.add.image(540, 550, 'start')
      .setStatic(true)
      .setInteractive();

    startBtn.on('pointerover', () => startBtn.setAlpha(0.6));
    startBtn.on('pointerout', () => startBtn.setAlpha(1));

    // Start game on click
    this.input.once('pointerdown', () => {
      this.clearBalls();
      this.scene.start('GameScene');
    });
  }

  createLogoPhysics() {
    const Body = Phaser.Physics.Matter.Matter.Body;
    const Composite = Phaser.Physics.Matter.Matter.Composite;
    const shapes = this.cache.json.get('logo');
    const composite = Composite.create();
    const fixtures = shapes.logo.fixtures;

    for (let i = 0; i < fixtures.length; i++) {
      const body = Body.create({ isStatic: true });
      
      // Adjust vertices position
      _.each(fixtures[i].vertices, arr => {
        _.each(arr, r => {
          r.x += 300;
        });
      });

      Body.setParts(body, this.parseVertices(fixtures[i].vertices));
      Composite.addBody(composite, body);
    }
    
    this.matter.world.add(composite);
  }

  parseVertices(vertexSets, options = {}) {
    const Matter = Phaser.Physics.Matter.Matter;
    const parts = [];

    for (let v = 0; v < vertexSets.length; v += 1) {
      parts.push(
        Matter.Body.create(
          Matter.Common.extend({
            position: Matter.Vertices.centre(vertexSets[v]),
            vertices: vertexSets[v]
          }, options)
        )
      );
    }

    // Flag coincident part edges
    const coincidentMaxDist = 5;

    for (let i = 0; i < parts.length; i++) {
      const partA = parts[i];

      for (let j = i + 1; j < parts.length; j++) {
        const partB = parts[j];

        if (Matter.Bounds.overlaps(partA.bounds, partB.bounds)) {
          const pav = partA.vertices;
          const pbv = partB.vertices;

          for (let k = 0; k < partA.vertices.length; k++) {
            for (let z = 0; z < partB.vertices.length; z++) {
              const da = Matter.Vector.magnitudeSquared(
                Matter.Vector.sub(pav[(k + 1) % pav.length], pbv[z])
              );
              const db = Matter.Vector.magnitudeSquared(
                Matter.Vector.sub(pav[k], pbv[(z + 1) % pbv.length])
              );

              if (da < coincidentMaxDist && db < coincidentMaxDist) {
                pav[k].isInternal = true;
                pbv[z].isInternal = true;
              }
            }
          }
        }
      }
    }

    return parts;
  }

  update(time, delta) {
    // Track elapsed time
    this.elapsedTime += delta;
    
    // Spawn balls at different intervals (using time instead of frames)
    if (this.elapsedTime % (20 * this.TARGET_DELTA) < delta) {
      this.spawnBall(Phaser.Math.Between(10, 1090), 50, 0, 20);
    }
    if (this.elapsedTime % (30 * this.TARGET_DELTA) < delta) {
      this.spawnBall(Phaser.Math.Between(10, 1090), 70, 1, 30);
    }
    if (this.elapsedTime % (40 * this.TARGET_DELTA) < delta) {
      this.spawnBall(Phaser.Math.Between(10, 1090), 30, 2, 40);
    }

    // Remove balls that fall off screen
    for (let i = this.balls.length - 1; i >= 0; i--) {
      if (this.balls[i].y > 1500) {
        this.balls[i].destroy();
        this.balls.splice(i, 1);
      }
    }
  }

  spawnBall(x, y, frame, duration) {
    const ball = this.matter.add.image(x, y, 'balls', frame);
    ball.setStatic(true);
    ball.setScale(0.05);
    
    // Convert frames to milliseconds (100 FPS = 10ms per frame)
    const durationMs = duration * 10;
    
    this.tweens.add({
      targets: ball,
      scaleX: 1,
      scaleY: 1,
      duration: durationMs,
      ease: 'Linear',
      onComplete: () => {
        ball.setStatic(false);
        ball.setCircle();
        ball.setFriction(0.001, 0.01, 0.001);
        ball.setFrictionAir(0.01);
        ball.setBounce(0.35);
        ball.setDensity(0.001);
        this.balls.push(ball);
      }
    });
  }

  clearBalls() {
    for (let i = this.balls.length - 1; i >= 0; i--) {
      this.balls[i].destroy();
    }
    this.balls = [];
  }
}

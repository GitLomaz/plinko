class adManager extends Phaser.GameObjects.Container {
  constructor() {
    super(scene, -100, 100);
    this.setSize(196, 48);
    this.setInteractive();
    this.setScrollFactor(0);
    this.bonuses = ["Double Points", "Double Spawn", "No Despawn"];
    this.bonus = Phaser.Math.Between(0, 2);
    this.transition = false;
    this.bonusActive = false;
    this.cooldown = 60 * 30;
    this.cooldownType = "noad";
    this.doublePoints = false;
    this.doubleSpawn = false;
    this.noDespawn = false;
    this.end = null;
    this.playingAd = false;

    let r1 = scene.add.rectangle(0, 0, this.width, this.height, 0xaed7fc);
    r1.alpha = 0.8;
    this.topText = scene.add
      .text(0, -10, "Top Text", {
        color: "#000",
        fontSize: "14px",
      })
      .setOrigin(0.5);

    this.bottomText = scene.add
      .text(0, 10, "bottom Text", {
        color: "#000",
        fontSize: "14px",
      })
      .setOrigin(0.5);
    this.add(r1);
    this.add(this.topText);
    this.add(this.bottomText);

    this.on("pointerup", function (pointer) {
      if (!this.bonusActive && !this.transition) {
        displayRewardedVideo();
      }
    });
    scene.add.existing(this);
    this.setDepth(10);
  }

  tick() {
    if (this.playingAd) {
      return;
    }
    if (this.cooldown === 0 && !this.bonusActive) {
      switch (this.cooldownType) {
        case "noad":
          this.prompt();
          this.cooldown = 60 * 30;
          break;
        case "ad":
          this.hide();
          this.cooldown = 60 * 90;
          break;
        default:
          break;
      }
    } else if (!this.bonusActive) {
      this.cooldown--;
    } else {
      let now = Math.floor(new Date().getTime() / 1000);
      let remaining = this.end - now;
      this.bottomText.setText(remaining + "s Remaining");
      if (remaining < 0) {
        this.bottomText.setText("0s Remaining");
        this.doublePoints = false;
        this.doubleSpawn = false;
        this.noDespawn = false;
        this.bonusActive = false;
        this.cooldownType = "noad";
        this.cooldown = 60 * 120;
        this.hide();
      }
    }
  }

  prompt() {
    let that = this;
    this.bonus = Phaser.Math.Between(0, 2);
    this.transition = true;
    this.topText.setText(this.bonuses[this.bonus]);
    this.bottomText.setText("Watch Ad");
    scene.tweens.add({
      targets: that,
      x: 80,
      ease: "Linear",
      duration: 800,
      onComplete: function () {
        that.cooldownType = "ad";
        that.transition = false;
      },
    });
  }

  hide() {
    let that = this;
    this.transition = true;
    scene.tweens.add({
      targets: that,
      x: -100,
      ease: "Linear",
      duration: 800,
      onComplete: function () {
        that.cooldownType = "noad";
        that.cooldown = 60 * 120;
        that.transition = false;
      },
    });
  }

  completeAd() {
    this.playingAd = false;
    this.activateBonus();
  }

  activateBonus() {
    this.x = 80;
    this.bonusActive = true;
    this.end = Math.floor(new Date().getTime() / 1000) + 180;
    this.bottomText.setText(180 + "s Remaining");
    switch (this.bonus) {
      case 0:
        this.doublePoints = true;
        break;
      case 1:
        this.doubleSpawn = true;
        break;
      case 2:
        this.noDespawn = true;
        break;
      default:
        break;
    }
  }
}

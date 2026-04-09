let block;
let zoneStrings = [
  "Shrinks Zone Diamonds",
  "Increase Cross Rotation",
  "Shrinks Ramp Width",
  "Decrease Circle Radius",
  "Straightens Lines",
  "Increases Pusher Speed",
  "Increases Convayer Speed",
  "Widens Channel",
];
let suffixes = [
  "M",
  "B",
  "T",
  "Qd",
  "Qn",
  "Sx",
  "Sp",
  "Oc",
  "N",
  "Dc",
  "UDc",
  "DDc",
  "TDc",
  "QaDc",
  "QiDc",
  "SxDc",
  "SpDc",
  "OcDc",
  "NDc",
  "Vi",
];
let numberFormat = "eng";
let resetCounter = 0;
let game;
var counter = 0; //spawn loop counter
var counter2 = 0; //title loop counter
var matter; //physics object
var balls = []; //ball array
var pointerdown = false; //mouse down flag
var isDragging = false; //mouse dragging flag
var startY = 0; // /
var lastY = 0; // | drag variables
var dirY = 0; // \
var camera; //camera object
var scene; //scene object
var zoneCount = 0; //number of zones spawned
var zones = []; //array of zones
var lockedContainer; //locked button for next zone
var menuContainer; //menu container
var graphics; //graphics object
var currentScore = new Decimal(0); //total score
var totalScore = new Decimal(0); //total score
var tokens = new Decimal(0); //total score
var fric = 0;
var selectedPanel = 0; //selected store panel
var zonePrices = [
  500, 2500, 50000, 750000, 15000000, 150000000, 2500000000, 55000000000,
];
var text;
var scrollDown = false;
var scrollUp = false;
var prestigeConfirm = false;
var currentTime;

$(document).ready(function () {
  $(window).focus(function () {
    updateProgress();
  });

  game = new Phaser.Game(config);
  $("#optsBall").on("click", function () {
    $(".optBtn").removeClass("selected");
    $(this).addClass("selected");
    $(".shop").hide();
    $("#ballShop").show();
    drawShopPanel();
  });
  $("#optsZone").on("click", function () {
    $(".optBtn").removeClass("selected");
    $(this).addClass("selected");
    $(".shop").hide();
    $("#zoneShop").show();
    drawShopPanel();
  });
  $("#optsToken").on("click", function () {
    $(".optBtn").removeClass("selected");
    $(this).addClass("selected");
    $(".shop").hide();
    $("#tokenShop").show();
    drawShopPanel();
  });
  $("#optsHelp").on("click", function () {
    $(".optBtn").removeClass("selected");
    $(this).addClass("selected");
    $(".shop").hide();
    $("#helpShop").show();
    drawShopPanel();
  });

  $(".ballUpgrade").on("click", function () {
    upgradeSpawn(spawns[$(this).attr("value")]);
  });

  $(".zoneUpgrade").on("click", function () {
    upgradeZone(zones[$(this).attr("value")]);
  });

  $(".tokenUpgrade").on("click", function () {
    upgradeToken(tokenUpgrades[$(this).attr("value")]);
  });

  $(".numOpt").on("click", function () {
    $(".numOpt").removeClass("selected");
    $(this).addClass("selected");
    numberFormat = $(this).attr("value");
    drawShopPanel();
  });

  $("#saveGame").on("click", function () {
    if ($(this).html() !== "Saved!") {
      $(this).html("Saved!");
      save();
      setTimeout(function () {
        $("#saveGame").html("Save Game");
      }, 3000);
    }
  });

  $("#saveGame").on("click", function () {
    if ($(this).html() !== "Saved!") {
      $(this).html("Saved!");
      save();
      setTimeout(function () {
        $("#saveGame").html("Save Game");
      }, 3000);
    }
  });

  $("#offlineClose").on("click", function () {
    $("#offlineProgress").hide();
  });

  $("#resetGame").on("click", function () {
    switch (resetCounter) {
      case 0:
        $(this).html("Confirm");
        resetCounter++;
        break;
      case 1:
        $(this).html("Ya Sure?");
        resetCounter++;
        break;
      case 2:
        $(this).html("100%?");
        resetCounter++;
        break;
      case 3:
        try {
          localStorage.removeItem("save");
        } catch (e) {}
        location.reload();
        break;
      default:
        break;
    }
  });

  $("#resetGame").on("mouseleave", function () {
    $(this).html("Hard Reset");
    resetCounter = 0;
  });

  $("#prestige").on("click", function () {
    if (!prestigeConfirm) {
      prestigeConfirm = true;
      $(this).html("Confirm");
    } else {
      prestige();
    }
  });

  $("#prestige").on("mouseleave", function () {
    $(this).html("Prestige");
    prestigeConfirm = false;
  });

  $("#scrollDown")
    .mousedown(function () {
      scrollDown = true;
    })
    .mouseup(function () {
      scrollDown = false;
      dirY = 0;
    })
    .on("mouseleave", function () {
      scrollDown = false;
      dirY = 0;
    });

  $("#scrollUp")
    .mousedown(function () {
      scrollUp = true;
    })
    .mouseup(function () {
      scrollUp = false;
      dirY = 0;
    })
    .on("mouseleave", function () {
      scrollUp = false;
      dirY = 0;
    });
});

var gameScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function gameScene() {
    Phaser.Scene.call(this, {
      key: "gameScene",
    });
  },

  preload: function () {
    this.load.image("rectangle", "assets/images/rectangle.png");
    this.load.image("clearRectangle", "assets/images/clearRectangle.png");
    this.load.image("circle", "assets/images/circle.png");
    this.load.image("ball", "assets/images/ball.png");
    this.load.image("pres", "assets/images/pres.png");
    this.load.image("zone", "assets/images/zone.png");
    this.load.image("locked", "assets/images/locked.png");
    this.load.image("unlocked", "assets/images/unlocked.png");
    this.load.image("lockedUpgrade", "assets/images/lockedUpgrade.png");
    this.load.image("lockedStage", "assets/images/lockedStage.png");
    this.load.spritesheet("balls", "assets/images/balls.png", {
      frameWidth: 17,
      frameHeight: 17,
    });
  },

  create: function () {
    scene = this;
    matter = this.matter;
    camera = this.cameras.main;
    camera.setBackgroundColor("rgba(255, 255, 225, 0.5)");
    matter.world.setGravity(0, 0.0005, 1);
    $("#menuContainer").show();
    load();
    drawShopPanel();

    this.input.on("pointermove", (ptr) => {
      if (pointerdown && !isDragging) {
        if (ptr.y - startY) {
          isDragging = true;
          lastY = ptr.y;
        }
      }
      if (isDragging) {
        var dy = ptr.y - lastY;
        dirY += dy;
        lastY = ptr.y;
      }
    });

    this.input.on("pointerup", (ptr, gameobs) => {
      pointerdown = false;
      isDragging = false;
    });

    this.input.on(
      "wheel",
      function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
        camera.scrollY += deltaY * 0.5;
      }
    );

    this.adManager = new adManager();

    this.input.on("pointerdown", (ptr) => {
      const scale = 0.08 * ((tokenUpgrades[3].level - 1) * 0.5 + 1);
      let target = this.add
        .image(ptr.worldX, ptr.worldY, "circle")
        .setScale(scale)
        .setAlpha(0.3);
      let ballCount = 0;
      for (let i = balls.length - 1; i >= 0; i--) {
        let ball = balls[i];
        if (
          Math.abs(ball.x - ptr.worldX) + Math.abs(ball.y - ptr.worldY) <
          40 + scale * 250
        ) {
          ballCount++;
          ball.value = ball.value.mul(
            tokenUpgrades[4].value
              .mul(
                tokenUpgrades[4].valueModifier.pow(tokenUpgrades[4].level - 1)
              )
              .div(100)
          );
          if (scene.adManager.doublePoints) {
            ball.value = ball.value.mul(2);
          }
          currentScore = currentScore.add(ball.value);
          totalScore = totalScore.add(ball.value);
          let text = scene.add.text(ball.x, ball.y, displayNumber(ball.value), {
            fontFamily: "neue",
            fontSize: 12,
            color: "#ffff00",
          });
          text.tween = scene.tweens.add({
            targets: text,
            y: ball.y - 50,
            duration: 700,
            ease: "Linear",
            onComplete: function (tween, targets) {
              targets[0].destroy();
            },
          });
          ball.destroy();
          balls.splice(i, 1);
        }
      }
      if (ballCount > 0) {
        $("#goldValue").html(displayNumber(currentScore));
        checkLock();
        drawShopPanel();
      }
      scene.tweens.add({
        targets: target,
        alpha: 0,
        duration: 300,
        ease: "Linear",
        onComplete: function (tween, targets) {
          targets[0].destroy();
        },
      });
      pointerdown = true;
      dirY = 0;
    });
  },

  update: function () {
    this.adManager.tick();
    if (counter % 600 === 0) {
      currentTime = Date.now();
    }

    if (scrollDown) {
      dirY = -75;
    }

    if (scrollUp) {
      dirY = 75;
    }

    camera.scrollY -= dirY / 0.15 / 100;
    dirY -= dirY / 0.6 / 100;
    if (dirY < 3 && dirY > -3) {
      dirY = 0;
    }

    for (var i = 0; i < spawns.length; i++) {
      if (spawns[i].level > 0 && zones[spawns[i].stage - 1]) {
        let delayFrame =
          spawns[i].cooldown - spawns[i].speedModifier * (spawns[i].level - 1);
        if (spawns[i].level > 10) {
          delayFrame = spawns[i].cooldown - spawns[i].speedModifier * 10;
        }
        if (scene.adManager.doubleSpawn) {
          delayFrame = Math.floor(delayFrame / 2);
        }
        // console.log(delayFrame)
        if (counter % delayFrame == 0) {
          const mod = tokenUpgrades[0].value
            .mul(tokenUpgrades[0].valueModifier.pow(tokenUpgrades[0].level - 1))
            .div(100);
          const value = mod.mul(
            spawns[i].value.mul(
              spawns[i].valueModifier.pow(spawns[i].level - 1)
            )
          );
          generateBall(
            -1,
            spawns[i].y,
            i,
            delayFrame,
            spawns[i].stage,
            // THIS IS NOT INCLUDING SPAWN BONUS
            value,
            spawns[i].level
          );
        }
      }
    }

    if (counter % 2000 == 0) {
      save();
    }

    counter++;
    for (let i = balls.length - 1; i >= 0; i--) {
      ball = balls[i];
      if (ball.y > ball.stage * 1500 - 70) {
        score(ball);
        let success =
          100 -
          tokenUpgrades[1].value.plus(tokenUpgrades[1].level - 1).toNumber();
        if (scene.adManager.noDespawn) {
          success = 0;
        }
        if (
          !(
            Phaser.Math.Between(0, 100) > success && ball.stage < zones.length
          ) ||
          balls.length > 700
        ) {
          ball.destroy();
          balls.splice(i, 1);
        } else {
          ball.stage++;
        }
      }
    }
    if (
      this.input.mousePointer.y > 575 ||
      this.input.mousePointer.x > 680 ||
      this.input.mousePointer.y < 15 ||
      this.input.mousePointer.x < 0
    ) {
      pointerdown = false;
      isDragging = false;
    }
  },
});

var titleScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function titleScene() {
    Phaser.Scene.call(this, {
      key: "titleScene",
    });
  },

  preload: function () {
    this.load.image("logo", "assets/images/logo.png");
    this.load.image("start", "assets/images/start.png");
    this.load.json("logo", "assets/images/logo.json");
    this.load.spritesheet("balls", "assets/images/balls.png", {
      frameWidth: 17,
      frameHeight: 17,
    });
  },

  create: function () {
    console.log("verison 0.1.7");
    var Body = Phaser.Physics.Matter.Matter.Body;
    var Composite = Phaser.Physics.Matter.Matter.Composite;

    this.cameras.main.setBackgroundColor("rgba(255, 255, 225, 0.5)");
    this.matter.world.setGravity(0, 0.0005, 1);

    this.add.line(0, 0, 0, 30, 3000, 30, 0xf84d3e, 0.6);
    this.add.line(0, 0, 0, 70, 3000, 70, 0x0085f3, 0.6);
    this.add.line(0, 0, 0, 50, 3000, 50, 0xd06ab8, 0.6);

    var shapes = this.cache.json.get("logo");

    var composite = Composite.create();

    var fixtures = shapes.logo.fixtures;

    for (var i = 0; i < fixtures.length; i++) {
      var body = Body.create({
        isStatic: true,
      });

      _.each(fixtures[i].vertices, function (arr) {
        _.each(arr, function (r) {
          r.x += 300;
        });
      });

      Body.setParts(body, parseVertices(fixtures[i].vertices));

      Composite.addBody(composite, body);
    }
    this.matter.world.add(composite);
    this.add.sprite(540, 250, "logo");
    var startBtn = this.matter.add
      .image(540, 550, "start")
      .setStatic(true)
      .setInteractive();

    this.input.once(
      "pointerdown",
      function () {
        for (let i = balls.length - 1; i >= 0; i--) {
          ball = balls[i];
          ball.destroy();
          balls.splice(i, 1);
        }
        this.scene.start("gameScene");
      },
      this
    );

    startBtn.on("pointerover", function (pointer) {
      startBtn.setAlpha(0.6);
    });
    startBtn.on("pointerout", function (pointer) {
      startBtn.setAlpha(1);
    });
  },

  update: function () {
    if (counter2 % 20 == 0) {
      var x = Phaser.Math.Between(10, 1090);
      var ball1 = this.matter.add.image(x, 50, "balls", 0);
      ball1.setStatic(true);
      ball1.setScale(0.05);
      this.tweens.add({
        useFrames: true,
        targets: ball1,
        scaleX: 1,
        scaleY: 1,
        duration: 20,
        ease: "Linear",
        onComplete: function () {
          ball1.setStatic(false);
          ball1.setCircle();
          ball1.setFriction(0.01);
          ball1.setBounce(0.5);
          balls.push(ball1);
        },
      });
    }
    if (counter2 % 30 == 0) {
      var x = Phaser.Math.Between(10, 1090);
      var ball2 = this.matter.add.image(x, 70, "balls", 1);
      ball2.setStatic(true);
      ball2.setScale(0.05);
      this.tweens.add({
        useFrames: true,
        targets: ball2,
        scaleX: 1,
        scaleY: 1,
        duration: 30,
        ease: "Linear",
        onComplete: function () {
          ball2.setStatic(false);
          ball2.setCircle();
          ball2.setFriction(0.01);
          ball2.setBounce(0.5);
          balls.push(ball2);
        },
      });
    }
    if (counter2 % 40 == 0) {
      var x = Phaser.Math.Between(10, 1090);
      var ball3 = this.matter.add.image(x, 30, "balls", 2);
      ball3.setStatic(true);
      ball3.setScale(0.05);
      this.tweens.add({
        useFrames: true,
        targets: ball3,
        scaleX: 1,
        scaleY: 1,
        duration: 40,
        ease: "Linear",
        onComplete: function () {
          ball3.setStatic(false);
          ball3.setCircle();
          ball3.setFriction(0.01);
          ball3.setBounce(0.5);
          balls.push(ball3);
        },
      });
    }
    for (let i = balls.length - 1; i >= 0; i--) {
      ball = balls[i];
      if (ball.y > 1500) {
        ball.destroy();
        balls.splice(i, 1);
      }
    }
    counter2++;
  },
});

var config = {
  type: Phaser.AUTO,
  width: 1108,
  height: 595,
  parent: "Game",
  physics: {
    default: "matter",
    matter: {
      enableSleeping: false,
      gravityY: 0.0005,
      setBounds: {
        x: 0,
        y: 0,
        width: 1108,
        height: 2000,
      },
    },
  },
  pixelArt: false,
  scene: [titleScene, gameScene],
};

function score(ball) {
  const mod = new Decimal(
    tokenUpgrades[6].value.mul(
      tokenUpgrades[6].valueModifier.pow(tokenUpgrades[6].level - 1)
    )
  ).div(100);
  let modifier = new Decimal(zones[ball.stage - 1].modifier).mul(mod);
  let score = new Decimal(ball.value * modifier);
  if (scene.adManager.doublePoints) {
    score = score.mul(2);
  }
  currentScore = currentScore.add(score);
  totalScore = totalScore.add(score);
  $("#goldValue").html(displayNumber(currentScore));
  if (ball.y > camera.scrollY && ball.y < camera.scrollY + 600) {
    const text = scene.add.text(ball.x, ball.y, displayNumber(score), {
      fontFamily: "Arial",
      fontSize: 12,
      color: "#ffff00",
    });
    scene.tweens.add({
      targets: text,
      y: ball.y - 50,
      duration: 700,
      ease: "Linear",
      onComplete: function (tween, targets) {
        text.destroy();
      },
    });
  }
  checkLock();
  drawShopPanel();
}

function generateBall(x, y, image, delayFrame, stage, value, level) {
  if (x == -1) {
    x = Phaser.Math.Between(10, 670);
  }
  var ball = this.matter.add.image(x, y, "balls", image);
  const success =
    100 - tokenUpgrades[2].value.plus(tokenUpgrades[2].level - 1).toNumber();
  if (Phaser.Math.Between(0, 100) > success) {
    value = value.mul(2);
  }
  ball.setStatic(true);
  ball.setScale(0.05);
  scene.tweens.add({
    useFrames: true,
    targets: ball,
    scaleX: 1,
    scaleY: 1,
    duration: delayFrame,
    ease: "Linear",
    onComplete: function () {
      ball.setStatic(false);
      ball.setCircle();
      ball.setFriction(fric);
      ball.setBounce(0.5);
      ball.stage = stage;
      ball.value = value;
      balls.push(ball);
    },
  });
}

function generateZone(level = 0) {
  var zone = new Object();
  zone.type = zoneCount;
  zone.shapes = [];
  zone.tweens = [];
  zone.level = level;
  zone.modifier = 0.8 + zone.type * 0.1 + level * 0.05;
  level = zone.level > 9 ? 9 : zone.level;
  zone.costModifier = new Decimal(4.5);
  zones.push(zone);
  zoneCount++;

  matter.world.setBounds(
    0,
    0,
    680,
    (zone.type + 1) * 1500,
    32,
    true,
    true,
    true,
    false
  );
  camera.setBounds(0, 0, 680, (zone.type + 1) * 1500).setName("main");

  if (zoneCount < 8) {
    if (lockedContainer) {
      lockedContainer.y = zone.type * 1500 + 1445;
    } else {
      lockedButton = scene.add.sprite(20, 20, "locked");
      lockedText = scene.add
        .text(-75, 11, "", {
          fontFamily: "Arial",
          fontSize: 16,
          color: "#f61a06",
          lineSpacing: 40,
        })
        .setFontStyle("bold");
      lockedContainer = scene.add
        .container(140, zone.type * 1500 + 1445, [lockedButton, lockedText])
        .setAlpha(0.8)
        .setSize(280, 55)
        .setInteractive();

      lockedContainer.on("pointerup", function () {
        if (!lockedContainer.locked) {
          currentScore = currentScore.minus(lockedContainer.price);
          $("#goldValue").html(displayNumber(currentScore));
          generateZone();
          dirY = -200;
          drawShopPanel();
        }
      });
    }
    const mod = (100 - tokenUpgrades[5].level + 1) / 100;
    const lockPrice = new Decimal(zonePrices[zoneCount] * mod);
    lockedContainer.price = new Decimal(lockPrice);
    lockedContainer.list[1].text = displayNumber(lockPrice);
    checkLock();
  } else {
    lockedButton.destroy();
    lockedText.destroy();
  }

  if (zoneCount == 1) {
    scene.add.line(0, 0, 0, 90, 2000, 90, 0xf84d3e, 0.6);
    scene.add.line(0, 0, 0, 70, 2000, 70, 0x0085f3, 0.6);
    scene.add.line(0, 0, 0, 50, 2000, 50, 0xd06ab8, 0.6);
  } else if (zoneCount == 2) {
    scene.add.line(0, 0, 0, 1530, 2000, 1530, 0x508a36, 0.6);
    scene.add.line(0, 0, 0, 1550, 2000, 1550, 0x108a80, 0.6);
    spawns[3].enabled = true;
    spawns[4].enabled = true;
  } else if (zoneCount == 3) {
    scene.add.line(0, 0, 0, 3070, 2000, 3070, 0xffb45a, 0.6);
    spawns[5].enabled = true;
  } else if (zoneCount == 4) {
    scene.add.line(0, 0, 0, 4570, 2000, 4570, 0xa57b36, 0.6);
    spawns[6].enabled = true;
  } else if (zoneCount == 5) {
    scene.add.line(0, 0, 0, 6070, 2000, 6070, 0x727272, 0.6);
    spawns[7].enabled = true;
  } else if (zoneCount == 6) {
    scene.add.line(0, 0, 0, 7570, 2000, 7570, 0x673eab, 0.6);
    spawns[8].enabled = true;
  } else if (zoneCount == 7) {
    scene.add.line(0, 0, 0, 9070, 2000, 9070, 0x833b21, 0.6);
    spawns[8].enabled = true;
  }

  for (j = 0; j < 70; j++) {
    if (j % 2 == 0)
      scene.add.line(
        0,
        0,
        j * 10,
        zone.type * 1500 + 1430,
        j * 10 + 10,
        zone.type * 1500 + 1430,
        0xf84d3e,
        0.4
      );
  }

  if (zone.type == 0) {
    zone.levels = [3, 2.8, 2.6, 2.4, 2.2, 2, 1.8, 1.6, 1.4, 1.2, 1];
    for (i = 0; i < 10; i++) {
      for (j = 0; j < 8; j++) {
        var shape1 = matter.add
          .image(
            0 + i * 68.5,
            zone.type * 1500 + 200 + j * 150,
            "rectangle",
            null,
            {
              isStatic: true,
            }
          )
          .setScale(zone.levels[level])
          .setAngle(45);
        var shape2 = matter.add
          .image(
            34 + i * 68.5,
            zone.type * 1500 + 275 + j * 150,
            "rectangle",
            null,
            {
              isStatic: true,
            }
          )
          .setScale(zone.levels[level])
          .setAngle(45);
        zone.shapes.push(shape1);
        zone.shapes.push(shape2);
      }
    }
  } else if (zone.type == 1) {
    zone.levels = [125, 115, 105, 95, 85, 75, 65, 55, 45, 35];
    for (i = 0; i < 3; i++) {
      var shape1 = matter.add
        .image(125, zone.type * 1500 + 200 + i * 400, "rectangle", null, {
          isStatic: true,
        })
        .setScale(30, 1)
        .setAngle(10);
      var shape2 = matter.add
        .image(550, zone.type * 1500 + 200 + i * 400, "rectangle", null, {
          isStatic: true,
        })
        .setScale(30, 1)
        .setAngle(-10);
      var ramp1 = matter.add
        .image(340, zone.type * 1500 + 400 + i * 400, "rectangle", null, {
          isStatic: true,
        })
        .setScale(40, 1)
        .setAngle(0);
      var ramp2 = matter.add
        .image(340, zone.type * 1500 + 400 + i * 400, "rectangle", null, {
          isStatic: true,
        })
        .setScale(40, 1)
        .setAngle(90);
      var tween1 = scene.tweens.add({
        targets: ramp1,
        rotation: Phaser.Math.DegToRad(360),
        duration: zone.levels[level] * 800,
        ease: "Linear",
        repeat: -1,
      });
      var tween2 = scene.tweens.add({
        targets: ramp2,
        rotation: Phaser.Math.DegToRad(450),
        duration: zone.levels[level] * 800,
        ease: "Linear",
        repeat: -1,
      });
      zone.shapes.push(ramp1);
      zone.shapes.push(ramp2);
    }
  } else if (zone.type == 2) {
    zone.levels = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180];
    for (i = 0; i < 6; i++) {
      var shape1 = matter.add
        .image(
          240 - zone.levels[level],
          zone.type * 1500 + 200 + i * 200,
          "rectangle",
          null,
          {
            isStatic: true,
          }
        )
        .setScale(50, 1)
        .setAngle(10);
      var shape2 = matter.add
        .image(
          440 + zone.levels[level],
          zone.type * 1500 + 300 + i * 200,
          "rectangle",
          null,
          {
            isStatic: true,
          }
        )
        .setScale(50, 1)
        .setAngle(-10);
      zone.shapes.push(shape1);
      zone.shapes.push(shape2);
    }
  } else if (zone.type == 3) {
    zone.levels = [0.5, 0.47, 0.43, 0.4, 0.37, 0.33, 0.3, 0.27, 0.23, 0.2];
    for (i = 0; i < 3; i++) {
      var shape1 = matter.add
        .image(0, zone.type * 1500 + 275 + i * 400, "circle")
        .setScale(zone.levels[level])
        .setCircle(zone.levels[level] * 250, {
          isStatic: true,
        });
      var shape2 = matter.add
        .image(480, zone.type * 1500 + 275 + i * 400, "circle")
        .setScale(zone.levels[level])
        .setCircle(zone.levels[level] * 250, {
          isStatic: true,
        });
      var shape3 = matter.add
        .image(240, zone.type * 1500 + 475 + i * 400, "circle")
        .setScale(zone.levels[level])
        .setCircle(zone.levels[level] * 250, {
          isStatic: true,
        });
      var shape4 = matter.add
        .image(720, zone.type * 1500 + 475 + i * 400, "circle")
        .setScale(zone.levels[level])
        .setCircle(zone.levels[level] * 250, {
          isStatic: true,
        });
      zone.shapes.push(shape1);
      zone.shapes.push(shape2);
      zone.shapes.push(shape3);
      zone.shapes.push(shape4);
    }
  } else if (zone.type == 4) {
    zone.levels = [
      [30, 150],
      [35, 145],
      [40, 140],
      [45, 135],
      [50, 130],
      [60, 120],
      [70, 110],
      [75, 105],
      [80, 100],
      [85, 95],
    ];
    for (i = 0; i < 12; i++) {
      for (j = 0; j < 8; j++) {
        var shape1 = matter.add
          .image(
            10 + i * 60,
            zone.type * 1500 + 200 + j * 150,
            "rectangle",
            null,
            {
              isStatic: true,
            }
          )
          .setScale(7, 1)
          .setAngle(zone.levels[level][0]);
        var shape2 = matter.add
          .image(
            40 + i * 60,
            zone.type * 1500 + 275 + j * 150,
            "rectangle",
            null,
            {
              isStatic: true,
            }
          )
          .setScale(7, 1)
          .setAngle(zone.levels[level][1]);
        zone.shapes.push(shape1);
        zone.shapes.push(shape2);
      }
    }
  } else if (zone.type == 5) {
    zone.levels = [125, 115, 105, 95, 85, 75, 65, 55, 45, 35];
    for (i = 0; i < 3; i++) {
      var shape1 = matter.add
        .image(200, zone.type * 1500 + 400 + i * 400, "rectangle", null, {
          isStatic: true,
        })
        .setScale(8)
        .setAngle(45);
      var shape2 = matter.add
        .image(480, zone.type * 1500 + 400 + i * 400, "rectangle", null, {
          isStatic: true,
        })
        .setScale(8)
        .setAngle(45);
      var shape3 = matter.add
        .image(340, zone.type * 1500 + 400 + i * 400, "rectangle", null, {
          isStatic: true,
        })
        .setScale(20, 1);
      var shape4 = matter.add
        .image(200, zone.type * 1500 + 400 + i * 400, "rectangle", null, {
          isStatic: true,
        })
        .setScale(1, 12);
      var shape5 = matter.add
        .image(480, zone.type * 1500 + 400 + i * 400, "rectangle", null, {
          isStatic: true,
        })
        .setScale(1, 12);
      var shape6 = matter.add
        .image(150, zone.type * 1500 + 200 + i * 400, "rectangle", null, {
          isStatic: true,
        })
        .setScale(30, 1)
        .setAngle(10);
      var shape7 = matter.add
        .image(530, zone.type * 1500 + 200 + i * 400, "rectangle", null, {
          isStatic: true,
        })
        .setScale(30, 1)
        .setAngle(-10);
      var tween1 = scene.tweens.add({
        targets: shape4,
        x: 480,
        duration: zone.levels[level] * 300,
        ease: "Linear",
        repeat: -1,
      });
      var tween2 = scene.tweens.add({
        targets: shape5,
        x: 200,
        duration: zone.levels[level] * 300,
        ease: "Linear",
        repeat: -1,
      });
      zone.shapes.push(shape4);
      zone.shapes.push(shape5);
    }
  } else if (zone.type == 6) {
    zone.levels = [125, 115, 105, 95, 85, 75, 65, 55, 45, 35];
    for (i = 0; i < 3; i++) {
      for (j = -50; j < 600; j = j + 50) {
        var shape = matter.add
          .image(
            j,
            zone.type * 1500 + 290 + i * 400 - j / 5,
            "rectangle",
            null,
            {
              isStatic: true,
            }
          )
          .setScale(4, 2)
          .setAngle(10);
        if (j != 550) {
          var tween = scene.tweens.add({
            targets: shape,
            x: "+=50",
            y: "-=10",
            duration: zone.levels[level] * 100,
            ease: "Linear",
            repeat: -1,
          });
          zone.shapes.push(shape);
        } else {
          var tween = scene.tweens.add({
            targets: shape,
            x: "+=25",
            y: "-=5",
            scaleY: 0.01,
            scaleX: 0.01,
            duration: zone.levels[level] * 100,
            ease: "Linear",
            repeat: -1,
          });
          zone.shapes.push(shape);
        }
      }
      for (j = 700; j > 100; j = j - 50) {
        var shape = matter.add
          .image(
            j,
            zone.type * 1500 + 340 + i * 400 + j / 5,
            "rectangle",
            null,
            {
              isStatic: true,
            }
          )
          .setScale(4, 2)
          .setAngle(-10);
        if (j != 150) {
          var tween = scene.tweens.add({
            targets: shape,
            x: "-=50",
            y: "-=10",
            duration: zone.levels[level] * 100,
            ease: "Linear",
            repeat: -1,
          });
          zone.shapes.push(shape);
        } else {
          var tween = scene.tweens.add({
            targets: shape,
            x: "-=25",
            y: "-=5",
            scaleY: 0.01,
            scaleX: 0.01,
            duration: zone.levels[level] * 100,
            ease: "Linear",
            repeat: -1,
          });
          zone.shapes.push(shape);
        }
      }
    }
  } else if (zone.type == 7) {
    zone.levels = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135];
    for (i = 0; i < 6; i++) {
      var shape1 = matter.add
        .image(
          200 - zone.levels[level],
          zone.type * 1500 + 200 + i * 200,
          "rectangle",
          null,
          {
            isStatic: true,
          }
        )
        .setScale(70, 1)
        .setAngle(10);
      var shape2 = matter.add
        .image(
          200 - zone.levels[level],
          zone.type * 1500 + 330 + i * 200,
          "rectangle",
          null,
          {
            isStatic: true,
          }
        )
        .setScale(70, 1)
        .setAngle(-10);
      zone.shapes.push(shape1);
      zone.shapes.push(shape2);
    }
    for (i = 0; i < 5; i++) {
      var shape1 = matter.add
        .image(
          550 + zone.levels[level],
          zone.type * 1500 + 300 + i * 200,
          "rectangle",
          null,
          {
            isStatic: true,
          }
        )
        .setScale(70, 1)
        .setAngle(-10);
      var shape2 = matter.add
        .image(
          550 + zone.levels[level],
          zone.type * 1500 + 430 + i * 200,
          "rectangle",
          null,
          {
            isStatic: true,
          }
        )
        .setScale(70, 1)
        .setAngle(10);
      zone.shapes.push(shape1);
      zone.shapes.push(shape2);
    }
  }
}

function upgradeZone(zone) {
  var cost = new Decimal(zonePrices[zone.type]).mul(
    zone.costModifier.pow(zone.level + 1)
  );
  if (currentScore.lt(cost)) {
    return -1;
  }
  zone.level++;
  currentScore = currentScore.minus(cost);
  zone.modifier = 0.8 + zone.type * 0.1 + zone.level * 0.05;

  if (zone.level > 8) {
    drawShopPanel();
    return 1;
  }

  if (zone.type == 0) {
    zone.shapes.forEach(function (shape) {
      shape.setScale(zone.levels[zone.level]);
    });
  } else if (zone.type == 3) {
    zone.shapes.forEach(function (shape) {
      shape
        .setScale(zone.levels[zone.level])
        .setCircle(zone.levels[zone.level] * 250, {
          isStatic: true,
        });
    });
  } else if (zone.type == 1) {
    zone.shapes.forEach(function (shape) {
      scene.tweens.killTweensOf(shape);
      shape.destroy();
    });
    for (i = 0; i < 3; i++) {
      var ramp1 = matter.add
        .image(340, zone.type * 1500 + 400 + i * 400, "rectangle", null, {
          isStatic: true,
        })
        .setScale(40, 1)
        .setAngle(0);
      var ramp2 = matter.add
        .image(340, zone.type * 1500 + 400 + i * 400, "rectangle", null, {
          isStatic: true,
        })
        .setScale(40, 1)
        .setAngle(90);
      scene.tweens.add({
        targets: ramp1,
        rotation: Phaser.Math.DegToRad(360),
        duration: zone.levels[zone.level] * 800,
        ease: "Linear",
        repeat: -1,
      });
      scene.tweens.add({
        targets: ramp2,
        rotation: Phaser.Math.DegToRad(450),
        duration: zone.levels[zone.level] * 800,
        ease: "Linear",
        repeat: -1,
      });
      zone.shapes.push(ramp1);
      zone.shapes.push(ramp2);
    }
  } else if (zone.type == 2) {
    var counter = true;
    zone.shapes.forEach(function (shape) {
      if (counter) {
        shape.setX(240 - zone.levels[zone.level]);
      } else {
        shape.setX(440 + zone.levels[zone.level]);
      }
      counter = !counter;
    });
  } else if (zone.type == 4) {
    var even = true;
    zone.shapes.forEach(function (shape) {
      if (even) {
        shape.setAngle(zone.levels[zone.level][0]);
      } else {
        shape.setAngle(zone.levels[zone.level][1]);
      }
      even = !even;
    });
  } else if (zone.type == 5) {
    zone.shapes.forEach(function (shape) {
      scene.tweens.killTweensOf(shape);
      shape.destroy();
    });
    for (i = 0; i < 3; i++) {
      var ramp1 = matter.add
        .image(200, zone.type * 1500 + 400 + i * 400, "rectangle", null, {
          isStatic: true,
        })
        .setScale(1, 12);
      var ramp2 = matter.add
        .image(480, zone.type * 1500 + 400 + i * 400, "rectangle", null, {
          isStatic: true,
        })
        .setScale(1, 12);
      scene.tweens.add({
        targets: ramp1,
        x: 480,
        duration: zone.levels[zone.level] * 300,
        ease: "Linear",
        repeat: -1,
      });
      scene.tweens.add({
        targets: ramp2,
        x: 200,
        duration: zone.levels[zone.level] * 300,
        ease: "Linear",
        repeat: -1,
      });
      zone.shapes.push(ramp1);
      zone.shapes.push(ramp2);
    }
  } else if (zone.type == 6) {
    zone.shapes.forEach(function (shape) {
      scene.tweens.killTweensOf(shape);
      shape.destroy();
    });
    for (i = 0; i < 3; i++) {
      for (j = -50; j < 600; j = j + 50) {
        var shape = matter.add
          .image(
            j,
            zone.type * 1500 + 290 + i * 400 - j / 5,
            "rectangle",
            null,
            {
              isStatic: true,
            }
          )
          .setScale(4, 2)
          .setAngle(10);
        if (j != 550) {
          var tween = scene.tweens.add({
            targets: shape,
            x: "+=50",
            y: "-=10",
            duration: zone.levels[zone.level] * 100,
            ease: "Linear",
            repeat: -1,
          });
          zone.shapes.push(shape);
        } else {
          var tween = scene.tweens.add({
            targets: shape,
            x: "+=25",
            y: "-=5",
            scaleY: 0.01,
            scaleX: 0.01,
            duration: zone.levels[zone.level] * 100,
            ease: "Linear",
            repeat: -1,
          });
          zone.shapes.push(shape);
        }
      }
      for (j = 700; j > 100; j = j - 50) {
        var shape = matter.add
          .image(
            j,
            zone.type * 1500 + 340 + i * 400 + j / 5,
            "rectangle",
            null,
            {
              isStatic: true,
            }
          )
          .setScale(4, 2)
          .setAngle(-10);
        if (j != 150) {
          var tween = scene.tweens.add({
            targets: shape,
            x: "-=50",
            y: "-=10",
            duration: zone.levels[zone.level] * 100,
            ease: "Linear",
            repeat: -1,
          });
          zone.shapes.push(shape);
        } else {
          var tween = scene.tweens.add({
            targets: shape,
            x: "-=25",
            y: "-=5",
            scaleY: 0.01,
            scaleX: 0.01,
            duration: zone.levels[zone.level] * 100,
            ease: "Linear",
            repeat: -1,
          });
          zone.shapes.push(shape);
        }
      }
    }
  } else if (zone.type == 7) {
    var counter = 0;
    zone.shapes.forEach(function (shape) {
      if (counter < 12) {
        shape.setX(200 - zone.levels[zone.level]);
      } else {
        shape.setX(550 + zone.levels[zone.level]);
      }
      counter++;
    });
  }
  drawShopPanel();
}

function upgradeSpawn(spawn) {
  var cost = spawn.cost.mul(spawn.costModifier.pow(spawn.level + 1));
  if (currentScore.lt(cost)) {
    return -1;
  }
  currentScore = currentScore.minus(cost);
  $("#goldValue").html(displayNumber(currentScore));
  spawn.level++;
  drawShopPanel();
}

function upgradeToken(token) {
  var cost = token.cost.mul(token.costModifier.pow(token.level + 1));
  if (tokens.lt(cost) || token.level === token.maxLevel) {
    return -1;
  }
  tokens = tokens.minus(cost);
  $("#tokenValue").html(displayNumber(tokens));
  token.level++;
  const mod = (100 - tokenUpgrades[5].level + 1) / 100;
  const lockPrice = new Decimal(zonePrices[zoneCount] * mod);
  lockedContainer.price = new Decimal(lockPrice);
  lockedContainer.list[1].text = displayNumber(lockPrice);
  drawShopPanel();
}

function displayNumber(y) {
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

function checkLock() {
  if (zoneCount < 8) {
    const mod = (100 - tokenUpgrades[5].level + 1) / 100;
    const lockPrice = new Decimal(lockedContainer.price * mod);
    if (lockedContainer.price.lte(currentScore)) {
      lockedContainer.locked = false;
    } else {
      lockedContainer.locked = true;
    }
    if (lockedContainer.locked) {
      lockedContainer.list[0].setTexture("locked");
      lockedContainer.list[1].setColor("#f61a06");
    } else {
      lockedContainer.list[0].setTexture("unlocked");
      lockedContainer.list[1].setColor("green");
    }
  }
}

function parseVertices(vertexSets, options) {
  var Matter = Phaser.Physics.Matter.Matter;

  var i, j, k, v, z;
  var parts = [];

  options = options || {};

  for (v = 0; v < vertexSets.length; v += 1) {
    parts.push(
      Matter.Body.create(
        Matter.Common.extend(
          {
            position: Matter.Vertices.centre(vertexSets[v]),
            vertices: vertexSets[v],
          },
          options
        )
      )
    );
  }

  // flag coincident part edges
  var coincidentMaxDist = 5;

  for (i = 0; i < parts.length; i++) {
    var partA = parts[i];

    for (j = i + 1; j < parts.length; j++) {
      var partB = parts[j];

      if (Matter.Bounds.overlaps(partA.bounds, partB.bounds)) {
        var pav = partA.vertices,
          pbv = partB.vertices;

        // iterate vertices of both parts
        for (k = 0; k < partA.vertices.length; k++) {
          for (z = 0; z < partB.vertices.length; z++) {
            // find distances between the vertices
            var da = Matter.Vector.magnitudeSquared(
                Matter.Vector.sub(pav[(k + 1) % pav.length], pbv[z])
              ),
              db = Matter.Vector.magnitudeSquared(
                Matter.Vector.sub(pav[k], pbv[(z + 1) % pbv.length])
              );

            // if both vertices are very close, consider the edge concident (internal)
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

function drawShopPanel() {
  $("#goldValue").html(displayNumber(currentScore));
  $("#tokenValue").html(displayNumber(tokens));
  if ($("#ballShop").is(":visible")) {
    for (var i = 0; i < spawns.length; i++) {
      const spawn = spawns[i];
      if (!zones[spawn.stage - 1]) {
        $("#ball" + i + "Value").html("-");
        $("#ball" + i + "Cooldown").html("-");
        $("#ball" + i + "Cost").html("-");
        $("#ball" + i + "Level").html("-");
        $("#ball" + i + "Cost").css("color", "black");
        $("#ball" + i + "Lock").show();
      } else {
        const mod = tokenUpgrades[0].value
          .mul(tokenUpgrades[0].valueModifier.pow(tokenUpgrades[0].level - 1))
          .div(100);
        if (spawn.level === 0) {
          $("#ball" + i + "Value").html(
            displayNumber(
              mod.mul(spawn.value.mul(spawn.valueModifier.pow(spawn.level)))
            )
          );
          $("#ball" + i + "Cooldown").html(
            displayNumber(spawn.cooldown - spawn.speedModifier * spawn.level)
          );
        } else if (spawn.level < 11) {
          $("#ball" + i + "Value").html(
            displayNumber(
              mod.mul(spawn.value.mul(spawn.valueModifier.pow(spawn.level - 1)))
            ) +
              " > " +
              displayNumber(
                mod.mul(spawn.value.mul(spawn.valueModifier.pow(spawn.level)))
              )
          );
          $("#ball" + i + "Cooldown").html(
            displayNumber(
              spawn.cooldown - spawn.speedModifier * (spawn.level - 1)
            ) +
              " > " +
              displayNumber(spawn.cooldown - spawn.speedModifier * spawn.level)
          );
        } else {
          $("#ball" + i + "Value").html(
            displayNumber(
              mod.mul(spawn.value.mul(spawn.valueModifier.pow(spawn.level - 1)))
            ) +
              " > " +
              displayNumber(
                mod.mul(spawn.value.mul(spawn.valueModifier.pow(spawn.level)))
              )
          );
          $("#ball" + i + "Cooldown").html(
            displayNumber(spawn.cooldown - spawn.speedModifier * 10) + " > MAX"
          );
        }
        const cost = spawn.cost.mul(spawn.costModifier.pow(spawn.level + 1));
        let color = "black";
        if (cost.gte(currentScore)) {
          color = "red";
        }
        $("#ball" + i + "Cost").html(displayNumber(cost));
        $("#ball" + i + "Level").html(spawn.level);
        $("#ball" + i + "Cost").css("color", color);
        $("#ball" + i + "Lock").hide();
      }
    }
  }
  if ($("#zoneShop").is(":visible")) {
    for (var i = 0; i < 8; i++) {
      if (zones.length > i) {
        $("#zone" + i + "Effect").html("Effect: " + zoneStrings[i]);
        const cost = new Decimal(zonePrices[i]).mul(
          zones[i].costModifier.pow(zones[i].level + 1)
        );
        let color = "black";
        if (cost.gte(currentScore)) {
          color = "red";
        }
        $("#zone" + i + "cost").html(displayNumber(cost));
        $("#zone" + i + "cost").css("color", color);
        const mod = new Decimal(
          tokenUpgrades[6].value.mul(
            tokenUpgrades[6].valueModifier.pow(tokenUpgrades[6].level - 1)
          )
        ).div(100);
        let modifier = new Decimal(zones[i].modifier).mul(mod);
        modifier = Math.round(modifier * 100) + "%";
        $("#zone" + i + "mod").html(modifier);
        $("#zone" + i + "Level").html(zones[i].level);
        $("#zone" + i + "Lock").hide();
      } else {
        $("#zone" + i + "Effect").html("Effect: ? ? ?");
        $("#zone" + i + "cost").html("---");
        $("#zone" + i + "mod").html("---");
        $("#zone" + i + "Level").html("---");
        $("#zone" + i + "Lock").show();
      }
    }
  }
  if ($("#tokenShop").is(":visible")) {
    $("#prestigeToken").html(displayNumber(calcuateTokens()));
    for (var i = 0; i < 8; i++) {
      if (tokenUpgrades.length > i) {
        const tokenUpgrade = tokenUpgrades[i];
        if (i === 1 || i === 2 || i === 5) {
          if (tokenUpgrade.level !== tokenUpgrade.maxLevel) {
            $("#token" + i + "Value").html(
              displayNumber(tokenUpgrade.value.plus(tokenUpgrade.level - 1)) +
                "% > " +
                displayNumber(tokenUpgrade.value.plus(tokenUpgrade.level)) +
                "%"
            );
            const cost = tokenUpgrade.cost.mul(
              tokenUpgrade.costModifier.pow(tokenUpgrade.level + 1)
            );
            let color = "black";
            if (cost.gte(tokens)) {
              color = "red";
            }
            $("#token" + i + "Cost").html(displayNumber(cost));
            $("#token" + i + "Cost").css("color", color);
          } else {
            $("#token" + i + "Value").html(
              displayNumber(tokenUpgrade.value.plus(tokenUpgrade.level - 1)) +
                "%"
            );
            $("#token" + i + "Cost").html("MAX");
          }
          $("#token" + i + "Level").html(
            tokenUpgrade.level - 1 + "/" + (tokenUpgrade.maxLevel - 1)
          );
        } else if (i === 3) {
          if (tokenUpgrade.level !== tokenUpgrade.maxLevel) {
            $("#token" + i + "Value").html(
              displayNumber(
                tokenUpgrade.value.plus((tokenUpgrade.level - 1) * 50)
              ) +
                "% > " +
                displayNumber(
                  tokenUpgrade.value.plus(tokenUpgrade.level * 50)
                ) +
                "%"
            );
            const cost = tokenUpgrade.cost.mul(
              tokenUpgrade.costModifier.pow(tokenUpgrade.level + 1)
            );
            let color = "black";
            if (cost.gte(tokens)) {
              color = "red";
            }
            $("#token" + i + "Cost").html(displayNumber(cost));
            $("#token" + i + "Cost").css("color", color);
          } else {
            $("#token" + i + "Value").html(
              displayNumber(
                tokenUpgrade.value.plus((tokenUpgrade.level - 1) * 50)
              ) + "%"
            );
            $("#token" + i + "Cost").html("MAX");
          }
          $("#token" + i + "Level").html(
            tokenUpgrade.level - 1 + "/" + (tokenUpgrade.maxLevel - 1)
          );
        } else {
          $("#token" + i + "Value").html(
            displayNumber(
              tokenUpgrade.value.mul(
                tokenUpgrade.valueModifier.pow(tokenUpgrade.level - 1)
              )
            ) +
              "% > " +
              displayNumber(
                tokenUpgrade.value.mul(
                  tokenUpgrade.valueModifier.pow(tokenUpgrade.level)
                )
              ) +
              "%"
          );
          const cost = tokenUpgrade.cost.mul(
            tokenUpgrade.costModifier.pow(tokenUpgrade.level + 1)
          );
          let color = "black";
          if (cost.gte(tokens)) {
            color = "red";
          }
          $("#token" + i + "Cost").html(displayNumber(cost));
          $("#token" + i + "Level").html(tokenUpgrade.level - 1);
          $("#token" + i + "Cost").css("color", color);
        }
      }
    }
  }
}

function save() {
  const saveZones = [];
  _.each(zones, function (zone) {
    saveZones.push({
      level: zone.level,
      type: zone.type,
    });
  });
  const obj = {
    spawns: spawns,
    tokenUpgrades: tokenUpgrades,
    money: currentScore.toString(),
    zones: saveZones,
    numberFormat: numberFormat,
    tokens: tokens.toString(),
    totalMoney: totalScore.toString(),
    sps: calculateScorePerSecond().toString(),
    time: Date.now(),
  };
  if (typeof Storage !== "undefined") {
    localStorage.setItem("save", JSON.stringify(obj));
  }
}

function load() {
  if (typeof Storage !== "undefined") {
    let save = localStorage.getItem("save");
    if (save) {
      save = JSON.parse(save);
      currentScore = new Decimal(save.money || 0);
      totalScore = new Decimal(save.totalMoney || 0);
      tokens = new Decimal(save.tokens || 0);
      numberFormat = save.numberFormat;
      $(".numOpt").removeClass("selected");
      $('.numOpt[value="' + numberFormat + '"').addClass("selected");
      if (save.spawns && save.spawns.length > 0) {
        spawns = save.spawns;
        _.each(spawns, function (spawn, index) {
          spawn.value = new Decimal(spawnTemplate[index].value);
          spawn.costModifier = new Decimal(spawnTemplate[index].costModifier);
          spawn.valueModifier = new Decimal(spawnTemplate[index].valueModifier);
          spawn.cost = new Decimal(spawnTemplate[index].cost);
        });
      }
      if (save.tokenUpgrades && save.tokenUpgrades.length > 0) {
        tokenUpgrades = save.tokenUpgrades;
        _.each(tokenUpgrades, function (tokenUpgrade, index) {
          tokenUpgrade.valueModifier = new Decimal(
            tokenTemplate[index].valueModifier || 0
          );
          tokenUpgrade.value = new Decimal(tokenTemplate[index].value || 0);
          tokenUpgrade.costModifier = new Decimal(
            tokenTemplate[index].costModifier || 0
          );
          tokenUpgrade.cost = new Decimal(tokenTemplate[index].cost || 0);
        });
      }
      if (save.zones && save.zones.length > 0) {
        _.each(save.zones, function (zone) {
          generateZone(zone.level);
        });
      } else {
        generateZone();
      }
      if (save.time) {
        currentTime = save.time;
        updateProgress();
        currentTime = Date.now();
      }
    } else {
      generateZone();
    }
  } else {
    generateZone();
  }
}

function prestige() {
  // GAObject.submitEvent("prestige", 1);
  tokens = tokens.add(calcuateTokens());
  currentScore = new Decimal(0); //total score
  totalScore = new Decimal(0); //total score
  zoneCount = 0;
  zones = [];
  lockedContainer = null;
  for (let i = balls.length - 1; i >= 0; i--) {
    ball = balls[i];
    ball.destroy();
  }
  balls = [];
  spawns = JSON.parse(JSON.stringify(spawnTemplate));
  save();
  game.scene.getScene("gameScene").scene.restart();
}

function calcuateTokens() {
  let tokenCost = new Decimal(125000);
  let score = new Decimal(totalScore);
  let tokens = new Decimal(0);
  const mod = new Decimal(
    tokenUpgrades[7].value.mul(
      tokenUpgrades[7].valueModifier.pow(tokenUpgrades[7].level - 1)
    )
  ).div(100);
  while (score.gte(tokenCost)) {
    score = score.minus(tokenCost);
    tokens = tokens.plus(1);
    tokenCost = tokenCost.mul(1.02);
  }
  return tokens.mul(mod).floor();
}

function updateProgress() {
  t = Date.now();
  const millis = (Date.now() - currentTime) / 1000;
  if (millis > 30) {
    let scorePerSecond = calculateScorePerSecond();
    addedScore = scorePerSecond.mul(millis);
    currentScore = currentScore.plus(addedScore);
    totalScore = totalScore.plus(addedScore);
    $("#offlineText").html(
      "Inactive for " +
        displayNumber(Math.floor(millis)) +
        " seconds<br/>Total Earned: " +
        displayNumber(addedScore)
    );
    $("#offlineProgress").show();
    drawShopPanel();
  }
}

function calculateScorePerSecond() {
  let scorePerSecond = new Decimal(0);
  for (var i = 0; i < spawns.length; i++) {
    if (spawns[i].level > 0 && zones[spawns[i].stage - 1]) {
      let cooldown =
        spawns[i].cooldown - spawns[i].speedModifier * (spawns[i].level - 1);
      if (spawns[i].level > 10) {
        cooldown = spawns[i].cooldown - spawns[i].speedModifier * 10;
      }
      const mod = tokenUpgrades[0].value
        .mul(tokenUpgrades[0].valueModifier.pow(tokenUpgrades[0].level - 1))
        .div(100);
      const value = mod.mul(
        spawns[i].value.mul(spawns[i].valueModifier.pow(spawns[i].level - 1))
      );
      cooldown = cooldown / 100;
      let sps = value / cooldown;
      scorePerSecond = scorePerSecond.plus(sps);
    }
  }
  return scorePerSecond.gt(0) ? scorePerSecond : new Decimal(0);
}

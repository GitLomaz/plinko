var block
var gameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function gameScene () {
        Phaser.Scene.call(this, { key: 'gameScene' });
    }, 

    preload: function() {
        this.load.image('rectangle', 'assets/images/rectangle.png');
        this.load.image('clearRectangle', 'assets/images/clearRectangle.png');
        this.load.image('circle', 'assets/images/circle.png');
        this.load.image('ball', 'assets/images/ball.png');
        this.load.image('ruby', 'assets/images/ruby.png');
        this.load.image('pres', 'assets/images/pres.png');
        this.load.image('zone', 'assets/images/zone.png');
        this.load.image('locked', 'assets/images/locked.png');
        this.load.image('unlocked', 'assets/images/unlocked.png');
        this.load.image('lockedUpgrade', 'assets/images/lockedUpgrade.png');
        this.load.image('lockedStage', 'assets/images/lockedStage.png');
        this.load.image('menu', 'assets/images/menu.png');
        this.load.image('goldContainer', 'assets/images/goldContainer.png');
        this.load.image('tokenContainer', 'assets/images/tokenContainer.png');
        this.load.image('rubyContainer', 'assets/images/rubyContainer.png');
        this.load.image('plusContainer', 'assets/images/button.png');
        this.load.spritesheet('balls', 'assets/images/balls.png', { frameWidth: 17, frameHeight: 17 });
    },

    create: function() {
        scene = this;
        matter = this.matter;
        camera = this.cameras.main;
        camera.setBackgroundColor('rgba(255, 255, 225, 0.5)');
        matter.world.setGravity(0,.0005,1);
    
        generateZone();
    
        var menu = scene.add.sprite(240,20,'menu');
        var overlay1 = scene.add.sprite(80,20,'goldContainer').setScrollFactor(0).setInteractive()
        var overlay2 = scene.add.sprite(240,20,'tokenContainer').setScrollFactor(0).setInteractive()
        var overlay3 = scene.add.sprite(400,20,'rubyContainer').setScrollFactor(0).setInteractive()
    
    
        menuContainer = this.add.container(0,0, [menu, overlay1, overlay2, overlay3]).setScrollFactor(0).setDepth(1000000).setAlpha(.9);
        textContainer = this.add.container(0,0, [
            scene.add.text(90, 20, "0", {fontFamily: 'Arial', fontSize: 14, color: '#000000', lineSpacing: 40, align: 'center', displayWidth: 130 }).setOrigin(.5),
            scene.add.text(250, 20, "0", {fontFamily: 'Arial', fontSize: 14, color: '#000000', lineSpacing: 40, align: 'center', displayWidth: 130 }).setOrigin(.5),
            scene.add.text(410, 20, "0", {fontFamily: 'Arial', fontSize: 14, color: '#000000', lineSpacing: 40, align: 'center', displayWidth: 130 }).setOrigin(.5)
        ]).setScrollFactor(0).setDepth(1000000);
    
    
        var background = scene.add.sprite(240,380,'menu').setScale(1,19).setScrollFactor(0).setInteractive().setAlpha(.9);
        var ballButton = scene.add.sprite(50,100,'ball').setScrollFactor(0).setInteractive();
        var zoneButton = scene.add.sprite(50,160,'zone').setScrollFactor(0).setInteractive();
        var presButton = scene.add.sprite(50,220,'pres').setScrollFactor(0).setInteractive();
        var bonusButton = scene.add.sprite(50,280,'ruby').setScrollFactor(0).setInteractive();
        var ballPanel = scene.add.sprite(240,380,'clearRectangle').setScale(33,62).setScrollFactor(0).setInteractive().setTintFill(0xB39667);
        var zonePanel = scene.add.sprite(240,380,'clearRectangle').setScale(33,62).setScrollFactor(0).setInteractive().setTintFill(0xc9a874);
        var presPanel = scene.add.sprite(240,380,'clearRectangle').setScale(33,62).setScrollFactor(0).setInteractive().setTintFill(0x50979c);
        var bonusPanel = scene.add.sprite(240,380,'clearRectangle').setScale(33,62).setScrollFactor(0).setInteractive().setTintFill(0x864E5B);
    
        storeContainer = this.add.container(680,-50, [background, ballButton, zoneButton, presButton, bonusButton, ballPanel, zonePanel, presPanel, bonusPanel]).setScrollFactor(0).setDepth(1000000);
        
        // background.on('pointerup', function(pointer){
        //     storeContainer.setX(500);
        // });
    
        // overlay1.on('pointerup', function(pointer){ 
        //     storeContainer.setX(0);
        //     showShop(0)
        // });
        // overlay2.on('pointerup', function(pointer){ 
        //     storeContainer.setX(0);
        //     showShop(2)
        // });
        // overlay3.on('pointerup', function(pointer){ 
        //     storeContainer.setX(0);
        //     showShop(3)
        // });
        overlay1.on('pointerover',function(pointer){
            overlay1.setAlpha(.6);
        });  
        overlay1.on('pointerout',function(pointer){
            overlay1.setAlpha(1);
        });
        overlay2.on('pointerover',function(pointer){
            overlay2.setAlpha(.6);
        });   
        overlay2.on('pointerout',function(pointer){
            overlay2.setAlpha(1);
        });
        overlay3.on('pointerover',function(pointer){
            overlay3.setAlpha(.6);
        });  
        overlay3.on('pointerout',function(pointer){
            overlay3.setAlpha(1);
        });
        ballButton.on('pointerup', function(pointer){ 
            selectedPanel = 0
            showShop();
        });
        zoneButton.on('pointerup', function(pointer){ 
            selectedPanel = 1
            showShop()
        });
        presButton.on('pointerup', function(pointer){ 
            selectedPanel = 2
            showShop()
        });
        bonusButton.on('pointerup', function(pointer){ 
            selectedPanel = 3
            showShop()
        });
    
        ballPanel.on('pointerup', function(pointer){});
        zonePanel.on('pointerup', function(pointer){});
        presPanel.on('pointerup', function(pointer){});
        bonusPanel.on('pointerup', function(pointer){});
        
    
        this.input.on('pointermove', ptr => {
            if (pointerdown && !isDragging) {
                if (ptr.y - startY) {
                    isDragging = true
                    lastY = ptr.y
                }
            }
            if (isDragging) {
                var dy = ptr.y - lastY
                dirY += dy
                lastY = ptr.y
            }
        })
     
        this.input.on('pointerup', (ptr, gameobs) => {
            pointerdown = false
            isDragging = false
        })
    
        this.input.on('pointerdown', ptr => {
            var target = this.add.image(ptr.worldX, ptr.worldY, 'circle').setScale(.08).setAlpha(.3);
                for (let i = balls.length - 1; i >=0 ; i--) {
                    ball = balls[i];
                    if(Math.abs(ball.x - ptr.worldX) + Math.abs(ball.y - ptr.worldY) < 40){
                        ball.value = ball.value.mul(1.5);
                        score(ball)
                        ball.destroy();
                        balls.splice(i, 1);
                    }
                }
                scene.tweens.add({
                    targets: target,
                    alpha: 0,
                    duration: 300,
                    ease: 'Linear',
                    onComplete: function(tween, targets){
                        targets[0].destroy();
                    }
                });
            pointerdown = true
            dirY = 0;
        })
    },

    update: function() {
        camera.scrollY -= (dirY / .15 / 100)
        dirY -= dirY / .6 / 100
        if(dirY < 3 && dirY > -3){
            dirY = 0;
        }

        for (var i=0; i < spawns.length ; i++) {
            if(spawns[i].level > 0){
                if (counter % (spawns[i].cooldown - spawns[i].speedModifier * spawns[i].level - 1) == 0){
                    generateBall(-1, spawns[i].y, i, spawns[i].cooldown - spawns[i].speedModifier * spawns[i].level - 1, spawns[i].stage, spawns[i].value.mul(spawns[i].valueModifier.pow(spawns[i].level)));      
                }
            }   
        }     
        counter++;
        for (let i = balls.length - 1; i >=0 ; i--) {
            ball = balls[i];
            if(ball.y > (ball.stage * 1500 - 70)){
                score(ball)
                if(!(Phaser.Math.Between(1, 4) != 1 && ball.stage < zones.length)){
                    ball.destroy();
                    balls.splice(i, 1);
                }else{
                    ball.stage++;
                }
            }
        }
        if(game.input.mousePointer.y > 800 || game.input.mousePointer.x > 680 || game.input.mousePointer.y < 0 || game.input.mousePointer.x < 0){
            pointerdown = false
            isDragging = false
        }
    }
})

var titleScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function titleScene () {
        Phaser.Scene.call(this, { key: 'titleScene' });
    },

    preload: function () {
        this.load.image('logo', 'assets/images/logo.png');
        this.load.image('start', 'assets/images/start.png');
        this.load.json('logo', 'assets/images/logo.json');
        this.load.spritesheet('balls', 'assets/images/balls.png', { frameWidth: 17, frameHeight: 17 });
    },

    create: function () {

        var Body = Phaser.Physics.Matter.Matter.Body;
        var Composite = Phaser.Physics.Matter.Matter.Composite;
        
        this.cameras.main.setBackgroundColor('rgba(255, 255, 225, 0.5)');
        this.matter.world.setGravity(0,.0005,1);

        this.add.line(0, 0, 0, 30, 3000, 30, 0xf84d3e, .6);
        this.add.line(0, 0, 0, 70, 3000, 70, 0x0085f3, .6);
        this.add.line(0, 0, 0, 50, 3000, 50, 0xd06ab8, .6);

        var shapes = this.cache.json.get('logo');

        var composite = Composite.create();

        var fixtures = shapes.logo.fixtures;

        for (var i = 0; i < fixtures.length; i++)
        {
            var body = Body.create({ isStatic: true });

            _.each(fixtures[i].vertices, function(arr) {
              _.each(arr, function(r) {
                r.x += 300
              })
            })
    
            Body.setParts(body, parseVertices(fixtures[i].vertices));
    
            Composite.addBody(composite, body);
        }        
        this.matter.world.add(composite);
        this.add.sprite(540, 250, 'logo')
        var startBtn = this.matter.add.image(540, 550, 'start').setStatic(true).setInteractive();

        this.input.once('pointerdown', function () {
            for (let i = balls.length - 1; i >=0 ; i--) {
                ball = balls[i];
                ball.destroy();
                balls.splice(i, 1);
            }
            this.scene.start('gameScene');
        }, this);

        startBtn.on('pointerover',function(pointer){
            startBtn.setAlpha(.6);
        });  
        startBtn.on('pointerout',function(pointer){
            startBtn.setAlpha(1);
        });
    },

    update: function() {
        if (counter2 % 20 == 0){     
            var x = Phaser.Math.Between(10, 1090);
            var ball1 = this.matter.add.image(x, 50, 'balls', 0);
            ball1.setStatic(true);
            ball1.setScale(.05);
            this.tweens.add({
                useFrames: true,
                targets: ball1,
                scaleX: 1,
                scaleY: 1,
                duration: 20,
                ease: 'Linear',
                onComplete: function(){
                    ball1.setStatic(false)
                    ball1.setCircle();
                    ball1.setFriction(0.01);
                    ball1.setBounce(.5);
                    balls.push(ball1);
                }
            });
        }
        if (counter2 % 30 == 0){
            var x = Phaser.Math.Between(10, 1090);
            var ball2 = this.matter.add.image(x, 70, 'balls', 1);
            ball2.setStatic(true);
            ball2.setScale(.05);
            this.tweens.add({
                useFrames: true,
                targets: ball2,
                scaleX: 1,
                scaleY: 1,
                duration: 30,
                ease: 'Linear',
                onComplete: function(){
                    ball2.setStatic(false)
                    ball2.setCircle();
                    ball2.setFriction(0.01);
                    ball2.setBounce(.5);
                    balls.push(ball2);
                }
            });     
        }
        if (counter2 % 40 == 0){
            var x = Phaser.Math.Between(10, 1090);
            var ball3 = this.matter.add.image(x, 30, 'balls', 2);
            ball3.setStatic(true);
            ball3.setScale(.05);
            this.tweens.add({
                useFrames: true,
                targets: ball3,
                scaleX: 1,
                scaleY: 1,
                duration: 40,
                ease: 'Linear',
                onComplete: function(){
                    ball3.setStatic(false)
                    ball3.setCircle();
                    ball3.setFriction(0.01);
                    ball3.setBounce(.5);
                    balls.push(ball3);
                }
            });   
        }
        for (let i = balls.length - 1; i >=0 ; i--) {
            ball = balls[i];
            if(ball.y > 1500){
                ball.destroy();
                balls.splice(i, 1);
            }
        }
        counter2++
    }  
});

var config = {
    type: Phaser.AUTO,
    width: 1108,
    height: 595,
    parent: "Game",
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: false,
            gravityY: .0005,
            setBounds: {
                x: 0,
                y: 0,
                width: 1108,
                height: 2000,
                
            },
        }
    },
    pixelArt: false,
    scene: [ titleScene, gameScene ]
};

var game = new Phaser.Game(config);
var counter = 0;                        //spawn loop counter
var counter2 = 0;                       //title loop counter
var matter;                             //physics object
var balls = [];                         //ball array
var spawns = [];                        //spawns array
var pointerdown = false;                //mouse down flag
var isDragging = false;                 //mouse dragging flag
var startY = 0                          // /
var lastY = 0                           // | drag variables
var dirY = 0                            // \ 
var camera;                             //camera object
var scene;                              //scene object
var zoneCount = 0;                      //number of zones spawned
var zones = [];                         //array of zones
var lockedContainer;                    //locked button for next zone
var menuContainer;                      //menu container
var graphics;                           //graphics object
var totalScore = new Decimal(0);        //total score
var fric = 0;
var selectedPanel = 0                   //selected store panel
var zonePrices = [500,5000,50000,500000,5000000,50000000,500000000,5000000000]

var spawn1 = {};
spawn1.cooldown = 300; //50 at max
spawn1.value = new Decimal(40);
spawn1.y = 90;
spawn1.stage = 1;
spawn1.level = 1;
spawn1.speedModifier = 25;
spawn1.costModifier = new Decimal(5.5);
spawn1.valueModifier = new Decimal(1.2);
spawn1.cost = new Decimal(20);

var spawn2 = {};
spawn2.cooldown = 350; //60 at max
spawn2.value = new Decimal(50);
spawn2.y = 70;
spawn2.stage = 1;
spawn2.level = 0;
spawn2.speedModifier = 29;
spawn2.costModifier = new Decimal(5.5);
spawn2.valueModifier = new Decimal(1.2);
spawn2.cost = new Decimal(200);

var spawn3 = {};
spawn3.cooldown = 400; //80 at max
spawn3.value = new Decimal(60);
spawn3.y = 50;
spawn3.stage = 1;
spawn3.level = 0;
spawn3.speedModifier = 32;
spawn3.costModifier = new Decimal(5.5);
spawn3.valueModifier = new Decimal(1.2);
spawn3.cost = new Decimal(1000);

var spawn4 = {};
spawn4.cooldown = 450; //100 at max
spawn4.value = new Decimal(70);
spawn4.y = 1530;
spawn4.stage = 2;
spawn4.level = 0;
spawn4.speedModifier = 35;
spawn4.costModifier = new Decimal(5.5);
spawn4.valueModifier = new Decimal(1.2);
spawn4.cost = new Decimal(7500);

var spawn5 = {};
spawn5.cooldown = 500; //120 at max
spawn5.value = new Decimal(80);
spawn5.y = 1550;
spawn5.stage = 2;
spawn5.level = 0;
spawn5.speedModifier = 38;
spawn5.costModifier = new Decimal(5.5);
spawn5.valueModifier = new Decimal(1.2);
spawn5.cost = new Decimal(20000);

var spawn6 = {};
spawn6.cooldown = 600; //150 at max
spawn6.value = new Decimal(100);
spawn6.y = 3070;
spawn6.stage = 3;
spawn6.level = 0;
spawn6.speedModifier = 45;
spawn6.costModifier = new Decimal(5.5);
spawn6.valueModifier = new Decimal(1.2);
spawn6.cost = new Decimal(60000);

var spawn7 = {};
spawn7.cooldown = 700; //200 at max
spawn7.value = new Decimal(120);
spawn7.y = 4570;
spawn7.stage = 4;
spawn7.level = 0;
spawn7.speedModifier = 60;
spawn7.costModifier = new Decimal(5.5);
spawn7.valueModifier = new Decimal(1.2);
spawn7.cost = new Decimal(250000);

var spawn8 = {};
spawn8.cooldown = 900; //250 at max
spawn8.value = new Decimal(150);
spawn8.y = 6070;
spawn8.stage = 5;
spawn8.level = 0;
spawn8.speedModifier = 65;
spawn8.costModifier = new Decimal(5.5);
spawn8.valueModifier = new Decimal(1.2);
spawn8.cost = new Decimal(1250000);

var spawn9 = {};
spawn9.cooldown = 1000; //300 at max
spawn9.value = new Decimal(200);
spawn9.y = 7570;
spawn9.stage = 6;
spawn9.level = 0;
spawn9.speedModifier = 70;
spawn9.costModifier = new Decimal(5.5);
spawn9.valueModifier = new Decimal(1.2);
spawn9.cost = new Decimal(5000000);

var spawn0 = {};
spawn0.cooldown = 1500; //400 at max
spawn0.value = new Decimal(500);
spawn0.y = 7570;
spawn0.stage = 6;
spawn0.level = 0;
spawn0.speedModifier = 11;
spawn0.costModifier = new Decimal(5.5);
spawn0.valueModifier = new Decimal(1.2);
spawn0.cost = new Decimal(500000000);

spawns.push(spawn1);
spawns.push(spawn2);
spawns.push(spawn3);
spawns.push(spawn4);
spawns.push(spawn5);
spawns.push(spawn6);
spawns.push(spawn7);
spawns.push(spawn8);
spawns.push(spawn9);
spawns.push(spawn0);

var text;

function score(ball, click = false){
    var modifier = 1;
    if(!click){
        modifier = zones[ball.stage - 1].modifier;
    }
    var score = new Decimal(ball.value * modifier)
    totalScore = totalScore.add(score)
    textContainer.list[0].text = displayNumber(totalScore);
    var text = scene.add.text(ball.x, ball.y, displayNumber(score), {fontFamily: 'Arial', fontSize: 12, color: '#ffff00' });
    checkLock();
    drawShopPanel();
    scene.tweens.add({
        targets: text,
        y: ball.y - 50,
        duration: 700,
        ease: 'Linear',
        onComplete: function(tween, targets){
            targets[0].destroy();
        }
    });
}

function generateBall(x, y, image, delayFrame, stage, value){
    if(x == -1){
        x = Phaser.Math.Between(10, 670);
    }
    var ball = this.matter.add.image(x, y, 'balls',image);
    ball.setStatic(true);
    ball.setScale(.05);
    scene.tweens.add({
        useFrames: true,
        targets: ball,
        scaleX: 1,
        scaleY: 1,
        duration: delayFrame,
        ease: 'Linear',
        onComplete: function(){
            ball.setStatic(false)
            ball.setCircle();
            ball.setFriction(fric);
            ball.setBounce(.5);
            ball.stage = stage;
            ball.value = value + 10000000;
            balls.push(ball);
        }
    });
}

function generateZone(level = 0){
    var zone = new Object();
    zone.type = zoneCount;
    zone.shapes = [];
    zone.tweens = [];
    zone.level = level;
    zone.modifier = .8 + (zone.type * .1) + (level * .05);
    zone.costModifier = new Decimal(4.5);
    zones.push(zone);
    zoneCount++;
    
    matter.world.setBounds(0, 0, 680, (zone.type + 1) * 1500, 32, true, true, true, false);
    camera.setBounds(0, 0, 680, (zone.type + 1) * 1500).setName('main');

    if(zoneCount < 8){
        if(lockedContainer){
            lockedContainer.y =  zone.type * 1500 + 1445;
        }else{
            lockedButton = scene.add.sprite(20, 20, 'locked')
            lockedText = scene.add.text(-75, 11, "", {fontFamily: 'Arial', fontSize: 16, color: '#f61a06', lineSpacing: 40}).setFontStyle('bold');
            lockedContainer = scene.add.container(140, zone.type * 1500 + 1445, [lockedButton, lockedText]).setAlpha(.8).setSize(280, 55).setInteractive();

            lockedContainer.on('pointerup', function(pointer){
                if(!lockedContainer.locked){
                    totalScore = totalScore.minus(lockedContainer.price);
                    textContainer.list[0].text = displayNumber(totalScore);
                    generateZone();
                    dirY = -200;
                }
            })
        }
        lockedContainer.price = new Decimal(zonePrices[zoneCount]);
        lockedContainer.list[1].text = displayNumber(lockedContainer.price);
        checkLock();
    }else{
        lockedButton.destroy();
        lockedText.destroy();
        
    }
    
    if(zoneCount == 1){
        scene.add.line(0, 0, 0, 90, 2000, 90, 0xf84d3e, .6);
        scene.add.line(0, 0, 0, 70, 2000, 70, 0x0085f3, .6);
        scene.add.line(0, 0, 0, 50, 2000, 50, 0xd06ab8, .6);
    }else if(zoneCount == 2){
        scene.add.line(0, 0, 0, 1530, 2000, 1530, 0x508a36, .6);
        scene.add.line(0, 0, 0, 1550, 2000, 1550, 0x108a80, .6);
        spawns[3].enabled = true;
        spawns[4].enabled = true;
    }else if(zoneCount == 3){
        scene.add.line(0, 0, 0, 3070, 2000, 3070, 0xffb45a, .6);
        spawns[5].enabled = true;
    }else if(zoneCount == 4){
        scene.add.line(0, 0, 0, 4570, 2000, 4570, 0xa57b36, .6);
        spawns[6].enabled = true;
    }else if(zoneCount == 5){
        scene.add.line(0, 0, 0, 6070, 2000, 6070, 0x727272, .6);
        spawns[7].enabled = true;
    }else if(zoneCount == 6){
        scene.add.line(0, 0, 0, 7570, 2000, 7570, 0x673eab, .6);
        spawns[8].enabled = true;
    }

    for (j = 0; j < 70; j++) {
        if(j%2==0)
            scene.add.line(0, 0, (j * 10), zone.type * 1500 + 1430, (j * 10) + 10, zone.type * 1500 + 1430, 0xf84d3e, .4);
    } 

    if(zone.type == 0){
        zone.levels = [3,2.8,2.6,2.4,2.2,2,1.8,1.6,1.4,1.2,1]
        for (i = 0; i < 10; i++) {
            for (j = 0; j < 8; j++) {
                var shape1 = matter.add.image(0 + i * 68.5, (zone.type*1500) + 200 + j * 150, 'rectangle', null, { isStatic: true }).setScale(zone.levels[level]).setAngle(45);
                var shape2 = matter.add.image(34 + i * 68.5, (zone.type*1500) + 275 + j * 150, 'rectangle', null, { isStatic: true }).setScale(zone.levels[level]).setAngle(45);
                zone.shapes.push(shape1);
                zone.shapes.push(shape2); 
            }
        }
    }else if(zone.type == 1){
        zone.levels = [125,115,105,95,85,75,65,55,45,35]
        for (i = 0; i < 3; i++) {
            var shape1 = matter.add.image(25, (zone.type*1500) + 200 + (i * 400), 'rectangle', null, { isStatic: true }).setScale(30, 1).setAngle(10);
            var shape2 = matter.add.image(450, (zone.type*1500) + 200 + (i * 400), 'rectangle', null, { isStatic: true }).setScale(30, 1).setAngle(-10);
            var ramp1 = matter.add.image(240, (zone.type*1500) + 400 + (i * 400), 'rectangle', null, { isStatic: true }).setScale(40, 1).setAngle(0);
            var ramp2 = matter.add.image(240, (zone.type*1500) + 400 + (i * 400), 'rectangle', null, { isStatic: true }).setScale(40, 1).setAngle(90);
            var tween1 = scene.tweens.add({
                targets: ramp1,
                rotation: Phaser.Math.DegToRad(360),
                duration: zone.levels[level] * 800,
                ease: 'Linear',
                repeat: -1,
            });
            var tween2 = scene.tweens.add({
                targets: ramp2,
                rotation: Phaser.Math.DegToRad(450),
                duration: zone.levels[level] * 800,
                ease: 'Linear',
                repeat: -1,
            });
            zone.shapes.push(ramp1);
            zone.shapes.push(ramp2); 
        }
    }else if(zone.type == 2){
        zone.levels = [0,20,40,60,80,100,120,140,160,180]
        for (i = 0; i < 6; i++) {
            var shape1 = matter.add.image(125 - zone.levels[level], (zone.type*1500) + 200 + (i * 200), 'rectangle', null, { isStatic: true }).setScale(50, 1).setAngle(10);
            var shape2 = matter.add.image(350 + zone.levels[level], (zone.type*1500) + 300 + (i * 200), 'rectangle', null, { isStatic: true }).setScale(50, 1).setAngle(-10);
            zone.shapes.push(shape1);
            zone.shapes.push(shape2);
        }
    }else if(zone.type == 3){
        zone.levels = [.6,.57,.53,.5,.47,.43,.4,.37,.33,.3]
        for (i = 0; i < 3; i++) {
            var shape1 = matter.add.image(0, (zone.type*1500) + 275 + (i * 400), 'circle').setScale(zone.levels[level]).setCircle(zone.levels[level] * 250, { isStatic: true });
            var shape2 = matter.add.image(480, (zone.type*1500) + 275 + (i * 400), 'circle').setScale(zone.levels[level]).setCircle(zone.levels[level] * 250, { isStatic: true });
            var shape3 = matter.add.image(240, (zone.type*1500) + 475 + (i * 400), 'circle').setScale(zone.levels[level]).setCircle(zone.levels[level] * 250, { isStatic: true });
            zone.shapes.push(shape1);
            zone.shapes.push(shape2);
            zone.shapes.push(shape3);
        }
    }else if(zone.type == 4){
        zone.levels = [[30,150],[35,145],[40,140],[45,135],[50,130],[60,120],[70,110],[75,105],[80,100],[85,95]]
        for (i = 0; i < 8; i++) {
            for (j = 0; j < 8; j++) {
                var shape1 = matter.add.image(10 + i * 60, (zone.type*1500) + 200 + j * 150, 'rectangle', null, { isStatic: true }).setScale(7, 1).setAngle(zone.levels[level][0]);
                var shape2 = matter.add.image(40 + i * 60, (zone.type*1500) + 275 + j * 150, 'rectangle', null, { isStatic: true }).setScale(7, 1).setAngle(zone.levels[level][1]);
                zone.shapes.push(shape1);
                zone.shapes.push(shape2);
            }
        }
    }else if(zone.type == 5){
        zone.levels = [125,115,105,95,85,75,65,55,45,35]
        for (i = 0; i < 3; i++) {
            var shape1 = matter.add.image(100, (zone.type*1500) + 400 + (i * 400), 'rectangle', null, { isStatic: true }).setScale(8).setAngle(45);
            var shape2 = matter.add.image(380, (zone.type*1500) + 400 + (i * 400), 'rectangle', null, { isStatic: true }).setScale(8).setAngle(45);
            var shape3 = matter.add.image(240, (zone.type*1500) + 400 + (i * 400), 'rectangle', null, { isStatic: true }).setScale(20,1);
            var shape4 = matter.add.image(100, (zone.type*1500) + 400 + (i * 400), 'rectangle', null, { isStatic: true }).setScale(1,12);
            var shape5 = matter.add.image(380, (zone.type*1500) + 400 + (i * 400), 'rectangle', null, { isStatic: true }).setScale(1,12)
            var shape6 = matter.add.image(25, (zone.type*1500) + 200 + (i * 400), 'rectangle', null, { isStatic: true }).setScale(30, 1).setAngle(10);
            var shape7 = matter.add.image(450, (zone.type*1500) + 200 + (i * 400), 'rectangle', null, { isStatic: true }).setScale(30, 1).setAngle(-10);
            var tween1 = scene.tweens.add({
                targets: shape4,
                x: 380,
                duration: zone.levels[level] * 300,
                ease: 'Linear',
                repeat: -1,
            });
            var tween2 = scene.tweens.add({
                targets: shape5,
                x: 100,
                duration: zone.levels[level] * 300,
                ease: 'Linear',
                repeat: -1,
            });
            zone.shapes.push(shape4);
            zone.shapes.push(shape5);
        }
    }else if(zone.type == 6){
        zone.levels = [125,115,105,95,85,75,65,55,45,35]
        for (i = 0; i < 3; i++) {
            for(j = -50; j < 400; j = j + 50){
                var shape = matter.add.image(j, (zone.type*1500) + 290 + (i * 400) - (j/5), 'rectangle', null, { isStatic: true }).setScale(4, 2).setAngle(10);
                if(j != 350){
                    var tween = scene.tweens.add({
                        targets: shape,
                        x: '+=50',
                        y: '-=10',
                        duration: zone.levels[level] * 100,
                        ease: 'Linear',
                        repeat: -1,
                    });
                    zone.shapes.push(shape);
                }else{
                    var tween = scene.tweens.add({
                        targets: shape,
                        x: '+=25',
                        y: '-=5',
                        scaleY: .01,
                        scaleX: .01,
                        duration: zone.levels[level] * 100,
                        ease: 'Linear',
                        repeat: -1,
                    });   
                    zone.shapes.push(shape);                
                }
            }
            for(j = 500; j > 100; j = j - 50){
                var shape = matter.add.image(j, (zone.type*1500) + 390 + (i * 400) + (j/5), 'rectangle', null, { isStatic: true }).setScale(4, 2).setAngle(-10);
                if(j != 150){
                    var tween = scene.tweens.add({
                        targets: shape,
                        x: '-=50',
                        y: '-=10',
                        duration: zone.levels[level] * 100,
                        ease: 'Linear',
                        repeat: -1,
                    });
                    zone.shapes.push(shape);
                }else{
                    var tween = scene.tweens.add({
                        targets: shape,
                        x: '-=25',
                        y: '-=5',
                        scaleY: .01,
                        scaleX: .01,
                        duration: zone.levels[level] * 100,
                        ease: 'Linear',
                        repeat: -1,
                    });      
                    zone.shapes.push(shape);            
                }
            }
        }
    }else if(zone.type == 7){
        zone.levels = [0,5,10,15,20,25,30,35,40,45]
        for (i = 0; i < 4; i++) {
            var shape1 = matter.add.image(150 - zone.levels[level], (zone.type*1500) + 200 + (i * 300), 'rectangle', null, { isStatic: true }).setScale(50, 1).setAngle(20);
            var shape2 = matter.add.image(150 - zone.levels[level], (zone.type*1500) + 375 + (i * 300), 'rectangle', null, { isStatic: true }).setScale(50, 1).setAngle(-20);
            zone.shapes.push(shape1);
            zone.shapes.push(shape2);
        }
        for (i = 0; i < 3; i++) {
            var shape1 = matter.add.image(300 + zone.levels[level], (zone.type*1500) + 350 + (i * 300), 'rectangle', null, { isStatic: true }).setScale(50, 1).setAngle(-20);
            var shape2 = matter.add.image(300 + zone.levels[level], (zone.type*1500) + 525 + (i * 300), 'rectangle', null, { isStatic: true }).setScale(50, 1).setAngle(20);
            zone.shapes.push(shape1);
            zone.shapes.push(shape2);
        }
    }
}

function upgradeZone(zone, index){
    var cost = new Decimal(zonePrices[index]).mul(zone.costModifier.pow(zone.level + 1))
    if(zone.level != 9 && totalScore.gte(cost)){
        zone.level++;
        totalScore = totalScore.minus(cost);
    }else{
        return -1
    }
    zone.modifier = .8 + (zone.type * .2) + (zone.level * .05);

    if(zone.type == 0){
        zone.shapes.forEach(function(shape){
            shape.setScale(zone.levels[zone.level]);
        });
    }else if(zone.type == 3){
        zone.shapes.forEach(function(shape){
            shape.setScale(zone.levels[zone.level]).setCircle(zone.levels[zone.level] * 250, { isStatic: true });
        });
    }else if(zone.type == 1){
        zone.shapes.forEach(function(shape){
            scene.tweens.killTweensOf(shape);
            shape.destroy();
        });
        for (i = 0; i < 3; i++) {
            var ramp1 = matter.add.image(240, (zone.type*1500) + 400 + (i * 400), 'rectangle', null, { isStatic: true }).setScale(40, 1).setAngle(0);
            var ramp2 = matter.add.image(240, (zone.type*1500) + 400 + (i * 400), 'rectangle', null, { isStatic: true }).setScale(40, 1).setAngle(90);
            scene.tweens.add({
                targets: ramp1,
                rotation: Phaser.Math.DegToRad(360),
                duration: zone.levels[zone.level] * 800,
                ease: 'Linear',
                repeat: -1,
            });
            scene.tweens.add({
                targets: ramp2,
                rotation: Phaser.Math.DegToRad(450),
                duration: zone.levels[zone.level] * 800,
                ease: 'Linear',
                repeat: -1,
            });
            zone.shapes.push(ramp1);
            zone.shapes.push(ramp2); 
        }
    }else if(zone.type == 2){
        var counter = true;
        zone.shapes.forEach(function(shape){
            if(counter){
                shape.setX(125 - zone.levels[zone.level]);
            }else{
                shape.setX(350 + zone.levels[zone.level]);
            }
            counter = !counter
        });
    }else if(zone.type == 4){
        var even = true;
        zone.shapes.forEach(function(shape){
            if(even){
                shape.setAngle(zone.levels[zone.level][0]);
            }else{
                shape.setAngle(zone.levels[zone.level][1]);
            }
            even = !even
        });
    }else if(zone.type == 5){
        zone.shapes.forEach(function(shape){
            scene.tweens.killTweensOf(shape);
            shape.destroy();
        });
        for (i = 0; i < 3; i++) {
            var ramp1 = matter.add.image(100, (zone.type*1500) + 400 + (i * 400), 'rectangle', null, { isStatic: true }).setScale(1,12);
            var ramp2 = matter.add.image(380, (zone.type*1500) + 400 + (i * 400), 'rectangle', null, { isStatic: true }).setScale(1,12)
            scene.tweens.add({
                targets: ramp1,
                x: 380,
                duration: zone.levels[zone.level] * 300,
                ease: 'Linear',
                repeat: -1,
            });
            scene.tweens.add({
                targets: ramp2,
                x: 100,
                duration: zone.levels[zone.level] * 300,
                ease: 'Linear',
                repeat: -1,
            });
            zone.shapes.push(ramp1);
            zone.shapes.push(ramp2); 
        }
    }else if(zone.type == 6){
        zone.shapes.forEach(function(shape){
            scene.tweens.killTweensOf(shape);
            shape.destroy();
        });
        for (i = 0; i < 3; i++) {
            for(j = -50; j < 400; j = j + 50){
                var shape = matter.add.image(j, (zone.type*1500) + 290 + (i * 400) - (j/5), 'rectangle', null, { isStatic: true }).setScale(4, 2).setAngle(10);
                if(j != 350){
                    var tween = scene.tweens.add({
                        targets: shape,
                        x: '+=50',
                        y: '-=10',
                        duration: zone.levels[zone.level] * 100,
                        ease: 'Linear',
                        repeat: -1,
                    });
                    zone.shapes.push(shape);
                }else{
                    var tween = scene.tweens.add({
                        targets: shape,
                        x: '+=25',
                        y: '-=5',
                        scaleY: .01,
                        scaleX: .01,
                        duration: zone.levels[zone.level] * 100,
                        ease: 'Linear',
                        repeat: -1,
                    });   
                    zone.shapes.push(shape);             
                }
            }
            for(j = 500; j > 100; j = j - 50){
                var shape = matter.add.image(j, (zone.type*1500) + 390 + (i * 400) + (j/5), 'rectangle', null, { isStatic: true }).setScale(4, 2).setAngle(-10);
                if(j != 150){
                    var tween = scene.tweens.add({
                        targets: shape,
                        x: '-=50',
                        y: '-=10',
                        duration: zone.levels[zone.level] * 100,
                        ease: 'Linear',
                        repeat: -1,
                    });
                    zone.shapes.push(shape);
                }else{
                    var tween = scene.tweens.add({
                        targets: shape,
                        x: '-=25',
                        y: '-=5',
                        scaleY: .01,
                        scaleX: .01,
                        duration: zone.levels[zone.level] * 100,
                        ease: 'Linear',
                        repeat: -1,
                    });      
                    zone.shapes.push(shape);             
                }
            }
        }
    }else if(zone.type == 7){
        var counter = 0;
        zone.shapes.forEach(function(shape){
            if(counter < 8){
                shape.setX(150 - zone.levels[zone.level]);
            }else{
                shape.setX(300 + zone.levels[zone.level]);
            }
            counter++
        });
    }
    drawShopPanel();
}

function upgradeSpawn(spawn){
    var cost = spawn.cost.mul(spawn.costModifier.pow(spawn.level + 1))
    if(spawn.level > 10 || totalScore.lt(cost)){
        return -1
    }
    totalScore = totalScore.minus(cost);
    textContainer.list[0].text = displayNumber(totalScore);
    spawn.level++;
    drawShopPanel();
}

function displayNumber(y){
    try{
        if(y.e < 9){
            return y.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }else{
            return y.d[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + 
            ((y.d[1] === undefined) ? 0 : y.d[1].toString().substring(0,3))  + 'e' + 
            (y.e - (y.d[0].toString().length - 1))
        }
    }catch (err){
        return y;
    }
}

function checkLock(){
    if(zoneCount < 8){
        if(lockedContainer.price.lte(totalScore)){
            lockedContainer.locked = false;
        }else{
            lockedContainer.locked = true;
        }
        if(lockedContainer.locked){
            lockedContainer.list[0].setTexture("locked");
            lockedContainer.list[1].setColor('#f61a06');
            
        }else{
            lockedContainer.list[0].setTexture("unlocked");
            lockedContainer.list[1].setColor('green');
        }
    }
}

function drawShopPanel(){
    for(var i=storeContainer.list.length - 1;i>8;i--){
        storeContainer.list[i].destroy();
    }
    if(selectedPanel == 0){
        var tipText = scene.add.text(100,90, "Tip: Upgrading balls not only increases their value, but also the frequency in which they spawn.", { color: '#363636', fontFamily: 'Arial', fontSize: 14, wordWrap: { width: 300 } }).setFontStyle('bold italic');
        storeContainer.add(tipText);
        var upgradePanel0 = scene.add.sprite(160,255 + (0 * 45),'clearRectangle').setScale(13,8).setScrollFactor(0).setInteractive().setTintFill(getPanelColorBalls(0));
        upgradePanel0.on('pointerdown', function () {upgradeSpawn(spawns[0])});
        var upgradePanel1 = scene.add.sprite(320,255 + (0 * 45),'clearRectangle').setScale(13,8).setScrollFactor(0).setInteractive().setTintFill(getPanelColorBalls(1));
        upgradePanel1.on('pointerdown', function () {upgradeSpawn(spawns[1])});
        var upgradePanel2 = scene.add.sprite(160,255 + (2 * 45),'clearRectangle').setScale(13,8).setScrollFactor(0).setInteractive().setTintFill(getPanelColorBalls(2));
        upgradePanel2.on('pointerdown', function () {upgradeSpawn(spawns[2])});
        var upgradePanel3 = scene.add.sprite(320,255 + (2 * 45),'clearRectangle').setScale(13,8).setScrollFactor(0).setInteractive().setTintFill(getPanelColorBalls(3));
        upgradePanel3.on('pointerdown', function () {upgradeSpawn(spawns[3])});
        var upgradePanel4 = scene.add.sprite(160,255 + (4 * 45),'clearRectangle').setScale(13,8).setScrollFactor(0).setInteractive().setTintFill(getPanelColorBalls(4));
        upgradePanel4.on('pointerdown', function () {upgradeSpawn(spawns[4])});
        var upgradePanel5 = scene.add.sprite(320,255 + (4 * 45),'clearRectangle').setScale(13,8).setScrollFactor(0).setInteractive().setTintFill(getPanelColorBalls(5));
        upgradePanel5.on('pointerdown', function () {upgradeSpawn(spawns[5])});
        var upgradePanel6 = scene.add.sprite(160,255 + (6 * 45),'clearRectangle').setScale(13,8).setScrollFactor(0).setInteractive().setTintFill(getPanelColorBalls(6));
        upgradePanel6.on('pointerdown', function () {upgradeSpawn(spawns[6])});
        var upgradePanel7 = scene.add.sprite(320,255 + (6 * 45),'clearRectangle').setScale(13,8).setScrollFactor(0).setInteractive().setTintFill(getPanelColorBalls(7));
        upgradePanel7.on('pointerdown', function () {upgradeSpawn(spawns[7])});
        var upgradePanel8 = scene.add.sprite(160,255 + (8 * 45),'clearRectangle').setScale(13,8).setScrollFactor(0).setInteractive().setTintFill(getPanelColorBalls(8));
        upgradePanel8.on('pointerdown', function () {upgradeSpawn(spawns[8])});
        var upgradePanel9 = scene.add.sprite(320,255 + (8 * 45),'clearRectangle').setScale(13,8).setScrollFactor(0).setInteractive().setTintFill(getPanelColorBalls(9));
        upgradePanel9.on('pointerdown', function () {upgradeSpawn(spawns[9])});
        storeContainer.add(upgradePanel0);
        storeContainer.add(upgradePanel1);
        storeContainer.add(upgradePanel2);
        storeContainer.add(upgradePanel3);
        storeContainer.add(upgradePanel4);
        storeContainer.add(upgradePanel5);
        storeContainer.add(upgradePanel6);
        storeContainer.add(upgradePanel7);
        storeContainer.add(upgradePanel8);
        storeContainer.add(upgradePanel9);
        for(var i=0;i<spawns.length;i=i+2){
            var content1 = [
                "Value: " + displayNumber(spawns[i].value.mul(spawns[i].valueModifier.pow(spawns[i].level))),
                "Cooldown: " + displayNumber(spawns[i].cooldown - (spawns[i].speedModifier * spawns[i+1].level)),
                "Cost: " + displayNumber(spawns[i].cost.mul(spawns[i].costModifier.pow(spawns[i].level + 1)))
            ]
            var text1 = scene.add.text(98,245 + (i * 45), content1, { color: '#363636', fontFamily: 'Arial', fontSize: 14, });
            var ball1 = scene.add.sprite(160, 229 + (i * 45), 'balls', i)

            storeContainer.add(text1);
            storeContainer.add(ball1);

            if(!zones[spawns[i].stage - 1]){
                var locked1 = scene.add.sprite(160, 256 + (i * 45), 'lockedUpgrade')
                storeContainer.add(locked1);
            }

            var content2 = [
                "Value: " + displayNumber(spawns[i+1].value.mul(spawns[i+1].valueModifier.pow(spawns[i+1].level))),
                "Cooldown: " + displayNumber(spawns[i+1].cooldown - (spawns[i+1].speedModifier * spawns[i+1].level)),
                "Cost: " + displayNumber(spawns[i+1].cost.mul(spawns[i+1].costModifier.pow(spawns[i+1].level + 1)))
            ]
            var text2 = scene.add.text(257,245 + (i * 45), content2, { color: '#363636', fontFamily: 'Arial', fontSize: 14, });
            var ball2 = scene.add.sprite(320, 229 + (i * 45), 'balls', i + 1)

            storeContainer.add(text2);
            storeContainer.add(ball2);

            if(!zones[spawns[i+1].stage - 1]){
                var locked1 = scene.add.sprite(320, 256 + (i * 45), 'lockedUpgrade')
                storeContainer.add(locked1);
            }
        }
    }else if(selectedPanel == 1){
        var tipText = scene.add.text(100,90, "Tip: Upgrading zones not only increases ball payouts that make it to the end of that zone, but also has another benifit unique to each zone.", { color: '#363636', fontFamily: 'Arial', fontSize: 14, wordWrap: { width: 300 } }).setFontStyle('bold italic');
        storeContainer.add(tipText);
        var upgradePanel0 = scene.add.sprite(240,205 + (0 * 60),'clearRectangle').setScale(28,5).setScrollFactor(0).setInteractive().setTintFill(getPanelColorStages(0));
        upgradePanel0.on('pointerdown', function () {upgradeZone(zones[0], 0)});
        var upgradePanel1 = scene.add.sprite(240,205 + (1 * 60),'clearRectangle').setScale(28,5).setScrollFactor(0).setInteractive().setTintFill(getPanelColorStages(1));
        upgradePanel1.on('pointerdown', function () {upgradeZone(zones[1], 1)});
        var upgradePanel2 = scene.add.sprite(240,205 + (2 * 60),'clearRectangle').setScale(28,5).setScrollFactor(0).setInteractive().setTintFill(getPanelColorStages(2));
        upgradePanel2.on('pointerdown', function () {upgradeZone(zones[2], 2)});
        var upgradePanel3 = scene.add.sprite(240,205 + (3 * 60),'clearRectangle').setScale(28,5).setScrollFactor(0).setInteractive().setTintFill(getPanelColorStages(3));
        upgradePanel3.on('pointerdown', function () {upgradeZone(zones[3], 3)});
        var upgradePanel4 = scene.add.sprite(240,205 + (4 * 60),'clearRectangle').setScale(28,5).setScrollFactor(0).setInteractive().setTintFill(getPanelColorStages(4));
        upgradePanel4.on('pointerdown', function () {upgradeZone(zones[4], 4)});
        var upgradePanel5 = scene.add.sprite(240,205 + (5 * 60),'clearRectangle').setScale(28,5).setScrollFactor(0).setInteractive().setTintFill(getPanelColorStages(5));
        upgradePanel5.on('pointerdown', function () {upgradeZone(zones[5], 5)});
        var upgradePanel6 = scene.add.sprite(240,205 + (6 * 60),'clearRectangle').setScale(28,5).setScrollFactor(0).setInteractive().setTintFill(getPanelColorStages(6));
        upgradePanel6.on('pointerdown', function () {upgradeZone(zones[6], 6)});
        var upgradePanel7 = scene.add.sprite(240,205 + (7 * 60),'clearRectangle').setScale(28,5).setScrollFactor(0).setInteractive().setTintFill(getPanelColorStages(7));
        upgradePanel7.on('pointerdown', function () {upgradeZone(zones[7], 7)});
        storeContainer.add(upgradePanel0);
        storeContainer.add(upgradePanel1);
        storeContainer.add(upgradePanel2);
        storeContainer.add(upgradePanel3);
        storeContainer.add(upgradePanel4);
        storeContainer.add(upgradePanel5);
        storeContainer.add(upgradePanel6);
        storeContainer.add(upgradePanel7);   
        var strings = ["Shrinks Zone Diamonds", "Icrease Cross Rotation", "Shrinks Ramp Width", "Decrease Circle Radius", "Straightens Lines", "Increases Pusher Speed", "Increases Convayer Speed", "Widens Channel"]   
        for(var i=0;i<8;i++){
            if(!zones[i]){
                var locked1 = scene.add.sprite(240, 205 + (i * 60), 'lockedStage')
                storeContainer.add(locked1);
            }else{
                var content1 = "Cost: " + displayNumber(new Decimal(zonePrices[i]).mul(zones[i].costModifier.pow(zones[i].level + 1)))
                var text1 = scene.add.text(105,210 + (i * 60), content1, { color: '#363636', fontFamily: 'Arial', fontSize: 13 });
                var text2 = scene.add.text(120,190 + (i * 60), strings[i], { color: '#363636', fontFamily: 'Arial', fontSize: 18 });
                var text3 = scene.add.text(335,193 + (i * 60), Math.round(zones[i].modifier*100) + '%', { color: '#363636', fontFamily: 'Arial', align: 'right', fontSize: 18 });
                storeContainer.add(text1);
                storeContainer.add(text2);
                storeContainer.add(text3);
            }
        }
    }else if(selectedPanel == 2){
        var tipText = scene.add.text(100,90, "Tip: This will have prestige options, when they work..", { color: '#363636', fontFamily: 'Arial', fontSize: 14, wordWrap: { width: 300 } }).setFontStyle('bold italic');
        storeContainer.add(tipText);
    }else if(selectedPanel == 3){
        var tipText = scene.add.text(100,90, "Tip: Cash Store will go here!", { color: '#363636', fontFamily: 'Arial', fontSize: 14, wordWrap: { width: 300 } }).setFontStyle('bold italic');
        storeContainer.add(tipText);
    }
}

function getPanelColorBalls(i){
    var color1;
    if(!zones[spawns[i].stage - 1] || totalScore.lt(spawns[i].cost.mul(spawns[i].costModifier.pow(spawns[i].level + 1)))){
        color1 = 0x909090;
    }else if(spawns[i].level == 0){
        color1 = 0x526cb2;
    }else{
        color1 = 0x7bb252;
    }
    return color1;
}

function getPanelColorStages(i){
    var color1;
    if(!zones[i]){
        color1 = 0x909090;
    }else{
        if(totalScore.lt(new Decimal(zonePrices[i]).mul(zones[i].costModifier.pow(zones[i].level + 1)))){
            color1 = 0x909090;
        }else{
            color1 = 0x7bb252;
        }
    }
    return color1;
}

function showShop(){
    for(var i=5;i<9;i++){
        storeContainer.list[i].x = 1000;
    }
    storeContainer.list[selectedPanel+5].x = 240
    drawShopPanel();
}

function parseVertices (vertexSets, options){
    var Matter = Phaser.Physics.Matter.Matter;

    var i, j, k, v, z;
    var parts = [];

    options = options || {};

    for (v = 0; v < vertexSets.length; v += 1)
    {
        parts.push(Matter.Body.create(Matter.Common.extend({
            position: Matter.Vertices.centre(vertexSets[v]),
            vertices: vertexSets[v]
        }, options)));
    }

    // flag coincident part edges
    var coincidentMaxDist = 5;

    for (i = 0; i < parts.length; i++)
    {
        var partA = parts[i];

        for (j = i + 1; j < parts.length; j++)
        {
            var partB = parts[j];

            if (Matter.Bounds.overlaps(partA.bounds, partB.bounds))
            {
                var pav = partA.vertices,
                    pbv = partB.vertices;

                // iterate vertices of both parts
                for (k = 0; k < partA.vertices.length; k++)
                {
                    for (z = 0; z < partB.vertices.length; z++)
                    {
                        // find distances between the vertices
                        var da = Matter.Vector.magnitudeSquared(Matter.Vector.sub(pav[(k + 1) % pav.length], pbv[z])),
                            db = Matter.Vector.magnitudeSquared(Matter.Vector.sub(pav[k], pbv[(z + 1) % pbv.length]));

                        // if both vertices are very close, consider the edge concident (internal)
                        if (da < coincidentMaxDist && db < coincidentMaxDist)
                        {
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

function arrayUp(arr, index = -1){
	index = (index == -1 ? arr.length - 1 : index)
	if(arr[index] != 9){
		arr[index]++;
		return arr;    
	}else{
		arr[index] = 0;
		if(index == 0){
			arr.unshift(1);
        }else{
			arr = arrayUp(arr, index - 1); 
        }
    }
	return arr;
}
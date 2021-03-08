var spawn1 = {};
spawn1.cooldown = 300; //50 at max
spawn1.value = new Decimal(55);
spawn1.y = 90;
spawn1.stage = 1;
spawn1.level = 1;
spawn1.speedModifier = 25;
spawn1.costModifier = new Decimal(4.5);
spawn1.valueModifier = new Decimal(1.8);
spawn1.cost = new Decimal(20);

var spawn2 = {};
spawn2.cooldown = 350; //60 at max
spawn2.value = new Decimal(80);
spawn2.y = 70;
spawn2.stage = 1;
spawn2.level = 0;
spawn2.speedModifier = 29;
spawn2.costModifier = new Decimal(4.3);
spawn2.valueModifier = new Decimal(1.8);
spawn2.cost = new Decimal(100);

var spawn3 = {};
spawn3.cooldown = 400; //80 at max
spawn3.value = new Decimal(110);
spawn3.y = 50;
spawn3.stage = 1;
spawn3.level = 0;
spawn3.speedModifier = 32;
spawn3.costModifier = new Decimal(4.1);
spawn3.valueModifier = new Decimal(1.8);
spawn3.cost = new Decimal(1000);

var spawn4 = {};
spawn4.cooldown = 450; //100 at max
spawn4.value = new Decimal(150);
spawn4.y = 1530;
spawn4.stage = 2;
spawn4.level = 0;
spawn4.speedModifier = 35;
spawn4.costModifier = new Decimal(3.9);
spawn4.valueModifier = new Decimal(1.85);
spawn4.cost = new Decimal(7500);

var spawn5 = {};
spawn5.cooldown = 500; //120 at max
spawn5.value = new Decimal(170);
spawn5.y = 1550;
spawn5.stage = 2;
spawn5.level = 0;
spawn5.speedModifier = 38;
spawn5.costModifier = new Decimal(3.7);
spawn5.valueModifier = new Decimal(1.85);
spawn5.cost = new Decimal(20000);

var spawn6 = {};
spawn6.cooldown = 600; //150 at max
spawn6.value = new Decimal(190);
spawn6.y = 3070;
spawn6.stage = 3;
spawn6.level = 0;
spawn6.speedModifier = 45;
spawn6.costModifier = new Decimal(3.5);
spawn6.valueModifier = new Decimal(1.88);
spawn6.cost = new Decimal(60000);

var spawn7 = {};
spawn7.cooldown = 700; //200 at max
spawn7.value = new Decimal(220);
spawn7.y = 4570;
spawn7.stage = 4;
spawn7.level = 0;
spawn7.speedModifier = 60;
spawn7.costModifier = new Decimal(3.3);
spawn7.valueModifier = new Decimal(1.89);
spawn7.cost = new Decimal(250000);

var spawn8 = {};
spawn8.cooldown = 900; //250 at max
spawn8.value = new Decimal(250);
spawn8.y = 6070;
spawn8.stage = 5;
spawn8.level = 0;
spawn8.speedModifier = 65;
spawn8.costModifier = new Decimal(3.1);
spawn8.valueModifier = new Decimal(1.92);
spawn8.cost = new Decimal(1250000);

var spawn9 = {};
spawn9.cooldown = 1000; //300 at max
spawn9.value = new Decimal(320);
spawn9.y = 7570;
spawn9.stage = 6;
spawn9.level = 0;
spawn9.speedModifier = 70;
spawn9.costModifier = new Decimal(2.9);
spawn9.valueModifier = new Decimal(1.95);
spawn9.cost = new Decimal(5000000);

var spawn0 = {};
spawn0.cooldown = 1500; //400 at max
spawn0.value = new Decimal(780);
spawn0.y = 9070;
spawn0.stage = 6;
spawn0.level = 0;
spawn0.speedModifier = 11;
spawn0.costModifier = new Decimal(2.7);
spawn0.valueModifier = new Decimal(2);
spawn0.cost = new Decimal(500000000);

var spawns = []; //spawns array
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

var spawnTemplate = JSON.parse(JSON.stringify(spawns))
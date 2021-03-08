var token1 = {};
token1.level = 1;
token1.valueModifier = new Decimal(1.1);
token1.value = new Decimal(100);
token1.costModifier = new Decimal(1.8);
token1.cost = new Decimal(5);

var token2 = {};
token2.level = 1;
token2.value = new Decimal(30);
token2.costModifier = new Decimal(1.8);
token2.cost = new Decimal(10);
token2.maxLevel = 31

var token3 = {};
token3.level = 1;
token3.value = new Decimal(0);
token3.costModifier = new Decimal(1.8);
token3.cost = new Decimal(7.5);
token3.maxLevel = 51

var token4 = {};
token4.level = 1;
token4.value = new Decimal(100);
token4.costModifier = new Decimal(1.8);
token4.cost = new Decimal(2);
token4.maxLevel = 11

var token5 = {};
token5.level = 1;
token5.valueModifier = new Decimal(1.1);
token5.value = new Decimal(125);
token5.costModifier = new Decimal(1.8);
token5.cost = new Decimal(12);

var token6 = {};
token6.level = 1;
token6.value = new Decimal(0);
token6.costModifier = new Decimal(1.8);
token6.cost = new Decimal(7.5);
token6.maxLevel = 51

var token7 = {};
token7.level = 1;
token7.valueModifier = new Decimal(1.1);
token7.value = new Decimal(100);
token7.costModifier = new Decimal(1.8);
token7.cost = new Decimal(5);

var token8 = {};
token8.level = 1;
token8.valueModifier = new Decimal(1.1);
token8.value = new Decimal(100);
token8.costModifier = new Decimal(1.8);
token8.cost = new Decimal(10);

var tokenUpgrades = []; //tokens array
tokenUpgrades.push(token1);
tokenUpgrades.push(token2);
tokenUpgrades.push(token3);
tokenUpgrades.push(token4);
tokenUpgrades.push(token5);
tokenUpgrades.push(token6);
tokenUpgrades.push(token7);
tokenUpgrades.push(token8);

var tokenTemplate = JSON.parse(JSON.stringify(tokenUpgrades))
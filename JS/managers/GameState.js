/**
 * GameState.js
 * Central state management for the Plinko game
 */

import { SPAWN_CONFIGS } from '../config/SpawnConfig.js';
import { TOKEN_CONFIGS } from '../config/TokenConfig.js';

export class GameState {
  constructor() {
    this.currentScore = new Decimal(0);
    this.totalScore = new Decimal(0);
    this.tokens = new Decimal(0);
    this.numberFormat = 'eng';
    
    // Statistics tracking
    this.stats = {
      totalTokensEarned: 0,
      totalAdsWatched: 0,
      totalPrestiges: 0,
      highestZone: 0,
      totalBallsSpawned: 0,
      totalPlayTime: 0, // in seconds
      lastPlayTime: Date.now()
    };
    
    // Initialize spawns from config
    this.spawns = SPAWN_CONFIGS.map((config, index) => ({
      ...config,
      level: index === 0 ? 1 : 0,
      enabled: index === 0,
      value: new Decimal(config.value),
      cost: new Decimal(config.cost),
      costModifier: new Decimal(config.costModifier),
      valueModifier: new Decimal(config.valueModifier)
    }));

    // Initialize token upgrades from config
    this.tokenUpgrades = TOKEN_CONFIGS.map(config => ({
      ...config,
      level: 1,
      value: new Decimal(config.value),
      cost: new Decimal(config.cost),
      costModifier: new Decimal(config.costModifier),
      valueModifier: config.valueModifier ? new Decimal(config.valueModifier) : null
    }));

    this.zones = [];
    this.currentTime = Date.now();
  }

  /**
   * Add gold to the current score
   * @param {Decimal} amount - Amount to add
   */
  addGold(amount) {
    this.currentScore = this.currentScore.add(amount);
    this.totalScore = this.totalScore.add(amount);
  }

  /**
   * Spend gold if available
   * @param {Decimal} amount - Amount to spend
   * @returns {boolean} - True if purchase was successful
   */
  spendGold(amount) {
    if (this.currentScore.lt(amount)) {
      return false;
    }
    this.currentScore = this.currentScore.minus(amount);
    return true;
  }

  /**
   * Add tokens
   * @param {Decimal} amount - Amount to add
   */
  addTokens(amount) {
    this.tokens = this.tokens.add(amount);
    this.stats.totalTokensEarned += parseFloat(amount.toString());
  }

  /**
   * Spend tokens if available
   * @param {Decimal} amount - Amount to spend
   * @returns {boolean} - True if purchase was successful
   */
  spendTokens(amount) {
    if (this.tokens.lt(amount)) {
      return false;
    }
    this.tokens = this.tokens.minus(amount);
    return true;
  }

  /**
   * Get the cost for upgrading a spawn
   * @param {number} spawnIndex - Index of the spawn
   * @returns {Decimal} - Cost of the upgrade
   */
  getSpawnUpgradeCost(spawnIndex) {
    const spawn = this.spawns[spawnIndex];
    return spawn.cost.mul(spawn.costModifier.pow(spawn.level + 1));
  }

  /**
   * Get the cost for upgrading a zone
   * @param {number} zoneIndex - Index of the zone
   * @param {number} zonePrice - Base price of the zone
   * @returns {Decimal} - Cost of the upgrade
   */
  getZoneUpgradeCost(zoneIndex, zonePrice) {
    const zone = this.zones[zoneIndex];
    return new Decimal(zonePrice).mul(zone.costModifier.pow(zone.level + 1));
  }

  /**
   * Get the cost for upgrading a token upgrade
   * @param {number} tokenIndex - Index of the token upgrade
   * @returns {Decimal} - Cost of the upgrade
   */
  getTokenUpgradeCost(tokenIndex) {
    const token = this.tokenUpgrades[tokenIndex];
    return token.cost.mul(token.costModifier.pow(token.level + 1));
  }

  /**
   * Get the current value of a spawn based on upgrades
   * @param {number} spawnIndex - Index of the spawn
   * @returns {Decimal} - Current value of the spawn
   */
  getSpawnValue(spawnIndex) {
    const spawn = this.spawns[spawnIndex];
    const levelMultiplier = spawn.level > 0 ? spawn.level - 1 : 0;
    
    const mod = this.tokenUpgrades[0].value
      .mul(this.tokenUpgrades[0].valueModifier.pow(this.tokenUpgrades[0].level - 1))
      .div(100);
    
    return mod.mul(spawn.value.mul(spawn.valueModifier.pow(levelMultiplier)));
  }

  /**
   * Calculate score per second
   * @returns {Decimal} - Score generated per second
   */
  calculateScorePerSecond() {
    let scorePerSecond = new Decimal(0);
    
    for (let i = 0; i < this.spawns.length; i++) {
      const spawn = this.spawns[i];
      if (spawn.level > 0 && this.zones[spawn.stage - 1]) {
        let cooldown = spawn.cooldown - spawn.speedModifier * (spawn.level - 1);
        if (spawn.level > 10) {
          cooldown = spawn.cooldown - spawn.speedModifier * 10;
        }
        
        const value = this.getSpawnValue(i);
        const framesPerSecond = 60;
        const spawnPerSecond = framesPerSecond / cooldown;
        const sps = value.mul(spawnPerSecond);
        
        scorePerSecond = scorePerSecond.add(sps);
      }
    }
    
    return scorePerSecond.gt(0) ? scorePerSecond : new Decimal(0);
  }

  /**
   * Calculate tokens earned from prestige
   * @returns {Decimal} - Number of tokens earned
   */
  calculatePrestigeTokens() {
    let tokenCost = new Decimal(125000);
    let score = new Decimal(this.totalScore);
    let tokens = new Decimal(0);
    
    const mod = this.tokenUpgrades[7].value
      .mul(this.tokenUpgrades[7].valueModifier.pow(this.tokenUpgrades[7].level - 1))
      .div(100);
    
    while (score.gte(tokenCost)) {
      score = score.minus(tokenCost);
      tokens = tokens.add(1);
      tokenCost = tokenCost.mul(1.02);
    }
    
    return tokens.mul(mod).floor();
  }

  /**
   * Reset state for prestige
   */
  resetForPrestige() {
    this.currentScore = new Decimal(0);
    this.totalScore = new Decimal(0);
    this.zones = [];
    this.stats.totalPrestiges++;
    
    // Reset spawns to initial state
    this.spawns = SPAWN_CONFIGS.map((config, index) => ({
      ...config,
      level: index === 0 ? 1 : 0,
      enabled: index === 0,
      value: new Decimal(config.value),
      cost: new Decimal(config.cost),
      costModifier: new Decimal(config.costModifier),
      valueModifier: new Decimal(config.valueModifier)
    }));
  }
}

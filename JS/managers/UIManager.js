/**
 * UIManager.js
 * Manages all UI elements and updates
 */

import { ZONE_PRICES, ZONE_EFFECTS } from '../config/GameConfig.js';
import { NumberFormatter } from '../utils/NumberFormatter.js';

export class UIManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.formatter = new NumberFormatter();
    this.formatter.setFormat(gameState.numberFormat);
    this.currentPanel = 'ball';
    this.resetCounter = 0;
    this.prestigeConfirm = false;
    
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // Panel switching
    $('#optsBall').on('click', () => this.switchPanel('ball'));
    $('#optsZone').on('click', () => this.switchPanel('zone'));
    $('#optsToken').on('click', () => this.switchPanel('token'));
    $('#optsHelp').on('click', () => this.switchPanel('help'));

    // Number format selection
    $('.numOpt').on('click', (e) => {
      $('.numOpt').removeClass('selected');
      $(e.currentTarget).addClass('selected');
      const format = $(e.currentTarget).attr('value');
      this.formatter.setFormat(format);
      this.gameState.numberFormat = format;
      this.updateShopPanel();
    });

    // Save button
    $('#saveGame').on('click', () => this.handleSaveClick());

    // Reset button
    $('#resetGame').on('click', () => this.handleResetClick());
    $('#resetGame').on('mouseleave', () => {
      $('#resetGame').html('Hard Reset');
      this.resetCounter = 0;
    });

    // Prestige button
    $('#prestige').on('click', () => this.handlePrestigeClick());
    $('#prestige').on('mouseleave', () => {
      $('#prestige').html('Prestige');
      this.prestigeConfirm = false;
    });

    // Offline progress close
    $('#offlineClose').on('click', () => $('#offlineProgress').hide());

    // Scroll buttons
    this.setupScrollButtons();
  }

  setupScrollButtons() {
    this.scrollDown = false;
    this.scrollUp = false;

    $('#scrollDown')
      .mousedown(() => { this.scrollDown = true; })
      .mouseup(() => { this.scrollDown = false; })
      .on('mouseleave', () => { this.scrollDown = false; });

    $('#scrollUp')
      .mousedown(() => { this.scrollUp = true; })
      .mouseup(() => { this.scrollUp = false; })
      .on('mouseleave', () => { this.scrollUp = false; });
  }

  switchPanel(panelName) {
    $('.optBtn').removeClass('selected');
    $(`#opts${panelName.charAt(0).toUpperCase() + panelName.slice(1)}`).addClass('selected');
    $('.shop').hide();
    $(`#${panelName}Shop`).show();
    this.currentPanel = panelName;
    this.updateShopPanel();
  }

  handleSaveClick() {
    if ($('#saveGame').html() !== 'Saved!') {
      $('#saveGame').html('Saved!');
      // Trigger save event
      window.dispatchEvent(new CustomEvent('game:save'));
      setTimeout(() => {
        $('#saveGame').html('Save Game');
      }, 3000);
    }
  }

  handleResetClick() {
    switch (this.resetCounter) {
      case 0:
        $('#resetGame').html('Confirm');
        this.resetCounter++;
        break;
      case 1:
        $('#resetGame').html('Ya Sure?');
        this.resetCounter++;
        break;
      case 2:
        $('#resetGame').html('100%?');
        this.resetCounter++;
        break;
      case 3:
        window.dispatchEvent(new CustomEvent('game:hardreset'));
        break;
    }
  }

  handlePrestigeClick() {
    if (!this.prestigeConfirm) {
      this.prestigeConfirm = true;
      $('#prestige').html('Confirm');
    } else {
      window.dispatchEvent(new CustomEvent('game:prestige'));
    }
  }

  updateCurrency() {
    $('#goldValue').html(this.formatter.format(this.gameState.currentScore));
    $('#tokenValue').html(this.formatter.format(this.gameState.tokens));
  }

  updateShopPanel() {
    this.updateCurrency();

    switch (this.currentPanel) {
      case 'ball':
        this.updateBallShop();
        break;
      case 'zone':
        this.updateZoneShop();
        break;
      case 'token':
        this.updateTokenShop();
        break;
    }
  }

  updateBallShop() {
    for (let i = 0; i < this.gameState.spawns.length; i++) {
      const spawn = this.gameState.spawns[i];
      
      if (!this.gameState.zones[spawn.stage - 1]) {
        // Zone not unlocked yet
        $(`#ball${i}Value`).html('-');
        $(`#ball${i}Cooldown`).html('-');
        $(`#ball${i}Cost`).html('-');
        $(`#ball${i}Level`).html('-');
        $(`#ball${i}Cost`).css('color', 'black');
        $(`#ball${i}Lock`).show();
      } else {
        // Zone unlocked
        const currentValue = this.gameState.getSpawnValue(i);
        const cost = this.gameState.getSpawnUpgradeCost(i);
        
        if (spawn.level === 0) {
          $(`#ball${i}Value`).html(this.formatter.format(currentValue));
          $(`#ball${i}Cooldown`).html(spawn.cooldown);
        } else {
          const nextValue = this.gameState.getSpawnValue(i);
          const currentCooldown = spawn.cooldown - spawn.speedModifier * (spawn.level - 1);
          const nextCooldown = spawn.level < 11 ? 
            spawn.cooldown - spawn.speedModifier * spawn.level : 
            'MAX';

          $(`#ball${i}Value`).html(
            `${this.formatter.format(currentValue)} > ${this.formatter.format(nextValue)}`
          );
          $(`#ball${i}Cooldown`).html(
            `${currentCooldown} > ${nextCooldown}`
          );
        }

        const canAfford = this.gameState.currentScore.gte(cost);
        $(`#ball${i}Cost`).html(this.formatter.format(cost));
        $(`#ball${i}Cost`).css('color', canAfford ? 'black' : 'red');
        $(`#ball${i}Level`).html(spawn.level);
        $(`#ball${i}Lock`).hide();
      }
    }
  }

  updateZoneShop() {
    for (let i = 0; i < 8; i++) {
      if (this.gameState.zones.length > i) {
        const zone = this.gameState.zones[i];
        $(`#zone${i}Effect`).html(`Effect: ${ZONE_EFFECTS[i]}`);

        const cost = this.gameState.getZoneUpgradeCost(i, ZONE_PRICES[i]);
        const canAfford = this.gameState.currentScore.gte(cost);
        
        $(`#zone${i}cost`).html(this.formatter.format(cost));
        $(`#zone${i}cost`).css('color', canAfford ? 'black' : 'red');

        const mod = this.gameState.tokenUpgrades[6].value
          .mul(this.gameState.tokenUpgrades[6].valueModifier.pow(this.gameState.tokenUpgrades[6].level - 1))
          .div(100);
        const modifier = new Decimal(zone.modifier).mul(mod);
        
        $(`#zone${i}mod`).html(this.formatter.formatPercent(modifier.toNumber()));
        $(`#zone${i}Level`).html(zone.level);
        $(`#zone${i}Lock`).hide();
      } else {
        $(`#zone${i}Effect`).html('Effect: ? ? ?');
        $(`#zone${i}cost`).html('---');
        $(`#zone${i}mod`).html('---');
        $(`#zone${i}Level`).html('---');
        $(`#zone${i}Lock`).show();
      }
    }
  }

  updateTokenShop() {
    $('#prestigeToken').html(this.formatter.format(this.gameState.calculatePrestigeTokens()));

    for (let i = 0; i < this.gameState.tokenUpgrades.length; i++) {
      const token = this.gameState.tokenUpgrades[i];
      const cost = this.gameState.getTokenUpgradeCost(i);
      const canAfford = this.gameState.tokens.gte(cost);
      const atMaxLevel = token.maxLevel && token.level === token.maxLevel;

      if ([1, 2, 5].includes(i)) {
        // Linear increase tokens
        if (!atMaxLevel) {
          const current = token.value.plus(token.level - 1);
          const next = token.value.plus(token.level);
          $(`#token${i}Value`).html(`${this.formatter.format(current)}% > ${this.formatter.format(next)}%`);
          $(`#token${i}Cost`).html(this.formatter.format(cost));
          $(`#token${i}Cost`).css('color', canAfford ? 'black' : 'red');
        } else {
          $(`#token${i}Value`).html(`${this.formatter.format(token.value.plus(token.level - 1))}%`);
          $(`#token${i}Cost`).html('MAX');
        }
        $(`#token${i}Level`).html(`${token.level - 1}/${token.maxLevel - 1}`);
      } else if (i === 3) {
        // Special scaling token
        if (!atMaxLevel) {
          const current = token.value.plus((token.level - 1) * 50);
          const next = token.value.plus(token.level * 50);
          $(`#token${i}Value`).html(`${this.formatter.format(current)}% > ${this.formatter.format(next)}%`);
          $(`#token${i}Cost`).html(this.formatter.format(cost));
          $(`#token${i}Cost`).css('color', canAfford ? 'black' : 'red');
        } else {
          $(`#token${i}Value`).html(`${this.formatter.format(token.value.plus((token.level - 1) * 50))}%`);
          $(`#token${i}Cost`).html('MAX');
        }
        $(`#token${i}Level`).html(`${token.level - 1}/${token.maxLevel - 1}`);
      } else {
        // Multiplicative tokens
        const current = token.value.mul(token.valueModifier.pow(token.level - 1));
        const next = token.value.mul(token.valueModifier.pow(token.level));
        $(`#token${i}Value`).html(`${this.formatter.format(current)}% > ${this.formatter.format(next)}%`);
        $(`#token${i}Cost`).html(this.formatter.format(cost));
        $(`#token${i}Cost`).css('color', canAfford ? 'black' : 'red');
        $(`#token${i}Level`).html(token.level - 1);
      }
    }
  }

  showOfflineProgress(seconds, earned) {
    $('#offlineText').html(
      `Inactive for ${this.formatter.addCommas(Math.floor(seconds))} seconds<br/>` +
      `Total Earned: ${this.formatter.format(earned)}`
    );
    $('#offlineProgress').show();
  }

  getScrollState() {
    return { down: this.scrollDown, up: this.scrollUp };
  }

  showMenu() {
    $('#menuContainer').show();
  }

  attachUpgradeHandlers(onSpawnUpgrade, onZoneUpgrade, onTokenUpgrade) {
    $('.ballUpgrade').off('click').on('click', function() {
      const index = parseInt($(this).attr('value'));
      onSpawnUpgrade(index);
    });

    $('.zoneUpgrade').off('click').on('click', function() {
      const index = parseInt($(this).attr('value'));
      onZoneUpgrade(index);
    });

    $('.tokenUpgrade').off('click').on('click', function() {
      const index = parseInt($(this).attr('value'));
      onTokenUpgrade(index);
    });
  }
}

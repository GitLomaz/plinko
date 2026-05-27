/**
 * SaveManager.js
 * Handles saving and loading game state
 */

export class SaveManager {
  constructor() {
    this.storageKey = 'plinko_save';
  }

  /**
   * Save the game state
   * @param {Object} gameState - The current game state to save
   * @returns {boolean} - True if save was successful
   */
  save(gameState) {
    try {
      if (typeof Storage === 'undefined') {
        console.warn('LocalStorage not available');
        return false;
      }

      const saveData = {
        spawns: gameState.spawns,
        tokenUpgrades: gameState.tokenUpgrades,
        money: gameState.currentScore.toString(),
        totalMoney: gameState.totalScore.toString(),
        tokens: gameState.tokens.toString(),
        zones: gameState.zones.map(zone => ({
          level: zone.level,
          type: zone.type
        })),
        numberFormat: gameState.numberFormat,
        theme: gameState.theme,
        stats: gameState.stats,
        time: Date.now()
      };

      localStorage.setItem(this.storageKey, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('Error saving game:', error);
      return false;
    }
  }

  /**
   * Load the game state
   * @returns {Object|null} - The loaded game state or null if no save exists
   */
  load() {
    try {
      if (typeof Storage === 'undefined') {
        console.warn('LocalStorage not available');
        return null;
      }

      const saveData = localStorage.getItem(this.storageKey);
      if (!saveData) {
        return null;
      }

      return JSON.parse(saveData);
    } catch (error) {
      console.error('Error loading game:', error);
      return null;
    }
  }

  /**
   * Delete the save file
   * @returns {boolean} - True if deletion was successful
   */
  deleteSave() {
    try {
      if (typeof Storage === 'undefined') {
        return false;
      }

      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Error deleting save:', error);
      return false;
    }
  }

  /**
   * Check if a save exists
   * @returns {boolean} - True if a save exists
   */
  hasSave() {
    try {
      if (typeof Storage === 'undefined') {
        return false;
      }

      return localStorage.getItem(this.storageKey) !== null;
    } catch (error) {
      return false;
    }
  }
}

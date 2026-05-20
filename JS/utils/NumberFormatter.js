/**
 * NumberFormatter.js
 * Utility class for formatting large numbers with different notation systems
 */

import { NUMBER_SUFFIXES } from '../config/GameConfig.js';

export class NumberFormatter {
  constructor() {
    this.formatType = 'eng'; // 'eng', 'bad', or 'sci'
  }

  setFormat(format) {
    this.formatType = format;
  }

  /**
   * Format a Decimal.js number for display
   * @param {Decimal} value - The number to format
   * @returns {string} - Formatted number string
   */
  format(value) {
    try {
      if (value.e < 9) {
        return value
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }

      const str = value.toPrecision(value.e + 1).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      const parts = str.split(',');
      const s0 = parts[0];
      const s1 = parts[1] ? parts[1].substring(0, 4 - s0.length) : '';
      const e = (parts.length - 1) * 3;

      switch (this.formatType) {
        case 'eng':
          return `${s0}.${s1}e+${e}`;
        case 'bad':
          const suffixIndex = parts.length - 1 - 2;
          return `${s0}.${s1} ${NUMBER_SUFFIXES[suffixIndex] || ''}`;
        case 'sci':
          return value.toPrecision(4);
        default:
          return `${s0}.${s1}e+${e}`;
      }
    } catch (err) {
      return value.toString();
    }
  }

  /**
   * Format a number as a percentage
   * @param {number} value - The value to format as percentage
   * @returns {string} - Formatted percentage string
   */
  formatPercent(value) {
    return Math.round(value * 100) + '%';
  }

  /**
   * Add commas to a regular number
   * @param {number} num - Number to format
   * @returns {string} - Formatted number with commas
   */
  addCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

/**
 * Format a date string to a more readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string (e.g., "Jan 1, 2023")
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Calculate pool statistics
 * @param {Array} bouts - Array of bout objects
 * @returns {Object} Pool statistics
 */
export const calculatePoolStats = (bouts) => {
  if (!bouts || bouts.length === 0) {
    return {
      victories: 0,
      bouts: 0,
      winPercentage: 0,
      touchesScored: 0,
      touchesReceived: 0,
      indicator: 0
    };
  }
  
  const victories = bouts.filter(bout => bout.victory).length;
  const totalBouts = bouts.length;
  const winPercentage = (victories / totalBouts) * 100;
  const touchesScored = bouts.reduce((sum, bout) => sum + bout.scoreFor, 0);
  const touchesReceived = bouts.reduce((sum, bout) => sum + bout.scoreAgainst, 0);
  const indicator = touchesScored - touchesReceived;
  
  return {
    victories,
    bouts: totalBouts,
    winPercentage,
    touchesScored,
    touchesReceived,
    indicator
  };
};

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

/**
 * Get weapon display name
 * @param {string} weaponCode - Weapon code (F, E, S)
 * @returns {string} Weapon display name
 */
export const getWeaponName = (weaponCode) => {
  const weapons = {
    F: 'Foil',
    E: 'Épée',
    S: 'Saber'
  };
  return weapons[weaponCode] || weaponCode;
};

/**
 * Get age category display name
 * @param {string} categoryCode - Age category code (Y10, Y12, Y14, Cadet, Junior, Senior, Veteran)
 * @returns {string} Age category display name
 */
export const getAgeCategoryName = (categoryCode) => {
  const categories = {
    Y10: 'Y10 (Under 10)',
    Y12: 'Y12 (Under 12)',
    Y14: 'Y14 (Under 14)',
    Cadet: 'Cadet (Under 17)',
    Junior: 'Junior (Under 20)',
    Senior: 'Senior (Open)',
    Veteran: 'Veteran (40+)'
  };
  return categories[categoryCode] || categoryCode;
};

/**
 * Get DE round name
 * @param {number} round - Round number (64, 32, 16, 8, 4, 2, 1)
 * @returns {string} Round name
 */
export const getDERoundName = (round) => {
  const rounds = {
    64: 'Table of 64',
    32: 'Table of 32',
    16: 'Table of 16',
    8: 'Quarterfinals',
    4: 'Semifinals',
    2: 'Finals',
    1: 'Gold Medal Bout'
  };
  return rounds[round] || `Round of ${round}`;
};

/**
 * Format a placing with the correct suffix
 * @param {number} placing - Placing number
 * @returns {string} Formatted placing (e.g., "1st", "2nd", "3rd", "4th")
 */
export const formatPlacing = (placing) => {
  if (!placing) return '';
  
  const j = placing % 10;
  const k = placing % 100;
  
  if (j === 1 && k !== 11) {
    return placing + 'st';
  }
  if (j === 2 && k !== 12) {
    return placing + 'nd';
  }
  if (j === 3 && k !== 13) {
    return placing + 'rd';
  }
  return placing + 'th';
};
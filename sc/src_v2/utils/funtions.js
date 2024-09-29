/**
 * @param {Date} [date]
 * @returns {string}
 */
function getTimestamp(date) {
  if (date) return date.toISOString().replace(/T/, " ").replace(/\..+/, "");
  return new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
}

/**
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 * Return ramdom number from min to max
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Thay thế các ký tự không phải ASCII bằng dấu hỏi '?'
 * @param {string} inputString
 * @returns {string}
 */
function replaceInvalidChars(inputString) {
  return inputString.replace(/[^\x00-\x7F]/g, "?");
}

module.exports = { getTimestamp, getRandomInt, replaceInvalidChars };

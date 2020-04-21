const { Buffer } = require("buffer");

/**
 * Memory manager
 * @class
 */
class MemoryManager {

  /**
   * Boolean bytes size
   * @returns {number}
   */
  static get BOOLEAN_SIZE() {
    return 4;
  }

  /**
   * Number bytes size
   * @returns {number}
   */
  static get NUMBER_SIZE() {
    return 8;
  }

  /**
   * Size unities
   * @returns {string[]}
   */
  static get SIZE_UNITY() {
    return ["bytes", "KiB", "MiB", "GiB", "TiB"];
  }

  static isGlobalSymbol(object) {
    return Symbol.keyFor && Symbol.keyFor(object);
  }

  /**
   * Get Array size
   * @param {Array} element
   */
  static getArraySize(element) {
    let byte = 0;
    for (const value of element) {
      byte += this.getSize(value);
    }
    return byte;
  }

  /**
   * Get Object lenght
   * @param {object|Array} element
   */
  static getObjectSize(element) {
    if (Array.isArray(element)) {
      return this.getArraySize(element);
    }

    let byte = 0;
    for (const key in element) {
      byte += this.getSize(element[key]);
    }
    return byte;
  }

  /**
   * Get Symbol bytes size
   * @param {Symbol} element
   */
  static getSymbolSize(element) {
    return this.isGlobalSymbol(element)
      ? Symbol.keyFor(element).length * 2
      : (element.toString().length - 8) * 2;
  }

  /**
   * Get string bytes size
   * @param {string} element
   */
  static getStringSize(element) {
    return element.length * 2;
  }

  /**
   * Get Buffer bytes size
   * @param {Buffer} element
   */
  static getBufferSize(element) {
    return element.length;
  }

  /**
	 * Get element byte size
	 * @param {*} element
	 * @returns {number}
	 */
  static getSize(element) {

    if (Buffer.isBuffer(element)) {
      return this.getBufferSize(element);
    }

    switch (typeof element) {
        case "object":
          return this.getObjectSize(element);
        case "symbol":
          return this.getSymbolSize(element);
        case "string":
          return this.getStringSize(element);
        case "boolean":
          return this.BOOLEAN_SIZE;
        case "number":
          return this.NUMBER_SIZE;
        default:
          // TODO: check others formats
          return 0;
    }
  }

  /**
	 *	Get formated bytes size
	 * @param {number} bytes
	 * @returns {string}
	 */
  static format(bytes) {
    if (typeof bytes !== "number") {
      throw new Error("value size it's not a number");
    }

    if (bytes === 0) {
      return `0 ${this.SIZE_UNITY[0]}`;
    }

    // Get size unity level
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);

    if (i === 0) {
      return `${bytes} ${this.SIZE_UNITY[i]}`;
    }

    if (!this.SIZE_UNITY[i]) {
      return `${bytes} bytes`;
    }

    return `${(bytes / (1024 ** i)).toFixed(1)} ${this.SIZE_UNITY[i]}`;
  }
}

module.exports = MemoryManager;

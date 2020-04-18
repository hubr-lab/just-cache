/* !
* just-cache
* Copyright(c) 2020 Gleisson Mattos
* http://github.com/gleissonmattos
*
* Licensed under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/

const { Buffer } = require('buffer');

/**
 * @class
 * Cache Entries entity
 * @constructor
 */
class CacheControl {
  constructor (value, timeout, expireAt) {
    this.value = value;
    this.timeout = timeout;
    this.expireAt = expireAt;
  }
}

/**
 * Validate ttl value
 * @param {number} ttl should be one positive number
 */
function validateTtl(ttl) {
  if (typeof ttl !== "number") {
    throw new Error("Property key it's not a number");
  }

  if (ttl < 0) {
    throw new Error(`Expiration time '${ttl}' can't be negative`);
  }
}

function isGlobalSymbol(object) {
  return Symbol.keyFor && Symbol.keyFor(object);
}

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
    return isGlobalSymbol(element)
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

/**
 * Check if cache key is valid
 * @param {string} key
 */
function checkValidKey(key) {
  if (typeof key !== "string" || key.length === 0) {
    throw new Error("Property key it's not a string");
  }
}

/**
 * Check if cache value is valid
 * @param {*} value
 */
function checkValidValue(value) {
  if (value === null) {
    throw new Error("Can't set 'null' to cache value");
  } else if (value === undefined) {
    throw new Error("Can't set 'undefined' to cache value");
  }
}

/**
 * Get limit from options
 * @param {options} options JustCache option
 */
function getLimit({ limit }) {
  if (typeof limit !== "number" || (limit && limit < 0)) {
    throw new Error("Property options limit is invalid");
  }
  return limit;
}

/**
 * Just Cache @class
 */
class JustCache {
  constructor (options = {}) {

    this._data = {};
    this._storageOrder = [];
    this._options = {};

    if (options.limit !== null && options.limit !== undefined) {
      this._options.limit = getLimit(options);
    }

    if (options.ttl !== null && options.ttl !== undefined) {
      validateTtl(options.ttl);
      this._options.ttl = options.ttl;
    }
    this._options.ttl = options.ttl;
  }

  /**
   * Clean from cache old values based a size
   * The value is
   * @param {number} valueSize
   */
  normalizeCache(valueSize, limit) {
    if (typeof valueSize !== "number") {
      throw new Error("Value size must be a number");
    }
    const safeLimit = this._options.limit || getLimit({ limit });
    if ((this.size() + valueSize) > safeLimit) {
      const [firstKey] = this.keys();
      if (firstKey) {
        this.delete(firstKey);
        this.normalizeCache(valueSize, limit);
      }
    }
  }

  /**
	 * Put or set the cache value
	 * @param {string} key key the cache
	 * @param {*} value any cache value
	 * @param {number} ttl time to expire
	 */
  put(key, value, ttl) {
    checkValidKey(key);
    checkValidValue(value);

    // validate ttl case has setted
    if (ttl !== null && ttl !== undefined) {
      validateTtl(ttl);
    }

    // dont save to has expired setted ttl
    if (ttl === 0) {
      return;
    }

    if (this._options.limit !== null && this._options.limit !== undefined) {
      const valueSize = MemoryManager.getSize(value);
      if (valueSize > this._options.limit) {
        return;
      }
      this.normalizeCache(valueSize);
    }

    // clean cache time out case exists
    this.removeTtl(key);

    ttl = ttl || this._options.ttl;
    const expireMls = ttl * 1000;

    // add memory cache
    this._data[key] = new CacheControl(
      value,
      ttl
        ? setTimeout(() => { this.delete(key); }, expireMls)
        : null,
      ttl
        ? Date.now() + expireMls
        : null
    );
  }

  /**
	 * Set unsetted key values
	 * Case value has registered return exception
	 * @param {string} key key the cache
	 * @param {*} value any cache value
	 * @param {number} ttl time to expire
	 */
  set(key, value, ttl) {

    checkValidKey(key);

    // do not update until it is removed
    if (this.has(key)) {
      return;
    }

    checkValidValue(value);

    if (ttl !== null && ttl !== undefined) {
      validateTtl(ttl);
    }

    if (ttl === 0) {
      return;
    }

    if (this._options.limit !== null && this._options.limit !== undefined) {
      const valueSize = MemoryManager.getSize(value);
      if (valueSize > this._options.limit) {
        return;
      }
      this.normalizeCache(valueSize);
    }

    ttl = ttl || this._options.ttl;
    const expireMls = ttl * 1000;

    this._data[key] = new CacheControl(
      value,
      ttl
        ? setTimeout(() => { this.delete(key); }, expireMls)
        : null,
      ttl
        ? Date.now() + expireMls
        : null
    );
  }

  /**
	 * Clean all cached values
	 */
  clean() {
    for (const key in this._data) {
      this.delete(key);
    }
  }

  /**
	 * Check if exists one cache
	 * @param {string} key
	 */
  has(key) {
    checkValidKey(key);
    return Boolean(this._data[key]);
  }

  /**
	 * Get from value from cache
	 * @param {string} key
	 */
  get(key) {

    checkValidKey(key);

    const cached = this._data[key];

    if (!cached) {
      return null;
    }

    return this._data[key].value;
  }

  removeTtl(key) {
    checkValidKey(key);
    if (this.has(key) && this._data[key].timeout) {
      clearTimeout(this._data[key].timeout);
    }
  }

  /**
	 * Remove from cache
	 * @param {string} key
	 */
  delete(key) {
    checkValidKey(key);
    this.removeTtl(key);
    delete this._data[key];
  }

  /**
	 * Get all cached keys
	 * @returns {string[]}
	 */
  keys() {
    return Object.keys(this._data);
  }

  /**
	 * Count existing cache values
	 * @returns {number}
	 */
  count() {
    return this.keys().length;
  }

  /**
	 * Get current cache size
	 * @returns {number}
	 */
  size() {
    let bytes = 0;
    for (const key in this._data) {
      bytes += MemoryManager.getSize(this._data[key].value);
    }
    return bytes;
  }

  /**
	 * Get current cache size formated text
	 * @returns {string}
	 */
  sizeText() {
    return MemoryManager.format(this.size());
  }
}

module.exports = JustCache;



/* !
* just-cache
* Copyright(c) 2020 Gleisson Mattos
* http://github.com/gleissonmattos
*
* Licensed under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/

const MemoryManager = require("./memory");
const Store = require("./storage");
const { EventEmitter } = require("events");

const storage = new Store();

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
class JustCache extends EventEmitter {

  constructor (options = {}) {
    super();

    this._memory = {};
    this._storageOrder = [];
    this._options = {};

    if (options.limit !== null && options.limit !== undefined) {
      this._options.limit = getLimit(options);
    }

    if (options.ttl !== null && options.ttl !== undefined) {
      validateTtl(options.ttl);
      this._options.ttl = options.ttl;
    }

    if (options.persistent !== null && options.persistent !== undefined) {
      if (typeof options.persistent !== "boolean") {
        throw new Error("persistent options must be string");
      }
      this._options.persistent = options.persistent;
      this.isLoaded = !this._options.persistent;
    } else {
      this._options.persistent = false;
    }

    this.load();
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
   * Load all stored cache
   */
  load() {
    const self = this;
    storage.all()
      .then((result) => {
        for (const key in result) {

          // Remove expired load cache
          if ((result[key].ttl !== null && result[key].ttl !== undefined) && Date.now() >= result[key].expireAt) {
            storage.delete(key);
            continue;
          }

          const {
            value,
            ttl,
            expireAt
          } = result[key];

          self._memory[key] = new CacheControl(
            value,
            ttl
              ? setTimeout(() => this.delete(key), ttl)
              : null,
            ttl
              ? expireAt
              : null
          );
        }
        this.isLoaded = true;
        this.emit("load");
      })
      .catch(err => {
        throw err;
      });
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
    const expireAt = Date.now() + expireMls;

    this._memory[key] = new CacheControl(
      value,
      ttl
        ? setTimeout(() => this.delete(key), expireMls)
        : null,
      ttl
        ? expireAt
        : null
    );

    if (this._options.persistent) {
      return storage.save(key, {
        key,
        value,
        ttl: ttl ? expireMls : null,
        expireAt: ttl ? expireAt : null
      });
    }
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
    const expireAt = Date.now() + expireMls;

    this._memory[key] = new CacheControl(
      value,
      ttl
        ? setTimeout(() => this.delete(key), expireMls)
        : null,
      ttl
        ? expireAt
        : null
    );

    if (this._options.persistent) {
      return storage.save(key, {
        key,
        value,
        ttl: ttl ? expireMls : null,
        expireAt: ttl ? expireAt : null
      });
    }
  }

  /**
	 * Clean all cached values
	 */
  clean() {
    for (const key in this._memory) {
      this.delete(key);
    }
  }

  /**
	 * Check if exists one cache
	 * @param {string} key
	 */
  has(key) {
    checkValidKey(key);
    return Boolean(this._memory[key]);
  }

  /**
	 * Get from value from cache
	 * @param {string} key
	 */
  get(key) {

    checkValidKey(key);

    const cached = this._memory[key];

    if (!cached) {
      return null;
    }

    return this._memory[key].value;
  }

  removeTtl(key) {
    checkValidKey(key);
    if (this.has(key) && this._memory[key].timeout) {
      clearTimeout(this._memory[key].timeout);
    }
  }

  /**
	 * Remove from cache
	 * @param {string} key
	 */
  delete(key) {
    checkValidKey(key);
    this.removeTtl(key);

    if (this._options.persistent) {
      storage.delete(key);
    }

    delete this._memory[key];
  }

  /**
	 * Get all cached keys
	 * @returns {string[]}
	 */
  keys() {
    return Object.keys(this._memory);
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
    for (const key in this._memory) {
      bytes += MemoryManager.getSize(this._memory[key].value);
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



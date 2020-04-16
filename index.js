class CacheControl {
	constructor (value, timeout, expireAt) {
		this.value = value;
		this.timeout = timeout;
		this.expireAt = expireAt;
	}
}

function validateTtl(ttl) {
	if (typeof ttl !== "number") {
		throw new Error("Property key it's not a number");
	}

	if (ttl < 0) {
		throw new Error(`Expiration time '${ttl}' can't be negative`);
	}
}

class JustCache {
	constructor (options = {}) {

		this._data = {};
		this._options = {};

		if (options.ttl !== null && options.ttl !== undefined) {
			validateTtl(options.ttl);

			this._options.ttl = options.ttl;
		}

		this._options.ttl = options.ttl;
	}

	put(key, value, ttl) {
		if (typeof key !== "string" || key.length === 0) {
			throw new Error("Property key it's not a string");
		}

		if (value === null) {
      throw new Error("Can't set 'null' to cache value");
    } else if (value === undefined) {
      throw new Error("Can't set 'undefined' to cache value");
		}

		if (ttl !== null && ttl !== undefined) {
			validateTtl(ttl);
		}

		if (ttl === 0) {
			return;
		}

		if (this.has(key) && this._data[key].timeout) {
			clearTimeout(this._data[key].timeout);
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

	set(key, value, ttl) {

		if (typeof key !== "string" || key.length === 0) {
			throw new Error("Property key it's not a string");
		}

		if (this.has(key)) {
			throw new Error(`Cache already ${key} already exists. To update use put`);
		}

		if (value === null) {
      throw new Error("Can't set 'null' to cache value");
    } else if (value === undefined) {
      throw new Error("Can't set 'undefined' to cache value");
		}

		if (ttl !== null && ttl !== undefined) {
			validateTtl(ttl);
		}

		if (ttl === 0) {
			return;
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

	clean() {
		for (const key in this._data) {
			this.delete(key);
		}
	}

	has(key) {

		if (typeof key !== "string" || key.length === 0) {
			throw new Error("Property key it's not a string");
		}

		return this._data.hasOwnProperty(key);
	}

	get(key) {

		if (typeof key !== "string" || key.length === 0) {
			throw new Error("Property key it's not a string");
		}

		const cached = this._data[key];

		if (!cached) {
			return null;
		}

		return this._data[key].value;
	}

	delete(key) {
		if (typeof key !== "string" || key.length === 0) {
			throw new Error("Property key it's not a string");
		}
		if (this.has(key) && this._data[key].timeout) {
			clearTimeout(this._data[key].timeout);
		}
		delete this._data[key];
	}

	keys() {
		return Object.keys(this._data);
	}

	count() {
		return this.keys().length;
	}
}

module.exports = JustCache;



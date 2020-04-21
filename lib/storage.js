const fs = require("fs");
const crypto = require("crypto");

const defaults = {
  local: './.cache',
  encoding: 'utf8',
};

/**
 * Encrypt string to MD5
 * @param {string} key
 */
function md5(text) {
  return crypto.createHash('md5')
    .update(text)
    .digest('hex');
}

/**
 * Persistent Storage @class
 */
class Storage {

  constructor(options = {}) {
    this._options = {
      ...defaults,
      ...options
    };
  }

  /**
   * Storage values
   * @param {string} key
   * @param {*} value
   */
  save(key, value) {

    if (!fs.existsSync(this._options.local)){
      fs.mkdirSync(this._options.local);
    }

    const content = {
      key,
      value
    };

    return new Promise((resolve, reject) => {
      fs.writeFile(`${this._options.local}/${md5(key)}`, JSON.stringify(content), this._options.encoding, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(content);
      });
    });

  }

  /**
   * Read stored cache by filename
   * @param {string} filename
   */
  readFile(filename) {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, this._options.encoding, (err, text) => {
        if (err) {
          /* Only throw the error if the error is something else other than the file doesn't exist */
          if (err.code === 'ENOENT') {
            resolve(null);
          } else {
            reject(err);
          }
          return;
        }

        resolve(JSON.parse(text));
      });
    });
  }

  /**
   * Get cache from file by key
   * @param {string} key
   */
  get(key) {
    const safe = this;
    return new Promise((resolve, reject) => {
      safe.readFile(`${this._options.local}/${md5(key)}`)
        .then(content => {
          const parsed = JSON.parse(content);
          resolve(parsed.value);
        })
        .catch(err => {
          if (err) {
            if (err.code === 'ENOENT') {
              resolve(null);
            } else {
              reject(err);
            }
            return;
          }
        });
    });
  }

  /**
   * Remove cache from storage by key
   * @param {string} key
   */
  delete(key) {

    const filePath = `${this._options.local}/${md5(key)}`;

    return new Promise((resolve, reject) => {
      fs.exists(filePath, (exists) => {
        if (exists) {
          fs.unlink(filePath, (err) => {
            /* Only throw the error if the error is something else */
            if (err && err.code !== 'ENOENT') {
              return reject(err);
            }

            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Get local file names
   */
  files() {
    return new Promise((resolve, reject) => {
      fs.readdir(this._options.local, (err, files) => {

        if (err) {
          return reject(err);
        }

        resolve(files);
      });
    });
  }

  /**
   * Get all stored caches
   */
  all() {
    const safe = this;
    return new Promise((resolve, reject) => {
      safe.files()
        .then(async files => {
          const all = {};
          for (const file of files) {
            const content = await safe.readFile(`${this._options.local}/${file}`);
            all[content.key] = content.value;
          }
          resolve(all);
        })
        .catch(reject);
    });
  }
}

module.exports = Storage;



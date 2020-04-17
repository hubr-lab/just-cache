/* !
* just-cache
* Copyright(c) 2020 Gleisson Mattos
* http://github.com/gleissonmattos
*
* Licensed under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/

const JustCache = require("..");
const faker = require("faker");

describe("Just Cache get", () => {

  test("Should success get setted cache", () => {
    const cache = new JustCache();
    const key = faker.random.word();
    const value = faker.random.word();

    cache.set(key, value);
    expect(cache.get(key)).toBe(value);
  });

  test("Should success get not existing cache", () => {
    const cache = new JustCache();
    expect(cache.get("not")).toBeNull();
  });

  test("Should fail to invalid key value", () => {
    const cache = new JustCache();

    expect(() => cache.get({})).toThrowError(Error);
    expect(() => cache.get(25)).toThrowError(Error);
    expect(() => cache.get([])).toThrowError(Error);
    expect(() => cache.get("")).toThrowError(Error);
    expect(() => cache.get(null)).toThrowError(Error);
    expect(() => cache.get(undefined)).toThrowError(Error);
    expect(() => cache.get(new JustCache())).toThrowError(Error);
  });
});

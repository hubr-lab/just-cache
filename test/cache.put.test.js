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

describe("Just Cache put", () => {

  test("Should success cache put", () => {
    const cache = new JustCache();
    const key = faker.random.word();
    const value = faker.random.word();

    cache.put(key, value);
    expect(cache.has(key)).toBeTruthy();
  });

  test("Should success cache put object", () => {
    const cache = new JustCache();
    const key = faker.random.word();
    const message = faker.random.words(5);

    cache.put(key, {
      message
    });

    expect(cache.has(key)).toBeTruthy();
    expect(cache.get(key)).toMatchObject({
      message
    });
  });

  test("Should success cache put with ttl", () => {
    const cache = new JustCache();
    const key = faker.random.word();
    const value = faker.random.word();

    cache.put(key, value, 10);
    expect(cache.has(key)).toBeTruthy();
  });

  test("Should success cache put with undefined ttl", () => {
    const cache = new JustCache();
    const key = faker.random.word();
    const key2 = faker.random.word();
    const value = faker.random.word();

    cache.put(key, value, undefined);
    expect(cache.has(key)).toBeTruthy();

    cache.put(key2, value, null);
    expect(cache.has(key2)).toBeTruthy();
  });

  test("Should success cache put with ttl zero expired", (done) => {
    const cache = new JustCache();
    const key = faker.random.word();
    const value = faker.random.word();

    cache.put(key, value, 0);
    setTimeout(() => {
      expect(cache.has(key)).toBe(false);
      done();
    }, 0);
  });

  test("Should success cache put with ttl expiration", (done) => {
    const cache = new JustCache();
    const key = faker.random.word();
    const value = faker.random.word();

    cache.put(key, value, 1);
    expect(cache.has(key)).toBeTruthy();

    setTimeout(() => {
      expect(cache.has(key)).toBe(false);
      done();
    }, 2000);
  });

  test("Should fail to existent cache", () => {
    const cache = new JustCache();
    const key = faker.random.word();
    const value = faker.random.word();

    cache.put(key, value, 5);
    cache.put(key, "another value", 3);
    expect(cache.has(key)).toBeTruthy();
  });

  test("Should fail to invalid key value", () => {
    const cache = new JustCache();

    expect(() => cache.put({}, "must fail")).toThrowError(Error);
    expect(() => cache.put(25, "must fail")).toThrowError(Error);
    expect(() => cache.put([], "must fail")).toThrowError(Error);
    expect(() => cache.put("", "must fail")).toThrowError(Error);
    expect(() => cache.put(null, "must fail")).toThrowError(Error);
    expect(() => cache.put(undefined, "must fail")).toThrowError(Error);
    expect(() => cache.put(new JustCache(), "must fail")).toThrowError(Error);
  });

  test("Should fail to invalid cache value", () => {
    const cache = new JustCache();

    expect(() => cache.put("cache1")).toThrowError(Error);
    expect(() => cache.put("cache2", null)).toThrowError(Error);
    expect(() => cache.put("cache2", undefined)).toThrowError(Error);
  });

  test("Should fail to invalid ttl", () => {
    const cache = new JustCache();
    const key = faker.random.word();

    expect(() => cache.put(cache, key, "must fail", -20)).toThrowError(Error);
    expect(() => cache.put(cache, key, "must fail", -1)).toThrowError(Error);
    expect(() => cache.put(cache, key, "must fail", {})).toThrowError(Error);
    expect(() => cache.put(cache, key, "must fail", [])).toThrowError(Error);
    expect(() => cache.put(cache, key, "must fail", " --- ")).toThrowError(Error);
  });

  test("Should success with size control", () => {
    const cache = new JustCache({
      limit: 19
    });

    cache.put("value1", "var");
    cache.put("value2", "anot");
    cache.put("value3", "sss");

    expect(cache.get("value1")).toBeNull();
    expect(cache.size()).toBe(14);
    expect(cache.count()).toBe(2);
  });
});

/*!
* just-cache
* Copyright(c) 2020 Gleisson Mattos
* http://github.com/gleissonmattos
*
* Licensed under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/

const JustCache = require("..");
const faker = require("faker");

describe("Just Cache delete", () => {

	test("Should delete from just cache", () => {
		const cache = new JustCache();
		const key = faker.random.word();
		const value = faker.random.word();

		cache.set(key, value);

		cache.delete(key);
		expect(cache.has(key)).not.toBeTruthy();
	});

	test("Should fail to invalid key", () => {
		const cache = new JustCache();

		expect(() => cache.delete({})).toThrowError(Error);
		expect(() => cache.delete(25)).toThrowError(Error);
		expect(() => cache.delete([])).toThrowError(Error);
		expect(() => cache.delete(null)).toThrowError(Error);
		expect(() => cache.delete(undefined)).toThrowError(Error);
		expect(() => cache.delete(new JustCache())).toThrowError(Error);
	});
});
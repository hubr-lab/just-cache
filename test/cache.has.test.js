const JustCache = require("..");
const faker = require("faker");

describe("Just Cache get", () => {

	test("Should success get setted cache", () => {
		const cache = new JustCache();
		const key = faker.random.word();
		const value = faker.random.word();

		cache.set(key, value);
		expect(cache.has(key)).toBeTruthy();
	});

	test("Should fail to invalid key value", () => {
		const cache = new JustCache();

		expect(() => cache.has({})).toThrowError(Error);
		expect(() => cache.has(25)).toThrowError(Error);
		expect(() => cache.has([])).toThrowError(Error);
		expect(() => cache.has("")).toThrowError(Error);
		expect(() => cache.has(null)).toThrowError(Error);
		expect(() => cache.has(undefined)).toThrowError(Error);
		expect(() => cache.has(new JustCache())).toThrowError(Error);
	});
});
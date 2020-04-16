const JustCache = require("..");
const faker = require("faker");

describe("Just Cache clean", () => {

	test("Should success to clean all cache", () => {
		const cache = new JustCache();
		const key = faker.random.word();
		const value = faker.random.word();

		cache.set(key, value);
		expect(cache.length).toBe(1);
	});
});
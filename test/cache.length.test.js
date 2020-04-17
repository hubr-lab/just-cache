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

describe("Just Cache count", () => {

  test("Should count the cache stored keys", () => {
    const cache = new JustCache();
    const key = faker.random.word();
    const value = faker.random.word();

    cache.set(key, value);
    expect(cache.count()).toBe(1);
  });
});

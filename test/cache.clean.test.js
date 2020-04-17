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

describe("Just Cache clean", () => {

  test("Should success to clean all cache", () => {
    const cache = new JustCache();
    const key = faker.random.word();
    const value = faker.random.word();

    cache.set(key, value);
    cache.clean();
    expect(cache.has(key)).not.toBeTruthy();
    expect(cache.count()).toBe(0);
  });
});

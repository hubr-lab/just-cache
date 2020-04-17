/* !
* just-cache
* Copyright(c) 2020 Gleisson Mattos
* http://github.com/gleissonmattos
*
* Licensed under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/

const JustCache = require("..");

describe("Just Cache instance", () => {

  test("Should return valid Just Cache instance", () => {
    expect(new JustCache()).toBeTruthy();
  });

  test("Should return valid Just Cache instance with ttl", () => {
    expect(new JustCache({ ttl: 5 })).toBeTruthy();
  });
});

describe("Just Cache instance validations", () => {

  test("Should fail to invalid ttl", () => {
    expect(() => new JustCache({ ttl: -55 })).toThrowError(Error);
  });

  test("Should fail to invalid ttl", () => {
    expect(() => new JustCache({ ttl: {} })).toThrowError(Error);
    expect(() => new JustCache({ ttl: -25 })).toThrowError(Error);
    expect(() => new JustCache({ ttl: [] })).toThrowError(Error);
    expect(() => new JustCache({ ttl: "25" })).toThrowError(Error);
    expect(() => new JustCache({ ttl: new JustCache() })).toThrowError(Error);
  });
});

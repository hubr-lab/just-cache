/* !
* just-cache
* Copyright(c) 2020 Gleisson Mattos
* http://github.com/gleissonmattos
*
* Licensed under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/
const JustCache = require("..");

describe("Just Cache size", () => {

  test("Should returns valid only string size", () => {
    const cache = new JustCache();

    cache.put("key", "Message");

    expect(cache.size()).toBe(14);
    expect(cache.sizeText()).toBe("14 bytes");
  });

  test("Should returns valid only Buffer size", () => {
    const cache = new JustCache();

    cache.put("key", new Buffer("this is one buffer"));

    expect(cache.size()).toBe(18);
    expect(cache.sizeText()).toBe("18 bytes");
  });

  test("Should returns valid only boolean size", () => {
    const cache = new JustCache();

    cache.put("key", true); // 4 bytes
    cache.put("key2", false); // 4 bytes

    expect(cache.size()).toBe(8);
    expect(cache.sizeText()).toBe("8 bytes");
  });

  test("Should returns valid only Symbol size", () => {
    const cache = new JustCache();

    cache.put("key", Symbol("foo")); // 4 bytes

    expect(cache.size()).toBe(6);
    expect(cache.sizeText()).toBe("6 bytes");
  });

  test("Should returns 0 to empty cache", () => {
    const cache = new JustCache();
    expect(cache.size()).toBe(0);
    expect(cache.sizeText()).toBe("0 bytes");
  });

  test("Should returns valid two data string size", () => {
    const cache = new JustCache();

    cache.put("key", "Message");
    cache.put("key2", "me");

    expect(cache.size()).toBe(18);
    expect(cache.sizeText()).toBe("18 bytes");
  });

  test("Should returns valid cache size", () => {
    const cache = new JustCache();

    cache.put("key", {
      field1: "Valeu 0",
      field2: "Lorem I.",
      field3: "  ",
      field4: 12,
      field5: [],
      field6: ["a"],
      field7: {
        intoField1: "object"
      }
    });

    cache.put("key2", {});
    cache.put("key3", "222");
    cache.put("key4", 54654564);

    expect(cache.size()).toBe(70);
    expect(cache.sizeText()).toBe("70 bytes");
  });
});

const Just = require("..");

describe("Cache control test", () => {
  test("Limit flow", () => {
    const cache = new Just({
      limit: 30
    });

    cache.set("a", "abcdfg");
    cache.set("b", "asd");
    cache.set("c", { b: "gleisson"} );
    cache.set("d", 45454);
    cache.set("e", "3ss");
    cache.set("f", "asdfdsafwrekwj");

    expect(cache.count()).toBe(1);
    expect(cache.size()).toBe(28);
  });
});


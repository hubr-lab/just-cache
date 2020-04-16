Just Cache
===========
Simple memory cache storage

```js

const JustCache = require("just-cache");

const cache = new JustCache();

cache.set("message", "this text message");
cache.put("message", "this new message");

cache.get("message"); // "this new message";

```

Set TTL on storage cache


```js
const cache = new JustCache({
    ttl: 10 // seconds
});

cache.set("message", "without me");
cache.set("another", "with me", 30 /* seconds */);
cache.get("message"); // 'with me'

// ... after 10 seconds:
cache.get("message"); // null
cache.has("message"); // false
cache.count(); // 1

cache.get("another"); // 'with me'


```

Check cache size:

```js
cache.set("message", "this");
cache.size(); // 8
cache.sizeText(); // '8 bytes'

```
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

Set memory storage bytes limit.
If new values ​​exceed the memory limit, the first key in the queue will be removed during the sending of the new value.

```js
const cache = new JustCache({
    limit: 100 // in bytes
});

```

Check cache size:

```js
cache.set("message", "this");
cache.size(); // 8
cache.sizeText(); // '8 bytes'

```

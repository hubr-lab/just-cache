Just Cache
===========
Simple in-memory cache manager and controller for Node JS with TTL and storage size limit.


```js

const Just = require("just-cache");

const cache = new Just();

cache.set("message", "this text message");
cache.put("message", { foo: "bar" });
cache.set("message", true);

cache.get("message"); // { foo: "bar" };

```

## Installation

Installation is easy with the [npm](https://www.npmjs.com) command

```bash
$ npm install just-cache --save
```

## Features

- Cache manager with basic and simples commands.
- Storage size info.
- High test coverage.
- Automatic storage limit management.

## Usage

#### put (key, value, ttl)

Set or update cache value.

#### set (key, value, ttl)

Add a new cache. If the cache key already exists, will not set the value.

#### get (key)

Return the value stored.

#### size ()

Return the stored cache size. (value in bytes).

#### sizeText ()

Return the stored formated size string.

#### clean ()

Clean all stored cache.

#### has (key)

Check if contains stored key cache.

#### delete (key)

Remove existing cache by key.

#### keys ()

Get all stored keys.

#### count ()

Count all stored keys.

## Examples

Set TTL on storage cache

```js
const cache = new Just({
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
const cache = new Just({
    limit: 100 // in bytes
});

```

Check cache size:

```js
cache.set("message", "this");
cache.size(); // 8
cache.sizeText(); // '8 bytes'

```

## Options

- ***ttl*** - General ttl value. Case use set or put with TTL this option will be ignored.
- ***limit*** - Storage size limit in bytes.

## TODO

- Actions callbacks.
- Info logger option.

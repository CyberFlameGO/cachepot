# cachepot &middot; [![Build Status](https://img.shields.io/travis/JasonEtco/cachepot/master.svg)](https://travis-ci.org/JasonEtco/cachepot) [![Codecov](https://img.shields.io/codecov/c/github/JasonEtco/cachepot.svg)](https://codecov.io/gh/JasonEtco/cachepot/)

Itsy-bitsy cache module. Smells as good as flowers.

## Usage

**Cachepot** has almost the same external-facing API as the [ES6 Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), but with some additional methods and configuration options.

```js
const cache = new Cachepot()
cache.set('key', 'value')
cache.get('key')
cache.wrap('key', () => 'value')
```

#### `new Cachepot(options)`

| Key | Description | Default |
| --- | ----------- | ------- |
| `ttl` | Time in milliseconds until the key/value pair expires. | `60 x 60` |

#### `cache.wrap(key, callback)`

This method will either return the value if it exists, or set a new one by calling the callback function. The return value of the function will be set as the new value for the `key`.

```js
const cache = new Cachepot()
cache.wrap('key', () => {
  const value = createComplicatedObject()
  return value
})
```

#### `cache.set(key, value, ttl)`

This method has the same API as `Map.set()`, but with an additional optional `ttl` argument. This will override the configured TTL option.
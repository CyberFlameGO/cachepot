class Cachepot extends Map {
  /**
   * @param {CacheOptions} opts
   */
  constructor (opts) {
    super()
    this.opts = Object.assign({}, { ttl: 60 * 60 }, opts)
    this.timers = new Map()
  }

  /**
   * Adds a new timer
   * @param {*} key - Key for the cache
   * @param {number} [ttl] - When the key/value pair will expire, in milliseconds. Defaults to 1 hour.
   * @private
   */
  addTimer (key, ttl) {
    const timer = setTimeout(() => {
      super.delete(key)
    }, ttl || this.opts.ttl)
    this.timers.set(key, timer)
  }

  /**
   * Delete a timer
   * @param {*} key - Key for the cache
   * @private
   */
  deleteTimer (key) {
    const timer = this.timers.get(key)
    if (timer) {
      clearTimeout(timer)
      this.timers.delete(key)
    }
  }

  /**
   * Clear the internal Map and the timers
   */
  clear () {
    super.clear()
    this.timers.clear()
  }

  /**
   * Delete a key/value pair and the associated timer
   * @param {*} key - Key to delete from the cache
   */
  delete (key) {
    super.delete(key)
    this.deleteTimer(key)
  }

  /**
   * Add a new key/value pair
   * @param {*} key - Key for the cache
   * @param {*} value - Value
   * @param {number} [ttl] - When it should expire in milliseconds.
   * Defaults to `opts.ttl` or 1 hour.
   */
  set (key, value, ttl) {
    this.deleteTimer(key)
    super.set(key, value)
    this.addTimer(key, ttl)
  }

  /**
   * Returns a value if it exists, or runs the callback to set the value.
   * @param {*} key - Key for the cache
   * @param {function} cb - Callback function that runs if the cache
   * does not already have an item with that key. The return value
   * from the callback will be used to set the value for the key.
   */
  wrap (key, cb) {
    // It already has the key, so return it
    if (super.has(key)) return super.get(key)

    // It does not have the key, so run the cb function
    const value = cb()
    this.set(key, value)
    return value
  }
}

module.exports = Cachepot

/**
 * @typedef CacheOptions
 * @property {number} ttl
 */

const Cache = require('../lib/index')

describe('cache', () => {
  let cache

  beforeEach(() => {
    jest.useFakeTimers()
    cache = new Cache()
  })

  describe('clear', () => {
    it('clears the cache and the timers', () => {
      [1, 2, 3, 4].forEach(n => cache.set(n, n))
      cache.clear()
      expect(cache.size).toBe(0)
      expect(cache.timers.size).toBe(0)
    })
  })

  describe('delete', () => {
    it('deletes key/value from the cache and clears the timer', () => {
      cache.set('key', 'value')
      cache.delete('key')
      expect(cache.has('key')).toBeFalsy()
      expect(clearTimeout).toHaveBeenCalledTimes(1)
    })
  })

  describe('set', () => {
    it('adds a new key/value pair to the cache', () => {
      cache.set('key', 'value')
      expect(cache.get('key')).toBe('value')
    })

    it('updates an existing key/value', () => {
      cache.set('key', 'value')
      expect(cache.get('key')).toBe('value')

      cache.set('key', 'pizza')
      expect(cache.get('key')).toBe('pizza')

      expect(clearTimeout).toHaveBeenCalledTimes(1)
      expect(setTimeout).toHaveBeenCalledTimes(2)
    })

    it('deletes a cached item after 1 hour', () => {
      cache.set('key', 'value')

      // Fast-forward until all timers have been executed
      jest.runAllTimers()

      expect(cache.get('key')).toBe(undefined)
    })

    it('respects the ttl param', () => {
      cache.set('key', 'value', 12)
      expect(setTimeout.mock.calls[0][1]).toBe(12)
    })
  })

  describe('wrap', () => {
    it('gets if it already exists', () => {
      const spy = jest.fn()
      cache.set('key', 'value')

      const res = cache.wrap('key', spy)
      expect(res).toBe('value')
      expect(spy).not.toHaveBeenCalled()
    })

    it('runs the callback if it does not exist', () => {
      const spy = jest.fn(() => 'pizza')
      const res = cache.wrap('key', spy)

      expect(res).toBe('pizza')
      expect(cache.get('key')).toBe('pizza')
      expect(spy).toHaveBeenCalled()
    })
  })
})

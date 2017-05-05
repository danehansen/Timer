import Timer from '../src/Timer'
import { expect } from 'chai'
import { spy } from 'sinon'

describe('Timer', function() {
  describe('constructor', function() {
    it('instantiates instance with default repeatCount', function() {
      const delay = Math.random() * 1000
      const t = new Timer(delay)

      expect(t.delay()).to.equal(delay)
      expect(t.repeatCount).to.equal(0)
      expect(t.currentCount).to.equal(0)
      expect(t.running).to.be.false
      expect(t._timeLeft).to.equal(delay)
    })

    it('instantiates instance with supplied repeatCount', function() {
      const delay = Math.random() * 1000
      const repeatCount = Math.round(Math.random() * 1000)
      const t = new Timer(delay, repeatCount)

      expect(t.delay()).to.equal(delay)
      expect(t.repeatCount).to.equal(repeatCount)
      expect(t.currentCount).to.equal(0)
      expect(t.running).to.be.false
      expect(t._timeLeft).to.equal(delay)
    })
  })

  describe('currentCount', function() {
    it('gets correct currentCount', function(done) {
      const repeat = 5
      const t = new Timer(2, 5)
      const s = spy()
      expect(t.currentCount).to.equal(0)
      t.start()
      t.addEventListener(Timer.TIMER, (evt) => {
        s()
        expect(t.currentCount).to.equal(s.callCount)
        if (t.currentCount === repeat) {
          done()
        }
      })
    })
  })

  describe('delay', function() {
    it('gets correct delay', function() {
      const d = 2
      const t = new Timer(d)
      expect(t.delay()).to.equal(d)
    })

    it('changes delay amount while running', function(done) {
      const d = 10
      const t = new Timer(d, 5)
      const nows = []
      const multiplier = 1.5
      t.addEventListener(Timer.TIMER, () => {
        nows.push(Date.now())
        const { currentCount } = t
        const odd = currentCount % 2
        if (currentCount > 3) {
          const diff = nows[currentCount - 1] - nows[currentCount - 2]
          const lastDiff = nows[currentCount - 2] - nows[currentCount - 3]
          if (odd) {
            expect(diff).to.be.below(lastDiff)
          } else {
            expect(diff).to.be.above(lastDiff)
          }
        }
        if (odd) {
          expect(t.delay()).to.equal(d)
          t.delay(d * multiplier)
          expect(t.delay()).to.equal(d * multiplier)
        } else {
          expect(t.delay()).to.equal(d * multiplier)
          t.delay(d)
          expect(t.delay()).to.equal(d)
        }
      })
      t.addEventListener(Timer.TIMER_COMPLETE, () => {
        done()
      })
      t.start()
    })

    it('changes delay amount while stopped', function(done) {
      const t = new Timer(10, 6)
      const s = spy()
      t.addEventListener(Timer.TIMER, () => {
        s()
        if (t.currentCount === 3) {
          t.stop()
          t.delay(40)
          setTimeout(() => {
            expect(t.currentCount).to.equal(3)
            setTimeout(() => {
              expect(t.currentCount).to.equal(5) //check behavior of flash
              done()
            }, 50)
            t.start()
          }, 50)
        }
      })
      t.start()
    })
  })

  describe('repeatCount', function() {
    it('get correct repeatCount', function(done) {
      const repeat = 5
      const t = new Timer(2, repeat)
      const s = spy()
      t.addEventListener(Timer.TIMER, () => {
        s()
      })
      t.addEventListener(Timer.TIMER_COMPLETE, () => {
        expect(t.repeatCount).to.equal(repeat)
        expect(s.callCount).to.equal(repeat)
        done()
      })
      t.start()
    })

    it('sets repeatCount', function(done) {
      const t = new Timer(2, 4)
      const repeat = 8
      const s = spy()
      t.addEventListener(Timer.TIMER, () => {
        s()
        if (t.currentCount === 3) {
          t.repeatCount = repeat
        }
      })
      t.addEventListener(Timer.TIMER_COMPLETE, () => {
        expect(t.repeatCount).to.equal(repeat)
        expect(s.callCount).to.equal(repeat)
        done()
      })
      t.start()
    })
  })

  describe('running', function() {
    it('reveals when is running', function(done) {
      const t = new Timer(2, 3)
      expect(t.running).to.equal(false)
      t.start()
      expect(t.running).to.equal(true)
      t.addEventListener(Timer.TIMER_COMPLETE, () => {
        expect(t.running).to.equal(false)
        done()
      })
    })
  })

  describe('reset', function() {
    it('resets and stops timer while running', function(done) {
      const t = new Timer(2, 5)
      t.start()
      expect(t.running).to.equal(true)
      t.addEventListener(Timer.TIMER, () => {
        expect(t.running).to.equal(true)
        expect(t.currentCount).to.equal(1)
        t.reset()
        expect(t.running).to.equal(false)
        expect(t.currentCount).to.equal(0)
        done()
      })
    })

    it('resets and stops timer while running', function(done) {
      const t = new Timer(2, 5)
      t.start()
      expect(t.running).to.equal(true)
      t.addEventListener(Timer.TIMER, () => {
        expect(t.running).to.equal(true)
        t.stop()
        expect(t.running).to.equal(false)
        expect(t.currentCount).to.equal(1)
        t.reset()
        expect(t.running).to.equal(false)
        expect(t.currentCount).to.equal(0)
        done()
      })
    })
  })

  describe('start', function() {
    it('starts timer when stopped', function(done) {
      const t = new Timer(2, 5)
      expect(t.running).to.equal(false)
      t.start()
      expect(t.running).to.equal(true)
      t.addEventListener(Timer.TIMER, () => {
        expect(t.running).to.equal(true)
        t.stop()
        done()
      })
    })

    it('does nothing while running', function(done) {
      const t = new Timer(2, 5)
      expect(t.running).to.equal(false)
      t.start()
      expect(t.running).to.equal(true)
      t.addEventListener(Timer.TIMER, () => {
        expect(t.running).to.equal(true)
        t.start()
        expect(t.running).to.equal(true)
        t.stop()
        done()
      })
    })
  })

  describe('stop', function() {
    it('stops timer while running', function(done) {
      const t = new Timer(2, 5)
      const s = spy()
      expect(t.running).to.equal(false)
      t.start()
      expect(t.running).to.equal(true)
      t.addEventListener(Timer.TIMER, () => {
        s()
        t.stop()
        expect(t.running).to.equal(false)
        expect(s.callCount).to.equal(1)
        done()
      })
    })

    it('does nothing while stopped', function(done) {
      const t = new Timer(2, 5)
      const s = spy()
      expect(t.running).to.equal(false)
      t.start()
      expect(t.running).to.equal(true)
      t.addEventListener(Timer.TIMER, () => {
        s()
        t.stop()
        expect(t.running).to.equal(false)
        expect(s.callCount).to.equal(1)
        t.stop()
        expect(t.running).to.equal(false)
        expect(s.callCount).to.equal(1)
        done()
      })
    })
  })

  describe('destroy', function() {
    it('stops the timer', function(done) {
      const s = spy()
      const t = new Timer(2)
      t.addEventListener(Timer.TIMER, spy)
      t.start()
      t.destroy()

      setTimeout(function() {
        expect(t.running).to.equal(false)
        expect(s.callCount).to.equal(0)
        done()
      }, 10)
    })

    it('removes event listeners', function(done) {
      const t = new Timer(2)
      function noop() {
        // do nothing
      }
      t.addEventListener(Timer.TIMER, noop)
      t.start()
      expect(t._callbacks).to.deep.equal({
        [Timer.TIMER]: [noop],
      })

      t.destroy()

      setTimeout(function() {
        expect(t._callbacks).to.deep.equal({})
        done()
      }, 10)
    })
  })
})

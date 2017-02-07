const EventDispatcher = typeof __BROWSER__ === 'undefined' ? require('@danehansen/event-dispatcher').default : (((window || {}).danehansen || {}).EventDispatcher || {})

export default class Timer extends EventDispatcher {
	static TIMER = 'TIMER'
	static TIMER_COMPLETE = 'TIMER_COMPLETE'

	constructor(delay, repeatCount = 0) {
		super()

		this._currentCount = 0
		this._delay = delay
		this._lastTime = null
		this.repeatCount(repeatCount)
		this._running = false
		this._timeLeft = delay
		this._timeout = null
	}

	// getters/setters

		currentCount = () => {
			return this._currentCount
		}

		delay = (num) => {
			if (typeof num === 'number') {
				this._delay = num
				if (this._running) {
					this.stop()
					this._timeLeft = this._delay
					this.start()
				}
			} else {
				return this._delay
			}
		}

		repeatCount = (num) => {
			if (typeof num === 'number') {
				this._repeatCount = num
			} else {
				return this._repeatCount
			}
		}

		running = () =>  {
			return this._running
		}

	//methods

		//public

			reset = () => {
				this.stop()
				this._timeLeft = this._delay
				this._currentCount = 0
			}

			start = () => {
				if (!this._running) {
					this._running = true
					this._increment()
				}
			}

			stop = () => {
				if (this._running) {
					clearTimeout(this._timeout)
					this._timeLeft = this._delay - Date.now() + this._lastTime
					this._running = false
				}
			}

		//private

			_increment = () => {
				this._lastTime = Date.now()
				this._timeout = setTimeout(this._onTimer, this._timeLeft)
				this._timeLeft = this._delay
			}

			_onTimer = () => {
				this._currentCount++
				this.dispatchEvent(Timer.TIMER)
				if (this._running) {
					if (!this._repeatCount || this._currentCount < this._repeatCount) {
						this._increment()
					} else {
						this._onTimerComplete()
					}
				}
			}

			_onTimerComplete = () => {
				this._running = false
				this.dispatchEvent(Timer.TIMER_COMPLETE)
			}
}

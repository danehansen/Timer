'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventDispatcher = typeof __BROWSER__ === 'undefined' ? require('@danehansen/event-dispatcher').default : ((window || {}).danehansen || {}).EventDispatcher || {};

var Timer = function (_EventDispatcher) {
  _inherits(Timer, _EventDispatcher);

  function Timer(delay) {
    var repeatCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Timer);

    var _this = _possibleConstructorReturn(this, (Timer.__proto__ || Object.getPrototypeOf(Timer)).call(this));

    _this.delay = function (num) {
      if (num === undefined) {
        return _this._delay;
      }
      _this._delay = num;
      if (_this._running) {
        _this.stop();
        _this._timeLeft = _this._delay;
        _this.start();
      }
    };

    _this.reset = function () {
      _this.stop();
      _this._timeLeft = _this._delay;
      _this._currentCount = 0;
    };

    _this.start = function () {
      if (!_this._running) {
        _this._running = true;
        _this._increment();
      }
    };

    _this.stop = function () {
      if (_this._running) {
        clearTimeout(_this._timeout);
        _this._timeLeft = _this._delay - Date.now() + _this._lastTime;
        _this._running = false;
      }
    };

    _this.destroy = function () {
      // TODO write test for this
      _this.stop();
      _this.clearEventListeners();
    };

    _this._increment = function () {
      _this._lastTime = Date.now();
      _this._timeout = setTimeout(_this._onTimer, _this._timeLeft);
      _this._timeLeft = _this._delay;
    };

    _this._onTimer = function () {
      _this._currentCount++;
      _this.dispatchEvent(Timer.TIMER);
      if (_this._running) {
        if (!_this.repeatCount || _this._currentCount < _this.repeatCount) {
          _this._increment();
        } else {
          _this._onTimerComplete();
        }
      }
    };

    _this._onTimerComplete = function () {
      _this._running = false;
      _this.dispatchEvent(Timer.TIMER_COMPLETE);
    };

    _this._currentCount = 0;
    _this._delay = delay;
    _this._lastTime = null;
    _this.repeatCount = repeatCount;
    _this._running = false;
    _this._timeLeft = delay;
    _this._timeout = null;
    return _this;
  }

  // getters/setters

  _createClass(Timer, [{
    key: 'currentCount',
    get: function get() {
      return this._currentCount;
    }
  }, {
    key: 'running',
    get: function get() {
      return this._running;
    }

    //methods

    //public

    //private

  }]);

  return Timer;
}(EventDispatcher);

Timer.TIMER = 'TIMER';
Timer.TIMER_COMPLETE = 'TIMER_COMPLETE';
exports.default = Timer;

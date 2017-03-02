#Timer

__Class__ : public class [Timer](https://github.com/danehansen/Timer)  
__Inheritance__ : [Timer](https://github.com/danehansen/Timer) > [EventDispatcher](https://github.com/danehansen/EventDispatcher) > Object

The Timer class is the interface to setTimeout and setInterval, and is totally ripped off from the AS3 Timer class, but simplified. This class depends on EventDispatcher. Use the start() method to start a timer. Add an event listener for the timer event to set up code to be run on the timer interval.

You can create Timer objects to run once or repeat at specified intervals to execute code on a schedule.

##Installation

`npm install --save @danehansen/timer`

##Usage

As a module:

    import Timer from '@danehansen/timer';

    var t = new Timer(500);
    function onTimer(evt) {
      console.log(evt.target.currentCount());
    }
    t.addEventListener(Timer.TIMER, onTimer);

In your browser:

    <script src='danehansen-Timer.min.js'></script>
    <script>
      var Timer = window.danehansen.Timer;

      var t = new Timer(500);
      function onTimer(evt) {
        console.log(evt.target.currentCount());
      }
      t.addEventListener(Timer.TIMER, onTimer);
    </script>

##Public Constants

* __TIMER__ : String = 'TIMER'  
[static] The Timer.TIMER constant defines the value of the type property of a timer event object.
* __TIMER&#95;COMPLETE__ : String = 'TIMER&#95;COMPLETE'  
[static] The Timer.TIMER&#95;COMPLETE constant defines the value of the type property of a timerComplete event object.

##Public Properties
* __currentCount__ : int  
[read-only] The total number of times the timer has fired since it started at zero.
* __running__ : Boolean  
[read-only] The timer's current state; true if the timer is running, otherwise false.

##Public Methods

* __Timer__(delay:Number, repeatCount:int = 0)  
Constructs a new Timer object with the specified delay and repeatCount states.
* __delay__(value:Number):*  
Gets or sets the delay, in milliseconds, between timer events.
* __repeatCount__(value:int):*  
Gets or sets the total number of times the timer is set to run.
* __reset__()  
Stops the timer, if it is running, and sets the currentCount property back to 0, like the reset button of a stopwatch.
* __start__()  
Starts the timer, if it is not already running.
* __stop__()  
Stops the timer.

##Events

* __TIMER__  
Dispatched whenever a Timer object reaches an interval specified according to the Timer.delay property.
* __TIMER&#95;COMPLETE__  
Dispatched whenever it has completed the number of requests set by Timer.repeatCount.

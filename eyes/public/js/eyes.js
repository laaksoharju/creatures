/*jslint es5:true, indent: 2 */
/*global Vue, io */
/* exported vm */
'use strict';
var socket = io();

var beep = (function () {
  let frequency = 50;
  let period = 1/frequency;
  let ctxClass = window.AudioContext;
  let ctx = new ctxClass();
  return function (times, finishedCallback) {
    if (typeof finishedCallback !== "function") {
      finishedCallback = function () {};
    }
    let osc = ctx.createOscillator();
    let currentTime = ctx.currentTime;
    osc.type = "square";
    osc.frequency.value = frequency;

    osc.connect(ctx.destination);
    osc.start(currentTime);
    osc.stop(currentTime + period * times);

    setTimeout(function () {
      finishedCallback();
    }, period * times);
  };
})();

    var vm = new Vue({
      el: '#dots',
      data: {
        eyePos: {},
      },
      created: function () {
        /************
        HERE YOU CAN WRITE NEW LISTENERS IF YOU NEED
        ************/
        socket.on('move:eyes', function (data) {
          this.eyePos = data;
        }.bind(this));

        // The motor commands are transferred to the Arduino by sound pulses
        socket.on('move:motors', function (motors) {
          const {left, right} = motors;
          const letTheMoverKnowItHasBeenDone = function() {
            socket.emit('moved:motors', motors)
          }

          if (left && !right) {
            beep(1, letTheMoverKnowItHasBeenDone);
          }
          if (left && right) {
            beep(3, letTheMoverKnowItHasBeenDone);
          }
          if (!left && right) {
            beep(2, letTheMoverKnowItHasBeenDone);
          }
          if (!left && !right) {
            beep(4, letTheMoverKnowItHasBeenDone);
          }
        });
      }
    });

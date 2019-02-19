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
        socket.on('move:eyes', function (data) {
          this.eyePos = data;
        }.bind(this));
        socket.on('turn:left', function () {
          beep(1, function() {
            socket.emit('turned:left');
          });
        });
        socket.on('turn:right', function () {
          beep(2, function() {
            socket.emit('turned:right');
          });
        });
        socket.on('drive:forward', function () {
          beep(3, function() {
            socket.emit('drove:forward');
          });
        });
        socket.on('drive:backward', function () {
          beep(4, function() {
            socket.emit('drove:backward');
          });
        });
      }
    });

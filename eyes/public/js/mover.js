/*jslint es5:true, indent: 2 */
/*global Vue, io */
/* exported vm */
'use strict';
var socket = io();

var vm = new Vue({
  el: '#app',
  data: {
    eyePos: {},
    mouseDown: false,
    turned: ''
  },
  created: function () {
    socket.on('moved:motors', function (motors) {
      const {left, right} = motors;
      if (left && !right)
        this.turned = "LEFT";
      if (left && right)
        this.turned = "FORWARD";
      if (!left && right)
        this.turned = "RIGHT";
      if (!left && !right)
        this.turned = "BACKWARD";
    }.bind(this));
  },
  methods: {
    pressed: function () {
      this.mouseDown = true;
    },
    released: function () {
      this.mouseDown = false;
    },
    moveEyes: function (event) {
      var offset = {x: event.currentTarget.getBoundingClientRect().left,
                    y: event.currentTarget.getBoundingClientRect().top};
        if (this.mouseDown) {
          this.eyePos = { x: event.clientX - 10 - offset.x,
                          y: event.clientY - 10 - offset.y };
          socket.emit("move:eyes", this.eyePos);
        }
    },
    turnLeft: function () {
      socket.emit('move:motors', {left: true, right: false});
    },
    turnRight: function () {
      socket.emit('move:motors', {left: false, right: true});
    },
    driveForward: function () {
      socket.emit('move:motors', {left: true, right: true});
    },
    driveBackward: function () {
      socket.emit('move:motors', {left: false, right: false});
    },
  }
});

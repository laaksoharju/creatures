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
    socket.on('turned:left', function () {
      this.turned = "LEFT";
    }.bind(this));
    socket.on('turned:right', function () {
      this.turned = "RIGHT";
    }.bind(this));
    socket.on('drove:forward', function () {
      this.turned = "FORWARD";
    }.bind(this));
    socket.on('drove:backward', function () {
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
      socket.emit('turn:left');
    },
    turnRight: function () {
      socket.emit('turn:right');
    },
    driveForward: function () {
      socket.emit('drive:forward');
    },
    driveBackward: function () {
      socket.emit('drive:backward');
    },
  }
});

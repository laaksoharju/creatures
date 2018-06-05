/*jslint es5:true, indent: 2 */
/*global Vue, io */
/* exported vm */
'use strict';
var socket = io();

var vm = new Vue({
  el: '#eye1',
  data: {
    eyePos: {},
    mouseDown: false
  },
  methods: {
    pressed: function () {
      this.mouseDown = true;
    },
    released: function () {
      this.mouseDown = false;
    },
    move: function (event) {
      var offset = {x: event.currentTarget.getBoundingClientRect().left,
                    y: event.currentTarget.getBoundingClientRect().top};
        if (this.mouseDown) {
          this.eyePos = { x: event.clientX - 10 - offset.x,
                          y: event.clientY - 10 - offset.y };
          socket.emit("move", this.eyePos);
        }
    }
  }
});

/*jslint es5:true, indent: 2 */
/*global Vue, io */
/* exported vm */
'use strict';
var socket = io();

var vm = new Vue({
  el: '#dots',
  data: {
    eyePos: {},
  },
  created: function () {
    socket.on('move', function (data) {
      this.eyePos = data;
    }.bind(this));
  }
});


'use strict';


var b = require('bonescript');
var Tail = require('tail').Tail;
console.log('Started');

var duty_min = 0.01;
var duty_max = 0.2;
var position = duty_min;
var increment = 0.02;

// Tuning parameters
var offset_1 = 0;
var offset_2 = 0;
var scale_1 = 2.5 * 10;
var scale_2 = 3 * 10;

var chan1vol = 1;
var chan2vol = 1;
var ready_for_update = true;

var chan1 = new Tail('channel-1-vol.txt');
var chan2 = new Tail('channel-2-vol.txt');

chan1.on('line', function (data) {
    // console.log('1 ' + data);
    chan1vol = parseFloat(data) * scale_1 + offset_1;
    updateDuty()
});

chan2.on('line', function (data) {
    // console.log('2 ' + data);
    chan2vol = parseFloat(data) * scale_2 + offset_2;
    updateDuty()
});

var duty_cycle = duty_min;
function updateDuty() {
    if (!ready_for_update) return;
    ready_for_update = false;
    // compute and adjust duty_cycle based on desired position in range 0..1
    var position = chan1vol / (chan1vol + chan2vol);
    position = Math.max(0, position);
    position = Math.min(1, position);

    duty_cycle = (position * (duty_max - duty_min)) + duty_min;
    console.log('Duty Cycle: ', (duty_cycle).toFixed(3), chan1vol.toFixed(3), chan2vol.toFixed(3));
    setTimeout(function () {
        b.analogWrite('P9_16', duty_cycle, 60, function () { ready_for_update = true; });
    }, 50);
}


updateDuty();

chan1.on('error', function (error) {
    console.log('ERROR chan1: ', error);
});
chan2.on('error', function (error) {
    console.log('ERROR chan2: ', error);
});

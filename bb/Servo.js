
// 'use strict';

// var b = require('octalbonescript');
// var SERVO = 'P9_16';
// var duty_min = 0.03;
// var position = 0;
// var increment = 0.02;

// b.pinMode(SERVO, b.OUTPUT, function (err, result) {
//     console.log(err, result);
// });
// updateDuty();

// function updateDuty() {
//     // compute and adjust duty_cycle based on desired position in range 0..1
//     var duty_cycle = (position * 0.115) + duty_min;
//     b.analogWrite(SERVO, duty_cycle, 60, scheduleNextUpdate);
//     console.log('Duty Cycle: ', parseFloat(duty_cycle * 100).toFixed(1) + ' %');
// }

// function scheduleNextUpdate() {
//     // adjust position by increment and reverse if it exceeds range of 0..1
//     position = position + increment;
//     if (position < 0) {
//         position = 0;
//         increment = -increment;
//     } else if (position > 1) {
//         position = 1;
//         increment = -increment;
//     }

//     // call updateDuty after 200ms
//     setTimeout(updateDuty, 50);
// }


var b = require('bonescript');
var Tail = require('tail').Tail;

var duty_min = 0.01;
var duty_max = 0.18;
// var position = -0.002;
var position = duty_min;
var increment = 0.02;
var scale_2 = 1.0;
var chan1vol = 1;
var chan2vol = 1;
var ready_for_update = true;

var chan1 = new Tail('channel-1-vol.txt');
var chan2 = new Tail('channel-2-vol.txt');

chan1.on('line', function (data) {
    chan1vol = parseFloat(data);
    updateDuty()
});

chan1.on('error', function (error) {
    console.log('ERROR chan1: ', error);
});

chan2.on('line', function (data) {
    chan2vol = parseFloat(data);
    updateDuty()
});

chan2.on('error', function (error) {
    console.log('ERROR chan2: ', error);
});


function updateDuty() {
    if (!ready_for_update) return;
    ready_for_update = false;
    // compute and adjust duty_cycle based on desired position in range 0..1
    var position = chan1vol / (chan1vol + chan2vol);
    var duty_cycle = (position * 0.115) + duty_min;
    b.analogWrite('P9_16', position, 60, function () { ready_for_update = true; });
    console.log('Duty Cycle: ', (position * 100).toFixed(1) + ' %');
}

// function scheduleNextUpdate() {
//     // adjust position by increment and reverse if it exceeds range of 0..1
//     position = position + increment;
//     if (position < duty_min) {
//         position = duty_min;
//         increment = -increment;
//     } else if (position > duty_max) {
//         position = duty_max;
//         increment = -increment;
//     }

//     // call updateDuty after 200ms
//     setTimeout(updateDuty, 50);
// }


updateDuty();

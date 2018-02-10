
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
var duty_min = 0.01;
var duty_max = 0.18;
// var position = -0.002;
var position = duty_min;
var increment = 0.02;


function updateDuty() {
    // compute and adjust duty_cycle based on desired position in range 0..1
    var duty_cycle = (position * 0.115) + duty_min;
    b.analogWrite('P9_16', position, 60, scheduleNextUpdate);
    console.log('Duty Cycle: ', (position * 100).toFixed(1) + ' %');
}

function scheduleNextUpdate() {
    // adjust position by increment and reverse if it exceeds range of 0..1
    position = position + increment;
    if (position < duty_min) {
        position = duty_min;
        increment = -increment;
    } else if (position > duty_max) {
        position = duty_max;
        increment = -increment;
    }

    // call updateDuty after 200ms
    setTimeout(updateDuty, 50);
}


updateDuty();

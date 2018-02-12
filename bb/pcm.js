
var pcm = require('pcm-util');
var fs = require('fs');
var channel = process.argv[2];
if (isNaN(channel)) {
    console.log('ARG 1 is required to be number');
    process.exit(-1);
}
channel = channel | 0;

var format = {
    channels: 1,
    sampleRate: 8000,
    interleaved: true,
    float: false,
    signed: true,
    bitDepth: 16,
    byteOrder: 'BE',
    max: 32767,
    min: -32768,
    samplesPerFrame: 1024,
    id: 'S_16_LE_2_8000_I'
};

var thresh = channel === 1 ? 1 : 4.5;

var data_points = [];
function addPoint(p) {
    // console.log(p);
    data_points.push(p);
    if (data_points.length > 4000) {
        data_points.shift();
    }
}
function getAvg() {
    var sum = 0;
    data_points.forEach(function (p) {
        sum += p;
    });
    return sum / data_points.length;
}
function getMax() {
    var max = 0;
    data_points.forEach(function (p) {
        max = Math.max(p, max);
    });
    return max;
}

process.stdin.resume();
process.stdin.setEncoding(null);    // set input to binary
process.stdin.on('data', function (bufStr) {
    var buf = Buffer.from(bufStr, 'binary');
    if (buf.length % 2 !== 0) {
        return;
    }
    var audioBuffer = pcm.toAudioBuffer(buf, format);
    var audio = audioBuffer.getChannelData(0);
    audio.forEach(function (a) {
        addPoint(Math.abs(a));
    });
    // console.log(buf.length, audio.length, avg_volume);
    var avg_volume = getAvg();
    if (avg_volume > thresh)
        console.log(channel + ': ' + avg_volume);

    // process.stdout.write(buf.toString());
    fs.appendFileSync('channel-' + channel + '-vol.txt', avg_volume.toFixed(5) + '\n');
});





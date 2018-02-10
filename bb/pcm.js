
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

var avg_volume = 0;
var thresh = channel === 1 ? 0.3 : 4.5;

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
        avg_volume += Math.abs(a);
        avg_volume *= 0.9;
    });
    // console.log(buf.length, audio.length, avg_volume);
    if (avg_volume > thresh)
        console.log(avg_volume);

    // process.stdout.write(buf.toString());
    fs.appendFileSync('channel-' + channel + '-vol.txt', avg_volume.toString(5) + '\n', function (err) {
        if (err) throw err;
    });
});



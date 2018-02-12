#!/bin/sh

cd /home/debian/okean/bb

/usr/bin/ffmpeg -loglevel panic -i rtp://192.168.188.31:11000 -map 0:a -c:a pcm_s16le -f data - | /usr/bin/node pcm.js 1 &
/usr/bin/ffmpeg -loglevel panic -i rtp://192.168.188.32:12000 -map 0:a -c:a pcm_s16le -f data - | /usr/bin/node pcm.js 2 &

/usr/bin/node follow_noise.js
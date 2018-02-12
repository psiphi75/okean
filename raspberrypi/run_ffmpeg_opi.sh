#!/bin/bash

ffmpeg -re -f alsa -ac 1 -i hw:2,0 -ar 8000 -f mulaw -af lowpass=900,highpass=750  -f rtp rtp://192.168.188.30:12000
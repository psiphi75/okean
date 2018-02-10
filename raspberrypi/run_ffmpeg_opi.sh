#!/bin/bash

ffmpeg -re -f alsa -ac 1 -i hw:audiocodec,0 -ar 8000 -f mulaw  -f rtp rtp://192.168.20.182:12000
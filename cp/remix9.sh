#!/usr/bin/env bash
# Sound-only update: wait for run9.sh, re-export the mix list from the current build, re-mix and re-compress.
cd /home/claude/cp
until grep -q PIPELINE_DONE run9.log 2>/dev/null; do sleep 20; done
python3 mixexport.py && python3 mixta9.py render && python3 mixta9.py render-portrait
V=$(grep -o 'agencies_v[0-9]*_' run9.sh | head -1)
for m in 16x9 9x16; do ffmpeg -y -v error -i CityPremium_agencies_v9_$m.mp4 -c:v libx264 -preset medium -b:v 1800k -maxrate 2400k -bufsize 3600k -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart send9/CityPremium_${V}$m.mp4 & done; wait
ls -la send9 | grep "${V}"; echo REMIX_DONE

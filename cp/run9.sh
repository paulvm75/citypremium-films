#!/usr/bin/env bash
# Full v9 to v11 pipeline: render both formats in parallel, mix, compress under 30 MB.
cd /home/claude/cp
python3 renderta9.py render > r16.log 2>&1 &
python3 renderta9.py render-portrait > r9.log 2>&1 &
wait
python3 mixta9.py render && python3 mixta9.py render-portrait
mkdir -p send9
for m in 16x9 9x16; do ffmpeg -y -v error -i CityPremium_agencies_v9_$m.mp4 -c:v libx264 -preset medium -b:v 1800k -maxrate 2400k -bufsize 3600k -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart send9/CityPremium_agencies_v11_$m.mp4 & done; wait
ls -la send9; echo PIPELINE_DONE

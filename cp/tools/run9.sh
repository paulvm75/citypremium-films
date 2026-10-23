cd /home/claude/cp
P=/tmp/claude-0/-home-claude/e682fdc2-527b-573d-9d4f-9d2ea5507444/scratchpad/ag
python3 renderta9.py render > r16.log 2>&1 &
python3 renderta9.py render-portrait > r9.log 2>&1 &
wait
python3 mixta9.py render && python3 mixta9.py render-portrait
mkdir -p send9
for m in 16x9 9x16; do ffmpeg -y -v error -i CityPremium_agencies_v9_$m.mp4 -c:v libx264 -preset medium -b:v 1800k -maxrate 2400k -bufsize 3600k -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart send9/CityPremium_agencies_v9_$m.mp4; done
ls -la send9
for m in 16x9 9x16; do python3 $P/flash.py send9/CityPremium_agencies_v9_$m.mp4; done
python3 ovfta9.py > ovfta9.log 2>&1; cat ovfta9.log
echo PIPELINE_DONE

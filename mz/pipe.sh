set -e
cd /home/claude/mz
one(){ m=$1
  python3 dumpmix.py $m
  python3 rseg.py $m 210 2955 && mv seg_$m.mp4 segD_$m.mp4
  ffmpeg -y -v error -i mzvideo_$m.mp4 -i segD_$m.mp4 -filter_complex "[0:v]trim=end_frame=210,setpts=PTS-STARTPTS[a];[1:v]setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1[v]" -map "[v]" -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p mzvideo_new_$m.mp4
  mv mzvideo_new_$m.mp4 mzvideo_$m.mp4
  python3 mix.py $m
}
one render & one render-portrait & wait
mkdir -p send
for s in 16x9 9x16; do ffmpeg -y -v error -i CityPremium_maisons_v3_$s.mp4 -c:v libx264 -b:v 2000k -maxrate 2600k -bufsize 4000k -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart send/CityPremium_maisons_v4_$s.mp4; done
ls -la send/*v4*

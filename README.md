# City Premium films

This repo holds the motion-design ads for **City Premium**, the Paris and London operator for VIP mobility, concierge, travel and events. Each film is tailored to one audience. They are all built with the same code-driven engine: one HTML page, animated with GSAP, voiced by ElevenLabs, and rendered frame by frame to MP4 with Playwright and ffmpeg.

| Film | Audience | Source folder | Final renders | Interactive page |
|---|---|---|---|---|
| Explainer (v18) | Corporates, executive assistants, finance | `cp/` (`v18.html`, `build18.py`) | `renders/CityPremium_explainer_v18_*.mp4` | `pages/explainer.html` |
| For Agencies (v8) | Luxury travel advisors, DMCs, Virtuoso | `ta/` (sources) and `cp/` (`buildta8.py`) | `renders/CityPremium_agencies_v8_*.mp4` | `pages/agencies.html` |
| For Maisons (v6) | Luxury fashion maisons, VIC programmes | `mz/` | `renders/CityPremium_maisons_v6_*.mp4` | `pages/maisons.html` |

Every film ships in 16:9 and 9:16. The pages in `pages/` are self-contained, so you can open one in a browser and press play.

## Quick start

```bash
git clone https://github.com/paulvm75/citypremium-films
cd citypremium-films && ./setup.sh   # symlinks cp/ ta/ mz/ into /home/claude, installs icons, three.js, playwright
```

The scripts use absolute paths (`/home/claude/cp`, `/home/claude/ta`, `/home/claude/mz`, `/tmp/claude-0/...`). `setup.sh` recreates that layout so everything runs unchanged.

## How a film is built

1. **Script and voice.** The voice-over is generated with ElevenLabs (voice "Barb" on Maisons, "Jessa" on the earlier films). The word timings are stored as JSON (`words*.json`). Animation cues are keyed to those words, never to hand-typed times.
2. **Engine.** `cp/v18.html` is the base template. It provides the camera across a large SVG "world", stations (one scene each), kinetic text, tone panels, motion blur, SFX pooling and music ducking. Each film's `gen.py` patches that template with `rep(old, new)` and injects:
   - `scenes.py`: the SVG markup of each station (m1 to m10)
   - `tl.js`: the GSAP timeline per scene
   - `cam.js`: the camera moves (`go()` for a scene change, `foc()` for focus or zoom)
   - `frame.js`: per-frame work that GSAP can't do, such as the three.js renders, the ribbon simulation and the perspective gallery
   - `sfx.js`: sound cues, `add(name, time, volume)`
3. **Build.** `build.py` embeds the fonts (Instrument Sans), images and audio as base64. It produces a `*-render.html` with GSAP inlined, used for rendering, and a `*-pub.html` that loads GSAP from a CDN, used for publishing.
4. **Render.**
   - `rseg.py <mode> f0 f1` drives `renderAt(t)` frame by frame at 30 fps through Playwright and pipes JPEGs to ffmpeg (CRF 18). The mode is `render` for 16:9 or `render-portrait` for 9:16.
   - `dumpmix.py` exports `window.__mix`, the SFX cue list.
   - `mix.py` mixes the voice, music (sidechain ducking, emphasis dips, a swell after the voice ends) and SFX.
   - `pipe.sh` runs all of this for both formats.
5. **Deliver.**
   - Maisons is sped up by 5% at the end: `setpts=PTS/1.05` for video and `atempo=1.05` for audio.
   - Everything is compressed to 2000k video and 192k AAC, so each file stays under 30 MB.
   - The page plays at 1.05x as well, set via `playbackRate` in `mz/gen.py`.

Example (Maisons):
```bash
cd /tmp/claude-0/three && npx esbuild mz3d.js --bundle --minify --format=iife --outfile=mz3d.bundle.js && cp mz3d.js mz3d.bundle.js /home/claude/mz/
cd /home/claude/mz && python3 gen.py && python3 build.py      # -> mz-render.html, mz-pub.html
bash pipe.sh                                                   # full render + mix (pipe2.sh re-renders only from frame 2340)
ffmpeg -i CityPremium_maisons_v3_16x9.mp4 -filter_complex "[0:v]setpts=PTS/1.05,fps=30[v];[0:a]atempo=1.05[a]" -map "[v]" -map "[a]" -c:v libx264 -b:v 2000k -c:a aac -b:a 192k out_16x9.mp4
```

The intermediate full-quality master is named `CityPremium_maisons_v3_*` by `mix.py`. That's a historical name; it is the latest master.

## Checking for glitches before delivery

- `shot.py <mode> t1,t2,... W H` takes screenshots at given times. `sheet.py` turns them into contact sheets.
- `ovf.py` scans the whole film in both formats for text that overflows its box.
- `probe.py <mode> "<js>"` evaluates JS in the page, for example `C("brand#3")` for a cue time or `SA("m9")` for a scene start.
- After each render, sample frames from the MP4 with ffmpeg and look at them.

See `CLAUDE.md` for the creative rules, the client's preferences and the lessons learned. Read it before changing anything.

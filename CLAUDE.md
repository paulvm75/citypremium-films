# Working on the City Premium films

The client is Paul Tuil, Director of Client Affairs at City Premium. He reviews every cut closely and gives blunt feedback. The bar is premium, simple, high-quality motion design, not "AI slop".

## Non-negotiable rules
- **No orange**, anywhere. The palette is navy and indigo (`#141A33`, `#1B2140`, `#2B3150`), ivory (`#F4F2ED`), steel and silver, with one accent per film: deep purple for the first ribbon, red for the Maisons bow.
- **Sans serif only** (Instrument Sans). No serif fonts.
- **No em dashes** in any on-screen text or copy.
- **Full sentences** in the voice-over and the copy. No tiny captions; text must be readable on a phone.
- **ElevenLabs is only for TTS and SFX** (and music if asked). Never use it to generate images or video, which wastes the client's credits.
- Describe City Premium as an **operator**, never a "chauffeur company" or a "broker".
- **Check for glitches yourself** before sending anything:
  - text overflow (`ovf.py`)
  - one-frame flashes (scan MP4 frames for black blocks)
  - elements reappearing
  - hard cuts between scenes
- Deliver both formats (16:9 and 9:16), each under 30 MB, and republish the artifact page each time.

## Sound
- **SFX:** motion-design sounds only (soft clicks, flicks, satin, car pass, jet). No "magic" shimmers, used once at most. No swooshes without a visible reason; the client calls them parasitic.
- **Music:** the client wants it audible, with **real bass**. The current Maisons settings were tuned over many rounds:
  - track: Exclusive French Afternoon
  - processing: `bass=g=14:f=95`, `equalizer f=55 g=6`, loudnorm -18
  - volume 0.256 in the mix
  - **gentle** ducking under the voice: sidechain ratio 2.2, threshold 0.03, plus a 20% dip on emphasised words
  - a +150% swell after the voice ends
- **Changing levels:** the page player's music level is set by the `DUCK` chase targets in `gen.py` (`.24` while speaking, `.284` otherwise), not by `.volume`. Change both the page and `mix.py`.

## 3D (Maisons, `mz/three/mz3d.js`)
Bundle with esbuild as an IIFE that exposes `window.MZ3D`.

- **Jet (Le Bourget scene), modelled on a Bombardier Challenger 350:**
  - Long ogive nose with the tip low.
  - The windscreen is **on the front of the nose**, wrapping over its top front. It's defined by the angle around the fuselage axis, not by height. A windscreen on the flank is wrong; the client was very clear that pilots have to see forward.
  - A plug door just behind the cockpit, curved flush with the fuselage, swinging out on its front hinge.
  - A separate airstair with handrails that unfolds from the sill to the tarmac.
- **First ribbon (m2):**
  - A real rope simulation: position-based dynamics with 64 nodes, precomputed and sampled per frame so renders are deterministic.
  - Movement: pulled taut between two off-screen posts. It goes from grey to deep purple, and the "Your brand" luggage tag lowers on its cord.
  - The cut, on "home", is a thin streak of light plus a soft flash. The halves recoil and fall. **No scissors.**
- **Closing bow (m9):**
  - A grey ribbon swoops in along a flight path and twists in the air.
  - It turns red **in flight**, starting from the head.
  - It ties into a bow on **"your brand"**: a morph with overshoot, the knot cinches, the tails are notched, and there's a zoom punch.
  - The voice-over has a 0.8 s pause inserted after "brand", so the bow holds before the crossfade to m10. The originals are kept as `vo_mz_orig.mp3` (not in repo) and `words_mz_orig.json`.

## Lessons learned (avoid repeating these bugs)
- **SVG filters vs canvases:** an SVG `filter` (drop shadow) on a group that contains a `foreignObject` canvas makes Chrome draw black blocks. Put the filters on sibling groups instead.
- **Cue lookup:** `C('word')` returns the **first** occurrence of a word. Use `C('word#n')` to get the n-th.
- **Overlapping tweens:** a `foc()` that overlaps a `go()` on the camera causes jumps. Never overlap camera tweens on the same property; use absolute values.
- **Ribbon rendering:** use rotation-minimising frames to avoid flips. Don't use a tapered head; it looks like a cut thread.
- **Rendering cost:** renders are slow (about 35 minutes for both formats). Re-render only the changed span with `rseg.py` and splice with ffmpeg trim and concat (see `pipe2.sh`).
- **Background jobs:** in background jobs, don't wait on `pgrep -f "bash pipe.sh"`; it matches the parent shell and never exits.

## Using this as a reference for a new film
1. Copy `mz/` as the starting point. It's the most evolved: scene system, emphasis markup in TXT (`*` italic accent, `^` highlight, `!` big, `|` chunk), ribbon and 3D hooks.
2. Write the script with the `citypremium-expert` positioning for the target audience (corporates, travel agencies, banks and roadshows, family offices, embassies, palaces). Generate the voice-over with ElevenLabs and get the word timings.
3. Rewrite `scenes.py`, `tl.js`, `cam.js` and `sfx.js` per station. Keep every cue tied to voice-over words.
4. Build, take screenshots in both formats, fix, render, check, then deliver.

## Agencies v9 (experiences section, 1:08 to 1:28) and its lessons
- Built as kinetic type. Photo slats open from a horizon line and flip like a split-flap board. GUIDES, CHAMPAGNE and COTSWOLDS rise letter by letter with photos inside the letters. CHAMPAGNE swings open like cellar doors onto a line-drawn flute that fills. COTSWOLDS rolls in like hills. The "?" is drawn (outline, then fill) with two extruded colour layers and is pushed out of frame as the tape measure slides in.
- The client rejected: big upscaled photos (blurry), plain cards, a map with pins and routes, hills and sun lines, a ring or moon around the "?", photo fills inside the "?", fog or glow in the door gap, jumps and zoom punches on calm moments, and swooshes.
- The engine used to add a swoosh on every text chunk (`VIS.forEach ... add('swish')`). It is removed in gen.py; keep it removed.
- `renderAt()` seeks with callbacks suppressed, so GSAP `onUpdate`/`onComplete` never fire in renders. Drive anything procedural from `frameA(t)` (the opening flight uses `window.FLY`).
- One value must drive things that have to stay in sync (jet, its line, its trail, the camera). Use `pathLength="1"` for dash draws; hard-coded dash lengths drift.
- A camera value that must hold on frame 0 needs `fromTo(..., {immediateRender:true})`. A plain `tl.set` at 0 is skipped on the first frame.
- Per-letter tspans: give each tspan an absolute x (measured with the font), because text-anchor applies per text chunk. Don't use the class `lt`, which the engine animates.
- Mask and outline letter sets must be staggered separately (the `G2` helper), or the outlines lag behind.
- `filter: blur` on SVG groups at opacity 0 can draw dark bars in Chrome. Use opacity and transforms instead.
- Check new SVG ids for duplicates. A second `mfade2` silently disabled the map feather.
- Review densely before shipping: shoot every 0.25 to 0.35 s of the changed span in both formats, look at contact sheets, then run `tools/flash.py` on the MP4s.

## Agencies v9, later rounds
- **The car drives the film.** A detailed top-down saloon (`carT` symbol in gen.py) drives between every scene, with a car pass SFX on every transition. It's hidden during the map hold.
- **Closing voice-over:** "Every experience is made to measure. And everything is white label, so your client only ever sees your name. Since 2010, luxury maisons, travel agencies and VIC clients have trusted us." The "And" belongs before "everything is white label", never before "Since 2010". Say "travel agencies", not "embassies", in this film. The current raw take is `ta/v9/vo_take4_raw.mp3` (a splice of take 2 and `line2_A.mp3`).
- **"On commercial flights" (about 0:53) must show a commercial airliner,** never the business jet. `mz/three/air3d.js` is a procedural 737-800-style airliner with the same `PLANE3D` API plus `doorAnchor()`. It has:
  - a tall swept fin and winglets
  - underwing engines
  - a cabin window row
  - a cockpit windscreen defined by absolute height on the nose (so the posts read vertical)
  - an L1 plug door and airstair

  Bundle it to `cp/plane.bundle.js`. `cp/plane_jet.bundle.js` is the Challenger backup.
- **3D canvas in SVG:** feather the `foreignObject` canvas on both axes. The mask `fm8` nests a vertical mask `fm8v`, otherwise the tarmac shows a hard bottom edge.
- `wait_for_function` never resolves on these pages (the engine controls rAF). Use a fixed `wait_for_timeout`. The portrait mode name is `render-portrait`.
- **Update:** the procedural airliner was rejected ("doesn't look like a plane"). The scene now uses a real A320neo model (FlightGear, GPL v2), converted to GLB. See `tools/a320/README.md`. Never hand-model an aircraft again; find a real model.
- Keep the engines clear of the ground: on the procedural model the nacelles sat below the wheel line and went through the tarmac.
- The split-flap scramble alphabet has no vowels, so random frames can't spell words.
- **Fleet side cars (a7, about 0:35):** these come from `ta/side/side.py`. The old v18 profile read as nose-left with the headlight on the right, so the client saw the lights as reversed.
  - Each car has a long hood at the nose, a white headlight at the nose and a red tail lamp at the rear.
  - The Paris car drives in from the left with its nose to the right. The London car comes in from the right, so it's mirrored and drives nose first.

## Agencies v10: Katana cinematic inserts (Higgsfield)
- The user invoked `/katana` to upgrade the visuals. The Higgsfield workflow generated people-free photoreal footage:
  - Soul Cinema location plates. Every plate is checked for people; Soul Cinema copies walkers from an evidence photo, so text-only plates were safer.
  - Seedance 2.5 shots at 1080p (16 credits per second on 2026-11-13).
  - Ledger, state and QA live in the Higgsfield sandbox workspace `katana-cp-agv10`.
- The source clips are in `cp/foot/src/`. `cp/foot/extract.py` grades them and writes:
  - render sequences `foot/r/<k>/f%04d.jpg` (30 fps, blended from 24, not in git; re-run `extract.py` to rebuild)
  - page videos `foot/v/<k>.mp4` and `.webm`
  - 15 fps letter sequences `foot/p/<k>/`
  - `clips.json`
- `ta/foot.js` drives everything from film time:
  - `#footB` sits behind the world SVG (a backdrop that the graphics sit on). `#footT` sits above `#dim`, so the camera dim can't darken it.
  - Moments:
    - o1: an iris from `#pin1` onto Paris at dawn.
    - o2: a full-bleed wipe with a light edge onto the saloon, from SA('a7') to C('chauffeurs').
    - o3 and o4: footage inside the CHAMPAGNE and COTSWOLDS letters, by swapping the hrefs of `#pc9x` and `#pt9x`.
    - o5: Paris at night behind the end card, at 0.8x speed.
  - Portrait shows the footage in a feathered full-width square band at 36% height, never as an upscaled centre crop.
- Renders must `await VSEEK(t)` after `renderAt(t)` (`renderta9.py` and `shotta9.py` do this), otherwise frames are captured before the JPEG decodes.
- The published artifact is multi-file: the page plus `foot/v/*` and `foot/p/*`, published with the Artifact tool's `files` (root `cp/`).
- `cp/run9.sh` is the full pipeline (both renders in parallel, mix, compress to `send9/CityPremium_agencies_v10_*.mp4`).

## Agencies v11 to v14: kinetic type (`ta/kx.js`) and its lessons
- `ta/kx.js` holds full-frame type set pieces, each a pure function of film time, called from `render()` as `KX(t)`. Layers: `#kxbg` sits under the text, `#kx` sits above everything.
  - K0 opening: a cabin window, the shade lifts on Paris at dawn, then a push through the window. No plane sprite, no Paris pin.
  - KD (0:12 to 0:16): a 24-hour dial as a photo window (jet at the door 07:40, maitre d' 21:30, concierge 02:00, stills in `cp/dial/`), swept in by a clock hand, dusk and night open out from the dial.
  - K2: "That's / where" punch in with outline echoes, the real logo reveals with a glint, "comes in." is underlined, zoom through the o of "comes".
  - K3: "operator" fills the frame, its o becomes the orbit ring. K5: split-flap name board for white label. K6: odometer to 2010.
  - K7 ending: ivory frame with PARIS, LONDON, EUROPE cut out over the night footage, then a zoom through the P of EUROPE onto the logo and CTA.
- The client rejected: a static plane image sliding across the frame, a plane travelling round the dial, the small orbit icons for door and restaurant, a lone clock cutting in at 0:15, text with clipped letters, blur smears on camera moves, and violet or cyan backgrounds.
- Text grammar: words rise with a small rotation, no masks and no blur filters (they glitch in the page player). Big words scale in. Never animate letter-spacing on inline words; it reflows the line.
- A text chunk leaves before a scene wipe starts (`nextScene.a-.08`).
- Footage wipes use the same start, duration and ease as the panel wipe (`SA-.3`, 0.95 s, expo in-out), so there is one edge.
- Jets are stills of a real Bombardier Global 5000 model (`tools/g5000/`).

## Agencies v15
- The opening (K0) is the cabin window, and the client likes it: navy leather sidewall, deep window reveal, the shade lifts on Paris at dawn with light spilling onto the wall, then a banked push through the window with a soft burst of light. A cut-out-words opening was tried and rejected; keep the window.
- The ending (K7) is built by `mkCover` in `ta/kx.js`: an ivory frame with PARIS, LONDON, EUROPE cut out, footage inside the letters, and it splits open along its centre line onto the logo. The zoom through a letter there looked cheap.
- a7 towers are real line art of the Eiffel Tower and the Elizabeth Tower, drawn path by path with `pathLength="1"`.
- Fast track is four segments that fill in turn with a tick each; the minutes drop per segment. No moving dot, and the chauffeur token leaves before the card arrives.
- "Something truly unusual" (K8) is a hairline question mark that draws, fills like frosted glass and gets one reflection.
- "Made to measure" stays the tape measure with three photos and the seal (in `tl_b.js`), and white label stays the split-flap name board (K5). A corner-mark frame and a wall of blinds were tried and the client preferred the originals.
- `C('every')` is the first "every" at 1:06; use `CA(word, afterTime)` in kx.js when a word repeats.
- Map (a8): no halos, no radar rings, no plane icons. Private terminals are one ring marker each with a code-and-name tag on a leader line, placed so tags never meet the text column or the frame edge. The pull-out shows eight destinations (Nice, Geneva, Munich, Rome, Madrid, Lisbon, Athens, Copenhagen) as a dot and a plain label. Paris and London rings only appear on the pull-out. The road returns only after the map has gone.
- The world road and car fade out under the end card; a far-off car read as a stray white dot.
- Cabin window: ivory plastic bezel and reveal on the navy leather wall, a white rim lit by the daylight. No light blob on the push (it read as white dust).
- Operator beat (K3): "We're an" sits on top of the word as one composition over a 0.9 veil; the letters lift away at operator+0.5 and the City Premium emblem (`#boss`) draws its orbit with a light at its head, a ripple and a glow pulse on `#cpOrbG` when the ring closes. The old "o becomes the ring" morph read as a second circle flying in from the left.

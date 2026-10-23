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

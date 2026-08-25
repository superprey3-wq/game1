# Арена Спутников

Mobile-first HTML5 survivor/roguelite for Yandex Games. Dependency-free Canvas + vanilla JavaScript.

## Production-pass features

- 5 heroes and 5 pets, with persistent unlock progression
- 10 weapons, per-weapon levels and evolved forms at max level
- stat upgrades, crit, regen, armor, pickup radius and movement speed
- escalating waves, multiple enemy archetypes and a boss every 2 minutes
- 10-minute target run with victory state
- run currency + permanent metaprogression upgrades
- rewarded-video revive flow (once per run)
- fullscreen ad hook between completed runs
- procedural WebAudio sound effects + lightweight music + mute controls
- Russian/English localization based on Yandex SDK language with manual toggle
- local save + Yandex Player cloud save when available
- leaderboard score submission hook (`arena_survival`) when configured in Yandex Console
- local achievements stored in save data
- mobile virtual joystick, keyboard controls, focus/visibility pause
- procedural vector-style Canvas art/VFX with no external sprite dependency

## Controls

Desktop: WASD / arrow keys. Esc/P pauses.

Mobile: touch/drag on the left side of the screen for a virtual joystick.

## Run locally

Use a static HTTP server. The Yandex `/sdk.js` path is available on the platform; locally the bridge gracefully falls back when the SDK is absent.

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Yandex Games setup

1. Upload a ZIP with `index.html` in the archive root.
2. Create a leaderboard with technical name `arena_survival` if leaderboard submission is desired.
3. Rewarded revive stays unavailable when rewarded ads are not provided by the SDK.
4. Cloud save is used when a Yandex Player is available; localStorage remains the fallback.

## Release checklist

- verify `LoadingAPI.ready()` timing in Yandex debug mode
- verify GameplayAPI start/stop and `game_api_pause` / `game_api_resume`
- verify rewarded revive on the real Yandex test environment
- configure the `arena_survival` leaderboard in the Console
- create/upload final catalog PNG assets: 512×512 icon and 800×470 cover
- capture at least two real gameplay screenshots per selected platform in the dimensions required by the current Yandex draft form
- do a final balance/performance pass on Android low-end devices and desktop browsers

The code-side production pass is complete. Catalog media, screenshots and Console configuration are publishing tasks that must be completed in Yandex Games itself because moderation requires real gameplay media and draft-specific uploads.

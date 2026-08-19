# Арена Спутников

Mobile-first HTML5 survivor/roguelite prototype for Yandex Games.

## Core loop

- choose 1 of 5 heroes
- choose 1 of 5 companion pets
- move while attacks fire automatically
- collect XP and choose upgrades
- survive escalating waves and bosses
- 10-minute run target

## Controls

Desktop: WASD / arrow keys. Esc/P pauses.

Mobile: touch/drag on the left side of the screen for a virtual joystick.

## Yandex Games integration

The project includes the current Yandex Games SDK loader and wrapper for:

- SDK initialization
- `LoadingAPI.ready()`
- GameplayAPI start/stop markers
- language detection through SDK
- local save + Yandex Player cloud save when available
- fullscreen/rewarded ad methods prepared for later economy integration
- pause when the tab/app loses focus

## Run locally

Use a local static HTTP server rather than opening `index.html` as a file.

Example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Yandex upload

For Yandex Games, ZIP the game files with `index.html` in the archive root. Do not include git metadata.

## Current MVP

The first version is intentionally dependency-free: HTML5 Canvas + vanilla JavaScript. This keeps load time, bundle size and mobile compatibility under control.

Next production passes:

1. original sprite/art pack and VFX
2. sound/music and mute controls
3. 10+ weapons with evolutions
4. metaprogression and unlockable heroes/pets
5. rewarded revive / reward economy
6. Yandex leaderboard and achievements
7. Russian + English localization
8. promo assets, screenshots, icon and moderation checklist
9. balance/performance testing on Android and low-end desktop hardware

# Последний вагон — playable prototype

Independent HTML5 zombie train defense game in `last-wagon/`. Existing games are unchanged.

## Play and package

Run `python3 -m http.server 8090` from repository root and open `http://localhost:8090/last-wagon/`.

Build a Yandex upload ZIP (index.html must be at archive root):

```sh
python3 last-wagon/package.py
```

Upload `last-wagon.zip` to a new Yandex Games draft. This does not publish the game automatically.

## Implemented

- 60 progressively unlocked stations, six palette/region themes; three 60-second waves per completed station. Upgrade choices pause the clock. A surviving boss can extend the battle.
- Three zombie archetypes and a boss on every fifth station.
- Automatic shooting, tap to prioritize a zombie, rechargeable electrical pulse (Space on desktop).
- Mid-run damage/rate/repair choices and voluntary extraction. A loss banks 35% of run metal.
- Three functional weapon classes: machine gun, chain Tesla, area mortar.
- Four item rarities, persistent arsenal, duplicate recycling and permanent damage/armor upgrades.
- Local versioned progress, pause on visibility loss, mobile/desktop layout.
- Yandex SDK loading/gameplay signals, platform pause handling, optional rewarded revival and post-victory bonus chest. Only onRewarded grants a reward, once per request. No simulated rewards outside Yandex.
- Loot chances: common 60%, rare 28%, epic 10%, legendary 2%. No purchases. Standard victory chest is free.

## Before release

This is a prototype, not a moderation-approved or revenue-ready release. Validate real rewarded ads and SDK events in Yandex draft; connect monetization in Console; prepare actual gameplay screenshots, icon and cover; test on Android and tune all 60 stations with player data. Regions currently differ in palette/name and progressive enemy strength, not handcrafted maps. Art is original procedural Canvas geometry. There is no audio, cloud save, leaderboard or localization yet. Save data is local to the browser/device; private/blocked storage cannot persist it.

First-session goals: understand target selection and pulse, complete one station, equip a drop, launch a second station. Track completion, repeat play and ad opt-in in a later analytics iteration before predicting income.

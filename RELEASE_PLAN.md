# Arena of Companions — production gates

This branch is not released until every P0 gate passes.

## P0 gameplay
- Four worlds with distinct pacing, enemy palettes and bosses.
- At least six weapons, five levels each, plus companion-based evolutions.
- Active companions visibly follow/support the hero.
- 10–12 minute runs; difficulty ramps without unavoidable damage spikes.
- Death -> one optional rewarded revive -> result screen.
- Meta currency, permanent upgrades, unlock progression and achievements persist.

## P0 Yandex
- SDK loaded with the deployment-supported path in the release archive.
- LoadingAPI.ready only after boot/UI is usable.
- GameplayAPI lifecycle matches actual gameplay.
- focus/visibility/ad events pause gameplay AND audio.
- Guest path never requires login.
- Cloud save is best-effort; local save always works.
- RU/EN cover every meaningful string and reward description.
- Interstitial only at natural transitions; rewarded is always opt-in.
- Touch, keyboard, resize and orientation tested.

## P0 performance
- 60 FPS target on mid-range mobile; graceful 30 FPS under load.
- Enemy/projectile caps and pooling prevent runaway allocations.
- DPR capped; reduced effects mode available automatically.
- No large third-party runtime dependencies.
- Uncompressed package <100 MB.

## P1 presentation
- Original coherent fantasy art direction.
- Hero/pet silhouettes readable at phone scale.
- World-specific backgrounds and effects.
- Boss telegraphs and damage feedback are clear.
- No AI-generated text embedded in art.
- Procedural/original audio only unless a verified compatible license is documented.

## Release artifact
- `index.html` at ZIP root.
- No dev-only files needed at runtime.
- Version/build metadata included.
- Fresh-install RU and EN smoke tests pass.
- Yandex draft smoke test passes before submission.

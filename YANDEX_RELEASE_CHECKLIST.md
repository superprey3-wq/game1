# Yandex Games release checklist — Arena of Companions

Checked against Yandex Games requirements updated 2026-07-01.

## Build / SDK
- [ ] Yandex Games SDK uses current supported connection path.
- [ ] `LoadingAPI.ready()` is called only when the player can actually start interacting.
- [ ] `GameplayAPI.start()` only during active gameplay.
- [ ] `GameplayAPI.stop()` on pause, menus where appropriate, ads, tab/background state.
- [ ] Guest play works without forced authorization.
- [ ] Progress is saved locally; Yandex cloud save is used when Player is available.
- [ ] `index.html` is at archive root.
- [ ] No spaces or Cyrillic characters in file/folder names.
- [ ] Uncompressed build stays below 100 MB.

## Mobile / browser UX
- [ ] Touch controls work on Android/iOS.
- [ ] Mouse/keyboard controls work on desktop.
- [ ] Browser context menu is disabled in the game area (right-click and long press).
- [ ] Game survives resize/orientation changes without dead screens.
- [ ] Game pauses and sound stops when page/app is backgrounded.
- [ ] No console errors, freezes, debug text, broken buttons or placeholder screens.

## Localization
- [ ] Automatic language detection occurs at startup through SDK.
- [ ] Full Russian localization.
- [ ] Full English localization.
- [ ] Manual language selector is understandable without knowing current language.
- [ ] All gameplay-significant text changes language, including ad reward descriptions.
- [ ] Store/console descriptions, instructions and promo materials match selected locales.

## Ads
- [ ] Ads are requested only through Yandex Games SDK.
- [ ] Interstitials appear only at logical pauses, never during active combat.
- [ ] Rewarded ads are voluntary and clearly state the exact reward before viewing.
- [ ] Rewarded bonuses are optional extras and do not block core progression.
- [ ] Gameplay and sound stop during fullscreen/rewarded ads.
- [ ] Progress is saved before/around ad transitions where loss could occur.
- [ ] Sticky banners, if enabled, do not cover controls or active gameplay.

## Content / moderation
- [ ] Main experience has >10 minutes of content/replayability.
- [ ] Game is presented as finished, not alpha/beta/demo.
- [ ] Tutorial explains movement, auto-attack, upgrades, pets and rewarded choices.
- [ ] All buttons have a working purpose on every declared platform.
- [ ] Promotional screenshots show real gameplay prominently.
- [ ] Promo art uses only Arena of Companions characters/assets.
- [ ] Generated art is manually checked for artifacts, broken text/hands and inconsistent designs.
- [ ] No third-party copyrighted characters, logos, music or unlicensed assets.

## Pre-submit test matrix
- [ ] Yandex Browser desktop
- [ ] Chrome desktop
- [ ] Firefox desktop
- [ ] Safari desktop where available
- [ ] Android mobile
- [ ] iOS mobile where available
- [ ] Yandex Games draft environment
- [ ] Offline/ad-error callbacks tested
- [ ] RU and EN fresh-install paths tested

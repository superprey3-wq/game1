# Arena of Companions — curated CC0 art plan

Goal: keep one coherent fantasy/sci-fi visual language. Do not dump mismatched packs into the game.

## Approved source pool
- Tiddybub/2d-assets: curated CC0-only library; use SOURCE.md provenance per imported pack.
- Kenney CC0 packs: Monster Builder Pack, Modular Characters, Roguelike Characters, Toon Characters.

## World 1 — Emerald Wilds
Target: bright magical forest, readable green ground, ancient ruins.
Use/adapt: nature terrain, trees, rocks, ruins, monster-builder beasts.
Enemy silhouettes: sprout beast, fang quadruped, shaman caster.
Boss: Ancient Guardian — stone/wood armor, glowing emerald core, oversized shoulders.
FX: leaves, green motes, roots, gold/green shockwave.

## World 2 — Ashen Dunes
Target: warm desert, broken temple, orange dust.
Use/adapt: sketch-desert, pyramid/ruins props, monster-builder insects/humanoids.
Enemy silhouettes: scarab, raider, djinn.
Boss: Sand Colossus — stone plates, gold seams, heavy arms.
FX: dust trails, sand ring, amber sparks.

## World 3 — Frostbound Reach
Target: blue ice field, crystals, ruined frozen structures.
Use/adapt: ice/freeze assets, rocks and recolored fantasy ruins.
Enemy silhouettes: wisp, frost wolf, frost mage.
Boss: Frost Wyrm — long horned/armored silhouette, cyan core.
FX: snow motes, ice shards, pale-blue spiral projectiles.

## World 4 — The Abyss
Target: purple/black alien-fantasy corruption, runes and floating fragments.
Use/adapt: sci-fi alien shapes + fantasy ruins, recolored to one palette.
Enemy silhouettes: eye, crawler, warlock.
Boss: Void Lord — large armored humanoid, floating crown/horns, violet core.
FX: purple fog, rune circles, teleport distortion, void sparks.

## Heroes / skins
Use modular character construction as reference/base language, but normalize proportions and palette in our renderer. Five classes must remain identifiable at phone scale: Knight shield, Mage staff/hat, Ranger bow, Berserker axe, Shade dual blades. Skins change armor/material palette and a few silhouette accents, not class readability.

## Companions
Use monster-builder/animal shapes as reference language. Fox and wolf are grounded quadrupeds; owl has strong wing flap; slime squash/stretch; dragon wing flap + tail. Each companion gets a small attack tell.

## Import rules
1. CC0 only for direct asset import.
2. Keep provenance in `assets/SOURCES.md` even where attribution is not legally required.
3. Prefer PNG/WebP sprite atlases; no runtime external downloads.
4. Resize/atlas before shipping; avoid hundreds of individual requests.
5. Target visual scale: heroes 48–64 px apparent height, common enemies 36–56 px, bosses 100–160 px.
6. Avoid pixel-art packs if they clash with the smoother vector/toon combat style; use them only as composition references.
7. Every imported asset must pass mobile readability and performance checks.

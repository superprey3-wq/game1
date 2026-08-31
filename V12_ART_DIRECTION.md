# Arena Companions — V12 Art Rebuild

V12 is a visual rebuild, not another overlay on V11.

## Target
Readable top-down / three-quarter action-RPG presentation inspired by the clarity and richness of polished 2D action games, without copying Terraria or any other game's copyrighted characters/assets.

## First vertical slice
Only World 1 — Crystal Ruins — is rebuilt first. Do not expand to the other four worlds until this slice looks coherent on a phone.

- 1 hero: Rain
- 1 companion: laser drone
- 3 enemy families: crystal wolf, shard crawler, ruin sentinel
- 1 boss: Crystal Guardian
- 6 visually distinct weapons: plasma gun, drone, moon blades, cryo staff, solar staff, grenades
- environment: grass/stone path, ruined masonry, cliffs, water/waterfall, crystal clusters, vegetation, chest and pickups

## Scale / readability
- Hero visual footprint: ~72–96 px tall on a 1080p reference frame; never a tiny 16 px tile enlarged into a square.
- Common enemies: 48–80 px depending on species.
- Boss: 160–240 px, visibly multi-part and unique.
- Weapons must have recognizable silhouettes and be visible in hand or in flight.
- Props use irregular silhouettes and overlap tiles so the world does not read as a grid.
- Shadows ground actors; additive glows are reserved for magic, crystals and projectiles.

## Animation
Rain: idle 6f, run 8f, aim/fire 6f, hurt 3f, death 8f.
Drone: hover 6f, fire 4f.
Enemies: idle/run/attack/hurt/death. Boss additionally telegraph, slam and crystal burst.

## Camera / composition
Top-down three-quarter view. Camera follows the hero with soft damping. World is composed from 48/64 px terrain modules plus large props. Avoid visible checkerboard repetition by using variants, decals and edge pieces.

## UI
Large weapon cards with real artwork, level and short function label. Mobile controls stay clear of combat. Boss bar is large and named. Damage numbers are secondary to silhouettes/effects.

## Asset sourcing rules
Prefer original generated art or verified permissive packs. Kenney Top-down Shooter is CC0 and contains 580+ separate 2D files; it is suitable for temporary/reference props and readable top-down weapon/character language. LPC offers richer 32 px three-quarter characters and animation, but much of it requires attribution/share-alike; do not vendor LPC art without carrying exact credits/licenses.

Research references:
- Kenney Top-down Shooter: https://www.kenney.nl/assets/top-down-shooter — CC0, 580+ files.
- OpenGameArt Liberated Pixel Cup: https://github.com/OpenGameArt/LiberatedPixelCup — CC BY-SA 3.0 / GPL 3.0.
- Universal LPC generator: https://github.com/LiberatedPixelCup/Universal-LPC-Spritesheet-Character-Generator — per-asset licensing/credits.

## Generation brief
When generating original sprites, do not ask for a screenshot of a full game UI. Generate isolated production assets on transparent background in consistent orthographic three-quarter view, fixed scale and lighting. Character sheets must keep proportions/outfit/colors identical across frames.

### Rain master prompt
Original sci-fi fantasy top-down three-quarter action-RPG hero sprite sheet, white-haired young adult male ranger named Rain, athletic human proportions, large readable head/hands/boots, dark navy tactical coat with cyan luminous trim, black fitted armor, blue scarf, futuristic plasma rifle held clearly in both hands; polished hand-painted 2D game sprite, crisp silhouette, detailed fabric and metal, no chibi cube body, no voxel geometry, no square torso, no text, transparent background, consistent 3/4 overhead camera and lighting. Produce coherent animation frames: idle, running, aiming/firing, hurt and death; preserve exact face, hairstyle, costume and rifle design across every frame.

### Crystal wolf prompt
Original quadruped crystal wolf enemy for a polished top-down three-quarter action RPG, clearly animal anatomy with long muzzle, four articulated legs, tail and hunched predatory posture, dark slate fur/rock hide with luminous violet-blue crystal spines growing naturally from shoulders and back, glowing eyes, readable at mobile scale, hand-painted 2D sprite, irregular organic silhouette, no cube body, no geometric placeholder, transparent background, coherent run/attack/hurt/death frames, same camera and lighting as Rain.

### Crystal Guardian prompt
Original huge Crystal Guardian boss for top-down three-quarter action RPG, towering asymmetrical stone golem with massive arms, small armored head, cracked ancient masonry body and clusters of luminous purple/cyan crystals erupting from shoulders, back and chest core, 3–4 times hero height, unmistakable boss silhouette, hand-painted 2D sprite, rich material detail, transparent background; idle, walk, telegraphed slam, crystal burst, hurt and death frames; no square placeholder body, no UI, no text.

### Crystal Ruins environment prompt
Original modular top-down three-quarter fantasy sci-fi ruins environment asset sheet: mossy irregular stone paths, broken arches and pillars, cliff edges, turquoise water and waterfall pieces, dense ferns/flowers, purple/cyan crystal clusters, rubble, glowing chest, small decals and transition edges; polished hand-painted 2D game art, consistent 48/64 px module scale, transparent background where appropriate, irregular silhouettes, seamless terrain connections, no characters, no UI, no text, avoid obvious checkerboard repetition.

## Acceptance test
On a phone screenshot with the HUD hidden, a new viewer must be able to identify Rain, his equipped weapon, his companion, each enemy family, the boss, a chest and the Crystal Ruins biome without explanation. If any actor still reads as a colored square/diamond, the art pass is not accepted.
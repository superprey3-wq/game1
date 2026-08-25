# Arena Satellites — Production Content Roadmap

## Production target
A polished Unity WebGL survivor/action-RPG for Yandex Games with 5 worlds, 5 heroes, 5 pets, a broad weapon pool, gear, permanent progression, bosses and replayable builds.

## Build order
1. Xeno Jungle — vertical slice and quality benchmark.
2. Crystal Ruins — second biome using the same runtime/content pipeline.
3. Red Forge — industrial/robot-heavy biome.
4. Ice Wastes — frozen colony biome.
5. Orbital Station — late-game endgame biome.

## World 1 — Xeno Jungle status
Implemented in `unity-rebuild`:
- unified production Unity project under `UnityProject/` (Unity 6 WebGL/URP package manifest);
- data-driven global database for 5 worlds, 5 heroes, 5 pets, 10 weapon families, gear and upgrades;
- CC0 Kenney import pipeline for Captain Rain, robot/infected enemies, lasers/impacts and Xeno Jungle tiles;
- automatic scene builder for `World_XenoJungle`;
- Captain Rain movement/aim runtime;
- automatic target acquisition and projectile combat;
- enemy health, hit flash, death feedback and camera shake;
- five enemy archetypes: Runner, Spitter, Scout Drone, Brute Robot, Summoner;
- Orb pet orbit/magnet behavior;
- Xeno Jungle run director with waves, escalating spawn rate and boss timing;
- Xeno Queen two-phase boss runtime;
- initial production HUD runtime.

Still required before owner review:
- finish prefab wiring from the scene builder into the wave director;
- replace temporary enemy visual reuse with distinct alien/robot art per archetype;
- final Captain Rain animation states and firing pose;
- 6+ World 1 weapons with visible projectile/VFX differences;
- XP/loot/gear pickup loop and level-up UI;
- boss health binding and Queen projectile patterns/telegraphs;
- richer foliage/crystal/ruin dressing, lighting and post-processing;
- mobile controls;
- compile/test in Unity and produce WebGL review build.

## Content targets
### Worlds
- Xeno Jungle
- Crystal Ruins
- Red Forge
- Ice Wastes
- Orbital Station

### Heroes
- Captain Rain — Assault
- Luna — Tech
- Ice — Marksman
- Chaos — Tank
- Shade — Rogue

### Pets
- Orb — pickup/magnet
- Mecha Fox — movement speed
- Scout Owl — XP/support
- Mini Dragon — damage
- Battle Wolf — fire rate

### Weapon families
Pulse Rifle, Plasma Caster, Rocket Pod, Prism Laser, Chain Lightning, Grav Mines, Orbit Blades, Frost Cannon, Attack Drones, Heavy Cannon. Each family can evolve at max level.

### Gear
Helmet, Armor, Implant, Weapon Module, Boots, Artifact. Gear uses rarity tiers Common → Legendary and can modify combat stats/build identity.

## Rule
Do not start polishing World 2 until World 1 feels like a real released game rather than a prototype and has been reviewed by the owner.

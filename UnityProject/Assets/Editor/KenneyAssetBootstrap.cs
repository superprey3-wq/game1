#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using UnityEditor;
using UnityEngine;

public static class KenneyAssetBootstrap
{
    private const string Root = "Assets/Art/Kenney";
    private const string Mirror = "https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/";

    private static readonly Dictionary<string,string> Files = new()
    {
        {"Characters/CaptainRain/stand.png", "topdown-shooter/PNG/Soldier%201/soldier1_stand.png"},
        {"Characters/CaptainRain/hold.png",  "topdown-shooter/PNG/Soldier%201/soldier1_hold.png"},
        {"Characters/CaptainRain/gun.png",   "topdown-shooter/PNG/weapon_machine.png"},

        // Distinct World 1 enemy silhouettes. Alien variants are from Kenney More Enemies Animations (CC0).
        {"Enemies/Runner/stand.png",   "moreenemiesanimations/Alien%20sprites/alienGreen_stand.png"},
        {"Enemies/Runner/walk1.png",   "moreenemiesanimations/Alien%20sprites/alienGreen_walk1.png"},
        {"Enemies/Runner/walk2.png",   "moreenemiesanimations/Alien%20sprites/alienGreen_walk2.png"},
        {"Enemies/Spitter/stand.png",  "moreenemiesanimations/Alien%20sprites/alienPink_stand.png"},
        {"Enemies/Spitter/walk1.png",  "moreenemiesanimations/Alien%20sprites/alienPink_walk1.png"},
        {"Enemies/Summoner/stand.png", "moreenemiesanimations/Alien%20sprites/alienBeige_stand.png"},
        {"Enemies/Summoner/hurt.png",  "moreenemiesanimations/Alien%20sprites/alienBeige_hurt.png"},
        {"Enemies/Robot/stand.png",     "topdown-shooter/PNG/Robot%201/robot1_stand.png"},
        {"Enemies/Robot/hold.png",      "topdown-shooter/PNG/Robot%201/robot1_hold.png"},
        {"Enemies/Robot/gun.png",       "topdown-shooter/PNG/Robot%201/robot1_gun.png"},

        // Sci-fi projectiles / impact VFX.
        {"VFX/laser_blue.png",   "alien-ufo-pack/PNG/laserBlue2.png"},
        {"VFX/laser_green.png",  "alien-ufo-pack/PNG/laserGreen2.png"},
        {"VFX/laser_beige.png",  "alien-ufo-pack/PNG/laserBeige2.png"},
        {"VFX/burst_blue.png",   "alien-ufo-pack/PNG/laserBlue_burst.png"},
        {"VFX/burst_green.png",  "alien-ufo-pack/PNG/laserGreen_burst.png"},
        {"VFX/burst_beige.png",  "alien-ufo-pack/PNG/laserBeige_burst.png"},
        {"Props/ufo_dome.png",   "alien-ufo-pack/PNG/dome.png"},

        // World 1 floor/wall/cover tiles. Tinting/layering creates the xeno-jungle palette.
        {"Worlds/XenoJungle/tile_ground_01.png", "topdown-shooter/PNG/Tiles/tile_01.png"},
        {"Worlds/XenoJungle/tile_ground_02.png", "topdown-shooter/PNG/Tiles/tile_02.png"},
        {"Worlds/XenoJungle/tile_ground_03.png", "topdown-shooter/PNG/Tiles/tile_03.png"},
        {"Worlds/XenoJungle/tile_ground_04.png", "topdown-shooter/PNG/Tiles/tile_04.png"},
        {"Worlds/XenoJungle/tile_ruin_01.png",   "topdown-shooter/PNG/Tiles/tile_05.png"},
        {"Worlds/XenoJungle/tile_ruin_02.png",   "topdown-shooter/PNG/Tiles/tile_06.png"},
        {"Worlds/XenoJungle/tile_ruin_03.png",   "topdown-shooter/PNG/Tiles/tile_07.png"},
        {"Worlds/XenoJungle/tile_ruin_04.png",   "topdown-shooter/PNG/Tiles/tile_08.png"},
        {"Worlds/XenoJungle/tile_cover_01.png",  "topdown-shooter/PNG/Tiles/tile_09.png"},
        {"Worlds/XenoJungle/tile_cover_02.png",  "topdown-shooter/PNG/Tiles/tile_10.png"},
        {"Worlds/XenoJungle/tile_cover_03.png",  "topdown-shooter/PNG/Tiles/tile_100.png"},
        {"Worlds/XenoJungle/tile_cover_04.png",  "topdown-shooter/PNG/Tiles/tile_101.png"},
    };

    [MenuItem("Arena Satellites/Art/Download CC0 Kenney Starter Set")]
    public static async void Download()
    {
        Directory.CreateDirectory(Root);
        using var client = new HttpClient();
        int ok = 0;
        foreach (var pair in Files)
        {
            var destination = Path.Combine(Root, pair.Key);
            Directory.CreateDirectory(Path.GetDirectoryName(destination)!);
            try
            {
                var bytes = await client.GetByteArrayAsync(Mirror + pair.Value);
                await File.WriteAllBytesAsync(destination, bytes);
                ok++;
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"Could not download {pair.Key}: {ex.Message}");
            }
        }
        AssetDatabase.Refresh();
        ConfigureSprites();
        Debug.Log($"Arena Satellites: imported {ok}/{Files.Count} CC0 Kenney assets.");
    }

    private static void ConfigureSprites()
    {
        foreach (var pair in Files)
        {
            var assetPath = (Root + "/" + pair.Key).Replace('\\','/');
            if (AssetImporter.GetAtPath(assetPath) is not TextureImporter ti) continue;
            ti.textureType = TextureImporterType.Sprite;
            ti.spriteImportMode = SpriteImportMode.Single;
            ti.alphaIsTransparency = true;
            ti.mipmapEnabled = false;
            ti.filterMode = FilterMode.Bilinear;
            ti.textureCompression = TextureImporterCompression.CompressedHQ;
            ti.spritePixelsPerUnit = 64;
            ti.SaveAndReimport();
        }
    }
}
#endif

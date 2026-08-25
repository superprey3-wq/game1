#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using UnityEditor;
using UnityEngine;

public static class KenneyAssetBootstrap
{
    private const string Root = "UnityProject/Assets/Art/Kenney";
    private const string Mirror = "https://raw.githubusercontent.com/ETdoFresh/kenney.nl/master/";

    private static readonly Dictionary<string,string> Files = new()
    {
        // Captain Rain / human units
        {"Characters/CaptainRain/stand.png", "topdown-shooter/PNG/Soldier%201/soldier1_stand.png"},
        {"Characters/CaptainRain/hold.png",  "topdown-shooter/PNG/Soldier%201/soldier1_hold.png"},
        {"Characters/CaptainRain/gun.png",   "topdown-shooter/PNG/weapon_machine.png"},

        // Mechanical / infected enemy placeholders for the first vertical slice
        {"Enemies/Robot/stand.png",  "topdown-shooter/PNG/Robot%201/robot1_stand.png"},
        {"Enemies/Robot/hold.png",   "topdown-shooter/PNG/Robot%201/robot1_hold.png"},
        {"Enemies/Runner/stand.png", "topdown-shooter/PNG/Zombie%201/zoimbie1_stand.png"},
        {"Enemies/Runner/hold.png",  "topdown-shooter/PNG/Zombie%201/zoimbie1_hold.png"},

        // Sci-fi projectiles / impact VFX
        {"VFX/laser_blue.png",   "alien-ufo-pack/PNG/laserBlue2.png"},
        {"VFX/laser_green.png",  "alien-ufo-pack/PNG/laserGreen2.png"},
        {"VFX/laser_beige.png",  "alien-ufo-pack/PNG/laserBeige2.png"},
        {"VFX/burst_blue.png",   "alien-ufo-pack/PNG/laserBlue_burst.png"},
        {"VFX/burst_green.png",  "alien-ufo-pack/PNG/laserGreen_burst.png"},
        {"VFX/burst_beige.png",  "alien-ufo-pack/PNG/laserBeige_burst.png"},
        {"Props/ufo_dome.png",   "alien-ufo-pack/PNG/dome.png"},
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
        Debug.Log($"Arena Satellites: imported {ok}/{Files.Count} CC0 Kenney starter assets.");
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
            ti.SaveAndReimport();
        }
    }
}
#endif

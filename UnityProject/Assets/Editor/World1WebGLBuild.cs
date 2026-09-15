#if UNITY_EDITOR
using System;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;

public static class World1WebGLBuild
{
    private const string ScenePath = "Assets/Scenes/World_XenoJungle.unity";
    private const string OutputPath = "Build/WebGL";

    public static void Build()
    {
        Debug.Log("[World1Build] Rebuilding Xeno Jungle review scene...");
        XenoJungleSceneBuilder.Build();
        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh();

        PlayerSettings.productName = "Arena Satellites - Xeno Jungle";
        PlayerSettings.companyName = "Arena Satellites";
        PlayerSettings.WebGL.memorySize = 512;

        var options = new BuildPlayerOptions
        {
            scenes = new[] { ScenePath },
            locationPathName = OutputPath,
            target = BuildTarget.WebGL,
            options = BuildOptions.CleanBuildCache
        };

        BuildReport report = BuildPipeline.BuildPlayer(options);
        var summary = report.summary;
        Debug.Log($"[World1Build] Result={summary.result}, size={summary.totalSize}, time={summary.totalTime}");

        if (summary.result != BuildResult.Succeeded)
            throw new Exception($"World 1 WebGL build failed: {summary.result} ({summary.totalErrors} errors)");
    }
}
#endif

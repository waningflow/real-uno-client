import React from 'react';
import * as BABYLON from 'babylonjs';
import './index.less';

class Game extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var canvas = document.getElementById('game-canvas'); // Get the canvas element
    var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

    /******* Add the create scene function ******/
    var createScene = function () {
      // Create the scene space
      var scene = new BABYLON.Scene(engine);

      // Add a camera to the scene and attach it to the canvas
      var camera = new BABYLON.ArcRotateCamera(
        'Camera',
        -Math.PI / 2,
        Math.PI / 4,
        6,
        BABYLON.Vector3.Zero(),
        scene
      );
      camera.attachControl(canvas, true);
      camera.minZ = 0.1;

      // Initialize GizmoManager
      var gizmoManager = new BABYLON.GizmoManager(scene);

      // Initialize all gizmos
      gizmoManager.boundingBoxGizmoEnabled = true;
      gizmoManager.positionGizmoEnabled = true;
      gizmoManager.rotationGizmoEnabled = true;
      gizmoManager.scaleGizmoEnabled = true;

      // Modify gizmos based on keypress
      document.onkeydown = (e) => {
        if (e.key == 'w' || e.key == 'e' || e.key == 'r' || e.key == 'q') {
          // Switch gizmo type
          gizmoManager.positionGizmoEnabled = false;
          gizmoManager.rotationGizmoEnabled = false;
          gizmoManager.scaleGizmoEnabled = false;
          gizmoManager.boundingBoxGizmoEnabled = false;
          if (e.key == 'w') {
            gizmoManager.positionGizmoEnabled = true;
          }
          if (e.key == 'e') {
            gizmoManager.rotationGizmoEnabled = true;
          }
          if (e.key == 'r') {
            gizmoManager.scaleGizmoEnabled = true;
          }
          if (e.key == 'q') {
            gizmoManager.boundingBoxGizmoEnabled = true;
          }
        }
        if (e.key == 'y') {
          // hide the gizmo
          gizmoManager.attachToMesh(null);
        }
        if (e.key == 'a') {
          // Toggle local/global gizmo rotation positioning
          gizmoManager.gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh = !gizmoManager
            .gizmos.positionGizmo.updateGizmoRotationToMatchAttachedMesh;
          gizmoManager.gizmos.rotationGizmo.updateGizmoRotationToMatchAttachedMesh = !gizmoManager
            .gizmos.rotationGizmo.updateGizmoRotationToMatchAttachedMesh;
        }
        if (e.key == 's') {
          // Toggle distance snapping
          if (gizmoManager.gizmos.scaleGizmo.snapDistance == 0) {
            gizmoManager.gizmos.scaleGizmo.snapDistance = 0.3;
            gizmoManager.gizmos.rotationGizmo.snapDistance = 0.3;
            gizmoManager.gizmos.positionGizmo.snapDistance = 0.3;
          } else {
            gizmoManager.gizmos.scaleGizmo.snapDistance = 0;
            gizmoManager.gizmos.rotationGizmo.snapDistance = 0;
            gizmoManager.gizmos.positionGizmo.snapDistance = 0;
          }
        }
        if (e.key == 'd') {
          // Toggle gizmo size
          if (gizmoManager.gizmos.scaleGizmo.scaleRatio == 1) {
            gizmoManager.gizmos.scaleGizmo.scaleRatio = 1.5;
            gizmoManager.gizmos.rotationGizmo.scaleRatio = 1.5;
            gizmoManager.gizmos.positionGizmo.scaleRatio = 1.5;
          } else {
            gizmoManager.gizmos.scaleGizmo.scaleRatio = 1;
            gizmoManager.gizmos.rotationGizmo.scaleRatio = 1;
            gizmoManager.gizmos.positionGizmo.scaleRatio = 1;
          }
        }
      };

      // Start by only enabling position control
      document.onkeydown({ key: 'w' });

      // Create objects
      var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
        'http://texture.waningflow.com/uno/environment.dds',
        scene
      );
      var hdrSkybox = BABYLON.Mesh.CreateBox('hdrSkyBox', 1000.0, scene);
      hdrSkybox.isPickable = false;
      var hdrSkyboxMaterial = new BABYLON.PBRMaterial('skyBox', scene);
      hdrSkyboxMaterial.backFaceCulling = false;
      hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
      hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
      hdrSkyboxMaterial.microSurface = 1.0;
      hdrSkyboxMaterial.disableLighting = true;
      hdrSkybox.material = hdrSkyboxMaterial;
      hdrSkybox.infiniteDistance = true;
      var sphereGlass = BABYLON.Mesh.CreateSphere('sphereGlass', 48, 1.0, scene);
      sphereGlass.translate(new BABYLON.Vector3(1, 0, 0), -3);
      var sphereMetal = BABYLON.Mesh.CreateSphere('sphereMetal', 48, 1.0, scene);
      sphereMetal.translate(new BABYLON.Vector3(1, 0, 0), 3);
      var spherePlastic = BABYLON.Mesh.CreateSphere('spherePlastic', 48, 1.0, scene);
      spherePlastic.translate(new BABYLON.Vector3(0, 0, 1), -3);
      var woodPlank = BABYLON.MeshBuilder.CreateBox(
        'plane',
        { width: 3, height: 0.1, depth: 3 },
        scene
      );
      var glass = new BABYLON.PBRMaterial('glass', scene);
      glass.reflectionTexture = hdrTexture;
      glass.refractionTexture = hdrTexture;
      glass.linkRefractionWithTransparency = true;
      glass.indexOfRefraction = 0.52;
      glass.alpha = 0;
      glass.microSurface = 1;
      glass.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      glass.albedoColor = new BABYLON.Color3(0.85, 0.85, 0.85);
      sphereGlass.material = glass;
      var metal = new BABYLON.PBRMaterial('metal', scene);
      metal.reflectionTexture = hdrTexture;
      metal.microSurface = 0.96;
      metal.reflectivityColor = new BABYLON.Color3(0.85, 0.85, 0.85);
      metal.albedoColor = new BABYLON.Color3(0.01, 0.01, 0.01);
      sphereMetal.material = metal;
      var plastic = new BABYLON.PBRMaterial('plastic', scene);
      plastic.reflectionTexture = hdrTexture;
      plastic.microSurface = 0.96;
      plastic.albedoColor = new BABYLON.Color3(0.206, 0.94, 1);
      plastic.reflectivityColor = new BABYLON.Color3(0.003, 0.003, 0.003);
      spherePlastic.material = plastic;
      var wood = new BABYLON.PBRMaterial('wood', scene);
      wood.reflectionTexture = hdrTexture;
      wood.environmentIntensity = 1;
      wood.specularIntensity = 0.3;
      wood.reflectivityTexture = new BABYLON.Texture(
        'http://texture.waningflow.com/uno/reflectivity.png',
        scene
      );
      wood.useMicroSurfaceFromReflectivityMapAlpha = true;
      wood.albedoColor = BABYLON.Color3.White();
      wood.albedoTexture = new BABYLON.Texture(
        'http://texture.waningflow.com/uno/albedo.png',
        scene
      );
      woodPlank.material = wood;
      return scene;
    };
    /******* End of the create scene function ******/

    var scene = createScene(); //Call the createScene function

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
      scene.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener('resize', function () {
      engine.resize();
    });
  }

  render() {
    return (
      <div className="game-container">
        <canvas id="game-canvas" touch-action="none" />
      </div>
    );
  }
}

export default Game;

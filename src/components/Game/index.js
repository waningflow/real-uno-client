import React from 'react';
import * as BABYLON from 'babylonjs';
import Scene from 'babylonjs-hook';
import './index.less';

class Game extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSceneReady(scene) {
    const canvas = scene.getEngine().getRenderingCanvas();
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
    wood.albedoTexture = new BABYLON.Texture('http://texture.waningflow.com/uno/albedo.png', scene);
    woodPlank.material = wood;
  }

  render() {
    return (
      <div className="game-container">
        <Scene onSceneReady={this.handleSceneReady} className="game-canvas" />
      </div>
    );
  }
}

export default Game;

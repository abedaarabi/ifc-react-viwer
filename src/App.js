import "./App.css";
import React from "react";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  GridHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IFCLoader } from "web-ifc-three/IFCLoader";

function App() {
  const ifcLoader = new IFCLoader();
  ifcLoader.ifcManager.setWasmPath("../wasm/web-ifc.wasm");

  const scene = new Scene();
  const refConvas = React.useRef(null);
  const refInput = React.useRef(null);
  const [file, setFile] = React.useState(null);
  React.useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window;

    const size = {
      width: 800,
      height: 600,
    };
    //Creates the camera (point of view of the user)
    const aspect = size.width / size.height;
    const camera = new PerspectiveCamera(75, aspect);
    camera.position.z = 15;
    camera.position.y = 13;
    camera.position.x = 8;
    //Creates the lights of the scene
    const lightColor = "0001";
    const ambientLight = new AmbientLight(lightColor, 1.5);
    scene.add(ambientLight);
    const directionalLight = new DirectionalLight(lightColor, 1);
    directionalLight.position.set(0, 10, 0);
    directionalLight.target.position.set(-5, 0, 0);
    scene.add(directionalLight);
    scene.add(directionalLight.target);
    const renderer = new WebGLRenderer({
      canvas: refConvas.current,
      alpha: true,
    });
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    //Creates grids and axes in the scene
    const grid = new GridHelper(50, 30);
    scene.add(grid);
    const axes = new AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 1;
    scene.add(axes);
    //Creates the orbit controls (to navigate the scene)
    const controls = new OrbitControls(camera, refConvas.current);
    controls.enableDamping = true;
    controls.target.set(-2, 0, 0);
    //Animation loop
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // const ifcURL = URL.createObjectURL(file);
    ifcLoader.load(file, (ifcModel) => {
      scene.add(ifcModel);
      console.log(ifcModel);
    });
  }, [file]);
  console.log(file);
  return (
    <div className="App">
      <div>
        <p>Hello IFC</p>
        <input
          type="file"
          name="load"
          ref={refInput}
          id="file-input"
          onChange={(event) => setFile(event.target.files[0])}
        />
        <canvas id="three-canvas" ref={refConvas}></canvas>
      </div>
    </div>
  );
}

export default App;

import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../build/OrbitControls.js';
import { OBJLoader } from '../build/OBJLoader.js';
import { MTLLoader } from '../build/MTLLoader.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas, alpha: true});
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;

  let camera;
  function initCamera() {
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    
    camera.position.set(10,20,30);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(5, 10, 5);
    controls.update();
  }

  initCamera();

  const scene = new THREE.Scene();

  {const color = 0xFFFFFF;
    const intensity = 0.4;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
  }

  {const skyColor = 0xB2E1FF;
    const groundColor = 0xB98A20;
    const intensity = 0.5;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(-8, 22, -15);
    light.castShadow = true;
    scene.add(light);
  }

  {
    const color = 0xFFEAD0;
    const intensity = 0.2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);

    scene.add(light);
    scene.add(light.target);
  }

  {const planeSize = 80;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('../sand.jpg');
    texture.encoding = THREE.sRGBEncoding;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.receiveShadow = true;
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
  }

  {const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      '../background/px.png',
      '../background/nx.png',
      '../background/py.png',
      '../background/ny.png',
      '../background/pz.png',
      '../background/nz.png',
    ]);
    scene.background = texture;
  }

  {const color = 0xE2F4F8;
    const near = 0;
    const far = 80;
    scene.fog = new THREE.Fog(color, near, far);
  }

  //////////// tag label //////////////////
  function makeLabel(labelWidth, size, name, posxyz) {
    const canvas = makeLabelCanvas(labelWidth, size, name);
    const texture = new THREE.CanvasTexture(canvas);

    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    const labelMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    });

    const root = new THREE.Object3D();

    const labelBaseScale = 0.01;
    const label = new THREE.Sprite(labelMaterial);
    root.add(label);
    label.position.x = posxyz[0];
    label.position.y = posxyz[1] + 4;
    label.position.z = posxyz[2];

    label.scale.x = canvas.width * labelBaseScale;
    label.scale.y = canvas.height * labelBaseScale;

    scene.add(root);
    return root;
  }

  function makeLabelCanvas(baseWidth, size, name) {
    const borderSize = 2;
    const ctx = document.createElement('canvas').getContext('2d');
    const textWidth = ctx.measureText(name).width;

    const doubleBorderSize = borderSize * 2;
    const width = baseWidth + doubleBorderSize;
    const height = size + doubleBorderSize;
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    ctx.font = '80px Calibri';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, width, height);

    const scaleFactor = Math.min(1, baseWidth / textWidth);
    ctx.translate(width / 2, height / 2);
    ctx.scale(scaleFactor, 1);
    ctx.fillStyle = 'white';
    ctx.fillText(name, 0, 0);

    return ctx.canvas;
  }

  /////////// Surface area ////////////////
  {const mtlLoader = new MTLLoader();
    mtlLoader.load('../Garden/Garden.mtl', (mtl) => {
      mtl.preload();
      for (const material of Object.values(mtl.materials)) {
        material.side = THREE.DoubleSide;
      }
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);

      objLoader.load('../Garden/Garden.obj', (root) => {
        root.traverse(function (obj) {
          if (obj.isMesh) {
            obj.receiveShadow = true;
            obj.castShadow = true;
            obj.material.color.set(0xffffff);
          }
        });
        root.scale.set(3.5, 3.5, 3.5);
        root.position.set(0, -1.9, 0);
        scene.add(root);
      });
    });
  }

  /////////// Objects /////////////////
   {const mtlLoader = new MTLLoader();
    mtlLoader.load('../Puppy/Mesh_Puppy.mtl', (mtl) => {
      mtl.preload();
      for (const material of Object.values(mtl.materials)) {
        material.side = THREE.DoubleSide;
      }
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);

      objLoader.load('../Puppy/Mesh_Puppy.obj', (root) => {
        root.traverse(function (obj) {
          if (obj.isMesh) {
            obj.receiveShadow = true;
            obj.castShadow = true;
            obj.material.color.set(0xffffff);
          }
        });
        root.rotation.y = 90;
        root.scale.set(.08, .08, .08);
        root.position.set(-20, 2.5, 18);
        scene.add(root);
      });
    });
  }
  makeLabel(400, 100, 'Lucy', [-20, 2.5, 18]);

  {const mtlLoader = new MTLLoader();
    mtlLoader.load('../GolfCart/materials.mtl', (mtl) => {
      mtl.preload();
      for (const material of Object.values(mtl.materials)) {
        material.side = THREE.DoubleSide;
      }
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);

      objLoader.load('../GolfCart/model.obj', (root) => {
        root.traverse(function (obj) {
          if (obj.isMesh) {
            obj.receiveShadow = true;
            obj.castShadow = true;
          }
        });
        root.rotation.y = 0;
        root.scale.set(5,5,5);
        root.position.set(-10, 4.5, 6);
        scene.add(root);
      });
    });
  }

  {const mtlLoader = new MTLLoader();
    mtlLoader.load('../Golfer/materials.mtl', (mtl) => {
      mtl.preload();
      for (const material of Object.values(mtl.materials)) {
        material.side = THREE.DoubleSide;
      }
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);

      objLoader.load('../Golfer/model.obj', (root) => {
        root.traverse(function (obj) {
          if (obj.isMesh) {
            obj.receiveShadow = true;
            obj.castShadow = true;
          }
        });
        root.scale.set(5,5,5);
        root.position.set(0, 3, 25);
        scene.add(root);
      });
    });
  }
  makeLabel(400, 100, 'golfer', [0, 3, 25]);

  // {const mtlLoader = new MTLLoader();
  //   mtlLoader.load('./Shrub/Shrub.mtl', (mtl) => {
  //     mtl.preload();
  //     for (const material of Object.values(mtl.materials)) {
  //       material.side = THREE.DoubleSide;
  //     }
  //     const objLoader = new OBJLoader();
  //     objLoader.setMaterials(mtl);

  //     objLoader.load('./Shrub/Shrub.obj', (root) => {
  //       root.traverse(function (obj) {
  //         if (obj.isMesh) {
  //           obj.receiveShadow = true;
  //           obj.castShadow = true;
  //           obj.material.color.set(0xffffff);
  //         }
  //       });
  //       root.scale.set(1.5, 1.5, 1.5);
  //       root.position.set(-11, 0, -21);
  //       scene.add(root);
  //     });
  //   });
  // }
  // makeLabel(400, 100, 'shrub', [-11, 6, -21]);


  /////////////////// boxes and cubes ///////////////////
  const cubes = [];
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const loadManager = new THREE.LoadingManager();
  const loader = new THREE.TextureLoader();

  const materials = [  ];

  const cube = new THREE.Mesh(geometry, materials);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(13, 3.5, -20);
  cube.rotation.y = 15;
  scene.add(cube);
  
  {const boxWidth1 = 1;
    const boxHeight1 = 1;
    const boxDepth1 = 1;
    const geometry1 = new THREE.BoxGeometry(boxWidth1, boxHeight1, boxDepth1);
    const material1 = new THREE.MeshPhongMaterial({ color: 0x75548A });
    const cube1 = new THREE.Mesh(geometry1, material1);
    cube1.castShadow = true;
    cube1.receiveShadow = true;
    cube1.position.set(-2, 0.5, 22);
    scene.add(cube1);
  }
  makeLabel(400, 100, 'box1', [-2, 0.5, 22]);

  {const boxWidth1 = 1;
    const boxHeight1 = 1;
    const boxDepth1 = 1;
    const geometry1 = new THREE.BoxGeometry(boxWidth1, boxHeight1, boxDepth1);
    const material1 = new THREE.MeshPhongMaterial({ color: 0x75548A });
    const cube1 = new THREE.Mesh(geometry1, material1);
    cube1.castShadow = true;
    cube1.receiveShadow = true;
    cube1.position.set(5, 0.5, 25);
    scene.add(cube1);
  }
  makeLabel(400, 100, 'box2', [5, 0.5, 25]);


  /////////////////// WALLS ///////////////////

  {const boxWidth1 = 83;
    const boxHeight1 = 5;
    const boxDepth1 = 3;
    const geometry1 = new THREE.BoxGeometry(boxWidth1, boxHeight1, boxDepth1);
    const loader1 = new THREE.TextureLoader();
    const material1 = new THREE.MeshPhongMaterial({ map: loader1.load('../textures/fence.jpg') });
    const cube1 = new THREE.Mesh(geometry1, material1);

    cube1.position.set(0, 2.5, -40);
    scene.add(cube1);
  }

  {const boxWidth1 = 83;
    const boxHeight1 = 5;
    const boxDepth1 = 3;
    const geometry1 = new THREE.BoxGeometry(boxWidth1, boxHeight1, boxDepth1);
    const loader1 = new THREE.TextureLoader();
    const material1 = new THREE.MeshPhongMaterial({ map: loader1.load('../textures/fence.jpg') });
    const cube1 = new THREE.Mesh(geometry1, material1);

    cube1.position.set(0, 2.5, 40);
    scene.add(cube1);
  }

  {const boxWidth1 = 82;
    const boxHeight1 = 5;
    const boxDepth1 = 3;
    const geometry1 = new THREE.BoxGeometry(boxWidth1, boxHeight1, boxDepth1);
    const loader1 = new THREE.TextureLoader();
    const material1 = new THREE.MeshPhongMaterial({ map: loader1.load('../textures/fence.jpg') });
    const cube1 = new THREE.Mesh(geometry1, material1);

    cube1.position.set(-40, 2.5, 0);
    cube1.rotation.y = Math.PI / 2;
    scene.add(cube1);
  }

  {const boxWidth1 = 82;
    const boxHeight1 = 5;
    const boxDepth1 = 3;
    const geometry1 = new THREE.BoxGeometry(boxWidth1, boxHeight1, boxDepth1);
    const loader1 = new THREE.TextureLoader();
    const material1 = new THREE.MeshPhongMaterial({ map: loader1.load('../textures/fence.jpg') });
    const cube1 = new THREE.Mesh(geometry1, material1);

    cube1.position.set(40, 2.5, 0);
    cube1.rotation.y = Math.PI / 2;
    scene.add(cube1);
  }

  ////////////////// spheres ////////////////////

  {const sphereRadius = 3.2;
    const sphereWidthDivisions = 30;
    const sphereHeightDivisions = 15;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const numSpheres = 4;
    for (let i = 0; i < numSpheres; ++i) {
      const sphereMat = new THREE.MeshPhongMaterial();
      sphereMat.color.setHSL(i * .5, 1, 0.1);
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(-sphereRadius - 15, sphereRadius, i * sphereRadius + 1);
      scene.add(mesh);
    }
  }

  {const sphereRadius = 0.6;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const loader1 = new THREE.TextureLoader();
    const sphereMat = new THREE.MeshPhongMaterial({ map: loader1.load('../textures/tennisball.jpg') });
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(3, 1, 22);
    scene.add(mesh);
  }
  makeLabel(400,100, "golf ball", [3,1,22])

  {const geometry1 = new THREE.IcosahedronGeometry(2.3);
    const loader1 = new THREE.TextureLoader();
    const material1 = new THREE.MeshPhongMaterial({ map: loader1.load('../textures/water.jpg') });
    const cube1 = new THREE.Mesh(geometry1, material1);

    cube1.position.set(0, 6.5, -21);
    cubes.push(cube1);
    scene.add(cube1);
  }
  makeLabel(400,100, "fountain", [0, 8, -21])

  {const geometry1 = new THREE.CylinderGeometry(1, 1, 3, 20);
    const material1 = new THREE.MeshPhongMaterial({ color: 'red' });
    const cube1 = new THREE.Mesh(geometry1, material1);
    cube1.castShadow = true;
    cube1.receiveShadow = true;
    cube1.position.set(0, 2, -21);
    scene.add(cube1);
  }

  {const geometry1 = new THREE.CylinderGeometry(0.3, 0.3, 10, 20);
    const material1 = new THREE.MeshPhongMaterial({ color: 0x5C5B59 });
    const cube1 = new THREE.Mesh(geometry1, material1);
    cube1.position.set(0, 5, -21);
    scene.add(cube1);
  }

  {const geometry1 = new THREE.IcosahedronGeometry(1);
    const loader1 = new THREE.TextureLoader();
    const material1 = new THREE.MeshPhongMaterial({ map: loader1.load('../textures/water.jpg') });
    const cube1 = new THREE.Mesh(geometry1, material1);
    cube1.position.set(0, 10, -21);
    cubes.push(cube1);
    scene.add(cube1);
  }

  {const geometry1 = new THREE.TetrahedronGeometry(1);
    const material1 = new THREE.MeshPhongMaterial({ color: 0x5A0B9D });
    const cube1 = new THREE.Mesh(geometry1, material1);
    cube1.castShadow = true;
    cube1.receiveShadow = true;
    cube1.position.set(-5, 2, 21);
    cube1.rotation.y = 10;
    scene.add(cube1);
  }

  {const geometry1 = new THREE.OctahedronGeometry(2);
    const material1 = new THREE.MeshPhongMaterial({ color: 0x8E0E0A });
    const cube1 = new THREE.Mesh(geometry1, material1);
    cube1.castShadow = true;
    cube1.receiveShadow = true;
    cube1.position.set(-8, 2, 18.5);
    cube1.rotation.y = 15;
    scene.add(cube1);
  }

  /////////////////////// render and drawing ///////////////////////

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, ndx) => {
      const speed = 5 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
main();
// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
precision mediump float;
attribute vec4 a_Position;
attribute vec2 a_UV;
varying vec2 v_UV;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;
void main() {
  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  v_UV = a_UV;
}`

// Fragment shader program
var FSHADER_SOURCE = `
precision mediump float;
varying vec2 v_UV;
uniform vec4 u_FragColor;
uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
uniform sampler2D u_Sampler2;
uniform sampler2D u_Sampler3;
uniform sampler2D u_Sampler4;
uniform sampler2D u_Sampler5;
uniform int u_whichTexture;
void main() {
  if (u_whichTexture == -2) {
    gl_FragColor = u_FragColor;
  } else if (u_whichTexture == -1) {
    gl_FragColor = vec4(v_UV, 1.0, 1.0);
  } else if (u_whichTexture == 0) { 
    gl_FragColor = texture2D(u_Sampler0, v_UV);
  } else if (u_whichTexture == 1) {
    gl_FragColor = texture2D(u_Sampler1, v_UV);
  } else if (u_whichTexture == 2) {
    gl_FragColor = texture2D(u_Sampler2, v_UV);
  } else if (u_whichTexture == 3) {
    gl_FragColor = texture2D(u_Sampler3, v_UV);
  } else if (u_whichTexture == 4) {
    gl_FragColor = texture2D(u_Sampler4, v_UV);
  } else if (u_whichTexture == 5) {
    gl_FragColor = texture2D(u_Sampler5, v_UV);
  } else if (u_whichTexture == 6) {
    gl_FragColor = vec4(0.4, 0.56, 0.45, 1.0);
  } else {
    gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);
  }
}`

// Global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_Sampler5;
let u_whichTexture;

function setupWebGL() {
  // Retrieve canvas element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
  }
  gl.enable(gl.DEPTH_TEST);
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();
  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  return ([x, y]);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('bruh');
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_Modelmatrix');
    return;
  }

  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get u_ViewMatrix');
    return;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get u_ProjectionMatrix');
    return;
  }

  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get u_Sampler0');
    return false;
  }

  // Get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get u_Sampler1');
    return false;
  }

  // Get the storage location of u_Sampler2
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get u_Sampler2');
    return false;
  }

  // Get the storage location of u_Sampler3
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
  if (!u_Sampler3) {
    console.log('Failed to get u_Sampler3');
    return false;
  }

  // Get the storage location of u_Sampler4
  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
  if (!u_Sampler4) {
    console.log('Failed to get u_Sampler4');
    return false;
  }

  // Get the storage location of u_Sampler5
  u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
  if (!u_Sampler5) {
    console.log('Failed to get u_Sampler5');
    return false;
  }

  // Get the storage location of u_whichTexture
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get u_whichTexture');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

function initTextures() {
  // Load up images to be used as textures
  var image = new Image();
  if (!image) {
    console.log('Failed to get image');
    return false;
  }

  image.onload = function () { sendImageToTEXTURE0(image); };
  image.crossOrigin = 'anonymous';
  image.src = '../img/sky.jpg';

  var image1 = new Image();
  if (!image1) {
    console.log('Failed to get image1');
    return false;
  }

  image1.onload = function () { sendImageToTEXTURE1(image1); };
  image1.crossOrigin = 'anonymous';
  image1.src = '../img/wood.jpg';

  var image2 = new Image();
  if (!image2) {
    console.log('Failed to get image2');
    return false;
  }

  image2.onload = function () { sendImageToTEXTURE2(image2); };
  image2.crossOrigin = 'anonymous';
  image2.src = '../img/spinach.png';

  var image3 = new Image();
  if (!image3) {
    console.log('Failed to get image3');
    return false;
  }

  image3.onload = function () { sendImageToTEXTURE3(image3); };
  image3.crossOrigin = 'anonymous';
  image3.src = '../img/wood.jpg';

  var image4 = new Image();
  if (!image4) {
    console.log('Failed to get image4');
    return false;
  }

  image4.onload = function () { sendImageToTEXTURE4(image4); };
  image4.crossOrigin = 'anonymous';
  image4.src = '../img/olive.png';

  var image5 = new Image();
  if (!image5) {
    console.log('Failed to get image5');
    return false;
  }

  image5.onload = function () { sendImageToTEXTURE5(image5); };
  image5.crossOrigin = 'anonymous';
  image5.src = '../img/harbor.jpg';

  return true;
}

// Assign images to textures and add attributes
function sendImageToTEXTURE0(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to get texture0');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler0, 0);
}

function sendImageToTEXTURE1(image1) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to get texture1');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image1);
  gl.uniform1i(u_Sampler1, 1);
}

function sendImageToTEXTURE2(image2) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to get texture1');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image2);
  gl.uniform1i(u_Sampler2, 2);
}

function sendImageToTEXTURE3(image3) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to get texture1');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image3);
  gl.uniform1i(u_Sampler3, 3);
}

function sendImageToTEXTURE4(image4) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to get texture1');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE4);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image4);
  gl.uniform1i(u_Sampler4, 4);
}

function sendImageToTEXTURE5(image5) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to get texture1');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE5);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image5);
  gl.uniform1i(u_Sampler5, 5);
}

// Global Variables for UI
let g_AngleX = 0;
let g_camSlider = -180;
let g_AngleY = 0;
let g_leftLeg = 0;
let g_rightLeg = 0;
let g_lshol = 0;
let g_lelb = 0;
let g_lwri = 0;
let g_rshol = 0;
let g_relb = 0;
let g_rwri = 0;
let g_animate = false;
let shift_key = false;
let g_cap = 0;
var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

function addActionForHtmlUI() {

    // Slider Events
    document.getElementById('angleSlide').addEventListener('mousemove', function () { g_camSlider = this.value; renderScene(); });
    document.getElementById('frontLeft').addEventListener('mousemove', function () { g_leftLeg = this.value; renderScene(); });
    document.getElementById('frontRight').addEventListener('mousemove', function () { g_rightLeg = this.value; renderScene(); });
    document.getElementById('lshol').addEventListener('mousemove', function () { g_lshol = this.value; renderScene(); });
    document.getElementById('lelb').addEventListener('mousemove', function () { g_lelb = this.value; renderScene(); });
    document.getElementById('lwri').addEventListener('mousemove', function () { g_lwri = this.value; renderScene(); });
    document.getElementById('rshol').addEventListener('mousemove', function () { g_rshol = this.value; renderScene(); });
    document.getElementById('relb').addEventListener('mousemove', function () { g_relb = this.value; renderScene(); });
    document.getElementById('rwri').addEventListener('mousemove', function () { g_rwri = this.value; renderScene(); }); 
    
    // Buttons
    document.getElementById('on').addEventListener('click', function () { g_animate = true; });
    document.getElementById('off').addEventListener('click', function () { g_animate = false; });
}

function main() {
  // Set up canvas and gl variables
  setupWebGL();

  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionForHtmlUI();
  
  // Register function (event handler) to be called on a key press
  g_camera = new Camera();
  document.onkeydown = keydown;
  initTextures();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  requestAnimationFrame(tick);
}

let time = 0;

function tick() {
  g_seconds = performance.now() / 1000.0 - g_startTime;
  updateAnimationAngles();
  renderScene();
  requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  if (g_animate) {
      g_leftLeg = (10 * Math.sin(g_seconds));
      g_rightLeg = (10 * Math.sin(g_seconds));
      g_lshol = (5 * Math.sin(g_seconds));
      g_rshol = (5 * Math.sin(g_seconds));
  }
}

// Controls the camera movements with keys
function keydown(ev) {
  if (ev.keyCode == 68) { // d
    g_camera.eye.elements[0] += 0.15;
    //g_camera.mvright();
  } else if (ev.keyCode == 65) { // a
    g_camera.eye.elements[0] -= 0.15;
    //g_camera.mvleft();
  } else if (ev.keyCode == 87) { // w
    g_camera.mvforward();
  } else if (ev.keyCode == 83) { // s
    g_camera.mvbackward();
  } else if (ev.keyCode == 81) { // q
    g_camera.panleft();
  } else if (ev.keyCode == 69) { // e
    g_camera.panright();
  }
  renderScene();
}

var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

var yellow = [1.0, 1.0, 0.0, 1.0];
var blue = [0.0, 0.6, 1.0, 1.0];
var brown = [0.7, 0.4, 0.3, 1.0];
var darkBrown = [0.4, 0.2, 0.0, 1.0]; // Dark brown color
var red = [1.0, 0.0, 0.0, 1.0];
var black = [0.0, 0.0, 0.0, 1.0];
var white = [1.0, 1.0, 1.0, 1.0];
var gray = [0.8, 1.0, 1.0, 1.0]

// Draws the blocks in the world
function drawMap() {
  for (let x = 2; x < 3; x++) {
    for (let y = 1; y < 9; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        body.color = darkBrown; // Set the cube's color to dark brown
        body.textureNum = 3;
        body.matrix.translate(x - 3.6, -.8, y - 4.1);
        body.render();
      }
    }
  }

  for (let x = 6; x < 7; x++) {
    for (let y = 1; y < 9; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        body.textureNum = 3;
        body.matrix.translate(x - 3.2, -1.9, y - 4.3);
        body.render();
      }
    }
  }

  for (let x = 9; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        body.textureNum = 3;
        body.matrix.translate(x - 4.0, -.65, y - 4.0);
        body.render();
      }
    }
  }

  for (let x = 0; x < 1; x++) {
    for (let y = 0; y < 10; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        body.textureNum = 3;
        body.matrix.translate(x - 3.8, -.85, y - 4.1);
        body.render();
      }
    }
  }

  for (let x = 0; x < 10; x++) {
    for (let y = 9; y < 10; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        body.textureNum = 3;
        body.matrix.translate(x - 4.1, -.86, y - 4.1);
        body.render();
      }
    }
  }

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 1; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        body.textureNum = 3;
        body.matrix.translate(x - 3.9, -.65, y - 4.1);
        body.render();
      }
    }
  }

  // for (let x = 4; x < 5; x++) {
  //   for (let y = 1; y < 9; y++) {
  //     if (g_map[x][y] == 1) {
  //       var body = new Cube();
  //       body.textureNum = 2;
  //       body.matrix.scale(1.3, 1.3, 0.01);
  //       body.matrix.translate(x - 3.3, -0.2, y - 2.9);
  //       body.render();
  //     }
  //   }
  // }

  // for (let x = 4; x < 5; x++) {
  //   for (let y = 1; y < 9; y++) {
  //     if (g_map[x][y] == 1) {
  //       var body = new Cube();
  //       body.textureNum = 4;
  //       body.matrix.scale(1.3, 1.3, 0.01);
  //       body.matrix.translate(x - 1.5, -0.2, y + 250.9);
  //       body.render();
  //     }
  //   }
  // }

  for (let x = 4; x < 5; x++) {
    for (let y = 1; y < 9; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        body.textureNum = 5;
        body.matrix.scale(1.3, 1.3, 0.01);
        body.matrix.translate(x - 3.5, -0.2, y + 400.9);
        body.render();
      }
    }
  }
}

function renderScene() {
  var startTime = performance.now();
  var projMat = new Matrix4();
  projMat.setPerspective(50, canvas.width / canvas.height, .1, 1000);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Pass the view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(
    g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // Pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_camSlider, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
  // Clear canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Sky
  var sky = new Cube();
  sky.color = [1.0, 0.0, 0.0, 1.0];
  sky.textureNum = 0;
  sky.matrix.scale(50.0, 50.0, 50.0);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();

  // Floor
  var floor = new Cube();
  floor.textureNum = 1;
  floor.matrix.translate(0.0, -0.2, 0.0);
  floor.matrix.scale(10.0, 0.0, 10.0);
  floor.matrix.translate(-0.5, 0.0, -0.5);
  floor.render();

  drawMap();
  
  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "numdot");
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}


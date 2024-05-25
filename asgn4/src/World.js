// Vertex shader program
var VSHADER_SOURCE = `
precision mediump float;
attribute vec2 a_UV;
varying vec2 v_UV;
attribute vec3 a_Normal;
varying vec3 v_Normal;
varying vec4 v_VertPos;
attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;
uniform mat4 u_NormalMatrix;
uniform bool u_normalon;
void main() {
  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  v_UV = a_UV;
  if (u_normalon) {
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
  } else {
    v_Normal = a_Normal;
  }
  v_VertPos = u_ModelMatrix * a_Position;
}`

// Fragment shader program
var FSHADER_SOURCE = `
precision mediump float;
varying vec2 v_UV;
varying vec3 v_Normal;
uniform vec3 u_lightcolor;
uniform vec3 u_lightpos;
uniform vec3 u_camerapos;
varying vec4 v_VertPos;
uniform vec4 u_FragColor;
uniform sampler2D u_Sampler0;
uniform sampler2D u_Sampler1;
uniform sampler2D u_Sampler2;
uniform sampler2D u_Sampler3;
uniform sampler2D u_Sampler4;
uniform sampler2D u_Sampler5;
uniform int u_whichTexture;
uniform bool u_lighton;
void main() {
  if (u_whichTexture == -3) {
    gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0);
  } else if (u_whichTexture == -2) {
    gl_FragColor = u_FragColor;
  } else if (u_whichTexture == -1) {
    gl_FragColor = vec4(v_UV,1.0,1.0);
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
  vec3 lightVector = u_lightpos - vec3(v_VertPos);
  float r = length(lightVector);
  vec3 L = normalize(lightVector);
  vec3 N = normalize(v_Normal);
  float nL = max(dot(N,L), 0.0);
  vec3 R = reflect(L, N);
  vec3 E = normalize(u_camerapos - vec3(v_VertPos));
  float specular = pow(max(dot(E,R), 0.0), 30.0);
  vec3 diff = vec3(gl_FragColor) * nL * 0.7;
  vec3 amb = vec3(gl_FragColor) * 0.3;

  if (u_lighton) {
    if (u_whichTexture == 0) {
      gl_FragColor = vec4(diff + amb, 1.0);
    } else {
      gl_FragColor = vec4(specular * u_lightcolor + diff * u_lightcolor + amb, gl_FragColor.a);
    }
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
let a_Normal;
let u_NormalMatrix;
let u_normalon;
let u_lighton;
let u_lightpos;
let u_camerapos;
let u_lightcolor;

function setupWebGL() {
  // Retrieve <canvas> element
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

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get u_ProjectionMatrix');
    return;
  }

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get u_ViewMatrix');
    return;
  }

  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0'); //sky
  if (!u_Sampler0) {
    console.log('Failed to get u_Sampler0');
    return false;
  }

  // Get the storage location of u_Sampler1
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1'); //grass
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

  // Get the storage location of a_Normal
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }
  
  // Get the storage location of u_NormalMatrix
  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix) {
    console.log('Failed to get the storage location of u_NormalMatrix');
    return;
  }

  // Get the storage location of u_normalon
  u_normalon = gl.getUniformLocation(gl.program, 'u_normalon');
  if (!u_normalon) {
    console.log('Failed to get the storage location of u_normalon');
    return;
  }

  // Get the storage location of u_lighton
  u_lighton = gl.getUniformLocation(gl.program, 'u_lighton');
  if (!u_lighton) {
    console.log('Failed to get u_lighton');
    return;
  }

  // Get the storage location of u_lightpos
  u_lightpos = gl.getUniformLocation(gl.program, 'u_lightpos');
  if (!u_lightpos) {
    console.log('Failed to get the storage location of u_lightpos');
    return;
  }

  // Get the storage location of u_camerapos
  u_camerapos = gl.getUniformLocation(gl.program, 'u_camerapos');
  if (!u_camerapos) {
    console.log('Failed to get the storage location of u_camerapos');
    return;
  }

  // Get the storage location of u_lightcolor
  u_lightcolor = gl.getUniformLocation(gl.program, 'u_lightcolor');
  if (!u_lightcolor) {
    console.log('Failed to get the storage location of u_lightcolor');
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

  var image6 = new Image();
  if (!image6) {
    console.log('Failed to get image6');
    return false;
  }

  image6.onload = function () { sendImageToTEXTURE4(image6); };
  image6.crossOrigin = 'anonymous';
  image6.src = '../img/sun.png';

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

function sendImageToTEXTURE6(image6) {
    var texture = gl.createTexture();
    if (!texture) {
      console.log('Failed to get texture1');
      return false;
    }
  
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image6);
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
let g_lightpos = [0, 1, -2];
let g_lightOn = false;
let g_lightColor = [1.0, 1.0, 1.0];
let g_normalOn = false;
let g_aniLight = true;
let g_cap = 0;
var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;
var g_camera;

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
    document.getElementById('Xcoord').addEventListener('mousemove', function (ev) { if (ev.buttons == 1) { g_lightpos[0] = this.value / 100; renderScene(); } })
    document.getElementById('Ycoord').addEventListener('mousemove', function (ev) { if (ev.buttons == 1) { g_lightpos[1] = this.value / 100; renderScene(); } })
    document.getElementById('Zcoord').addEventListener('mousemove', function (ev) { if (ev.buttons == 1) { g_lightpos[2] = this.value / 100; renderScene(); } })
    document.getElementById('color').addEventListener('mousemove', function () { g_lightColor[2] = this.value / 10; });
    
    // Buttons
    document.getElementById('on').addEventListener('click', function () { g_animate = true; });
    document.getElementById('off').addEventListener('click', function () { g_animate = false; });
    document.getElementById('normalon').addEventListener('click', function () { g_normalOn = true; });
    document.getElementById('normaloff').addEventListener('click', function () { g_normalOn = false; });
    document.getElementById('lighton').addEventListener('click', function () { g_lightOn = true; });
    document.getElementById('lightoff').addEventListener('click', function () { g_lightOn = false; });
    document.getElementById('startlight').addEventListener('click', function () { g_aniLight = true; });
    document.getElementById('stoplight').addEventListener('click', function () { g_aniLight = false; });
}

var xyCoord = [0, 0];

function main() {
  // Set up canvas and gl variables
  setupWebGL();

  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionForHtmlUI();

  // Register function (event handler) to be called on a mouse hold
  canvas.onmousedown = click;
  canvas.onmousemove = function (ev) {
    if (ev.buttons == 1) {
      click(ev, 1)
    } else {
      if (xyCoord[0] != 0) {
        xyCoord = [0, 0];
      }
    }
  }

  g_camera = new Camera();
  document.onkeydown = keydown;
  initTextures();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  requestAnimationFrame(tick);
}

// Rotate viewspace when mouse clicked and dragged
function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);
  if (xyCoord[0] == 0) {
    xyCoord = [x, y];
  }

  g_AngleX += xyCoord[0] - x;
  g_AngleY += xyCoord[1] - y;

  if (Math.abs(g_AngleX / 360) > 1) {
    g_AngleX = 0;
  }

  if (Math.abs(g_AngleY / 360) > 1) {
    g_AngleY = 0;
  }
}

function keydown(ev) {
    if (ev.keyCode == 68) { // 'd' key
        g_camera.eye.elements[0] += 0.2;
        g_camera.at.elements[0] += 0.2;
    } else if (ev.keyCode == 65) { // 'a' key
        g_camera.eye.elements[0] -= 0.2;
        g_camera.at.elements[0] -= 0.2;
    } else if (ev.keyCode == 87) { // 'w' key
        g_camera.forward();
    } else if (ev.keyCode == 83) { // 's' key
        g_camera.back();
    } else if (ev.keyCode == 81) { // 'q' key
        g_camera.panLeft();
    } else if (ev.keyCode == 69) { // 'e' key
        g_camera.panRight();
    }
    renderScene();
    console.log(`Key pressed: ${ev.keyCode}`);
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
  if (g_aniLight){
    g_lightpos = [2 * Math.cos(-1 * g_seconds), 1.2, 2 * Math.sin(-1 * g_seconds)];
  }

}

function keydown(ev) {
  if (ev.keyCode == 68) { // 'd' key
      g_camera.eye.elements[0] += 0.2;
      g_camera.at.elements[0] += 0.2;
  } else if (ev.keyCode == 65) { // 'a' key
      g_camera.eye.elements[0] -= 0.2;
      g_camera.at.elements[0] -= 0.2;
  } else if (ev.keyCode == 87) { // 'w' key
      g_camera.forward();
  } else if (ev.keyCode == 83) { // 's' key
      g_camera.back();
  } else if (ev.keyCode == 81) { // 'q' key
      g_camera.panLeft();
  } else if (ev.keyCode == 69) { // 'e' key
      g_camera.panRight();
  }
  renderScene();
  console.log(`Key pressed: ${ev.keyCode}`);
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

// Draws the blocks in the world
function drawMap() {
  for (let x = 2; x < 3; x++) {
    for (let y = 1; y < 9; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        if (g_normalOn) {
            body.textureNum = -3;
          } else {
            body.textureNum = 3;
        }
        body.matrix.translate(x - 3.6, -.8, y - 4.1);
        body.normalMatrix.setInverseOf(body.matrix).transpose();
        body.renderfaster();
      }
    }
  }

  for (let x = 6; x < 7; x++) {
    for (let y = 1; y < 9; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        if (g_normalOn) {
            body.textureNum = -3;
          } else {
            body.textureNum = 3;
        }
        body.matrix.translate(x - 3.2, -1.9, y - 4.3);
        body.normalMatrix.setInverseOf(body.matrix).transpose();
        body.renderfaster();
      }
    }
  }

  for (let x = 9; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        if (g_normalOn) {
            body.textureNum = -3;
          } else {
            body.textureNum = 3;
        }
        body.matrix.translate(x - 4.0, -.65, y - 4.0);
        body.normalMatrix.setInverseOf(body.matrix).transpose();
        body.renderfaster();
      }
    }
  }

  for (let x = 0; x < 1; x++) {
    for (let y = 0; y < 10; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        if (g_normalOn) {
            body.textureNum = -3;
          } else {
            body.textureNum = 3;
        }
        body.matrix.translate(x - 3.8, -.85, y - 4.1);
        body.normalMatrix.setInverseOf(body.matrix).transpose();
        body.renderfaster();
      }
    }
  }

  for (let x = 0; x < 10; x++) {
    for (let y = 9; y < 10; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        if (g_normalOn) {
            body.textureNum = -3;
          } else {
            body.textureNum = 3;
        }
        body.matrix.translate(x - 4.1, -.86, y - 4.1);
        body.normalMatrix.setInverseOf(body.matrix).transpose();
        body.renderfaster();
      }
    }
  }

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 1; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        if (g_normalOn) {
            body.textureNum = -3;
          } else {
            body.textureNum = 3;
        }
        body.matrix.translate(x - 3.9, -.65, y - 4.1);
        body.normalMatrix.setInverseOf(body.matrix).transpose();
        body.renderfaster();
      }
    }
  }

  for (let x = 4; x < 5; x++) {
    for (let y = 1; y < 9; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        if (g_normalOn) {
            body.textureNum = -3;
          } else {
            body.textureNum = 2;
        }
        body.matrix.scale(1.3, 1.3, 0.01);
        body.matrix.translate(x - 3.3, -0.2, y - 2.9);
        body.normalMatrix.setInverseOf(body.matrix).transpose();
        body.renderfaster();
      }
    }
  }

  for (let x = 4; x < 5; x++) {
    for (let y = 1; y < 9; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        if (g_normalOn) {
            body.textureNum = -3;
          } else {
            body.textureNum = 4;
        }
        body.matrix.scale(1.3, 1.3, 0.01);
        body.matrix.translate(x - 1.5, -0.2, y + 250.9);
        body.normalMatrix.setInverseOf(body.matrix).transpose();
        body.renderfaster();
      }
    }
  }

  for (let x = 4; x < 5; x++) {
    for (let y = 1; y < 9; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        if (g_normalOn) {
            body.textureNum = -3;
          } else {
            body.textureNum = 5;
        }
        
        body.matrix.scale(1.3, 1.3, 0.01);
        body.matrix.translate(x - 3.5, -0.2, y + 400.9);
        body.normalMatrix.setInverseOf(body.matrix).transpose();
        body.render();
      }
    }
  }
}

var g_eye = [0, 0, 3];
var g_at = [0, 0, -100];
var g_up = [0, 1, 0];

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
    var globalRotMat = new Matrix4().rotate(g_AngleX, 0, -1, 0);
    globalRotMat.rotate(g_camSlider, 0, 1, 0);
    globalRotMat.rotate(g_AngleY, -1, 0, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
    // Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    gl.uniform3f(u_lightpos, g_lightpos[0], g_lightpos[1], g_lightpos[2]);
    gl.uniform3f(u_lightcolor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);
    gl.uniform3f(u_camerapos, g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2]);
    gl.uniform1i(u_lighton, g_lightOn);
    gl.uniform1i(u_normalon, g_normalOn);
  
    var lightS = new Cube();
    lightS.color = [g_lightColor[0], g_lightColor[1], g_lightColor[2], 1.0];
    lightS.matrix.translate(g_lightpos[0], g_lightpos[1], g_lightpos[2]);
    lightS.matrix.scale(-0.1, -0.1, -0.1);
    lightS.matrix.translate(-0.5, -.5, -.5);
    lightS.render();

    // Sky
    var sky = new Cube();
    sky.color = [1.0, 0.0, 0.0, 1.0];
    if (g_normalOn) {
        sky.textureNum = -3;
      } else {
        sky.textureNum = 0;
    }
    sky.matrix.scale(50.0, 50.0, 50.0);
    sky.matrix.translate(-0.5, -0.5, -0.5);
    sky.normalMatrix.setInverseOf(sky.matrix).transpose();
    sky.render();

    // Floor
    var floor = new Cube();
    if (g_normalOn) {
        floor.textureNum = -3;
      } else {
        floor.textureNum = 1;
    }
    floor.matrix.translate(0.0, -0.2, 0.0);
    floor.matrix.scale(10.0, 0.0, 10.0);
    floor.matrix.translate(-0.5, 0.0, -0.5);
    floor.normalMatrix.setInverseOf(floor.matrix).transpose();
    floor.render();

    // Sphere
    var sphere = new Sphere();
    sphere.matrix.translate(-0.8, 1, -.3);
    sphere.matrix.scale(.3, .3, .3);

    // Set the color of the sphere to light orange or yellow with full opacity
    sphere.setColor(1.0, 0.85, 0.0, 1.0); // RGB values for a sun-like color with full opacity

    if (g_normalOn) {
        sphere.textureNum = -3;
    } 
    sphere.normalMatrix.setInverseOf(sphere.matrix).transpose();
    sphere.render();

    drawMap();

    // Set color variables
    var yellow = [1.0, 1.0, 0.0, 1.0];
    var blue = [0.0, 0.6, 1.0, 1.0];
    var brown = [0.7, 0.4, 0.3, 1.0];
    var darkBrown = [0.4, 0.2, 0.0, 1.0]; // Dark brown color
    var red = [1.0, 0.0, 0.0, 1.0];
    var black = [0.0, 0.0, 0.0, 1.0];
    var white = [1.0, 1.0, 1.0, 1.0];
    var gray = [0.8, 1.0, 1.0, 1.0]
    // Skin colors
    var lightSkin = [0.94, 0.74, 0.65, 1.0]; // Light skin tone
    var mediumSkin = [0.76, 0.57, 0.49, 1.0]; // Medium skin tone
    var darkSkin = [0.47, 0.32, 0.28, 1.0]; // Dark skin tone
    var mouthColor = [0.8, 0.4, 0.4, 1.0];

    // Body
    var body = new Cube();
    body.color = lightSkin;
    if (g_normalOn) {
        body.textureNum = -3;
    } else {
        body.textureNum = -2;
    }
    body.matrix.scale(0.6, 0.6, 0.3);
    body.matrix.translate(-0.5, 1.1, -0.3);
    body.normalMatrix.setInverseOf(body.matrix).transpose();
    body.render();

    // Left Eye
    var lefteye = new Cube();
    lefteye.color = black;
    if (g_normalOn) {
        lefteye.textureNum = -3;
    } else {
        lefteye.textureNum = -2;
    }
    lefteye.matrix.scale(0.1, 0.02, 0.01);
    lefteye.matrix.translate(-1.5, 52, -11);
    lefteye.normalMatrix.setInverseOf(lefteye.matrix).transpose();
    lefteye.render();

    // Right Eye 1
    var righteye1 = new Cube();
    righteye1.color = white;
    if (g_normalOn) {
        righteye1.textureNum = -3;
    } else {
        righteye1.textureNum = -2;
    }
    righteye1.matrix.scale(0.05, 0.07, 0.01);
    righteye1.matrix.translate(1.3, 14.5, -11.5);
    righteye1.normalMatrix.setInverseOf(righteye1.matrix).transpose();
    righteye1.render();

    // Right Eye 2
    var righteye2 = new Cube();
    righteye2.color = black;
    if (g_normalOn) {
        righteye2.textureNum = -3;
    } else {
        righteye2.textureNum = -2;
    }
    righteye2.matrix.scale(0.1, 0.13, 0.01);
    righteye2.matrix.translate(0.45, 7.6, -11);
    righteye2.normalMatrix.setInverseOf(righteye2.matrix).transpose();
    righteye2.render();

    // Left Eyebrows 
    var leftbrows = new Cube();
    leftbrows.color = black;
    if (g_normalOn) {
        leftbrows.textureNum = -3;
    } else {
        leftbrows.textureNum = -2;
    }
    leftbrows.matrix.scale(0.14, 0.02, 0.01);
    leftbrows.matrix.translate(-1.2, 57, -11);
    leftbrows.normalMatrix.setInverseOf(leftbrows.matrix).transpose();
    leftbrows.render();

    // Right Eyebrows 
    var rightbrows = new Cube();
    rightbrows.color = black;
    if (g_normalOn) {
        rightbrows.textureNum = -3;
    } else {
        rightbrows.textureNum = -2;
    }
    rightbrows.matrix.scale(0.14, 0.02, 0.01);
    rightbrows.matrix.translate(0.19, 57, -11);
    rightbrows.normalMatrix.setInverseOf(rightbrows.matrix).transpose();
    rightbrows.render();

    // Nose
    var nose = new Cube();
    nose.color = mediumSkin;
    if (g_normalOn) {
        nose.textureNum = -3;
    } else {
        nose.textureNum = -2;
    }
    nose.matrix.scale(0.15, 0.1, 0.1);
    nose.matrix.translate(-0.5, 8.4, -1.4);
    nose.normalMatrix.setInverseOf(nose.matrix).transpose();
    nose.render();

    // Mouth
    var mouth = new Cube();
    mouth.color = black;
    if (g_normalOn) {
        mouth.textureNum = -3;
    } else {
        mouth.textureNum = -2;
    }
    mouth.matrix.scale(0.25, 0.01, 0.01);
    mouth.matrix.translate(-0.5, 80, -10);
    mouth.normalMatrix.setInverseOf(mouth.matrix).transpose();
    mouth.render();

    // Left chin
    var leftchin = new Cube();
    leftchin.color = mediumSkin;
    if (g_normalOn) {
        leftchin.textureNum = -3;
    } else {
        leftchin.textureNum = -2;
    }
    leftchin.matrix.scale(0.1, 0.07, 0.1);
    leftchin.matrix.translate(-1, 9.9, -1.8);
    leftchin.normalMatrix.setInverseOf(leftchin.matrix).transpose();
    leftchin.render();

    // Right chin
    var rightchin = new Cube();
    rightchin.color = mediumSkin;
    if (g_normalOn) {
        rightchin.textureNum = -3;
    } else {
        rightchin.textureNum = -2;
    }
    rightchin.matrix.scale(0.1, 0.07, 0.1);
    rightchin.matrix.translate(0.1, 9.9, -1.8);
    rightchin.normalMatrix.setInverseOf(rightchin.matrix).transpose();
    rightchin.render();

    // Top clothes
    var top = new Cube();
    top.color = red;
    if (g_normalOn) {
        top.textureNum = -3;
    } else {
        top.textureNum = -2;
    }
    top.matrix.scale(0.6, 0.07, 0.3);
    top.matrix.translate(-0.5, 8.4, -0.3);
    top.normalMatrix.setInverseOf(top.matrix).transpose();
    top.render();

    // Shirt
    var shirt = new Cube();
    shirt.color = black;
    if (g_normalOn) {
        shirt.textureNum = -3;
    } else {
        shirt.textureNum = -2;
    }
    shirt.matrix.scale(0.6, 0.14, 0.3);
    shirt.matrix.translate(-0.5, 3.2, -0.3);
    shirt.normalMatrix.setInverseOf(shirt.matrix).transpose();
    shirt.render();

    // Buttons
    var button1 = new Cube();
    button1.color = yellow;
    if (g_normalOn) {
        button1.textureNum = -3;
    } else {
        button1.textureNum = -2;
    }
    button1.matrix.scale(0.02, 0.02, 0.1);
    button1.matrix.translate(-0.5, 27, -1);
    button1.normalMatrix.setInverseOf(button1.matrix).transpose();
    button1.render();

    var button2 = new Cube();
    button2.color = yellow;
    if (g_normalOn) {
        button2.textureNum = -3;
    } else {
        button2.textureNum = -2;
    }
    button2.matrix.scale(0.02, 0.02, 0.1);
    button2.matrix.translate(-0.5, 25, -1);
    button2.normalMatrix.setInverseOf(button2.matrix).transpose();
    button2.render();

    var button3 = new Cube();
    button3.color = yellow;
    if (g_normalOn) {
        button3.textureNum = -3;
    } else {
        button3.textureNum = -2;
    }
    button3.matrix.scale(0.02, 0.02, 0.1);
    button3.matrix.translate(-0.5, 23, -1);
    button3.normalMatrix.setInverseOf(button3.matrix).transpose();
    button3.render();

    // Left Leg
    var leftleg = new Cube();
    leftleg.color = blue;
    if (g_normalOn) {
        leftleg.textureNum = -3;
    } else {
        leftleg.textureNum = -2;
    }
    leftleg.matrix.rotate(g_leftLeg, 1, 0, 0);
    leftleg.matrix.scale(0.16, 0.55, 0.1);
    leftleg.matrix.translate(-1.4, -0.2, 0.1);
    leftleg.normalMatrix.setInverseOf(leftleg.matrix).transpose();
    leftleg.render();

    // Right Leg
    var rightleg = new Cube();
    rightleg.color = blue;
    if (g_normalOn) {
        rightleg.textureNum = -3;
    } else {
        rightleg.textureNum = -2;
    }
    rightleg.matrix.rotate(-g_rightLeg, 1, 0, 0);
    rightleg.matrix.scale(0.16, 0.55, 0.1);
    rightleg.matrix.translate(0.4, -0.2, 0.1);
    rightleg.normalMatrix.setInverseOf(rightleg.matrix).transpose();
    rightleg.render();

    // Left Shoe
    var leftshoe = new Cube();
    leftshoe.color = darkBrown;
    if (g_normalOn) {
        leftshoe.textureNum = -3;
    } else {
        leftshoe.textureNum = -2;
    }
    leftshoe.matrix.rotate(g_leftLeg, 1, 0, 0);
    leftshoe.matrix.scale(0.11, 0.05, 0.15);
    leftshoe.matrix.translate(-1.8, -3.3, -0.3);
    leftshoe.normalMatrix.setInverseOf(leftshoe.matrix).transpose();
    leftshoe.render();

    // Right Shoe
    var rightshoe = new Cube();
    rightshoe.color = darkBrown;
    if (g_normalOn) {
        rightshoe.textureNum = -3;
    } else {
        rightshoe.textureNum = -2;
    }
    rightshoe.matrix.rotate(-g_rightLeg, 1, 0, 0);
    rightshoe.matrix.scale(0.11, 0.05, 0.15);
    rightshoe.matrix.translate(0.8, -3.3, -0.3);
    rightshoe.normalMatrix.setInverseOf(rightshoe.matrix).transpose();
    rightshoe.render();

    // Left Arm Shoulder
    var leftarms = new Cube();
    leftarms.color = lightSkin;
    if (g_normalOn) {
        leftarms.textureNum = -3;
    } else {
        leftarms.textureNum = -2;
    }
    leftarms.matrix.rotate(g_lshol, 0, 0, 1);
    var elbow = new Matrix4(leftarms.matrix);
    leftarms.matrix.scale(0.09, 0.37, 0.09);
    leftarms.matrix.translate(-4.3, 1, 0.5);
    leftarms.normalMatrix.setInverseOf(leftarms.matrix).transpose();
    leftarms.render();

    // Left Arm Elbow
    var leftarme = new Cube();
    leftarme.color = lightSkin;
    if (g_normalOn) {
        leftarme.textureNum = -3;
    } else {
        leftarme.textureNum = -2;
    }
    leftarme.matrix = elbow;
    leftarme.matrix.rotate(g_lelb, 0, 1, 1);
    var wrist = new Matrix4(leftarme.matrix);
    leftarme.matrix.scale(0.2, 0.2, 0.2);
    leftarme.matrix.translate(-2.2, 1, 0);
    leftarme.normalMatrix.setInverseOf(leftarme.matrix).transpose();
    leftarme.render();

    // Left Arm Wrist
    var leftarmw = new Cube();
    leftarmw.color = lightSkin;
    if (g_normalOn) {
        leftarmw.textureNum = -3;
    } else {
        leftarmw.textureNum = -2;
    }
    leftarmw.matrix = wrist;
    leftarmw.matrix.rotate(g_lwri, 0, 1, 1);
    leftarmw.matrix.scale(0.09, 0.06, 0.09);
    leftarmw.matrix.translate(-4.3, 2.7, 0.5);
    leftarmw.normalMatrix.setInverseOf(leftarmw.matrix).transpose();
    leftarmw.render();

    // Right Arm Shoulder
    var rightarms = new Cube();
    rightarms.color = lightSkin;
    if (g_normalOn) {
        rightarms.textureNum = -3;
    } else {
        rightarms.textureNum = -2;
    }
    rightarms.matrix.rotate(g_rshol, 0, 0, 1);
    var elbow1 = new Matrix4(rightarms.matrix);
    rightarms.matrix.scale(0.09, 0.37, 0.09);
    rightarms.matrix.translate(3.3, 1, 0.5);
    rightarms.normalMatrix.setInverseOf(rightarms.matrix).transpose();
    rightarms.render();

    // Right Arm Elbow
    var rightarme = new Cube();
    rightarme.color = lightSkin;
    if (g_normalOn) {
        rightarme.textureNum = -3;
    } else {
        rightarme.textureNum = -2;
    }
    rightarme.matrix = elbow1;
    rightarme.matrix.rotate(g_relb, 0, 1, 1);
    var wrist1 = new Matrix4(rightarme.matrix);
    rightarme.matrix.scale(0.2, 0.2, 0.2);
    rightarme.matrix.translate(1.2, 1, 0);
    rightarme.normalMatrix.setInverseOf(rightarme.matrix).transpose();
    rightarme.render();

    // Right Arm Wrist
    var rightarmw = new Cube();
    rightarmw.color = lightSkin;
    if (g_normalOn) {
        rightarmw.textureNum = -3;
    } else {
        rightarmw.textureNum = -2;
    }
    rightarmw.matrix = wrist1;
    rightarmw.matrix.rotate(g_rwri, 0, 1, 1);
    rightarmw.matrix.scale(0.09, 0.06, 0.09);
    rightarmw.matrix.translate(3.3, 2.7, 0.5);
    rightarmw.normalMatrix.setInverseOf(rightarmw.matrix).transpose();
    rightarmw.render();

    // Cap
    var cap = new Cube();
    cap.color = gray;
    if (g_normalOn) {
        cap.textureNum = -3;
    } else {
        cap.textureNum = -2;
    }
    cap.matrix.rotate(g_cap, 1, 0, 0);
    cap.matrix.scale(0.6, 0.18, 0.33);
    cap.matrix.translate(-0.5, 7, -0.38);
    cap.normalMatrix.setInverseOf(cap.matrix).transpose();
    cap.render();

    var cap2 = new Cube();
    cap2.color = black;
    if (g_normalOn) {
        cap2.textureNum = -3;
    } else {
        cap2.textureNum = -2;
    }
    cap2.matrix.rotate(g_cap, 1, 0, 0);
    cap2.matrix.scale(0.6, 0.02, 0.48);
    cap2.matrix.translate(-0.5, 62, -0.57);
    cap2.normalMatrix.setInverseOf(cap2.matrix).transpose();
    cap2.render();

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


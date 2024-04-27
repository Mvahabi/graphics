// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    void main() {
        gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
}`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;  
    void main() {
        gl_FragColor = u_FragColor;
    }`

// Global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

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

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}  

// Global Variables for UI
let g_AngleX = 0;
let g_camSlider = 0;
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

var xyCoord = [0,0];

function main() {
    // Set up canvas and gl variables
    setupWebGL();

    // Set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    // Set up actions for the HTML UI elements
    addActionForHtmlUI();
    
    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function (ev) { 
        if (ev.buttons == 1) {
            click(ev, 1) 
        } else {
            if (xyCoord[0] != 0){
            xyCoord = [0,0];
            }
        }
    }

  gl.clearColor(0.0, 0.3, 1.0, 1.0);
  requestAnimationFrame(tick);
}

function click(ev, check){
    // Animates cap when shift is held down while clicked
    if(ev.shiftKey){
        shift_key = true;
    }

    let [x, y] = convertCoordinatesEventToGL(ev);

    if (xyCoord[0] == 0){
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

let time = 0;

function tick() {
    g_seconds = performance.now() / 1000.0 - g_startTime;
    updateAnimationAngles();
    if (shift_key) {
        g_cap = (10 * Math.sin(3 * time));
        time += 0.1;
        if (time >= 1) {
            time = 0;
        shift_key = false;
        }
    }
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

function renderScene() {
    var startTime = performance.now();
    var globalRotMat = new Matrix4().rotate(g_AngleX, 0, 1, 0);
    globalRotMat.rotate(g_camSlider, 0, 1, 0);
    globalRotMat.rotate(g_AngleY, -1, 0, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);  
    
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
    body.matrix.scale(0.6, 0.6, 0.3);
    body.matrix.translate(-0.5, -0.3, -0.3);
    body.render();

    // Left Eye
    var lefteye = new Cube();
    lefteye.color = black;
    lefteye.matrix.scale(0.1, 0.02, 0.01);
    lefteye.matrix.translate(-1.5, 8.5, -11);
    lefteye.render();

    // Right Eye 1
    var righteye1 = new Cube();
    righteye1.color = white;
    righteye1.matrix.scale(0.05, 0.07, 0.01);
    righteye1.matrix.translate(1.3, 2, -11.5);
    righteye1.render();

    // Right Eye 2
    var righteye2 = new Cube();
    righteye2.color = black;
    righteye2.matrix.scale(0.1, 0.13, 0.01);
    righteye2.matrix.translate(0.45, 0.9, -11);
    righteye2.render();

    // Left Eyebrows 
    var leftbrows = new Cube();
    leftbrows.color = black;
    leftbrows.matrix.scale(0.14, 0.02, 0.01);
    leftbrows.matrix.translate(-1.2, 14, -11);
    leftbrows.render();

    // right Eyebrows 
    var rightbrows = new Cube();
    rightbrows.color = black;
    rightbrows.matrix.scale(0.14, 0.02, 0.01);
    rightbrows.matrix.translate(0.19, 14, -11);
    rightbrows.render();

    // Nose
    var nose = new Cube();
    nose.color = mediumSkin;
    nose.matrix.scale(0.15, 0.1, 0.1);
    nose.matrix.translate(-0.5, -0.1, -1.4);
    nose.render();

    // Mouth
    var mouth = new Cube();
    mouth.color = black;
    mouth.matrix.scale(0.25, 0.01, 0.01);
    mouth.matrix.translate(-0.5, -6, -10);
    mouth.render();

    // Left chin
    var leftchin = new Cube();
    leftchin.color = mediumSkin;
    leftchin.matrix.scale(0.1, 0.07, 0.1);
    leftchin.matrix.translate(-1, -2.3, -1.8);
    leftchin.render();

    // Right chin
    var rightchin = new Cube();
    rightchin.color = mediumSkin;
    rightchin.matrix.scale(0.1, 0.07, 0.1);
    rightchin.matrix.translate(0.1, -2.3, -1.8);
    rightchin.render();

    // Top clothes
    var top = new Cube();
    top.color = red;
    top.matrix.scale(0.6, 0.07, 0.3);
    top.matrix.translate(-0.5, -3.5, -0.3);
    top.render();

    // shirt
    var shirt = new Cube();
    shirt.color = black;
    shirt.matrix.scale(0.6, 0.14, 0.3);
    shirt.matrix.translate(-0.5, -2.75, -0.3);
    shirt.render();

    // Buttons
    var button1 = new Cube();
    button1.color = yellow;
    button1.matrix.scale(0.02, 0.02, 0.1);
    button1.matrix.translate(-0.5, -14, -1);
    button1.render();

    var button2 = new Cube();
    button2.color = yellow;
    button2.matrix.scale(0.02, 0.02, 0.1);
    button2.matrix.translate(-0.5, -16, -1);
    button2.render();

    var button3 = new Cube();
    button3.color = yellow;
    button3.matrix.scale(0.02, 0.02, 0.1);
    button3.matrix.translate(-0.5, -18, -1);
    button3.render();

    // Left Leg
    var leftleg = new Cube();
    leftleg.color = blue;
    leftleg.matrix.rotate(g_leftLeg, 1, 0, 0);
    leftleg.matrix.scale(0.16, 0.55, 0.1);
    leftleg.matrix.translate(-1.4, -1.5, 0.1);
    leftleg.render();

    // Right Leg
    var rightleg = new Cube();
    rightleg.color = blue;
    rightleg.matrix.rotate(-g_rightLeg, 1, 0, 0);
    rightleg.matrix.scale(0.16, 0.55, 0.1);
    rightleg.matrix.translate(0.4, -1.5, 0.1);
    rightleg.render();
    
    // Left Shoe
    var leftshoe = new Cube();
    leftshoe.color = darkBrown;
    leftshoe.matrix.rotate(g_leftLeg, 1, 0, 0);
    leftshoe.matrix.scale(0.11, 0.05, 0.15);
    leftshoe.matrix.translate(-1.8, -17.4, -0.3);
    leftshoe.render();

    // Right Shoe
    var rightshoe = new Cube();
    rightshoe.color = darkBrown;
    rightshoe.matrix.rotate(-g_rightLeg, 1, 0, 0);
    rightshoe.matrix.scale(0.11, 0.05, 0.15);
    rightshoe.matrix.translate(0.8, -17.4, -0.3);
    rightshoe.render();

    // Left Arm Shoulder
    var leftarms = new Cube();
    leftarms.color = lightSkin;
    leftarms.matrix.rotate(g_lshol, 0, 0, 1);
    var elbow = new Matrix4(leftarms.matrix);
    leftarms.matrix.scale(0.09, 0.37, 0.09);
    leftarms.matrix.translate(-4.3, -1.4, 0.5);
    leftarms.render();

    // Left Arm Elbow
    var leftarme = new Cube();
    leftarme.color = lightSkin;
    leftarme.matrix = elbow;
    leftarme.matrix.rotate(g_lelb, 0, 1, 1);
    var wrist = new Matrix4(leftarme.matrix);
    leftarme.matrix.scale(0.2, 0.2, 0.2);
    leftarme.matrix.translate(-2.2, -3.59,0);
    leftarme.render();

    // Left Arm Wrist
    var leftarmw = new Cube();
    leftarmw.color = lightSkin;
    leftarmw.matrix = wrist;
    leftarmw.matrix.rotate(g_lwri, 0, 1, 1);
    leftarmw.matrix.scale(0.09, 0.06, 0.09);
    leftarmw.matrix.translate(-4.3, -12.3, 0.5);
    leftarmw.render();

    // Right Arm Shoulder
    var rightarms = new Cube();
    rightarms.color = lightSkin;
    rightarms.matrix.rotate(g_rshol, 0, 0, 1);
    var elbow1 = new Matrix4(rightarms.matrix);
    rightarms.matrix.scale(0.09, 0.37, 0.09);
    rightarms.matrix.translate(3.3, -1.4, 0.5);
    rightarms.render();

    // Right Arm Elbow
    var rightarme = new Cube();
    rightarme.color = lightSkin;
    rightarme.matrix = elbow1;
    rightarme.matrix.rotate(g_relb, 0, 1, 1);
    var wrist1 = new Matrix4(rightarme.matrix);
    rightarme.matrix.scale(0.2, 0.2, 0.2);
    rightarme.matrix.translate(1.2,-3.59,0);
    rightarme.render();

    // Right Arm Wrist
    var rightarmw = new Cube();
    rightarmw.color = lightSkin;
    rightarmw.matrix = wrist1;
    rightarmw.matrix.rotate(g_rwri, 0, 1, 1);
    rightarmw.matrix.scale(0.09, 0.06, 0.09);
    rightarmw.matrix.translate(3.3, -12.3, 0.5);
    rightarmw.render();

    // Cap
    var cap = new Cube();
    cap.color = gray;
    cap.matrix.rotate(g_cap, 1, 0, 0);
    cap.matrix.scale(0.6, 0.18, 0.33);
    cap.matrix.translate(-0.5, 2.4, -0.38);
    cap.render();

    var cap2 = new Cube();
    cap2.color = black;
    cap2.matrix.rotate(g_cap, 1, 0, 0);
    cap2.matrix.scale(0.6, 0.02, 0.48);
    cap2.matrix.translate(-0.5, 21, -0.57);
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
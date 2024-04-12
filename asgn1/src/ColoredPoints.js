// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_Size;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = u_Size;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
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
    // Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const PICTURE = 3;

// Globals related to UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=5;
let g_selectedType=POINT;
let g_segment=3;

// Set up actions for the HTML UI elements
function addActionForHtmlUI() {

    // Button Events
    document.getElementById('clearButton').onclick = function() {g_shapesList=[]; renderAllShapes();};
    document.getElementById('picture').onclick = function() {drawPicture(v)};

    document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
    document.getElementById('triangleButton').onclick = function() {g_selectedType=TRIANGLE};
    document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};

    // Slider Events
    document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100; });
    document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100; });

    // Size Slider Events
    document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
    document.getElementById('segments').addEventListener('mouseup', function() { g_segment = this.value; });
}

function main() {

    // Set up canvas and gl variables
    setupWebGL();

    // Set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    // Set up actions for the HTML UI elements
    addActionForHtmlUI();
    
    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } };    
    
    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  
    
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

function click(ev) {   

    // Extract the event click and return it in WebGL coordinates
    let [x,y] = convertCoordinatesEventtoGL(ev);

    // Create and store the new point
    let point;
    if (g_selectedType==POINT) {
        point = new Point();
    }
    else if (g_selectedType==TRIANGLE) {
        point = new Triangle();
    }
    else {
        point = new Circle();
        point.segments = g_segment;
    }
    point.position = [x,y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);
    
    // Draw every shape that is supposed to be in the canvas
    renderAllShapes();
}

function convertCoordinatesEventtoGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();   
    
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return([x,y]);
}

function renderAllShapes() {
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_shapesList.length;

    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }
}

function show() {
    var img = document.getElementById("image");
    if (img.style.display === "none") {
      img.style.display = "block";
    } else {
      img.style.display = "none";
    }
}

   

var v = [
    -0.5, 0.4,
    -0.5, 0.6,
    -0.4, 0.4,

    -0.4, 0.3,
    -0.4, 0.4,
    -0.5, 0.4,

    -0.4, 0.3,
    -0.4, 0.4,
    -0.3, 0.3,

    -0.4, 0.3,
    -0.3, 0.3,
    -0.3, 0.2,

    -0.3, 0.2,
    -0.3, 0.3,
    -0.2, 0.3,

    -0.3, 0.2,
    -0.2, 0.2,
    -0.2, 0.3,

    -0.2, 0.2,
    -0.2, 0.3,
    -0.1, 0.3,

    -0.2, 0.3,
    -0.1, 0.3,
    -0.1, 0.4,

    -0.1, 0.3,
    -0.1, 0.4,
    0, 0.4,

    -0.1, 0.4, 
    -0.1, 0.6,
    0.1, 0.6,

    //////////
    0.5, 0.4,
    0.5, 0.6,
    0.4, 0.4,

    0.4, 0.3,
    0.4, 0.4,
    0.5, 0.4,

    0.4, 0.3,
    0.4, 0.4,
    0.3, 0.3,

    0.4, 0.3,
    0.3, 0.3,
    0.3, 0.2,

    0.3, 0.2,
    0.3, 0.3,
    0.2, 0.3,

    0.3, 0.2,
    0.2, 0.2,
    0.2, 0.3,

    0.2, 0.2,
    0.2, 0.3,
    0.1, 0.3,

    0.2, 0.3,
    0.1, 0.3,
    0.1, 0.4,

    0.1, 0.3,
    0.1, 0.4,
    0, 0.4,
    
    // 0.1, 0.4,
    // 0, 0.4,
    // 0, 0.6,

    0, 0.4,
    0.1, 0.3,
    -0.1, 0.3,

    // flipped now
    -0.5, -0.4,
    -0.5, -0.6,
    -0.4, -0.4,

    -0.4, -0.3,
    -0.4, -0.4,
    -0.5, -0.4,

    -0.4, -0.3,
    -0.4, -0.4,
    -0.3, -0.3,

    -0.4, -0.3,
    -0.3, -0.3,
    -0.3, -0.2,

    -0.3, -0.2,
    -0.3, -0.3,
    -0.2, -0.3,

    -0.2, -0.2,
    -0.2, -0.3,
    -0.3, -0.2,

    -0.3, -0.2,
    -0.2, -0.2,
    -0.2, -0.3,

    -0.3, -0.3,
    -0.25, -0.4,
    -0.2, -0.3,

    -0.2, -0.2,
    -0.2, -0.3,
    -0.1, -0.3,

    -0.2, -0.3,
    -0.1, -0.3,
    -0.1, -0.4,

    -0.1, -0.3,
    -0.1, -0.4,
    0, -0.4,

    -0.1, -0.4,
    0, -0.4,
    0, -0.6,
    
    -0.1, 0.4,
    0.1, 0.4,
    0.1, 0.6,

    //////////
    0.5, -0.4,
    0.5, -0.6,
    0.4, -0.4,

    0.4, -0.3,
    0.4, -0.4,
    0.5, -0.4,

    0.4, -0.3,
    0.4, -0.4,
    0.3, -0.3,

    0.4, -0.3,
    0.3, -0.3,
    0.3, -0.2,

    0.3, -0.2,
    0.3, -0.3,
    0.2, -0.3,

    0.3, -0.2,
    0.2, -0.2,
    0.2, -0.3,

    0.3, -0.3,
    0.25, -0.4,
    0.2, -0.3,

    0.2, -0.2,
    0.2, -0.3,
    0.1, -0.3,

    0.2, -0.3,
    0.1, -0.3,
    0.1, -0.4,

    0.1, -0.3,
    0.1, -0.4,
    0, -0.4,
    
    0.1, -0.4,
    0, -0.4,
    0, -0.6,

    0, -0.4,
    0.1, -0.3,
    -0.1, -0.3,

    // long stem
    -0.1, 0.3,
    -0.1, -0.3,
    0.1, -0.3,

    0.1, -0.3,
    0.1, 0.3,
    -0.1, 0.3,

    // connecting lines
    -0.5, -0.6,
    -0.9, 0,
    -0.5, 0.6,

    0.5, -0.6,
    0.9, 0,
    0.5, 0.6,

    // ears
    -0.1, 0.6,
    -0.1, 0.75,
    -0.05, 0.6,

    0.1, 0.6,
    0.1, 0.75,
    0.05, 0.6,

    // fill in the empty stuff
    -0.5, 0.4,
    -0.5, -0.4,
    -0.1, 0,

    0.5, 0.4,
    0.5, -0.4,
    0.1, 0,

    -0.3, 0.2,
    -0.1, 0.3,
    -0.1, 0,

    0.3, 0.2,
    0.1, 0.3,
    0.1, 0,

    -0.3, 0.2,
    -0.1, 0.3,
    -0.1, 0,

    0.3, -0.2,
    0.1, -0.3,
    0.1, 0,

    -0.3, -0.2,
    -0.1, -0.3,
    -0.1, 0

]

function drawPicture(vertices) {
    var n = 250; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Pass the position of a point to a_Position variable
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    // Pass the color to the shader
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    gl.uniform4f(u_FragColor, 1.0, 1.0, 0.0, 1.0); // Red color

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

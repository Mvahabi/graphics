
// global variables, reference the piazza post for the advice
var canvas;
var ctx;

function main() {
    canvas = document.getElementById('cnv1');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    
    ctx = canvas.getContext('2d');

    // Draw a black rectangle
    // Fill a rectangle with the color
    ctx.fillStyle = 'black'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
 }

 // Draws the two vectors; 2021 Fall Lab Section video
 function drawVector(v, color) {
    ctx.strokeStyle = color; // Set color
    let cx = canvas.width/2; // Get center of y axis
    let cy = canvas.height/2; // Get center of x axis
    ctx.beginPath();
    ctx.moveTo(cx, cy); // Move starting point to (0,0)
    ctx.lineTo(cx + v.elements[0] * 20, cy - v.elements[1] * 20, v.elements[2] * 20); // Draw line, starting from center with a scale of 20
    ctx.stroke(); // Shows display on webpage
 }

 // Draws v1 and v2 when button pressed
 // read in the x and y values for both vectors 
 // then create two vectors as a result
 function handleDrawEvent() {
    ctx.fillStyle = 'black'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    var v1x = document.getElementById('v1x').value; 
    var v1y = document.getElementById('v1y').value; 
    var v1 = new Vector3([v1x, v1y, 0]); 
    drawVector(v1, 'red'); 

    var v2x = document.getElementById('v2x').value; 
    var v2y = document.getElementById('v2y').value; 
    var v2 = new Vector3([v2x, v2y, 0]); 
    drawVector(v2, 'blue'); 
 }

 // Operation upon button pressed
 // same as handle draw event but adding options for operations and scalar
function handleDrawOperationEvent() {
   ctx.fillStyle = 'black'; 
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   var scalar = document.getElementById('scalar').value;

   var v1x = document.getElementById('v1x').value; 
   var v1y = document.getElementById('v1y').value; 
   var v1 = new Vector3([v1x, v1y, 0]); 
   drawVector(v1, 'red'); 

   var v2x = document.getElementById('v2x').value; 
   var v2y = document.getElementById('v2y').value; 
   var v2 = new Vector3([v2x, v2y, 0]); 
   drawVector(v2, 'blue'); 

   var v3, v4;

   // for all of these, you call the appropiate function 
   // and have the canvas draw the resulting vetor
   if (document.getElementById('operation').value == 'add') {
      v3 = v1.add(v2); 
      drawVector(v3, 'green'); 
   } else if (document.getElementById('operation').value == 'subtract') {
      v3 = v1.sub(v2); 
      drawVector(v3, 'green'); 
   } else if (document.getElementById('operation').value == 'multiply') {
      v3 = v1.mul(scalar); 
      v4 = v2.mul(scalar); 
      drawVector(v3, 'green'); 
      drawVector(v4, 'green'); 
   } else if (document.getElementById('operation').value == 'divide') {
      v3 = v1.div(scalar); 
      v4 = v2.div(scalar); 
      drawVector(v3, 'green'); 
      drawVector(v4, 'green'); 
   } else if (document.getElementById('operation').value == 'magnitude') {
      v3 = v1.magnitude(); 
      v4 = v2.magnitude(); 
      console.log('Magnitude v1: ', v3);
      console.log('Magnitude v2: ', v4);
   } else if (document.getElementById('operation').value == 'normalize') {
      v3 = v1.normalize(); 
      v4 = v2.normalize(); 
      drawVector(v3, 'green'); 
      drawVector(v4, 'green'); 
   } else if (document.getElementById('operation').value == 'angle between') {
      console.log('Angle: ' + (angleBetween(v1, v2)));
   } else if (document.getElementById('operation').value == 'area') {
      console.log("Area of the triangle: " + (areaTriangle(v1, v2)));
   }
}

// angle between v1 and v2
// Alpha:
// calculates the dot product of vectors
// calculate the magnitudes (lengths) of vectors 
// the dot product divided by the product of the magnitudes = cosine of the angle
// then convert to degrees
function angleBetween(v1, v2) {
   var alpha = Math.acos(Vector3.dot(v1, v2) / (v1.magnitude() * v2.magnitude())); 
   alpha *= 180/Math.PI; 
   return alpha;
}

// area of the triangle created from v1 and v2
// connect the two lines together then divide by magnitude
function areaTriangle(v1, v2) {
   let cross = Vector3.cross(v1, v2);
   let area = new Vector3([cross[0], cross[1], cross[2]]).magnitude()/2; 
   return area;
}
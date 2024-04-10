// DrawRectangle.js
var canvas;
var ctx;

function main() {
    // Retrieve <canvas> element <- (1)
    canvas = document.getElementById('cnv1');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    
    // Get the rendering context for 2DCG <- (2)
    ctx = canvas.getContext('2d');

    // Draw a black rectangle <- (3)
    ctx.fillStyle = 'black'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color
 }

 // Draws the vectors v1 and v2
 // Used 2021 Fall Lab Section video as reference
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
 function handleDrawEvent() {
    ctx.fillStyle = 'black'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color
    
    var v1x = document.getElementById('v1x').value; // Read in v1 x value
    var v1y = document.getElementById('v1y').value; // Read in v1 y value
    var v1 = new Vector3([v1x, v1y, 0.0]); // Create vector
    drawVector(v1, 'red'); // Draw vector

    var v2x = document.getElementById('v2x').value; // Read in v2 x value
    var v2y = document.getElementById('v2y').value; // Read in v2 y value
    var v2 = new Vector3([v2x, v2y, 0.0]); // Create vector
    drawVector(v2, 'blue'); // Draw vector
 }

 // Carries out operation of function called when button pressed
function handleDrawOperationEvent() {
   ctx.fillStyle = 'black'; // Set a black color
   ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color

   var scalar = document.getElementById('scalar').value;

   var v1x = document.getElementById('v1x').value; // Read in v1 x value
   var v1y = document.getElementById('v1y').value; // Read in v1 y value
   var v1 = new Vector3([v1x, v1y, 0]); // Create vector
   drawVector(v1, 'red'); // Draw vector

   var v2x = document.getElementById('v2x').value; // Read in v2 x value
   var v2y = document.getElementById('v2y').value; // Read in v2 y value
   var v2 = new Vector3([v2x, v2y, 0]); // Create vector
   drawVector(v2, 'blue'); // Draw vector

   if (document.getElementById('operation').value == 'add') {
      var v3 = v1.add(v2); // Call function
      drawVector(v3, 'green'); // Draw vector
   }
   if (document.getElementById('operation').value == 'subtract') {
      var v3 = v1.sub(v2); // Call function
      drawVector(v3, 'green'); // Draw vector
   }
   if (document.getElementById('operation').value == 'multiply') {
      var v3 = v1.mul(scalar); // Call function
      var v4 = v2.mul(scalar); // Call function
      drawVector(v3, 'green'); // Draw vector
      drawVector(v4, 'green'); // Draw vector
   }
   if (document.getElementById('operation').value == 'divide') {
      var v3 = v1.div(scalar); // Call function
      var v4 = v2.div(scalar); // Call function
      drawVector(v3, 'green'); // Draw vector
      drawVector(v4, 'green'); // Draw vector
   }
   if (document.getElementById('operation').value == 'anglebetween') {
      console.log('Angle: ' + (angleBetween(v1, v2))); // Call function and print output
   }
   if (document.getElementById('operation').value == 'area') {
      console.log("Area of the triangle: " + (areaTriangle(v1, v2))); // Call function and print output
   }
   if (document.getElementById('operation').value == 'magnitude') {
      var v3 = v1.magnitude(); // Call function
      var v4 = v2.magnitude(); // Call function
      console.log('Magnitude v1: ', v3);
      console.log('Magnitude v2: ', v4);
   }
   if (document.getElementById('operation').value == 'normalize') {
      var v3 = v1.normalize(); // Call function
      var v4 = v2.normalize(); // Call function
      drawVector(v3, 'green'); // Draw vector
      drawVector(v4, 'green'); // Draw vector
   }
}

// Calculates the angle between v1 and v2
function angleBetween(v1, v2) {
   // Dot product solving for alpha = cos^(-1) [(a Â· b) / (|a| |b|)]
   var alpha = Math.acos(Vector3.dot(v1, v2) / (v1.magnitude() * v2.magnitude())); // Formula
   alpha *= 180/Math.PI; // Convert to degrees
   return alpha;
}

// Calculates the area of the triangle created from v1 and v2
function areaTriangle(v1, v2) {
   let cross = Vector3.cross(v1, v2); // Get cross product of v1 and v2
   let area = new Vector3([cross[0], cross[1], cross[2]]).magnitude()/2; // Divide by mag to get area
   return area;
}
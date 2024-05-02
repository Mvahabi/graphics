class Triangle {
    constructor() {
        this.type = 'triangle';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.buffer = null;
    }

    render() {
        var rgba = this.color;
        
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);  
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        
        // Draw

        // Front
        drawTriangle3D([ -1, 0.0, 0.0,  0.0, 1.0, 0.0,  1, 0.0, 0.0 ]);
        
        // Back 
        drawTriangle3D([ -1, 0.0, 0.25,  0.0, 1.0, 0.25,  0.5, 0.0, 0.25 ]);
        
        // Bottom
        drawTriangle3D([ 1, 0.0, 0.0,  0.5, 0.0, 0.25,  -0.5, 0.0, 0.0 ]);
        drawTriangle3D([ -0.5, 0.0, 0.25,  -0.5, 0.0, 0.0, 0.5, 0.0, 0.0 ]);
        
        // Left
        drawTriangle3D([ -1, 0.0, 0.25,  0.0, 1.0, 0.25,  0.0, 1.0, 0.0 ]);
        drawTriangle3D([ -0.5, 0.0, 0.25,  -0.5, 0.0, 0.0,  0.0, 1.0, 0.0 ]);
      
        // Right
        drawTriangle3D([ 1, 0.0, 0.25,  0.0, 1.0, 0.25,  0.0, 1.0, 0.0 ]);
        drawTriangle3D([ 0.5, 0.0, 0.25,  0.5, 0.0, 0.0,  0.0, 1.0, 0.0 ]);
    
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    }
}

function drawTriangle3D(vertices) {
    var n = 3; // The number of vertices

    // Create a buffer object
    if (this.buffer == null) {
        this.buffer = gl.createBuffer();
        if (!this.buffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // Pass the position of a point to a_Position variable
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3DUV(vertices, uv) {
    var n = 3; // The number of vertices
  
    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
  
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
  
    var uvBuffer = gl.createBuffer();
    if (!uvBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

    // Assign the buffer object to a_UV variable
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_UV);
  
  
    gl.drawArrays(gl.TRIANGLES, 0, n);
    vertexBuffer = null;
}
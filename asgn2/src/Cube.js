class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }

    render() {
        var rgba = this.color;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front
        drawTriangle3D([ 0.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 0.0, 0.0 ]);
        drawTriangle3D([ 0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  1.0, 1.0, 0.0 ]);

        // Back
        gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
        drawTriangle3D([ 0.0, 0.0, 1.0,  1.0, 1.0, 1.0,  0.0, 1.0, 1.0 ]);
        drawTriangle3D([ 0.0, 0.0, 1.0,  1.0, 0.0, 1.0,  1.0, 1.0, 1.0 ]);

        // Left
        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        drawTriangle3D([ 1.0, 0.0, 0.0,  1.0, 1.0, 1.0,  1.0, 1.0, 0.0 ]);
        drawTriangle3D([ 1.0, 0.0, 0.0,  1.0, 0.0, 1.0,  1.0, 1.0, 1.0 ]);

        // Right 
        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        drawTriangle3D([ 0.0, 0.0, 0.0,  0.0, 1.0, 1.0,  0.0, 1.0, 0.0 ]);
        drawTriangle3D([ 0.0, 0.0, 0.0,  0.0, 0.0, 1.0,  0.0, 1.0, 1.0 ]);

        // Top
        gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
        drawTriangle3D([ 0.0, 1.0, 0.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0 ]);
        drawTriangle3D([ 0.0, 1.0, 0.0,  1.0, 1.0, 1.0,  1.0, 1.0, 0.0 ]);

        // Bottom
        gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
        drawTriangle3D([ 0.0, 0.0, 0.0,  1.0, 0.0, 1.0,  0.0, 0.0, 1.0 ]);
        drawTriangle3D([ 0.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 1.0 ]);
    }
 }
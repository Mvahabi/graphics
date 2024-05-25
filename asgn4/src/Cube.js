class Cube {
    constructor() {
      this.type = 'cube';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.normalMatrix = new Matrix4();
      this.textureNum = -2;
  
      this.verts = [
        // Front
        0, 0, 0, 1, 1, 0, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 1, 1, 0,
        
        // Top
        0, 1, 0, 0, 1, 1, 1, 1, 1,
        0, 1, 0, 1, 1, 1, 1, 1, 0,
        
        // Bottom
        0, 1, 0, 0, 1, 1, 1, 1, 1,
        0, 1, 0, 1, 1, 1, 1, 1, 0,
        
        // Left
        1, 0, 0, 1, 1, 1, 1, 1, 0,
        1, 0, 0, 1, 0, 1, 1, 1, 1,
        
        // Right
        0, 0, 0, 0, 1, 1, 0, 1, 0,
        0, 0, 0, 0, 0, 1, 0, 1, 1,
        
        // Back
        0, 0, 1, 1, 1, 1, 0, 1, 1,
        0, 0, 1, 1, 0, 1, 1, 1, 1];
  
      this.uvVerts = [
        0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
        0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
        0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
        0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
        0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1,
        0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1];
  
      this.vert32bit = new Float32Array([
        0, 0, 0, 1, 1, 0, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 1, 1, 0,
  
        0, 1, 0, 0, 1, 1, 1, 1, 1,
        0, 1, 0, 1, 1, 1, 1, 1, 0,
  
        0, 1, 0, 0, 1, 1, 1, 1, 1,
        0, 1, 0, 1, 1, 1, 1, 1, 0,
  
        0, 0, 0, 1, 0, 1, 0, 0, 1,
        0, 0, 0, 1, 0, 0, 1, 0, 1,
  
        1, 0, 0, 1, 1, 1, 1, 1, 0,
        1, 0, 0, 1, 0, 1, 1, 1, 1,
  
        0, 0, 1, 1, 1, 1, 0, 1, 1,
        0, 0, 1, 1, 0, 1, 1, 1, 1]);
  
      this.NormalVerts = [
        0, 0, -1, 0, 0, -1, 0, 0, -1,
        0, 0, -1, 0, 0, -1, 0, 0, -1,
        0, 1, 0, 0, 1, 0, 0, 1, 0,
        0, 1, 0, 0, 1, 0, 0, 1, 0,
        0, -1, 0, 0, -1, 0, 0, -1, 0,
        0, -1, 0, 0, -1, 0, 0, -1, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0,
        -1, 0, 0, -1, 0, 0, -1, 0, 0,
        -1, 0, 0, -1, 0, 0, -1, 0, 0,
        0, 0, 1, 0, 0, 1, 0, 0, 1,
        0, 0, 1, 0, 0, 1, 0, 0, 1]
    }
  
    render() {
      var rgba = this.color;
  
      gl.uniform1i(u_whichTexture, this.textureNum);
  
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
  
      // Pass the matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
      // Pass the matrix to u_NormalMatrix attribute
      gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
  
      // Front
      drawTriangle3DUVNormal([0, 0, 0, 1, 1, 0, 1, 0, 0], [0, 0, 1, 1, 1, 0], [0, 0, -1, 0, 0, -1, 0, 0, -1]);
      drawTriangle3DUVNormal([0, 0, 0, 0, 1, 0, 1, 1, 0], [0, 0, 0, 1, 1, 1], [0, 0, -1, 0, 0, -1, 0, 0, -1]);
      
      // Back
      gl.uniform4f(u_FragColor, rgba[0] * .7, rgba[1] * .7, rgba[2] * .7, rgba[3]);
      drawTriangle3DUVNormal([0, 0, 1, 1, 1, 1, 0, 1, 1], [0, 0, 1, 1, 1, 0], [0, 0, 1, 0, 0, 1, 0, 0, 1]);
      drawTriangle3DUVNormal([0, 0, 1, 1, 0, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1], [0, 0, 1, 0, 0, 1, 0, 0, 1]);
  
      // Top
      drawTriangle3DUVNormal([0, 1, 0, 1, 1, 1, 1, 1, 0], [0, 0, 1, 1, 1, 0], [0, 1, 0, 0, 1, 0, 0, 1, 0]);
      drawTriangle3DUVNormal([0, 1, 0, 0, 1, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1], [0, 1, 0, 0, 1, 0, 0, 1, 0]);
      
      // Bottom
      drawTriangle3DUVNormal([0, 0, 0, 1, 0, 1, 0, 0, 1], [0, 0, 1, 1, 1, 0], [0, -1, 0, 0, -1, 0, 0, -1, 0]);
      drawTriangle3DUVNormal([0, 0, 0, 1, 0, 0, 1, 0, 1], [0, 0, 0, 1, 1, 1], [0, -1, 0, 0, -1, 0, 0, -1, 0]);
     
      // Left
      drawTriangle3DUVNormal([1, 0, 0, 1, 1, 1, 1, 1, 0], [0, 0, 1, 1, 1, 0], [1, 0, 0, 1, 0, 0, 1, 0, 0]);
      drawTriangle3DUVNormal([1, 0, 0, 1, 0, 1, 1, 1, 1], [0, 0, 0, 1, 1, 1], [1, 0, 0, 1, 0, 0, 1, 0, 0]);
     
      // Right
      drawTriangle3DUVNormal([0, 0, 0, 0, 1, 1, 0, 1, 0], [0, 0, 1, 1, 1, 0], [-1, 0, 0, -1, 0, 0, -1, 0, 0]);
      drawTriangle3DUVNormal([0, 0, 0, 0, 0, 1, 0, 1, 1], [0, 0, 0, 1, 1, 1], [-1, 0, 0, -1, 0, 0, -1, 0, 0]);
      
    }
  
    renderfaster() {
      var rgba = this.color;
      
      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      
      gl.uniform1i(u_whichTexture, this.textureNum);
      
      // Pass the matrix to u_ModelMatrix attribute
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
  
      drawTriangle3DUVNormal(this.verts, this.uvVerts, this.NormalVerts);
    }
  }
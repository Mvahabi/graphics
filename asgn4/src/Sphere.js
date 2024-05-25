class Sphere {
  constructor() {
      this.type = 'sphere';
      this.color = [1.0, 1.0, 1.0, 1.0]; // Default color: white with full opacity
      
      this.matrix = new Matrix4();
      this.normalMatrix = new Matrix4();
      this.textureNum = -2;
      
      this.verts = [
          // Vertices data...
      ];

      this.uvVerts = [
          // UV coordinates data...
      ];
  }

  // Updated setColor method to accept four parameters: r, g, b, a
  setColor(r, g, b, a) {
      this.color = [r, g, b, a];
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

      var delta1 = Math.PI / 10;
      var delta2 = Math.PI / 10;

      for (var t = 0; t < Math.PI; t += delta1) {
          for (var r = 0; r < (2 * Math.PI); r = r + delta1) {
              var p1 = [Math.sin(t) * Math.cos(r), Math.sin(t) * Math.sin(r), Math.cos(t)];
              var p2 = [Math.sin(t + delta2) * Math.cos(r), Math.sin(t + delta2) * Math.sin(r), Math.cos(t + delta2)];
              var p3 = [Math.sin(t) * Math.cos(r + delta2), Math.sin(t) * Math.sin(r + delta2), Math.cos(t)];
              var p4 = [Math.sin(t + delta2) * Math.cos(r + delta2), Math.sin(t + delta2) * Math.sin(r + delta2), Math.cos(t + delta2)];

              var uv1 = [t / Math.PI, r / (2 * Math.PI)];
              var uv2 = [(t + delta2) / Math.PI, r / (2 * Math.PI)];
              var uv3 = [(t) / Math.PI, (r + delta2) / (2 * Math.PI)];
              var uv4 = [(t + delta2) / Math.PI, (r + delta2) / (2 * Math.PI)];

              var v = [];
              v = v.concat(p1);
              v = v.concat(p2);
              v = v.concat(p4);

              var uv = [];
              uv = uv.concat(uv1);
              uv = uv.concat(uv2);
              uv = uv.concat(uv4);
              
              drawTriangle3DUVNormal(v, uv, v);

              var v = [];
              v = v.concat(p1);
              v = v.concat(p4);
              v = v.concat(p3);

              var uv = [];
              uv = uv.concat(uv1);
              uv = uv.concat(uv4);
              uv = uv.concat(uv3);

              drawTriangle3DUVNormal(v, uv, v);
          }
      }
  }
}

class Camera {
   constructor() {
      this.eye = new Vector3([0, 0.5, 3]);
      this.at = new Vector3([0, 0, -100]);
      this.up = new Vector3([0, 1, 0]);
      this.speed = 0.15;

   }
   
   mvforward() {
      var f = new Vector3;      // f = at - eye
      f.set(this.at);           // Set f to be equal to at
      f.sub(this.eye);          // Subtract eye from f
      f.normalize();            // Noramlize f
      f.mul(this.speed);        // Scale f by speed value
      this.eye.add(f);          // eye = eye + f
      this.at.add(f);           // at = at + f
   }

   mvback() {
      var b = new Vector3;      // b = eye - at
      b.set(this.eye);          // Set b to be equal to eye
      b.sub(this.at);           // Subtract at from b
      b.normalize();            // Normalize b
      b.mul(this.speed);        // Scale b by speed value
      this.at.add(b);           // at = at + b 
      this.eye.add(b);          // eye = eye + b
   }
   
   mvleft() {
      var l = new Vector3;                   // l = at - eye
      l.set(this.at);                        // Set l to be equal to at
      l.sub(this.eye);                       // Subtract eye from l
      l.normalize();                         // Noramlize l
      l.mul(this.speed);                     // Scale l by speed value
      var s = Vector3.cross(this.up, l);     // Cross product
      this.at.add(s);                        // at = at + s 
      this.eye.add(s);                       // eye = eye + s
   }

   mvright() {
      var r = new Vector3;                  // r = eye - at
      r.set(this.eye);                      // Set r to be equal to eye
      r.sub(this.at);                       // Subtract at from r
      r.normalize();                        // Noramlize r
      r.mul(this.speed);                    // Scale r by speed value
      var s = Vector3.cross(this.up, r);    // Cross product
      this.at.add(s);                       // at = at + s 
      this.eye.add(s);                      // eye = eye + s
   }

   panleft() {
      var pl = new Vector3;
      pl.set(this.at);
      pl.sub(this.eye);
      let rotationMatrix = new Matrix4();
      rotationMatrix.setIdentity();
      rotationMatrix.setRotate(1, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
      
      // Get the vector translation of rotation matrix
      let d3D = rotationMatrix.multiplyVector3(pl);
      this.at = d3D.add(this.eye);
   }

   panright() {
      var pr = new Vector3;
        pr.set(this.at);
        pr.sub(this.eye);
        let rotationMatrix = new Matrix4();
		rotationMatrix.setIdentity();
		rotationMatrix.setRotate(-1, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
		
      // Get the vector translation of rotation matrix
		let d3D = rotationMatrix.multiplyVector3(pr);
		this.at = d3D.add(this.eye);
   }
}
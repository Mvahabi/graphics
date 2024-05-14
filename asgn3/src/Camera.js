// class Camera {
//     constructor() {
//        this.eye = new Vector3([0, 0.5, 3]);
//        this.at = new Vector3([0, 0, -100]);
//        this.up = new Vector3([0, 1, 0]);
//        this.speed = 0.2;
 
//     }
//     /*Compute forward vector f = at - eye. 
//     Create a new vector f: let f = new Vector3();
//     Set f to be equal to at: f.set(at);
//     Subtract eye from f: f.sub(eye);
//     Normalize f using f.normalize(); 
//     Scale f by a desired "speed" value: f.mul(speed)
//     Add forward vector to both eye and center: eye += f; at += f; */
//     forward(move = 0) {
//        var f = new Vector3;
//        f.set(this.at);
//        f.sub(this.eye);
//        f.normalize();
//        f.mul(this.speed + move);
//        this.eye.add(f);
//        this.at.add(f);
//     }
 
//     back(move = 0) {
//        var f = new Vector3;
//        f.set(this.eye);
//        f.sub(this.at);
//        f.normalize();
//        f.mul(this.speed + move);
//        this.at.add(f);
//        this.eye.add(f);
//     }
 
//     left() {
//        var f = new Vector3;    // l = at - eye
//        f.set(this.at);
//        f.sub(this.eye);
//        f.normalize();
//        f.mul(this.speed);
//        var s = Vector3.cross(this.up, f);
//        this.at.add(s);
//        this.eye.add(s);
//     }
 
//     right() {
//        var f = new Vector3;    // l = eye - at
//        f.set(this.eye);
//        f.sub(this.at);
//        f.normalize();
//        f.mul(this.speed);
//        var s = Vector3.cross(this.up, f);
//        this.at.add(s);
//        this.eye.add(s);
//     }
 
//     panLeft() {
//        var f = new Vector3;
//        f.set(this.at);
//        f.sub(this.eye);
//        let rotationMatrix = new Matrix4();
//        rotationMatrix.setIdentity();
//        rotationMatrix.setRotate(1, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
//        let d3D = rotationMatrix.multiplyVector3(f);
//        this.at = d3D.add(this.eye);
//     }
 
//     panRight() {
//        var f = new Vector3;
//        f.set(this.at);
//        f.sub(this.eye);
//        let rotationMatrix = new Matrix4();
//        rotationMatrix.setIdentity();
//        rotationMatrix.setRotate(-1, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
//        // Get the vec3 translation of Matrix4 Rotation Matrix
//        let d3D = rotationMatrix.multiplyVector3(f);
//        this.at = d3D.add(this.eye);
//     }
//  }

class Camera {
   constructor() {
       this.eye = new Vector3([0, 0.5, 3]);
       this.at = new Vector3([0, 0, -100]);
       this.up = new Vector3([0, 1, 0]);
       this.speed = 0.2;
   }

   forward() {
       let f = new Vector3();
       f.set(this.at);
       f.sub(this.eye);
       f.normalize();
       f.mul(this.speed);
       this.eye.add(f);
       this.at.add(f);
   }

   back() {
       let f = new Vector3();
       f.set(this.at);
       f.sub(this.eye);
       f.normalize();
       f.mul(this.speed);
       this.eye.sub(f);
       this.at.sub(f);
   }

   panLeft() {
       let f = new Vector3();
       f.set(this.at);
       f.sub(this.eye);
       let rotationMatrix = new Matrix4();
       rotationMatrix.setRotate(5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
       f = rotationMatrix.multiplyVector3(f);
       f.add(this.eye);
       this.at.set(f);
   }

   panRight() {
       let f = new Vector3();
       f.set(this.at);
       f.sub(this.eye);
       let rotationMatrix = new Matrix4();
       rotationMatrix.setRotate(-5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
       f = rotationMatrix.multiplyVector3(f);
       f.add(this.eye);
       this.at.set(f);
   }
}
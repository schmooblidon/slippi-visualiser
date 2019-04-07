export default function Vec2D(x, y) {
  
  this.x = x;
  this.y = y;
  this.dot = function(vector) {
    return this.x * vector.x + this.y * vector.y;
  };

  this.rotate = function(angle) {
    var new_x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    var new_y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
    this.x = new_x;
    this.y = new_y;
  } 

  this.angle = function() {
    return Math.atan2(this.y, this.x);
  }

};
// GameObject.js
class GameObject {
  constructor(id, type, width, height, x = 0, y = 0, isHidden = false) {
    this.id = id;
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.isHidden = isHidden;
  }
}

export default GameObject;

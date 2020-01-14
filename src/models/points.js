export default class Points {
  constructor() {
    this._points = [];
  }

  getPointsAll() {
    return this._points;
  }

  setPoints(points) {
    this._points = Array.from(points);
  }

  updatePoint(id, point) {
    const index = this._points.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), point, this._points.slice(index + 1));
    return true;
  }
}

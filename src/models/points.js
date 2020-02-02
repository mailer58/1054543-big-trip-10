import {
  getPointsByFilter
} from './../utils/filter.js';
import {
  FilterType
} from './../const.js';

export default class Points {
  constructor() {
    this._points = [];
    this._activeFilterType = FilterType.ALL;
  }

  getPointsAll() {
    return this._points;
  }

  getPoints() {
    return getPointsByFilter(this._points, this._activeFilterType);
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

  addPoint(point) {
    this._points = [].concat(point, this._points);
    return true;
  }

  removePoint(id) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));

    return true;
  }
}

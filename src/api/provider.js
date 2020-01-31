import nanoid from "nanoid";

import Point from "../models/point";

const getSyncedPoints = (items) => items.filter(({success}) => success).map(({payload}) => payload.point);

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getPoints() {
    if (this._isOnLine()) {
      return this._api.getPoints().then(
          (points) => {
            points.forEach((point) => {
              this._store.setItem(point.id, point.toRAW());
            });
            return points;
          }
      );
    }

    const storeData = this._store.getAll();
    const storePoints = [];

    // get points from local storage:
    for (const key in storeData) {
      if (key !== `offers` && key !== `destinations`) {
        storePoints.push(storeData[key]);
      }
    }
    this._isSynchronized = false;

    return Promise.resolve(Point.parsePoints(storePoints));
  }

  getDestinations() {
    if (this._isOnLine()) {
      return this._api.getDestinations().then(
          (destinations) => {
            destinations.forEach(() => {
              this._store.setItem(`destinations`, destinations);
            });
            return destinations;
          }
      );
    }

    const storeData = this._store.getAll();
    const storeDestinations = [];
    // get destinations from local storage:
    for (const key in storeData) {
      if (key === `destinations`) {
        storeDestinations.push(storeData[key]);
      }
    }

    this._isSynchronized = false;
    return Promise.resolve(storeDestinations);
  }

  getOffers() {
    if (this._isOnLine()) {
      return this._api.getOffers().then(
          (offers) => {
            offers.forEach((offer) => this._store.setItem(`offers`, offer));
            return offers;
          }
      );
    }

    const storeData = this._store.getAll();
    const storeOffers = [];

    // get offers from local storage:
    for (const key in storeData) {
      if (key === `offers`) {
        storeOffers.push(storeData[key]);
      }
    }

    this._isSynchronized = false;

    return Promise.resolve(storeOffers);
  }

  createPoint(point) {
    if (this._isOnLine()) {
      return this._api.createPoint(point).then(
          (newPoint) => {
            this._store.setItem(newPoint.id, newPoint.toRAW());
            return newPoint;
          }
      );
    }

    const fakeNewPointId = nanoid();
    const fakeNewPoint = Object.assign({}, point, {
      id: fakeNewPointId
    });

    this._isSynchronized = false;
    this._store.setItem(fakeNewPoint.id, Object.assign({}, fakeNewPoint, {
      offline: true
    }));

    return Promise.resolve(fakeNewPoint);
  }

  updatePoint(id, point) {
    if (this._isOnLine()) {
      return this._api.updatePoint(id, point).then(
          (newPoint) => {
            this._store.setItem(newPoint.id, newPoint);
            return newPoint;
          }
      );
    }

    const fakeUpdatedPoint = Point.parsePoint(Object.assign({}, point, {
      id
    }));

    this._isSynchronized = false;
    this._store.setItem(id, Object.assign({}, fakeUpdatedPoint.toRAW(), {
      offline: true
    }));

    return Promise.resolve(fakeUpdatedPoint);
  }

  deletePoint(id) {
    if (this._isOnLine()) {
      return this._api.deletePoint(id).then(
          () => {
            this._store.removeItem(id);
          }
      );
    }

    this._isSynchronized = false;
    this._store.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (this._isOnLine()) {
      const storePoints = [];
      const storeData = this._store.getAll();

      // get points from local storage:
      for (const key in storeData) {
        if (key !== `offers` && key !== `destinations`) {
          storePoints.push(storeData[key]);
        }
      }

      return this._api.sync(storePoints)
        .then((response) => {
          storePoints.filter((point) => point.offline).forEach((point) => {
            this._store.removeItem(point.id);
          });

          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          [...createdPoints, ...updatedPoints].forEach((point) => {
            this._store.setItem(point.id, point);
          });

          this._isSynchronized = true;

          return Promise.resolve();
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}

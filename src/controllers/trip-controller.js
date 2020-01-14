import
NoEventsComponent
from './../components/no-points.js';

import {
  renderEventCards
}
from './../components/cards-of-points-of-route.js';

import {
  computeTotalPrice,
  renderTripInfo
} from './../utils/common.js';

import {
  render,
  RenderPosition,
} from './../utils/render.js';

import
TripSortMenuComponent
from './../components/trip-sort-menu.js';

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;

    this._pointsModel = pointsModel;

    this._showedPointControllers = [];

    this._tripSortMenuComponent = new TripSortMenuComponent();
    this._noEventsComponent = new NoEventsComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render() {
    const tripEventsHeader = document.querySelector(`.trip-events > h2:nth-child(1)`);

    if (this._pointsModel.getPointsAll().length > 0) {

      // show sorting menu:
      render(tripEventsHeader, this._tripSortMenuComponent.getElement(), RenderPosition.AFTER);

      // show list of events:
      const newPoints = renderEventCards(this._pointsModel.getPointsAll(), this._container, this._onDataChange, this._onViewChange);

      // save array of pointControllers:
      this._showedPointControllers = this._showedPointControllers.concat(newPoints);

    } else { // show prompt:
      this._pointsModel.setPoints([]);
      this._showedPointControllers = [];
      render(tripEventsHeader, this._noEventsComponent.getElement(), RenderPosition.AFTER);
    }

    // compute and show total price:
    computeTotalPrice(this._pointsModel.getPointsAll());

    renderTripInfo(this._pointsModel.getPointsAll());
  }

  _onViewChange() {
    this._showedPointControllers.forEach((item) => item.setDefaultView());
  }


  _onDataChange(tripController, oldData, newData) {
    const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);

  }


}

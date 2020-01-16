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

import {
  DataChange
} from './../const.js';

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._tripController = this;

    this._pointsModel = pointsModel;

    this._showedPointControllers = [];

    this._tripSortMenuComponent = new TripSortMenuComponent();
    this._noEventsComponent = new NoEventsComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._tripEventsHeader = document.querySelector(`.trip-events > h2:nth-child(1)`);
  }

  render() {
    if (this._pointsModel.getPointsAll().length > 0) {

      // show sorting menu:
      render(this._tripEventsHeader, this._tripSortMenuComponent.getElement(), RenderPosition.AFTER);

      // show list of events:
      const newPoints = renderEventCards(this._pointsModel.getPointsAll(), this._container, this._onDataChange, this._onViewChange, this._tripController);

      // save array of pointControllers:
      this._showedPointControllers = this._showedPointControllers.concat(newPoints);

    } else { // show prompt:
      this._pointsModel.setPoints([]);
      this._showedPointControllers = [];
      render(this._tripEventsHeader, this._noEventsComponent.getElement(), RenderPosition.AFTER);
    }

    // compute and show total price:
    computeTotalPrice(this._pointsModel.getPointsAll());

    renderTripInfo(this._pointsModel.getPointsAll());
  }

  _onViewChange() {
    this._showedPointControllers.forEach((item) => item.setDefaultView());
  }

  _onDataChange(mode, id, event) {
    switch (mode) {
      case DataChange.FAVORITE: // toggle favorite:
        this._pointsModel.updatePoint(id, event);
        break;
      case DataChange.SAVE: // save existing point:
        this._pointsModel.updatePoint(id, event);

        // remove controllers of points:
        for (const pointController of this._showedPointControllers) {
          pointController.destroy();
        }

        // reset array of showedPointControllers:
        this._showedPointControllers = [];

        // remove mark-up of list of days:
        this._container.removeElement();
        const tripDays = document.querySelector(`.trip-days`);
        tripDays.remove();

        if (this._pointsModel.getPointsAll().length > 0) {
          // show list of events:
          const newPoints = renderEventCards(this._pointsModel.getPointsAll(), this._container, this._onDataChange, this._onViewChange, this._tripController);

          // save array of pointControllers:
          this._showedPointControllers = this._showedPointControllers.concat(newPoints);
        } else { // show prompt:
          render(this._tripEventsHeader, this._noEventsComponent.getElement(), RenderPosition.AFTER);
        }

        break;

    }
  }
}

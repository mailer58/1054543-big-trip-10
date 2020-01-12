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
  constructor(container) {
    this._container = container;

    this._events = [];
    this._showedPointControllers = [];

    this._tripSortMenuComponent = new TripSortMenuComponent();
    this._noEventsComponent = new NoEventsComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(events) {
    this._events = events;
    const tripEventsHeader = document.querySelector(`.trip-events > h2:nth-child(1)`);

    if (events.length > 0) {

      // show sorting menu:
      render(tripEventsHeader, this._tripSortMenuComponent.getElement(), RenderPosition.AFTER);

      // show list of events:
      const newPoints = renderEventCards(events, this._container, this._onDataChange, this._onViewChange);

      // save array of pointControllers:
      this._showedPointControllers = this._showedPointControllers.concat(newPoints);

    } else { // show prompt:
      this._events = [];
      this._showedPointControllers = [];
      render(tripEventsHeader, this._noEventsComponent.getElement(), RenderPosition.AFTER);
    }

    // compute and show total price:
    computeTotalPrice(events);

    renderTripInfo(events);
  }

  _onViewChange() {
    this._showedPointControllers.forEach((item) => item.setDefaultView());
  }


  _onDataChange(pointController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

  }

}

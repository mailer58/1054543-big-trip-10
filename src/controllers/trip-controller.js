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
    this._tripSortMenuComponent = new TripSortMenuComponent();
    this._noEventsComponent = new NoEventsComponent();
  }

  render(events) {
    const tripEventsHeader = document.querySelector(`.trip-events > h2:nth-child(1)`);

    if (events.length > 0) {

      // show sorting menu:
      render(tripEventsHeader, this._tripSortMenuComponent.getElement(), RenderPosition.AFTER);

      // show list of events:
      renderEventCards(events, this._container);

    } else {
      render(tripEventsHeader, this._noEventsComponent.getElement(), RenderPosition.AFTER);
    }

    // compute and show total price:
    computeTotalPrice(events);

    renderTripInfo(events);
  }
}

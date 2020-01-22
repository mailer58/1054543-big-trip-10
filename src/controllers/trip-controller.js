import
NoEventsComponent
  from './../components/no-points.js';

import NewEventController from './../controllers/new-event-controller.js';

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
  remove
} from './../utils/render.js';

import
TripSortMenuComponent
  from './../components/trip-sort-menu.js';

import {
  DataChange,
  ToggleButton,
  SortType
} from './../const.js';

export default class TripController {
  constructor(container, filter, pointsModel) {
    this._container = container;

    // presence sortMenu in mark-up for NewEventController:
    this._tripSortMenuPresence = false;

    this._currentSortType = SortType.EVENT;

    this._pointsModel = pointsModel;

    this._showedPointControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._filterComponent = filter;
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
    this._filterComponent.setFilterTypeChangeHandler(this._onFilterTypeChange);

    this._tripSortMenuComponent = new TripSortMenuComponent();
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._newEventController = new NewEventController(this, this._onDataChange);
    this._noEventsComponent = new NoEventsComponent(this._pointsModel._activeFilterType);

    this._tripEventsHeader = document.querySelector(`.trip-events > h2:nth-child(1)`);

    this.setNewEventBtnClickHandler();
  }

  setNewEventBtnClickHandler() {
    const newEventBtn = document.querySelector(`.trip-main__event-add-btn`);
    newEventBtn.addEventListener(`click`, () => {
      // disable button of new event:
      newEventBtn.disabled = true;

      // close all opened editing forms:
      this._onViewChange();

      // disable rollup buttons of points of route:
      this._showedPointControllers.forEach((item) => {
        item.toggleRollUpBtn(ToggleButton.DISABLE);
      });

      // show newEventForm:
      this._newEventController.render();
    });
  }

  render() {
    // remove markup of old noEventsComponent:
    remove(this._noEventsComponent);

    // remove old controllers:
    this.removeOldElements();

    // if there are points of route:
    if (this._pointsModel.getPoints().length > 0) {

      // show sorting menu:
      render(this._tripEventsHeader, this._tripSortMenuComponent.getElement(), RenderPosition.AFTER);
      this._tripSortMenuComponent.setSortTypeChangeHandler(this._onSortTypeChange);
      this._tripSortMenuPresence = true;

      // show list of events:
      const newPoints = renderEventCards(this._pointsModel.getPoints(), this._container, this._onDataChange, this._onViewChange, this);

      // save array of pointControllers:
      this._showedPointControllers = this._showedPointControllers.concat(newPoints);

    } else { // show a message:

      // remove sorting menu:
      remove(this._tripSortMenuComponent);
      this._tripSortMenuPresence = false;

      // set type of message for noEventsComponent:
      this._noEventsComponent._activeFilterType = this._pointsModel._activeFilterType;

      // show message of noEventsComponent:
      render(this._tripEventsHeader, this._noEventsComponent.getElement(), RenderPosition.AFTER);
    }

    // compute and show total price:
    computeTotalPrice(this._pointsModel.getPoints());

    // show summary of trip:
    renderTripInfo(this._pointsModel.getPoints());
  }

  // close opened editing forms:
  _onViewChange() {
    this._showedPointControllers.forEach((item) => item.setDefaultView());
  }

  // change data of pointsModel:
  _onDataChange(mode, id, event) {
    switch (mode) {
      case DataChange.FAVORITE: // toggle favorite:
        this._pointsModel.updatePoint(id, event);
        break;

      case DataChange.SAVE: // save existing point:
        this._pointsModel.updatePoint(id, event);
        this.render();
        break;

      case DataChange.REMOVE: // remove existing point:
        this._pointsModel.removePoint(id);
        this.render();
        break;

      case DataChange.ADD: // add new point:
        this._pointsModel.addPoint(event);
        this.render();
        break;
    }
  }

  _onSortTypeChange(sortType) {
    this._currentSortType = sortType;
    this.render();
  }

  _onFilterTypeChange(sortType) {
    this._pointsModel._activeFilterType = sortType;
    this.render();
  }

  removeOldElements() {
    // remove old newEventForm when changing filter or sorting:
    const newEventBtn = document.querySelector(`.trip-main__event-add-btn`);
    if (newEventBtn.disabled) {
      const newEventForm = this._newEventController._newEventFormComponent;
      remove(newEventForm);

      this._newEventController = new NewEventController(this, this._onDataChange);

      newEventBtn.disabled = false;
    }

    // remove old controllers:
    if (this._showedPointControllers.length > 0) {
      // remove controllers of points:
      this._showedPointControllers.forEach((item) => item.destroy());

      // reset array of showedPointControllers:
      this._showedPointControllers = [];

      // remove mark-up of list of days:
      remove(this._container);
    }
  }
}

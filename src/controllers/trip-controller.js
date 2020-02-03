import
NoEventsComponent
  from './../components/no-points.js';

import Statistics from './../components/statistics.js';

import NewEventController from './../controllers/new-event-controller.js';

import {
  renderEventCards
}
  from './../components/cards-of-points-of-route.js';

import {
  computeTotalPrice,
  renderTripInfo,
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
  SortType,
  ButtonsText
} from './../const.js';

export default class TripController {
  constructor(container, siteMenu, filter, pointsModel, api) {
    this._container = container;

    this._siteMenu = siteMenu;

    // presence sortMenu in mark-up for NewEventController:
    this._tripSortMenuPresence = false;

    this._newEventFormPresence = null;

    this._currentSortType = SortType.EVENT;

    this._pointsModel = pointsModel;

    this._api = api;

    this._showedPointControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._statisticsComponent = new Statistics(this);

    this._filterComponent = filter;
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
    this._filterComponent.setFilterTypeChangeHandler(this._onFilterTypeChange);
    this._filterComponent.getTripController(this);

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
      this._newEventFormPresence = true;

      // disable button of new event:
      newEventBtn.disabled = true;

      // close all opened editing forms:
      this._onViewChange();

      // disable rollup buttons of points of route:
      this._showedPointControllers.forEach((item) => {
        item.toggleRollUpBtn(ToggleButton.DISABLE);
      });

      // return into table mode from stats:
      const statsBtn = document.querySelector(`#stats`);
      if (statsBtn.classList.contains(`trip-tabs__btn--active`)) {
        this._statisticsComponent.hide();
        this._filterComponent.show();
        this._container.show();
        this._tripSortMenuComponent.show();
        this._newEventController._newEventFormComponent.show();

        const tableBtn = document.querySelector(`#table`);
        statsBtn.classList.toggle(`trip-tabs__btn--active`);
        tableBtn.classList.toggle(`trip-tabs__btn--active`);
      }

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
        this._api.updatePoint(id, event)
          .then((PointModel) => {
            // update a point:
            const isSuccess = this._pointsModel.updatePoint(id, PointModel);
            if (isSuccess) {
              // find required editPointComponent and add updated event to it:
              const pointController = this.findPointController(id);
              pointController._editPointComponent._event = PointModel;

              const favoriteInput = pointController._editPointComponent.getElement().querySelector(`#event-favorite-1`);

              // toggle favorite button:
              favoriteInput.checked = !favoriteInput.checked;

              // enable favorite button
              favoriteInput.classList.remove(`disabled`);
            }
          })
          .catch(() => {
            this.handleConnectionErrors(id);

            // find required editPointComponent and add updated event to it:
            const pointController = this.findPointController(id);

            // enable favorite button:
            const favoriteInput = pointController._editPointComponent.getElement().querySelector(`#event-favorite-1`);
            favoriteInput.classList.remove(`disabled`);
          });

        break;

      case DataChange.SAVE: // save existing point:
        this._api.updatePoint(id, event)
          .then((PointModel) => {
            const isSuccess = this._pointsModel.updatePoint(id, PointModel);
            if (isSuccess) {
              this.render();
            }
          })
          .catch(() => {
            this.handleConnectionErrors(id);
          });

        break;

      case DataChange.REMOVE: // remove existing point:
        this._api.deletePoint(id)
          .then(() => {
            this._pointsModel.removePoint(id);
            this.render();
          })
          .catch(() => {
            this.handleConnectionErrors(id);
          });

        break;

      case DataChange.ADD: // add new point:
        this._api.createPoint(event)
          .then((pointModel) => {
            const isSuccess = this._pointsModel.addPoint(pointModel);
            if (isSuccess) {
              this.render();
              this._newEventController._closeNewEventForm();
            }
          })
          .catch(() => {
            // show warning border:
            const newEventFormComponent = this._newEventController._newEventFormComponent.getElement();
            newEventFormComponent.classList.add(`error`);
            // shake a form:
            this._newEventController.shake();

            // unblock save button:
            const saveBtn = newEventFormComponent.querySelector(`.event__save-btn`);
            saveBtn.disabled = false;
            saveBtn.textContent = `Save`;
            this._newEventController._newEventFormComponent._buttonsText = Object.assign({}, ButtonsText, {
              SAVE: `Save`,
            });

          });

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
    if (this._newEventFormPresence) {
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

  findPointController(id) {
    for (const pointController of this._showedPointControllers) {
      if (pointController._id === id) {
        return pointController;
      }
    }
    return null;
  }

  onBodyClickToHideWarning(editPointComponent, handler) {
    editPointComponent.classList.remove(`error`);
    document.body.removeEventListener(`click`, handler);
  }

  // show animation and warning border:
  handleConnectionErrors(id) {

    const pointController = this.findPointController(id);
    const editPointComponent = pointController._editPointComponent.getElement();

    // show warning border:
    editPointComponent.classList.add(`error`);

    // shake a form:
    pointController.shake();

    // unblock save and delete buttons:
    const saveBtn = editPointComponent.querySelector(`.event__save-btn`);
    saveBtn.disabled = false;
    saveBtn.textContent = `Save`;
    pointController._editPointComponent._buttonsText = Object.assign({}, ButtonsText, {
      SAVE: `Save`,
    });

    const deleteBtn = editPointComponent.querySelector(`.event__reset-btn`);
    deleteBtn.disabled = false;
    deleteBtn.textContent = `Delete`;
    pointController._editPointComponent._buttonsText = Object.assign({}, ButtonsText, {
      DELETE: `Delete`,
    });

    const onBodyClick = this.onBodyClickToHideWarning.bind(null, editPointComponent, this.onBodyClickToHideWarning);

    document.body.addEventListener(`click`, onBodyClick);

  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }
}

import
FormsCommonListeners from './../utils/forms-common-listeners.js';

import {
  NewEventFormComponent,
  getFormData,
  setData
} from '../components/forms.js';

import {
  toRAW
} from './../utils/common.js';

import {
  render,
  remove,
  RenderPosition
} from './../utils/render.js';

import {
  DataChange,
  ToggleButton
} from './../const.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class NewEventController extends FormsCommonListeners {
  constructor(tripController, onDataChange) {
    super();
    this._tripController = tripController;
    this._onDataChange = onDataChange;

    this._newEventFormComponent = new NewEventFormComponent(this);

    this._closeNewEventForm = this.closeNewEventForm.bind(this);
  }

  render() {
    const sortMenuPresence = this._tripController._tripSortMenuPresence;
    const newEventForm = this._newEventFormComponent.getElement();

    if (!sortMenuPresence) {
      remove(this._tripController._noEventsComponent);
      const tripEventsSection = document.querySelector(`.trip-events`);
      render(tripEventsSection, newEventForm, RenderPosition.APPEND);
    } else {
      const tripDays = document.getElementsByClassName(`trip-days`)[0];
      if (tripDays) {
        render(tripDays, newEventForm, RenderPosition.BEFORE);
      } else {
        const tripEventList = document.getElementsByClassName(`trip-events__list`)[0];
        render(tripEventList, newEventForm, RenderPosition.BEFORE);
      }
    }

    // add listeners:
    this._newEventFormComponent._subscribeOnEvents();

    this._newEventFormComponent.setEventListBtnClickHandler(super.onEventListBtnClick.bind(this));

    this._newEventFormComponent.setCancelBtnClickHandler(() => {
      this._closeNewEventForm();
    });

    this._newEventFormComponent.setSubmitBtnHandler((evt) => {
      evt.preventDefault();

      // disable save button:
      const saveBtn = this._newEventFormComponent.getElement().querySelector(`.event__save-btn`);
      saveBtn.disabled = true;

      // get data of form:
      const formData = getFormData(this._newEventFormComponent);

      // get new id:
      const newId = String(this._tripController._pointsModel.getPointsAll().length + 1);

      // get data for format of server:
      const newEvent = toRAW(newId, formData);
      newEvent[`is_favorite`] = false;

      // change a text of save button:
      setData(this._newEventFormComponent, {
        saveButtonText: `Saving...`,
      }, formData);

      this._onDataChange(DataChange.ADD, null, newEvent);
    });
  }

  closeNewEventForm() {
    const saveBtn = this._newEventFormComponent.getElement().querySelector(`.event__save-btn`);

    if (saveBtn.textContent === `Save`) {
      this.resetNewEventFormData();
    }

    remove(this._newEventFormComponent);

    const newEventBtn = document.querySelector(`.trip-main__event-add-btn`);
    newEventBtn.disabled = false;

    // enable rollup buttons of points of route:
    this._tripController._showedPointControllers.forEach((item) => {
      item.toggleRollUpBtn(ToggleButton.ENABLE);
    });

    if (this._tripController._pointsModel.getPoints().length === 0) {
      // show message of noEventsComponent:
      const tripEventsHeader = document.querySelector(`.trip-events > h2:nth-child(1)`);
      render(tripEventsHeader, this._tripController._noEventsComponent.getElement(), RenderPosition.AFTER);
    }
  }

  resetNewEventFormData() {
    this._newEventFormComponent._destination = null;
    this._newEventFormComponent._price = null;
    this._newEventFormComponent._icon = null;
    this._newEventFormComponent._eventType = null;
    this._newEventFormComponent._startTime = null;
    this._newEventFormComponent._endTime = null;
    this._newEventFormComponent._offers = null;
    this._newEventFormComponent._displayNumber = 1;
  }

  shake() {
    this._newEventFormComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
  }

}

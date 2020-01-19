import
FormsCommonListeners from './../utils/forms-common-listeners.js';

import {
  NewEventFormComponent,
  getFormData,
} from '../components/forms.js';

import {
  render,
  remove,
  RenderPosition
} from './../utils/render.js';

import {
  DataChange,
  ToggleButton
} from './../const.js';

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
      const sortMenu = document.getElementsByClassName(`trip-events__trip-sort`)[0];
      render(sortMenu, newEventForm, RenderPosition.APPEND);
    }

    // add listeners:
    this._newEventFormComponent.setEventListBtnClickHandler(super.onEventListBtnClick.bind(this));

    this._newEventFormComponent.setCancelBtnClickHandler(() => {
      this._closeNewEventForm();
    });

    this._newEventFormComponent.setSubmitBtnHandler((evt) => {
      evt.preventDefault();
      const formData = getFormData(this._newEventFormComponent);
      const {
        formStartTime,
        formEndTime,
        formPrice,
        formDestination,
        formEventType,
        formIcon,
        formDescription,
        formOffers,
        formFavorite
      } = formData;

      const newId = this._tripController._pointsModel.getPointsAll().length + 1;

      const newEvent = {
        id: newId,
        eventType: formEventType,
        destination: formDestination,
        eventIcon: formIcon,
        startTime: formStartTime,
        endTime: formEndTime,
        price: formPrice,
        photo: null,
        description: formDescription,
        offers: formOffers,
        days: ``,
        favorite: formFavorite,
      };

      this._closeNewEventForm();

      this._onDataChange(DataChange.ADD, null, newEvent);
    });
  }

  closeNewEventForm() {
    this.resetNewEventFormData();

    remove(this._newEventFormComponent);

    this._newEventFormComponent._subscribeOnEvents();

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
  }

}

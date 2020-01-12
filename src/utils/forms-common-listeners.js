import {getEventTypeIcon} from "./../components/forms.js";

const ESC_KEYCODE = 27;

const pageBody = document.querySelector(`body`);


export default class FormsCommonListeners {
  constructor() {
    if (new.target === FormsCommonListeners) {
      throw new Error(`Can't instantiate FormsCommonListeners, only concrete one.`);
    }
    this.getEventTypeIcon = this.getEventTypeIcon;
  }

  // hide eventList by click on the page:
  onPageBodyClickToCloseEventList(evt) {
    const eventTypeList = document.getElementsByClassName(`event__type-list`)[0];
    const eventTypeToggle = document.getElementById(`event-type-toggle-1`);
    if (!evt.target.matches(`.event__type-label`) &&
      !evt.target.matches(`.event__type-btn`) &&
      !evt.target.matches(`.event__type-icon`) &&
      !evt.target.matches(`.event__type-input`)) {

      if (eventTypeToggle && eventTypeList) {
        eventTypeToggle.checked = !eventTypeToggle.checked;
        eventTypeList.style.display = `none`;
      }

      pageBody.removeEventListener(`click`, this.onPageBodyClickToCloseEventList);
      document.addEventListener(`keydown`, this._onEscKeyDownCloseForm);
    }
  }

  onEscKeyDownCloseEventsList(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      const eventTypeList = document.getElementsByClassName(`event__type-list`)[0];
      const eventTypeToggle = document.getElementById(`event-type-toggle-1`);
      eventTypeToggle.checked = !eventTypeToggle.checked;
      eventTypeList.style.display = `none`;
      document.removeEventListener(`keydown`, this.onEscKeyDownCloseEventsList);
      document.addEventListener(`keydown`, this._onEscKeyDownCloseForm);
      pageBody.removeEventListener(`click`, this.onPageBodyClickToCloseEventList);
    }
  }

  onEventListOptionClick(evt) {
    this._icon = getEventTypeIcon(evt);
    pageBody.removeEventListener(`click`, this.onPageBodyClickToCloseEventList);
  }
}

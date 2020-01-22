const pageBody = document.querySelector(`body`);


export default class FormsCommonListeners {
  constructor() {
    if (new.target === FormsCommonListeners) {
      throw new Error(`Can't instantiate FormsCommonListeners, only concrete one.`);
    }
  }

  // hide eventList by click on the page:
  _onPageBodyClickToCloseEventList(evt) {
    const eventTypeList = document.getElementsByClassName(`event__type-list`)[0];
    const eventTypeToggle = document.getElementById(`event-type-toggle-1`);
    if (!evt.target.matches(`.event__type-label`) &&
      !evt.target.matches(`.event__type-btn`) &&
      !evt.target.matches(`.event__type-icon`) &&
      !evt.target.matches(`.event__type-input`)) {

      if (eventTypeList) {
        eventTypeToggle.checked = false;
        eventTypeList.style.display = `none`;

        // remove this listener:
        pageBody.removeEventListener(`click`, this._onPageBodyClickToCloseEventList);
      }
    }
  }

  onEventListBtnClick(evt) {
    evt.preventDefault();

    const eventTypeToggle = document.getElementById(`event-type-toggle-1`);
    const eventTypeList = document.getElementsByClassName(`event__type-list`)[0];

    eventTypeToggle.checked = !eventTypeToggle.checked;
    eventTypeList.style.display = eventTypeToggle.checked ? `block` : `none`;
    if (eventTypeList.style.display === `block`) {
      pageBody.addEventListener(`click`, this._onPageBodyClickToCloseEventList);
    } else {
      pageBody.removeEventListener(`click`, this._onPageBodyClickToCloseEventList);
    }
  }
}

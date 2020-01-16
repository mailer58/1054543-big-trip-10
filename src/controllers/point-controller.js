import {
  EditEventFormComponent,
}
  from './../components/forms.js';

import {
  MarkUpForPointOfRouteComponent,
  OffersComponent
}
  from './../components/cards-of-points-of-route.js';

import
FormsCommonListeners, {} from './../utils/forms-common-listeners.js';

import {
  replace,
  render,
  RenderPosition,
  remove
} from './../utils/render.js';

import {
  DataChange
} from './../const.js';

import {
  setCase,
  getDateFromInput,
} from "./../utils/common.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

const pageBody = document.querySelector(`body`);

export default class PointController extends FormsCommonListeners {
  constructor(container, onDataChange, onViewChange, tripController) {
    super();
    this._container = container;
    this._mode = Mode.DEFAULT;
    this._tripController = tripController;

    this._pointComponent = null;
    this._editPointComponent = null;

    this._onEscKeyDownCloseEditForm = this._onEscKeyDownCloseEditForm.bind(this);
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onPageBodyClickToCloseEventList = super._onPageBodyClickToCloseEventList.bind(this);
    this._onEscKeyDownCloseEventsList = super._onEscKeyDownCloseEventsList.bind(this);
  }

  render(event) {

    this._pointComponent = new MarkUpForPointOfRouteComponent(event);
    this._editPointComponent = new EditEventFormComponent(event);

    // render a point of route:
    render(this._container, this._pointComponent.getElement(event), RenderPosition.APPEND);

    // render offers:
    const offersHeader = this._pointComponent.getElement().querySelector(`.event > h4`);
    const offersComponent = new OffersComponent(event.offers);
    const offersMarkUp = offersComponent.getElement();
    render(offersHeader, offersMarkUp, RenderPosition.AFTER);

    // add listeners:
    this._pointComponent.setRollUpBtnHandler(() => {
      this._replaceCardToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDownCloseEditForm);
    });

    // save changes in exisiting event:
    this._editPointComponent.setSubmitBtnHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToCard();
      const formData = this.getFormData();
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

      const newEvent = {
        id: event.id,
        eventType: formEventType,
        destination: formDestination,
        eventIcon: formIcon,
        startTime: formStartTime,
        endTime: formEndTime,
        price: formPrice,
        photo: event.photo,
        description: formDescription,
        offers: formOffers,
        days: ``,
        favorite: formFavorite,
      };

      this._onDataChange(DataChange.SAVE, event.id, Object.assign({}, newEvent));
    });

    this._editPointComponent.setFavoriteBtnClickHandler(() => {
      // update the array of model:
      this._onDataChange(DataChange.FAVORITE, event.id, Object.assign({}, event, {
        favorite: !event.favorite,
      }));
      // update event of pointController:
      event = Object.assign({}, event, {
        favorite: !event.favorite,
      });
      // update event in edit form:
      this._editPointComponent._event = event;
    });

    this._editPointComponent.setEventListBtnClickHandler((evt) => {
      evt.preventDefault();
      const eventTypeToggle = document.getElementById(`event-type-toggle-1`);
      const eventTypeList = document.getElementsByClassName(`event__type-list`)[0];
      eventTypeToggle.checked = !eventTypeToggle.checked;
      eventTypeList.style.display = eventTypeToggle.checked ? `block` : `none`;
      document.removeEventListener(`keydown`, this._onEscKeyDownCloseEditForm);
      pageBody.addEventListener(`click`, this._onPageBodyClickToCloseEventList);
      document.addEventListener(`keydown`, this._onEscKeyDownCloseEventsList);
    });
  }

  destroy() {
    remove(this._editPointComponent);
    remove(this._pointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceCardToEdit() {
    this._onViewChange();
    replace(this._editPointComponent, this._pointComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToCard() {
    replace(this._pointComponent, this._editPointComponent);
    this._mode = Mode.DEFAULT;

  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToCard();
    }
  }

  _onEscKeyDownCloseEditForm(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    const editForm = this._editPointComponent.getElement().querySelector(`section`);
    if (isEscKey && editForm) {
      // reset edit form:
      this._editPointComponent._destination = null;
      this._editPointComponent._description = null;
      this._editPointComponent._offers = null;
      this._editPointComponent._price = null;
      this._editPointComponent._icon = null;
      this._editPointComponent._eventType = null;

      // remove listeners:
      document.removeEventListener(`keydown`, this._onEscKeyDownCloseEditForm);
      this._editPointComponent.getElement().querySelector(`.event__type-btn`).removeEventListener(`click`, this._setEventListBtnClickHandler);

      this._replaceEditToCard();
      this._editPointComponent.removeElement();
      this._editPointComponent.recoveryListeners();

    }
  }

  getFormData() {
    const element = this._editPointComponent.getElement();
    // const editForm = element.querySelector(`.event.event--edit`);

    // get data from mark-up:
    let startTime = element.querySelector(`#event-start-time-1`).value;
    let endTime = element.querySelector(`#event-end-time-1`).value;

    // get time in format of javascript:
    startTime = getDateFromInput(startTime);
    endTime = getDateFromInput(endTime);

    const price = parseInt(element.querySelector(`#event-price-1`).value, 10);
    const destination = element.querySelector(`#event-destination-1`).value;
    const description = element.querySelector(`.event__destination-description`).textContent;
    const favorite = element.querySelector(`#event-favorite-1`).checked;
    const eventType = element.querySelector(`.event__label.event__type-output`).textContent;

    const offersCollection = element.getElementsByClassName(`event__offer-selector`);
    const offers = [];
    let offerTitle;
    let offerType;
    let offerName;
    let offerPrice;
    let checked;
    if (offersCollection) {
      for (const offer of offersCollection) {
        offerTitle = offer.querySelector(`.event__offer-title`).textContent;
        offerType = offerTitle.split(`: `);
        offerName = offerType[1];
        offerType = offerType[0];

        if (offerType.indexOf(` `)) {
          offerType = offerTitle.split(` `);
          offerType = offerType[0];
        }
        offerType = offerType === `Check` ? `Check-in` : offerType;

        offerPrice = offer.querySelector(`.event__offer-price`).textContent;
        checked = offer.getElementsByClassName(`event__offer-checkbox`)[0].checked;

        offers.push({
          type: offerType,
          name: offerName,
          price: offerPrice,
          isChecked: checked,
        });
      }
    }

    let eventIcon = element.querySelector(`.event__type-icon`).getAttribute(`src`);
    eventIcon = eventIcon.split(`/`);
    eventIcon = eventIcon[2];
    eventIcon = eventIcon.split(`.`);
    eventIcon = setCase(eventIcon[0], `toUpperCase`);

    return {
      formStartTime: startTime,
      formEndTime: endTime,
      formPrice: price,
      formDestination: destination,
      formEventType: eventType,
      formIcon: eventIcon,
      formDescription: description,
      formOffers: offers,
      formFavorite: favorite
    };
  }

}

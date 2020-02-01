import {
  onDestinationInputChange,
  createEventsListMarkUp,
  generateMarkUpForListOfDestinations,
  setOptionsHandlers,
  applyFlatpickr,
  createPhotoMarkUp,
  checkDestinationValidity
} from './../utils/forms-common-func.js';

import {
  DefaultData
} from './../const.js';

import {
  transformEventTypeText,
  setCase,
} from './../utils/common.js';

import AbstractSmartComponent from './abstract-smart-component.js';

import {
  offersMap,
  destinationsMap
} from './../main.js';

const createEditEventFormMarkUp = (event, options = {}) => {
  const {
    formDestination,
    formOffers,
    formPrice,
    formIcon,
    formEventType,
    formStartTime,
    formEndTime,
    externalData
  } = options;

  // transform time from html to design format:
  let editFormMarkup = [];
  let favorite = event.favorite;
  favorite = favorite ? `checked` : ``;

  const eventType = setCase(formIcon || event.eventType, `toLowerCase`);

  const offers = generateOffersMarkUpInEditForm(event.offers, formOffers, eventType);

  const startTime = formStartTime || event.startTime;
  const endTime = formEndTime || event.endTime;

  const destinationName = formDestination ? formDestination.name : event.destination.name;
  const description = formDestination ? formDestination.description : event.destination.description;
  const photos = formDestination ? formDestination.pictures : event.destination.pictures;

  const isBlockSaveButton = !checkDestinationValidity(destinationName) || externalData.saveButtonText === `Saving...`;
  let isInputError = !checkDestinationValidity(destinationName);

  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

  const price = formPrice || formPrice === 0 ? formPrice : event.price;

  editFormMarkup.push(
      `<form class="event  event--edit" action="#" method="post">
           <header class="event__header">
             <div class="event__type-wrapper">
               <label class="event__type  event__type-btn" for="event-type-toggle-1">
                 <span class="visually-hidden">Choose event type</span>
                 <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType}.png" alt="Event type icon">
               </label>
               <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">`);
  editFormMarkup.push(createEventsListMarkUp());
  editFormMarkup.push(
      `</div>
  
             <div class="event__field-group  event__field-group--destination">
               <label class="event__label  event__type-output" for="event-destination-1">${formEventType || transformEventTypeText(setCase(event.eventType, `toUpperCase`))}</label>
               <input class="event__input  event__input--destination ${isInputError = isInputError ? `error` : ``}" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
               <datalist id="destination-list-1">`);
  editFormMarkup.push(generateMarkUpForListOfDestinations(destinationsMap));
  editFormMarkup.push(
      `</datalist>
             </div>
  
             <div class="event__field-group  event__field-group--time">
               <label class="visually-hidden" for="event-start-time-1">
                 From
               </label>
               <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
               —
               <label class="visually-hidden" for="event-end-time-1">
                 To
               </label>
               <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
             </div>
  
             <div class="event__field-group  event__field-group--price">
               <label class="event__label" for="event-price-1">
                 <span class="visually-hidden">Price</span>
                 €
               </label>
               <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
             </div>
  
             <button class="event__save-btn  btn  btn--blue" type="submit" ${isBlockSaveButton ? `disabled` : ``}>${saveButtonText}</button>
             <button class="event__reset-btn" type="reset">${deleteButtonText}</button>
  
             <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${favorite}>
             <label class="event__favorite-btn" for="event-favorite-1">
               <span class="visually-hidden">Add to favorite</span>
               <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                 <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
               </svg>
             </label>
  
             <button class="event__rollup-btn" type="button">
               <span class="visually-hidden">Open event</span>
             </button>
           </header>`);
  if (offers || description) {
    editFormMarkup.push(`<section class="event__details">`);
  }
  editFormMarkup.push(`${offers}`);
  if (description) {
    editFormMarkup.push(
        `<section class="event__section  event__section--destination">
               <h3 class="event__section-title  event__section-title--destination">Destination</h3>
               <p class="event__destination-description">${description}</p>`
    );
  }

  if (photos && photos.length > 0) {
    editFormMarkup.push(createPhotoMarkUp(photos));
  }

  editFormMarkup.push(`</section>`);
  if (offers || description) {
    editFormMarkup.push(`</section>`);
  }
  editFormMarkup.push(`</form>`);
  editFormMarkup = editFormMarkup.join(`\n`);
  return editFormMarkup;
};

export default class EditEventFormComponent extends AbstractSmartComponent {
  constructor(event) {
    super();
    this._event = event;

    this._destination = null;
    this._offers = [];
    this._price = null;
    this._icon = null;
    this._eventType = null;
    this._favorite = null;
    this._startTime = this._event.startTime;
    this._endTime = this._event.endTime;
    this._pictures = null;

    this._externalData = DefaultData;

    this._flatpickrStart = null;
    this._flatpickrEnd = null;

    this._setSubmitBtnHandler = null;
    this._setEventListBtnClickHandler = null;
    this._favoriteHandler = null;
    this._setDeleteBtnHandler = null;

    this._onDestinationInputChange = onDestinationInputChange.bind(null, this);

    this._subscribeOnEvents();

    applyFlatpickr(this);
  }

  getTemplate() {
    return createEditEventFormMarkUp(this._event, {
      formDestination: this._destination,
      formOffers: this._offers,
      formPrice: this._price,
      formIcon: this._icon,
      formFavorite: this._favorite,
      formEventType: this._eventType,
      formStartTime: this._startTime,
      formEndTime: this._endTime,
      externalData: this._externalData
    });
  }

  setSubmitBtnHandler(handler) {
    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, handler);
    this._setSubmitBtnHandler = handler;
  }

  setDeleteBtnHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);
    this._setDeleteBtnHandler = handler;
  }

  setFavoriteBtnClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, handler);
    this._favoriteHandler = handler;
  }

  setEventListBtnClickHandler(handler) {
    this.getElement().querySelector(`.event__type-btn`).addEventListener(`click`, handler);
    this._setEventListBtnClickHandler = handler;
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setSubmitBtnHandler(this._setSubmitBtnHandler);
    this.setDeleteBtnHandler(this._setDeleteBtnHandler);
    this.setEventListBtnClickHandler(this._setEventListBtnClickHandler);
    this.setFavoriteBtnClickHandler(this._favoriteHandler);
  }

  _subscribeOnEvents() {
    const destinationInput = this.getElement().querySelector(`#event-destination-1`);

    // set listeners for input of destinations:
    destinationInput.addEventListener(`change`, this._onDestinationInputChange);

    // set listeners for options:
    setOptionsHandlers(this);

    // add calendar:
    applyFlatpickr(this);
  }

  removeElement() {
    if (this._flatpickrStart) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
    }
    if (this._flatpickrEnd) {
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }

    super.removeElement();
  }

  rerender() {
    super.rerender();

    applyFlatpickr(this);
  }

}

const generateOffersMarkUpInEditForm = (eventOffers, newOffers, eventType) => {
  let offers = [];
  let allAvailableOffers = [];

  // get all available offers for this event:
  for (const offer of offersMap) {
    if (offer[0] === eventType) {
      allAvailableOffers = Array.from(offer[1]);
      break;
    }
  }

  let offersIncoming = newOffers ? newOffers.slice() : eventOffers.slice();

  // add available unchecked offers to checked ones:
  if (offersIncoming.length > 0) {
    for (const uncheckedOffer of allAvailableOffers) {
      for (let i = 0; i < offersIncoming.length; i++) {
        if (uncheckedOffer.title === offersIncoming[i].title) {
          break;
        } else if (i === offersIncoming.length - 1) {
          offersIncoming.push(uncheckedOffer);
        }
      }
    }
  } else {
    offersIncoming = offersIncoming.concat(allAvailableOffers);
  }

  if (offersIncoming.length > 0) {
    offers.push(
        `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

  <div class="event__available-offers">`);
    for (const offer of offersIncoming) {
      const isChecked = offer.isChecked ? `checked` : ``;
      offers.push(
          `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer-${offer.title}" ${isChecked}>
      <label class="event__offer-label" for="event-offer-${offer.title}-1">
        <span class="event__offer-title">${offer.title}</span>
        +
        €&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`);
    }
    offers.push(`</section>`);
  }
  offers = offers.join(`\n`);

  return offers;
};

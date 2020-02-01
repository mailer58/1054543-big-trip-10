import AbstractSmartComponent from './abstract-smart-component.js';

import {
  onDestinationInputChange,
  createEventsListMarkUp,
  generateMarkUpForListOfDestinations,
  setOptionsHandlers,
  applyFlatpickr,
  createPhotoMarkUp,
} from './../utils/forms-common-func.js';

import {
  DefaultData,
} from './../const.js';

import {
  offersMap,
  destinationsMap
} from './../main.js';

export default class NewEventFormComponent extends AbstractSmartComponent {
  constructor(tripController) {
    super();
    this._element = null;
    this._tripController = tripController;

    this._setSubmitBtnHandler = null;
    this._setEventListBtnClickHandler = null;
    this._setCancelBtnClickHandler = null;

    this._destination = null;
    this._price = null;
    this._icon = null;
    this._eventType = null;
    this._startTime = null;
    this._endTime = null;
    this._offers = null;

    this._externalData = DefaultData;
    this._displayNumber = 1;

    this._flatpickrStart = null;
    this._flatpickrEnd = null;

    this._onDestinationInputChange = onDestinationInputChange.bind(null, this);

    this._subscribeOnEvents();
    applyFlatpickr(this);
  }

  getTemplate() {
    return createNewEventFormMarkUp({
      formDestination: this._destination,
      formPrice: this._price,
      formIcon: this._icon,
      formEventType: this._eventType,
      formStartTime: this._startTime,
      formEndTime: this._endTime,
      formOffers: this._offers,
      externalData: this._externalData,
      displayNumber: this._displayNumber++
    });
  }

  setSubmitBtnHandler(handler) {
    const saveBtn = this.getElement().querySelector(`.event__save-btn`);
    saveBtn.addEventListener(`click`, handler);
    this._setSubmitBtnHandler = handler;
  }

  setEventListBtnClickHandler(handler) {
    this.getElement().querySelector(`.event__type-btn`).addEventListener(`click`, handler);
    this._setEventListBtnClickHandler = handler;
  }

  setCancelBtnClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);
    this._setCancelBtnClickHandler = handler;
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

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setSubmitBtnHandler(this._setSubmitBtnHandler);
    this.setEventListBtnClickHandler(this._setEventListBtnClickHandler);
    this.setCancelBtnClickHandler(this._setCancelBtnClickHandler);
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

const createNewEventFormMarkUp = (formData = {}) => {
  const {
    formDestination,
    formPrice,
    formIcon,
    formEventType,
    formStartTime,
    formEndTime,
    formOffers,
    externalData,
    displayNumber
  } = formData;

  const eventType = formEventType || `Sightseeing at`;

  const icon = formIcon || `sightseeing`;
  const destination = formDestination ? formDestination.name : ``;

  const description = formDestination ? formDestination.description : ``;

  const startTime = formStartTime || ``;
  const endTime = formEndTime || ``;
  const startTimePlaceholder = formStartTime ? `` : `placeholder="Select Date..."`;
  const endTimePlaceholder = formEndTime ? `` : `placeholder="Select Date..."`;


  let offers = [];
  let availableOffers = [];

  // get all available offers for new event:
  for (const offer of offersMap) {
    if (offer[0] === icon) {
      availableOffers = Array.from(offer[1]);
      break;
    }
  }

  offers = formOffers ? formOffers : availableOffers;

  const photos = formDestination ? formDestination.pictures : [];

  const destinationName = formDestination ? formDestination.name : ``;

  const isBlockSaveButton = `` || externalData.saveButtonText === `Saving...`;
  const isInputError = ``;

  // let isInputError = !checkDestinationValidity(destinationName);

  // isInputError = displayNumber > 1 && isInputError ? `error` : ``;

  const saveButtonText = externalData.saveButtonText;

  const price = formPrice || formPrice === 0 ? formPrice : ``;

  let newEventFormMarkUp = [];

  newEventFormMarkUp.push(`<form class="trip-events__item  event  event--edit" action="#" method="post">
         <header class="event__header">
           <div class="event__type-wrapper">
             <label class="event__type  event__type-btn" for="event-type-toggle-1">
               <span class="visually-hidden">Choose event type</span>
               <img class="event__type-icon" width="17" height="17" src="img/icons/${icon}.png" alt="Event type icon">
             </label>
             <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">`);
  // generate event list:
  newEventFormMarkUp.push(createEventsListMarkUp());

  newEventFormMarkUp.push(`<div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-1">
    ${eventType}
    </label>
    <input class="event__input  event__input--destination ${isInputError}" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
    <datalist id="destination-list-1">`);

  // generate list of destinations:
  newEventFormMarkUp.push(generateMarkUpForListOfDestinations(destinationsMap));

  newEventFormMarkUp.push(`</datalist>
           </div>
    
           <div class="event__field-group  event__field-group--time">
             <label class="visually-hidden" for="event-start-time-1">
               From
             </label>
             <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}" ${startTimePlaceholder}>
             —
             <label class="visually-hidden" for="event-end-time-1">
               To
             </label>
             <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}" ${endTimePlaceholder}>
           </div>
    
           <div class="event__field-group  event__field-group--price">
             <label class="event__label" for="event-price-1">
               <span class="visually-hidden">Price</span>
               €
             </label>
             <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
           </div>
    
           <button class="event__save-btn  btn  btn--blue" type="submit" ${isBlockSaveButton ? `disabled` : ``}>${saveButtonText}</button>
           <button class="event__reset-btn" type="reset">Cancel</button>
         </header>`);
  if (offers.length > 0 || description) {
    newEventFormMarkUp.push(`<section class="event__details">`);
    if (offers.length > 0) {
      newEventFormMarkUp.push(
          `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    
      <div class="event__available-offers">`);
      for (const offer of offers) {
        newEventFormMarkUp.push(
            `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer-${offer.title}">
        <label class="event__offer-label" for="event-offer-${offer.title}-1">
          <span class="event__offer-title">${offer.title}</span>
          +
          €&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`);
      }
      newEventFormMarkUp.push(`</div>
      </section>`);
    }
    if (description) {
      newEventFormMarkUp.push(
          `<section class="event__section  event__section--destination">
                   <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                   <p class="event__destination-description">${description}</p>`
      );
    }
    if (photos && photos.length > 0) {
      newEventFormMarkUp.push(createPhotoMarkUp(photos));
    }
    newEventFormMarkUp.push(`</section>
      </section>`);
  }

  newEventFormMarkUp.push(`</form>`);
  newEventFormMarkUp = newEventFormMarkUp.join(`\n`);
  return newEventFormMarkUp;
};

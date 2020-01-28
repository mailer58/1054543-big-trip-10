import flatpickr from 'flatpickr';
// import 'flatpickr/dist/flatpickr.css';
// import '~flatpickr/dist/themes/light.css';

import {
  DefaultData
} from './../const.js';

import {
  render,
  createElement,
  RenderPosition
} from './../utils/render.js';

import {
  transformEventTypeText,
  setCase,
} from './../utils/common.js';

import AbstractSmartComponent from './abstract-smart-component.js';

import {
  offersMap,
  photosMap,
  destinationsMap
} from './../main.js';

const transfer = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`
];

const activity = [
  `check-in`,
  `sightseeing`,
  `restaurant`
];


/* --------------------------------------------------------------*/
// markup:

const createPhotoMarkUp = (photos) => {
  let photoMarkup = [];
  photoMarkup.push(
      `<div class="event__photos-container">
    <div class="event__photos-tape">`);
  for (const picture of photos) {
    photoMarkup.push(
        `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`);
  }
  photoMarkup.push(`</div>
  </div>`);

  photoMarkup = photoMarkup.join(`\n`);

  return photoMarkup;
};

const generateMarkUpForListOfDestinations = (map) => {
  // generate list of destinations:
  let listOfDestinationsMarkUp = [];
  if (map) {
    for (const item of map.keys()) {
      listOfDestinationsMarkUp.push(`<option value="${item}"></option>`);
    }
  }
  listOfDestinationsMarkUp = listOfDestinationsMarkUp.join(`\n`);
  return listOfDestinationsMarkUp;
};


const createEventsListMarkUp = () => {
  let eventsListMarkUp = [];

  eventsListMarkUp.push(`<div class="event__type-list">
<fieldset class="event__type-group">
  <legend class="visually-hidden">Transfer</legend>`);

  // add transfer events:
  for (const item of transfer) {
    eventsListMarkUp.push(`<div class="event__type-item">
    <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
    <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${setCase(item, `toUpperCase`)}</label>
  </div>`);
  }
  eventsListMarkUp.push(`</fieldset>
<fieldset class="event__type-group">
  <legend class="visually-hidden">Activity</legend>`);

  // add activity events:
  for (const item of activity) {
    eventsListMarkUp.push(`<div class="event__type-item">
 <input id="event-type-${item}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}">
 <label class="event__type-label  event__type-label--${item}" for="event-type-${item}-1">${setCase(item, `toUpperCase`)}</label>
</div>`);
  }
  eventsListMarkUp.push(`</fieldset>
</div>
</div>`);

  eventsListMarkUp = eventsListMarkUp.join(`\n`);
  return eventsListMarkUp;
};


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

export class EditEventFormComponent extends AbstractSmartComponent {
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

export class NewEventFormComponent extends AbstractSmartComponent {
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

  let isBlockSaveButton = !checkDestinationValidity(destinationName) || externalData.saveButtonText === `Saving...`;
  let isInputError = !checkDestinationValidity(destinationName);

  isInputError = displayNumber > 1 && isInputError ? `error` : ``;

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
  
         <button class="event__save-btn  btn  btn--blue" type="submit" ${isBlockSaveButton = isBlockSaveButton ? `disabled` : ``}>${saveButtonText}</button>
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

/* -------------------------------------------------------------*/
// other functions:

export const getEventTypeIcon = (evt) => {
  let checkedEventImgSrc;
  const labelsCollection = document.getElementsByTagName(`label`);
  // find corresponding input and label by comparing id and for attiubutes:
  const eventTypeId = evt.currentTarget.id;
  for (const i of labelsCollection) {
    const labelForAttr = i.getAttribute(`for`);
    if (labelForAttr === eventTypeId) {
      // find an image for the event:
      checkedEventImgSrc = window.getComputedStyle(
          i, `:before`
      ).getPropertyValue(`background-image`);
      // get source of image:
      const splitSymbol = `icons/`;
      checkedEventImgSrc = checkedEventImgSrc.split(splitSymbol);
      checkedEventImgSrc = checkedEventImgSrc[1];
      checkedEventImgSrc = checkedEventImgSrc.split(`.`);
      checkedEventImgSrc = checkedEventImgSrc[0];
      checkedEventImgSrc = checkedEventImgSrc.split(`")`);
      checkedEventImgSrc = checkedEventImgSrc[0];
      break;
    }
  }
  return checkedEventImgSrc;
};

export const getFormData = (form) => {
  const element = form.getElement();
  // const editForm = element.querySelector(`.event.event--edit`);

  // get data from input:
  const startTime = element.querySelector(`#event-start-time-1`)._flatpickr;
  const endTime = element.querySelector(`#event-end-time-1`)._flatpickr;

  let price = parseInt(element.querySelector(`#event-price-1`).value, 10);
  price = isNaN(price) ? 0 : price;

  const destination = element.querySelector(`#event-destination-1`).value;
  let formDescription = element.querySelector(`.event__destination-description`);
  formDescription = formDescription ? formDescription.textContent : ``;
  let favorite = element.querySelector(`#event-favorite-1`);
  favorite = favorite ? favorite.checked : ``;

  const offersCollection = element.getElementsByClassName(`event__offer-selector`);

  const offers = [];
  let offerTitle;
  let offerPrice;
  let offerInput;
  if (offersCollection) {
    for (const offer of offersCollection) {
      offerTitle = offer.querySelector(`.event__offer-title`).textContent;

      offerPrice = offer.querySelector(`.event__offer-price`).textContent;
      offerInput = offer.getElementsByClassName(`event__offer-checkbox`)[0];

      if (offerInput.checked) {
        offers.push({
          title: offerTitle,
          price: parseInt(offerPrice, 10),
          isChecked: true,
        });
      }
    }
  }

  let eventIcon = element.querySelector(`.event__type-icon`).getAttribute(`src`);
  eventIcon = eventIcon.split(`/`);
  eventIcon = eventIcon[2];
  eventIcon = eventIcon.split(`.`);
  eventIcon = eventIcon[0];

  const photos = [];
  const photoCollection = element.querySelectorAll(`.event__photo`);
  for (const photo of photoCollection) {
    photos.push({
      src: photo.getAttribute(`src`),
      description: photo.getAttribute(`alt`)
    });
  }
  return {
    formStartTime: startTime.selectedDates[0],
    formEndTime: endTime.selectedDates[0],
    formDestination: {
      name: destination,
      description: formDescription,
      pictures: photos
    },
    formEventType: eventIcon,
    formOffers: offers,
    formFavorite: favorite,
    formPrice: price,
  };
};

const setOptionsHandlers = (element) => {
  const optionsList = element.getElement().querySelectorAll(`.event__type-input`);

  for (const item of optionsList) {
    item.addEventListener(`click`, (evt) => {
      // change type of event and offers:
      element._icon = getEventTypeIcon(evt);
      element._eventType = transformEventTypeText(setCase(element._icon, `toUpperCase`));
      const offers = offersMap.get(element._icon);
      element._offers = offers ? offers : `noneInForm`;
      element._price = parseInt(element.getElement().querySelector(`#event-price-1`).value, 10);
      element._price = isNaN(element._price) ? 0 : element._price;
      element._startTime = element.getElement().querySelector(`#event-start-time-1`)._flatpickr.selectedDates[0];
      element._endTime = element.getElement().querySelector(`#event-end-time-1`)._flatpickr.selectedDates[0];

      element.rerender();
    });
  }
};

const onDestinationInputChange = (element) => {
  // hide warning border:
  element.getElement().classList.remove(`error`);

  const formHeader = element.getElement().querySelector(`.event__header`);
  const saveBtn = element.getElement().querySelector(`.event__save-btn`);

  const destinationInput = element.getElement().querySelector(`#event-destination-1`);

  element._price = element.getElement().querySelector(`.event__input--price`).value;
  element._startTime = element.getElement().querySelector(`#event-start-time-1`).value;
  element._endTime = element.getElement().querySelector(`#event-end-time-1`).value;

  // check validity of destination:
  const isValidDestination = checkDestinationValidity(destinationInput.value);

  saveBtn.disabled = !isValidDestination;

  let eventDetailsSection = element.getElement().querySelector(`.event__details`);
  let offersSection = element.getElement().querySelector(`.event__section--offers`);

  // change form:
  if (isValidDestination) {
    destinationInput.classList.remove(`error`);
    eventDetailsSection = element.getElement().querySelector(`.event__details`);
    const descriptionText = element.getElement().querySelector(`.event__destination-description`);
    if (descriptionText) {
      descriptionText.textContent = destinationsMap.get(destinationInput.value);
    } else if (!eventDetailsSection) { // for newEventForm
      const eventDetailsElement = createElement(`<section class ="event__details"></section>`);
      render(formHeader, eventDetailsElement, RenderPosition.AFTER);
    }

    offersSection = element.getElement().querySelector(`.event__section--offers`);

    if (offersSection) {
      createDestinationMarkup(element, offersSection, RenderPosition.AFTER);
    } else {
      eventDetailsSection = element.getElement().querySelector(`.event__details`);
      createDestinationMarkup(element, eventDetailsSection, RenderPosition.APPEND);
    }

  } else { // remove a description if a destination is invalid:
    if (!destinationInput.classList.contains(`error`)) {
      offersSection = element.getElement().querySelector(`.event__section--offers`);

      if (offersSection) { // keep offers section:
        const destinationSection = element.getElement().querySelector(`.event__section--destination`);
        destinationSection.remove();

      } else { // if there is no offers section remove all:
        eventDetailsSection = element.getElement().querySelector(`.event__details`);
        if (eventDetailsSection) {
          eventDetailsSection.remove();
        }
      }

      // keep an invalid destination when rerender in case of misprint:
      element._destination = {
        name: destinationInput.value,
      };

      // add red border in case of invalid destination
      destinationInput.classList.add(`error`);

    }
  }
};

const createDestinationMarkup = (element, container, renderPosition) => {
  const destinationInput = element.getElement().querySelector(`#event-destination-1`);
  let destinationSection = element.getElement().querySelector(`.event__section--destination`);

  // remove old section:
  if (destinationSection) {
    destinationSection.remove();
  }

  // render event section:
  const destinationElement = createElement(`<section class="event__section  event__section--destination"></section>`);
  render(container, destinationElement, renderPosition);

  // render header:
  destinationSection = element.getElement().querySelector(`.event__section--destination`);
  const descriptionHeaderElement = createElement(`<h3 class="event__section-title  event__section-title--destination">Destination</h3>`);
  render(destinationSection, descriptionHeaderElement, RenderPosition.APPEND);

  // render description:
  const descriptionHeader = element.getElement().querySelector(`.event__section-title--destination`);
  const descriptionElement = createElement(`<p class="event__destination-description">${destinationsMap.get(destinationInput.value)}</p>`);
  render(descriptionHeader, descriptionElement, RenderPosition.AFTER);


  const photoContainer = element.getElement().querySelector(`.event__photos-container`);
  if (photoContainer) {
    photoContainer.remove();
  }

  let photos = [];

  photosMap.forEach((value, key) => {
    if (key === destinationInput.value) {
      photos = Array.from(value);
    }
  });

  let photoMarkup;
  if (photos.length > 0) {
    photoMarkup = createPhotoMarkUp(photos);
  }

  photoMarkup = createElement(photoMarkup);
  render(destinationSection, photoMarkup, RenderPosition.APPEND);

  element._destination = {
    name: destinationInput.value,
    description: destinationsMap.get(destinationInput.value),
    pictures: photos
  };

};

// check validity of destination:

export const checkDestinationValidity = (destinationInput) => {
  for (const destination of destinationsMap.keys()) {
    if (destination === destinationInput) {
      return true;
    }
  }
  return false;
};

export const setData = (element, data, formData = {}) => {
  element._externalData = Object.assign({}, DefaultData, data);
  const {
    formStartTime,
    formEndTime,
    formDestination,
    formEventType,
    formOffers,
    formFavorite,
    formPrice
  } = formData;

  element._destination = formDestination;
  element._offers = formOffers;
  element._price = formPrice;
  element._eventType = transformEventTypeText(setCase(formEventType, `toUpperCase`));
  element._favorite = formFavorite;
  element._startTime = formStartTime;
  element._endTime = formEndTime;

  element.rerender();
};

// add calendar:
const applyFlatpickr = (element) => {
  // delete old instances of flatpickr:
  if (element._flatpickrStart) {
    element._flatpickrStart.destroy();
    element._flatpickrStart = null;
  }

  if (element._flatpickrEnd) {
    element._flatpickrEnd.destroy();
    element._flatpickrEnd = null;
  }

  const startTime = element.getElement().querySelector(`#event-start-time-1`);
  const endTime = element.getElement().querySelector(`#event-end-time-1`);

  // add flatpickr:
  element._flatpickrStart = flatpickr(startTime, {
    altInput: true,
    allowInput: false,
    enableTime: true,
    altFormat: `d/m/Y H:i`,
    minuteIncrement: 1,
    defaultDate: element._startTime ? element._startTime : ``,
  });

  element._flatpickrEnd = flatpickr(endTime, {
    altInput: true,
    allowInput: false,
    enableTime: true,
    altFormat: `d/m/Y H:i`,
    minuteIncrement: 1,
    defaultDate: element._endTime ? element._endTime : ``,
  });


};

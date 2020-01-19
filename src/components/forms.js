import moment from 'moment';

import {
  getDateFromInput,
  transformEventTypeText,
  setCase,
} from './../utils/common.js';

import AbstractSmartComponent from './abstract-smart-component.js';

import {
  DESTINATIONS,
  offersMap
} from './../mock/point-of-route.js';

import {
  pointsOfRoute
} from './../main.js';

export {
  createEditEventFormMarkUp,
  pointsOfRoute,
};

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

const generateMarkUpForListOfDestinations = () => {
  // generate list of destinations:
  let listOfDestinationsMarkUp = [];
  for (const item of DESTINATIONS) {
    listOfDestinationsMarkUp.push(`<option value="${item}"></option>`);
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
    formDescription,
    formOffers,
    formPrice,
    formIcon,
    formEventType,
    formStartTime,
    formEndTime
  } = options;
  // transform time from html to design format:
  let editFormMarkup = [];
  let favorite = event.favorite;
  favorite = favorite ? `checked` : ``;
  let offers;
  if (event.offers.length === 0 && !formOffers || formOffers === `noneInForm`) {
    offers = ``;
  } else {
    offers = generateOffersMarkUpInEditForm(event.offers, formOffers);
  }
  const formatTime = `DD/MM/YY HH:mm`;
  const startTime = formStartTime || moment(event.startTime).format(formatTime);
  const endTime = formEndTime || moment(event.endTime).format(formatTime);


  editFormMarkup.push(
      `<form class="event  event--edit" action="#" method="post">
           <header class="event__header">
             <div class="event__type-wrapper">
               <label class="event__type  event__type-btn" for="event-type-toggle-1">
                 <span class="visually-hidden">Choose event type</span>
                 <img class="event__type-icon" width="17" height="17" src="img/icons/${setCase(formIcon || event.eventIcon, `toLowerCase`)}.png" alt="Event type icon">
               </label>
               <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">`);
  editFormMarkup.push(createEventsListMarkUp());
  editFormMarkup.push(
      `</div>
  
             <div class="event__field-group  event__field-group--destination">
               <label class="event__label  event__type-output" for="event-destination-1">${formEventType || event.eventType}</label>
               <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${formDestination || event.destination}" list="destination-list-1">
               <datalist id="destination-list-1">`);
  editFormMarkup.push(generateMarkUpForListOfDestinations());
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
               <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${formPrice || event.price}">
             </div>
  
             <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
             <button class="event__reset-btn" type="reset">Delete</button>
  
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
           </header>
  
           <section class="event__details">
           ${offers}
             
             <section class="event__section  event__section--destination">
               <h3 class="event__section-title  event__section-title--destination">Destination</h3>
               <p class="event__destination-description">${formDescription || event.description}</p>`);

  if (event.photo) {
    editFormMarkup.push(`
               <div class="event__photos-container">
                 <div class="event__photos-tape">
                   <img class="event__photo" src="${event.photo}" alt="Event photo">
                 </div>
               </div>`);
  }
  editFormMarkup.push(`</section>
           </section>
         </form>`);
  editFormMarkup = editFormMarkup.join(`\n`);
  return editFormMarkup;
};

export class EditEventFormComponent extends AbstractSmartComponent {
  constructor(event) {
    super();
    this._event = event;
    this._destination = null;
    this._description = null;
    this._offers = null;
    this._price = null;
    this._icon = null;
    this._eventType = null;
    this._favorite = null;
    this._startTime = null;
    this._endTime = null;

    this._setSubmitBtnHandler = null;
    this._setEventListBtnClickHandler = null;
    this._favoriteHandler = null;
    this._setDeleteBtnHandler = null;

    this._onDestinationInputChange = super.onDestinationInputChange.bind(this);

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditEventFormMarkUp(this._event, {
      formDestination: this._destination,
      formDescription: this._description,
      formOffers: this._offers,
      formPrice: this._price,
      formIcon: this._icon,
      formFavorite: this._favorite,
      formEventType: this._eventType,
      formStartTime: this._startTime,
      formEndTime: this._endTime
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
  }
}

const generateOffersMarkUpInEditForm = (eventOffers, newOffers) => {
  let offers = [];
  const offersIncoming = newOffers ? newOffers.slice() : eventOffers.slice();
  offers.push(
      `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

  <div class="event__available-offers">`);
  for (const offer of offersIncoming) {
    const isChecked = offer.isChecked ? `checked` : ``;
    offers.push(
        `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.name}-1" type="checkbox" name="event-offer-${offer.name}" ${isChecked}>
      <label class="event__offer-label" for="event-offer-${offer.name}-1">
        <span class="event__offer-title">${offer.type} ${offer.name}</span>
        +
        €&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`);
  }
  offers.push(`</section>`);
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

    this._onDestinationInputChange = super.onDestinationInputChange.bind(this);

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createNewEventFormMarkUp({
      formDestination: this._destination,
      formPrice: this._price,
      formIcon: this._icon,
      formEventType: this._eventType,
      formStartTime: this._startTime,
      formEndTime: this._endTime
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
    // debugger;

    setOptionsHandlers(this);
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setSubmitBtnHandler(this._setSubmitBtnHandler);
    this.setEventListBtnClickHandler(this._setEventListBtnClickHandler);
    this.setCancelBtnClickHandler(this._setCancelBtnClickHandler);
  }

}


const createNewEventFormMarkUp = (formData = {}) => {
  const {
    formDestination,
    formPrice,
    formIcon,
    formEventType,
    formStartTime,
    formEndTime
  } = formData;

  const eventType = formEventType || `Flight to`;
  const price = formPrice || ``;

  const icon = formIcon || `flight`;
  const destination = formDestination || ``;

  const date = new Date();
  const formatTime = `DD/MM/YY HH:mm`;
  const startTime = formStartTime || moment(date).format(formatTime);
  const endTime = formEndTime || moment(date).format(formatTime);

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
  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
  <datalist id="destination-list-1">`);

  // generate list of destinations:
  newEventFormMarkUp.push(generateMarkUpForListOfDestinations());

  newEventFormMarkUp.push(`</datalist>
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
  
         <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
         <button class="event__reset-btn" type="reset">Cancel</button>
       </header>
     </form>`);
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

  // get data from mark-up:
  let startTime = element.querySelector(`#event-start-time-1`).value;
  let endTime = element.querySelector(`#event-end-time-1`).value;

  // get time in format of javascript:
  startTime = getDateFromInput(startTime);
  endTime = getDateFromInput(endTime);

  const price = parseInt(element.querySelector(`#event-price-1`).value, 10);
  const destination = element.querySelector(`#event-destination-1`).value;
  let description = element.querySelector(`.event__destination-description`);
  description = description ? description.textContent : ``;
  let favorite = element.querySelector(`#event-favorite-1`);
  favorite = favorite ? favorite.checked : ``;
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
        price: parseInt(offerPrice, 10),
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
};

const setOptionsHandlers = (element) => {
  const optionsList = element.getElement().querySelectorAll(`.event__type-input`);
  for (const item of optionsList) {
    item.addEventListener(`click`, (evt) => {
      // change type of event and offers:
      element._icon = getEventTypeIcon(evt);
      element._eventType = transformEventTypeText(setCase(element._icon, `toUpperCase`));
      const offers = offersMap[setCase(element._icon, `toUpperCase`)];
      element._offers = offers ? offers : `noneInForm`;
      element._price = element.getElement().querySelector(`#event-price-1`).value;
      element._startTime = element.getElement().querySelector(`#event-start-time-1`).value;
      element._endTime = element.getElement().querySelector(`#event-end-time-1`).value;
      element.rerender();
    });
  }
};

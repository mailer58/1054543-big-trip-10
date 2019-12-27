import {
  render,
  createPromptText,
  transformEventTypeText,
  adjustTimeFormat,
  setCase,
  createElement,
  RenderPosition,
  computeTotalPrice,
  renderTripInfo
} from './../utils.js';

import
EventCardComponent
from './cards-of-points-of-route.js';
import {
  DESTINATIONS
} from './../mock/point-of-route.js';
import
TripSortMenuComponent
from './trip-sort-menu.js';

import {
  pointsOfRoute
} from './../main.js';

export {
  setEventTypeText,
  setEventTypeIcon,
  toggleListenersOfEventListOptions,
  removeNewEventForm,
  onEventListOptionClick,
  onEventListBtnClick,
  onPageBodyClickToCloseEventList,
  onEscKeyDownCloseForm,
  onEscKeyDownCloseEventsList,
  onSaveBtnOfNewEventFormClick,
  createEditEventForm,
  onRollUpBtnClick,
  onCloseEditFormBtnClick,
  pointsOfRoute,
  toggleEventListenersForRollUpBtns
};

const ESC_KEYCODE = 27;

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

const newEventBtn = document.querySelector(`.trip-main__event-add-btn`);
const pageBody = document.querySelector(`body`);
const tripEventsHeader = document.querySelector(`.trip-events > h2:nth-child(1)`);
const tripEventsSection = document.querySelector(`.trip-events`);
let saveButtonOfEditForm = document.getElementsByClassName(`event__save-btn`)[0];

let currentPointOfRoute; // opened point of route in edit menu

/* --------------------------------------------------------------*/
// markup:

const createNewEventForm = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = adjustTimeFormat(date.getMonth() + 1);
  const day = adjustTimeFormat(date.getDate());
  const hours = adjustTimeFormat(date.getHours());
  const minutes = adjustTimeFormat(date.getMinutes());

  let newEventFormMarkUp = [];

  newEventFormMarkUp.push(`<form class="trip-events__item  event  event--edit" action="#" method="post">
       <header class="event__header">
         <div class="event__type-wrapper">
           <label class="event__type  event__type-btn" for="event-type-toggle-1">
             <span class="visually-hidden">Choose event type</span>
             <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
           </label>
           <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">`);
  // generate event list:
  newEventFormMarkUp.push(createEventsListMarkUp());

  newEventFormMarkUp.push(`<div class="event__field-group  event__field-group--destination">
  <label class="event__label  event__type-output" for="event-destination-1">
  Sightseeing at
  </label>
  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="" list="destination-list-1">
  <datalist id="destination-list-1">`);

  // generate list of destinations:
  newEventFormMarkUp.push(generateMarkUpForListOfDestinations());

  newEventFormMarkUp.push(`</datalist>
         </div>
  
         <div class="event__field-group  event__field-group--time">
           <label class="visually-hidden" for="event-start-time-1">
             From
           </label>
           <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${year}/${month}/${day} ${hours}:${minutes}">
           —
           <label class="visually-hidden" for="event-end-time-1">
             To
           </label>
           <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${year}/${month}/${day} ${hours}:${minutes}">
         </div>
  
         <div class="event__field-group  event__field-group--price">
           <label class="event__label" for="event-price-1">
             <span class="visually-hidden">Price</span>
             €
           </label>
           <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
         </div>
  
         <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
         <button class="event__reset-btn" type="reset">Cancel</button>
       </header>
     </form>`);
  newEventFormMarkUp = newEventFormMarkUp.join(`\n`);
  return newEventFormMarkUp;
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

const generateMarkUpForListOfDestinations = () => {
  // generate list of destinations:
  let listOfDestinationsMarkUp = [];
  for (const item of DESTINATIONS) {
    listOfDestinationsMarkUp.push(`<option value="${item}"></option>`);
  }
  listOfDestinationsMarkUp = listOfDestinationsMarkUp.join(`\n`);
  return listOfDestinationsMarkUp;
};

const createEditEventForm = (startTime, endTime, arrayOfEvents) => {
  currentPointOfRoute = findPointOfRouteInArray(startTime, arrayOfEvents);
  // transform time from html to design format:
  startTime = transformTimeBetweenHtmlAndDesigFormats(startTime, `T`, `/`, ` `);
  endTime = transformTimeBetweenHtmlAndDesigFormats(endTime, `T`, `/`, ` `);
  let editFormMarkup = [];
  editFormMarkup.push(
    `<form class="event  event--edit" action="#" method="post">
           <header class="event__header">
             <div class="event__type-wrapper">
               <label class="event__type  event__type-btn" for="event-type-toggle-1">
                 <span class="visually-hidden">Choose event type</span>
                 <img class="event__type-icon" width="17" height="17" src="img/icons/${currentPointOfRoute.eventIcon}.png" alt="Event type icon">
               </label>
               <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">`);
  editFormMarkup.push(createEventsListMarkUp());
  editFormMarkup.push(
    `</div>
  
             <div class="event__field-group  event__field-group--destination">
               <label class="event__label  event__type-output" for="event-destination-1">${currentPointOfRoute.eventType}</label>
               <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentPointOfRoute.destination}" list="destination-list-1">
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
               <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${currentPointOfRoute.price}">
             </div>
  
             <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
             <button class="event__reset-btn" type="reset">Delete</button>
  
             <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked="">
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
           ${generateOffersMarkUpInEditForm(currentPointOfRoute)}
             
             <section class="event__section  event__section--destination">
               <h3 class="event__section-title  event__section-title--destination">Destination</h3>
               <p class="event__destination-description">${currentPointOfRoute.description}</p>
  
               <div class="event__photos-container">
                 <div class="event__photos-tape">
                   <img class="event__photo" src="${currentPointOfRoute.photo}" alt="Event photo">
                 </div>
               </div>
             </section>
           </section>
         </form>`
  );
  editFormMarkup = editFormMarkup.join(`\n`);
  return editFormMarkup;
};

class EditEventForm {
  constructor() {
    this._element = null;
  }

  getTemplate(startTime, endTime, arrayOfEvents) {
    return createEditEventForm(startTime, endTime, arrayOfEvents);
  }

  getElement(startTime, endTime, arrayOfEvents) {
    if (!this._element) {
      this._element = createElement(this.getTemplate(startTime, endTime, arrayOfEvents));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

const generateOffersMarkUpInEditForm = (pointOfRoute) => {
  let offers = [];
  if (pointOfRoute.offers.length > 0) {
    offers.push(
      `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

  <div class="event__available-offers">`);
    for (const offer of pointOfRoute.offers) {
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
  }
  return ``;
};
/* --------------------------------------------*/
// classes:
export default class NewEventForm {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNewEventForm();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
/* -------------------------------------------------------*/
// handlers:

const onEventListOptionClick = (evt) => {
  setEventTypeIcon(evt);
  setEventTypeText(evt);
  const eventTypeToggle = document.getElementById(`event-type-toggle-1`);
  const eventTypeList = document.getElementsByClassName(`event__type-list`)[0];
  eventTypeList.style.display = `none`;
  eventTypeToggle.checked = !eventTypeToggle.checked;
  document.removeEventListener(`keydown`, onEscKeyDownCloseEventsList);
  document.addEventListener(`keydown`, onEscKeyDownCloseForm);
  pageBody.removeEventListener(`click`, onPageBodyClickToCloseEventList);
};

const onEventListBtnClick = (evt) => {
  evt.preventDefault();
  const eventTypeToggle = document.getElementById(`event-type-toggle-1`);
  const eventTypeList = document.getElementsByClassName(`event__type-list`)[0];
  eventTypeToggle.checked = !eventTypeToggle.checked;
  eventTypeList.style.display = eventTypeToggle.checked ? `block` : `none`;
  if (eventTypeToggle.checked) {
    document.removeEventListener(`keydown`, onEscKeyDownCloseForm);
    document.addEventListener(`keydown`, onEscKeyDownCloseEventsList);
  } else {
    document.removeEventListener(`keydown`, onEscKeyDownCloseEventsList);
    document.addEventListener(`keydown`, onEscKeyDownCloseForm);
  }
  pageBody.addEventListener(`click`, onPageBodyClickToCloseEventList);
};

// hide eventList by click on the page:
const onPageBodyClickToCloseEventList = (evt) => {
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
    pageBody.removeEventListener(`click`, onPageBodyClickToCloseEventList);
  }
};

const onEscKeyDownCloseForm = (evt) => {
  if (evt.keyCode === ESC_KEYCODE) {
    onCloseEditFormBtnClick();
    createPromptText();
  }
};

const onEscKeyDownCloseEventsList = (evt) => {
  if (evt.keyCode === ESC_KEYCODE) {
    const eventTypeList = document.getElementsByClassName(`event__type-list`)[0];
    const eventTypeToggle = document.getElementById(`event-type-toggle-1`);
    eventTypeToggle.checked = !eventTypeToggle.checked;
    eventTypeList.style.display = `none`;
    document.removeEventListener(`keydown`, onEscKeyDownCloseEventsList);
    document.addEventListener(`keydown`, onEscKeyDownCloseForm);
    pageBody.removeEventListener(`click`, onPageBodyClickToCloseEventList);
  }
};

const onSaveBtnOfNewEventFormClick = (evt) => {
  evt.preventDefault();
  // save data:
  savePointOfRoute(evt.target);
  // redraw  list of events:
  redrawListOfEvents();
};

const onRollUpBtnClick = (evt) => {
  // close current form:
  onCloseEditFormBtnClick();
  // check if an roll-up button has openEditForm class:
  if (evt.target.matches(`.openEditForm`)) {
    // show editEventForm:
    const eventDiv = evt.target.closest(`.event`);
    const startTime = eventDiv.querySelector(`.event__schedule > .event__time > .event__start-time`).getAttribute(`datetime`);
    const endTime = eventDiv.querySelector(`.event__schedule > .event__time > .event__end-time`).getAttribute(`datetime`);
    const editEventForm = new EditEventForm();
    render(eventDiv, editEventForm.getElement(startTime, endTime, pointsOfRoute), RenderPosition.AFTER);
    // disable roll-up button that had opened an edit form:
    evt.target.disabled = true;
    evt.target.classList.add(`disabledRollUpBtn`);
  }
  // add eventListener for close edit form button:
  const editEventForm = document.getElementsByClassName(`event--edit`)[0];
  const closeEditFormBtn = editEventForm.getElementsByClassName(`event__rollup-btn`)[0];
  closeEditFormBtn.addEventListener(`click`, onCloseEditFormBtnClick);
  // add eventListener for save button:
  saveButtonOfEditForm = document.getElementsByClassName(`event__save-btn`)[0];
  saveButtonOfEditForm.addEventListener(`click`, onSaveButtonOfEditFormClick);
  // add eventListener for delete button:
  const eventDeleteBtn = document.getElementsByClassName(`event__reset-btn`)[0];
  eventDeleteBtn.addEventListener(`click`, onDeleteBtnClick);
  // add eventListener for event list button:
  const eventListBtn = document.getElementsByClassName(`event__type-btn`)[0];
  eventListBtn.addEventListener(`click`, onEventListBtnClick);
  // add eventListeners for options of event list:
  toggleListenersOfEventListOptions(`addListeners`);
  // add eventListener for Esc button:
  document.addEventListener(`keydown`, onEscKeyDownCloseForm);
};

const onCloseEditFormBtnClick = () => {
  const editEventForm = document.getElementsByClassName(`event--edit`)[0];
  if (editEventForm) {
    const closeEditFormBtn = editEventForm.getElementsByClassName(`event__rollup-btn`)[0];
    if (closeEditFormBtn) {
      closeEditFormBtn.removeEventListener(`click`, onCloseEditFormBtnClick);
    }
    editEventForm.remove();
    // enable an disabled roll-up button:
    const disabledRollUpBtn = document.getElementsByClassName(`disabledRollUpBtn`);
    for (const i of disabledRollUpBtn) {
      i.disabled = false;
      i.classList.remove(`disabledRollUpBtn`);
    }
  }
  // activate newEventBtn:
  newEventBtn.disabled = false;

  toggleListenersOfEventListOptions(`removeListeners`);
  document.removeEventListener(`keydown`, onEscKeyDownCloseForm);
  const eventListBtn = document.getElementsByClassName(`event__type-btn`)[0];
  if (eventListBtn) {
    eventListBtn.removeEventListener(`click`, onEventListBtnClick);
  }
};

const onSaveButtonOfEditFormClick = (evt) => {
  evt.preventDefault();
  // save data:
  savePointOfRoute(evt.target);
  // redraw  list of events:
  redrawListOfEvents();
};

const onDeleteBtnClick = (evt) => {
  evt.preventDefault();
  // find and remove a point of route:
  for (let i = 0; i < pointsOfRoute.length; i++) {
    if (currentPointOfRoute.startTime === pointsOfRoute[i].startTime) {
      pointsOfRoute.splice([i], 1);
    }
  }
  // redraw list of events:
  redrawListOfEvents();

  // compute and show total price:
  computeTotalPrice(pointsOfRoute);

  // render information about trip in the header:
  renderTripInfo(pointsOfRoute);

  // if there are no events add the prompt:
  createPromptText();
};

/* ------------------------------------------------------------*/
// functions for listeners of events:

// toggle listeners of the event list:
const toggleListenersOfEventListOptions = (action) => {
  const eventTypeCollection = document.getElementsByClassName(`event__type-input`);
  for (const i of eventTypeCollection) {
    switch (action) {
      case `addListeners`:
        i.addEventListener(`click`, onEventListOptionClick);
        break;
      case `removeListeners`:
        i.removeEventListener(`click`, onEventListOptionClick);
    }
  }
};

const toggleEventListenersForRollUpBtns = (action) => {
  /*
  const rollupBtnCollection = document.getElementsByClassName(`event__rollup-btn`);
  // add eventListeners on roll-up buttons:
  switch (action) {
    case `addListeners`:
      for (const i of rollupBtnCollection) {
        i.classList.add(`openEditForm`);
        i.addEventListener(`click`, onRollUpBtnClick);
      }
      break;
    case `removeListeners`:
      for (const i of rollupBtnCollection) {
        i.removeEventListener(`click`, onRollUpBtnClick);
      }
      break;
  }
  */
};

const removeEventListenersOnEditFormClose = () => {
  const eventListBtn = document.getElementsByClassName(`event__type-btn`)[0];
  // remove eventListeners:
  eventListBtn.removeEventListener(`click`, onEventListBtnClick);
  saveButtonOfEditForm.removeEventListener(`click`, onSaveButtonOfEditFormClick);
  eventListBtn.removeEventListener(`click`, onEventListBtnClick);
  toggleListenersOfEventListOptions(`removeListeners`);
};

/* -------------------------------------------------------------*/
// other functions:

// find point of route in array:
const findPointOfRouteInArray = (startTime, arrayOfEvents) => {
  let pointOfRoute;
  const eventStartTime = startTime;

  // search for according record in array by date of event:
  for (const entry of arrayOfEvents) {
    const entryStartTimeYear = entry.startTime.getFullYear();
    let entryStartTimeMonth = entry.startTime.getMonth();
    entryStartTimeMonth = entryStartTimeMonth + 1;
    entryStartTimeMonth = adjustTimeFormat(entryStartTimeMonth);
    let entryStartTimeDay = entry.startTime.getDate();
    entryStartTimeDay = adjustTimeFormat(entryStartTimeDay);
    let entryStartTimeHours = entry.startTime.getHours();
    entryStartTimeHours = adjustTimeFormat(entryStartTimeHours);
    let entryStartTimeMinutes = entry.startTime.getMinutes();
    entryStartTimeMinutes = adjustTimeFormat(entryStartTimeMinutes);

    const entryStartTime = entryStartTimeYear + `-` + entryStartTimeMonth +
      `-` + entryStartTimeDay + `T` + entryStartTimeHours +
      `:` + entryStartTimeMinutes;

    if (eventStartTime === entryStartTime) {
      pointOfRoute = entry;
    }
  }
  currentPointOfRoute = pointOfRoute;
  return currentPointOfRoute;
};

// redraw list of events when save or delete button of edit form was clicked:
const redrawListOfEvents = () => {
  let newEvent;
  // check type of form:
  const newEventFormFormMarkUp = document.getElementsByClassName('trip-events__item  event  event--edit')[0];
  if (newEventFormFormMarkUp) {
    removeNewEventForm();
    newEvent = true;
  } else { // for editForm:
    removeEventListenersOnEditFormClose();
    const editForm = document.getElementsByClassName(`event--edit`)[0];
    editForm.remove();
  }

  // remove current list of points of route from mark-up:
  const tripDays = document.getElementsByClassName(`trip-days`)[0];
  if (tripDays) {
    tripDays.remove();
  }

  const sortingMenu = document.getElementsByClassName(`trip-events__trip-sort`)[0];
  if (sortingMenu) {
    sortingMenu.remove();
  }


  toggleEventListenersForRollUpBtns(`removeListeners`);

  // redraw events:
  if (pointsOfRoute.length > 0 || newEvent) {
    const tripSortMenu = new TripSortMenuComponent();
    render(tripEventsHeader, tripSortMenu.getElement(), RenderPosition.AFTER);

    // render updated list of records:
    const tripSortMenuMarkUp = document.getElementsByClassName('trip-events__trip-sort')[0];
    console.log(pointsOfRoute.length);
    const eventCards = new EventCardComponent(pointsOfRoute);
    render(tripSortMenuMarkUp, eventCards.getElement(pointsOfRoute), RenderPosition.AFTER);


    // add eventListeners for roll-up buttons:
    toggleEventListenersForRollUpBtns(`addListeners`);

    // compute and show total price:
    computeTotalPrice(pointsOfRoute);

    // render information about trip in the header:
    renderTripInfo(pointsOfRoute);
  }
  // if there are no events add the prompt:
  createPromptText();
};

const getDateFromInput = (time) => {
  let dateArray = [];
  // get numbers:
  for (let i = 0; i < time.length; i++) {
    if (!isNaN(parseInt(time[i]))) {
      let number = time[i];

      for (let j = i + 1; j <= time.length; j++) {
        if (!isNaN(parseInt(time[j]))) {
          number = number + time[j];
        } else {
          i = j;
          dateArray.push(parseInt(number));
          break;
        }
      }
    }
  }
  dateArray[1] = dateArray[1] - 1; // get month for javascript

  let year = dateArray[0];
  let month = dateArray[1];
  let day = dateArray[2];
  let hours = dateArray[3];
  let minutes = dateArray[4];
  time = new Date(year, month, day, hours, minutes);
  return time;
};


const savePointOfRoute = (form) => {
  const editForm = document.getElementsByClassName(`event--edit`)[0];

  // get data from mark-up:
  let startTime = document.querySelector(`#event-start-time-1`).value;
  let endTime = document.querySelector(`#event-end-time-1`).value;

  // get time in format of javascript:
  startTime = getDateFromInput(startTime);
  endTime = getDateFromInput(endTime);

  const price = parseInt(document.querySelector(`#event-price-1`).value, 10);

  const offersCollection = document.getElementsByClassName(`event__offer-checkbox`);

  const destination = document.querySelector(`#event-destination-1`).value;
  const eventType = document.getElementsByClassName(`event__label  event__type-output`)[0].textContent;

  let eventIcon = editForm.getElementsByClassName(`event__type-icon`)[0].getAttribute(`src`);
  eventIcon = eventIcon.split(`/`);
  eventIcon = eventIcon[2];
  eventIcon = eventIcon.split('.');
  eventIcon = setCase(eventIcon[0], 'toUpperCase');
  // save data into object:
  if (form.className.includes('new-event')) { // for newEventform

    // create a new point of route
    let newPointOfRoute = {
      eventType: eventType,
      destination: destination,
      eventIcon: eventIcon,
      startTime: startTime,
      endTime: endTime,
      price: price,
      photo: `http://picsum.photos/300/150?r=\${getRandomInteger(1, 1000)}`,
      description: ``,
      offers: ``,
      days: ``
    }
    // add the new point of route to array of points of route:
    pointsOfRoute.push(newPointOfRoute);
  } else { // for editForm

    console.log(eventIcon);

    currentPointOfRoute.startTime = startTime;
    currentPointOfRoute.endTime = endTime;
    currentPointOfRoute.price = price;
    currentPointOfRoute.destination = destination;
    currentPointOfRoute.eventType = eventType;
    currentPointOfRoute.eventIcon = eventIcon;

    for (let i = 0; i < offersCollection.length; i++) {
      currentPointOfRoute.offers[i].isChecked = offersCollection[i].checked;
    }
  }
};

const transformTimeBetweenHtmlAndDesigFormats = (time, splitter, substitute, combiner) => {
  time = time.split(splitter);
  time[0] = time[0].replace(/\D/g, substitute);
  time = time.join(combiner);
  return time;
};



// set event type:
const setEventTypeText = (evt) => {
  // set an text for an event:
  let eventText = setCase(evt.currentTarget.value, `toUpperCase`);
  eventText = transformEventTypeText(eventText);
  const eventTypeTextForm = document.getElementsByClassName(`event__type-output`)[0];
  eventTypeTextForm.textContent = eventText;
};

const setEventTypeIcon = (evt) => {
  const labelsCollection = document.getElementsByTagName(`label`);
  // find corresponding input and label by comparing id and for attiubutes:
  const eventTypeId = evt.currentTarget.id;
  for (const i of labelsCollection) {
    const labelForAttr = i.getAttribute(`for`);
    if (labelForAttr === eventTypeId) {
      // find an image for the event:
      let checkedEventImgSrc = window.getComputedStyle(
        i, `:before`
      ).getPropertyValue(`background-image`);
      // get source of image:
      const splitSymbol = `img/`;
      checkedEventImgSrc = checkedEventImgSrc.split(splitSymbol);
      checkedEventImgSrc = checkedEventImgSrc[1];
      checkedEventImgSrc = checkedEventImgSrc.split(`")`);
      checkedEventImgSrc = `img/` + checkedEventImgSrc[0];
      // set an new image:
      const editForm = document.getElementsByClassName(`event--edit`)[0];
      const eventImg = editForm.getElementsByClassName(`event__type-icon`)[0];
      eventImg.setAttribute(`src`, checkedEventImgSrc);
      break;
    }
  }
};

// remove newEventForm:
const removeNewEventForm = () => {
  const eventResetButton = document.getElementsByClassName(`event__reset-btn`)[0];
  const eventSaveButton = document.getElementsByClassName(`event__save-btn`)[0];
  const tripEventsForm = document.getElementsByClassName(`event--edit`)[0];
  eventResetButton.removeEventListener(`click`, removeNewEventForm);
  eventSaveButton.removeEventListener(`click`, onSaveBtnOfNewEventFormClick);
  tripEventsForm.remove();
  newEventBtn.disabled = false;
  createPromptText();
};

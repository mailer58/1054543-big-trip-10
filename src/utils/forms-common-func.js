import flatpickr from 'flatpickr';

import moment from 'moment';

import {
  offersMap,
  photosMap,
  destinationsMap
} from './../main.js';

import {
  render,
  createElement,
  RenderPosition
} from './../utils/render.js';

import {
  setCase,
  transformEventTypeText
} from './../utils/common.js';

import {
  ButtonsText,
  Transport,
  Stops,
  Case
} from './../const.js';

export const onDestinationInputChange = (element) => {
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

  saveBtn.disabled = !isValidDestination || !onInputChangeCheckTime(element);

  let eventDetailsSection = element.getElement().querySelector(`.event__details`);
  const offersSection = element.getElement().querySelector(`.event__section--offers`);


  element._destination = {
    name: destinationInput.value,
  };
  destinationInput.classList.remove(`error`);
  // change form:
  if (isValidDestination && destinationInput.value.length > 0) {

    const descriptionText = element.getElement().querySelector(`.event__destination-description`);
    if (descriptionText) {
      descriptionText.textContent = destinationsMap.get(destinationInput.value);
    } else if (!eventDetailsSection) { // for newEventForm
      const eventDetailsElement = createElement(`<section class ="event__details"></section>`);
      render(formHeader, eventDetailsElement, RenderPosition.AFTER);
    }

    if (offersSection) {
      createDestinationMarkup(element, offersSection, RenderPosition.AFTER);
    } else {
      eventDetailsSection = element.getElement().querySelector(`.event__details`);
      createDestinationMarkup(element, eventDetailsSection, RenderPosition.APPEND);
    }

  } else { // remove a description if a destination is invalid:
    if (!destinationInput.classList.contains(`error`)) {

      if (offersSection) { // keep offers section:
        const destinationSection = element.getElement().querySelector(`.event__section--destination`);
        if (destinationSection) {
          destinationSection.remove();
        }

      } else { // if there is no offers section remove all:
        if (eventDetailsSection) {
          eventDetailsSection.remove();
        }
      }

      // keep an invalid destination when rerender in case of misprint:
      element._destination = {
        name: destinationInput.value,
      };

    }
    // add red border in case of invalid destination
    if (destinationInput.value.length > 0) {
      destinationInput.classList.add(`error`);
    }
  }

};

export const createEventsListMarkUp = () => {
  const elementsOfMarkup = [];

  elementsOfMarkup.push(`<div class="event__type-list">
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Transfer</legend>`);

  // add events of transport:
  for (const item in Transport) {
    if (Object.prototype.hasOwnProperty.call(Transport, item)) {
      const transport = setCase(Transport[item], Case.LOWER);
      elementsOfMarkup.push(`<div class="event__type-item">
      <input id="event-type-${transport}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${transport}">
      <label class="event__type-label  event__type-label--${transport}" for="event-type-${transport}-1">${Transport[item]}</label>
    </div>`);
    }
  }
  elementsOfMarkup.push(`</fieldset>
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Activity</legend>`);

  // add activity events:
  for (const item in Stops) {
    if (Object.prototype.hasOwnProperty.call(Stops, item)) {
      const stop = setCase(Stops[item], Case.LOWER);
      elementsOfMarkup.push(`<div class="event__type-item">
   <input id="event-type-${stop}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${stop}">
   <label class="event__type-label  event__type-label--${stop}" for="event-type-${stop}-1">${Stops[item]}</label>
  </div>`);
    }
  }
  elementsOfMarkup.push(`</fieldset>
  </div>
  </div>`);

  return elementsOfMarkup.join(`\n`);
};

export const generateMarkUpForListOfDestinations = (map) => {
  // generate list of destinations:
  const elementsOfMarkup = [];
  if (map) {
    for (const item of map.keys()) {
      elementsOfMarkup.push(`<option value="${item}"></option>`);
    }
  }
  return elementsOfMarkup.join(`\n`);
};

export const setOptionsHandlers = (element) => {
  const optionsList = element.getElement().querySelectorAll(`.event__type-input`);

  for (const item of optionsList) {
    item.addEventListener(`click`, (evt) => {
      // change type of event and offers:
      element._icon = getEventTypeIcon(evt);
      element._eventType = transformEventTypeText(setCase(element._icon, Case.UPPER));
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

// add calendar:
export const applyFlatpickr = (element) => {
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

const getEventTypeIcon = (evt) => {
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

// check validity of destination:

export const checkDestinationValidity = (destinationInput) => {
  for (const destination of destinationsMap.keys()) {
    if (destination === destinationInput) {
      return true;
    }
  }
  return false;
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

  let elementsOfMarkup;
  if (photos.length > 0) {
    elementsOfMarkup = createPhotoMarkUp(photos);
  }

  elementsOfMarkup = createElement(elementsOfMarkup);
  render(destinationSection, elementsOfMarkup, RenderPosition.APPEND);

  element._destination = {
    name: destinationInput.value,
    description: destinationsMap.get(destinationInput.value),
    pictures: photos
  };

};

export const createPhotoMarkUp = (photos) => {
  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${photos.map((picture) => {
      return `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
    }).join(`\n`)}
  </div>
    </div>`);
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


export const setData = (element, data, formData = {}) => {
  element._buttonsText = Object.assign({}, ButtonsText, data);
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
  element._eventType = transformEventTypeText(setCase(formEventType, Case.UPPER));
  element._favorite = formFavorite;
  element._startTime = formStartTime;
  element._endTime = formEndTime;

  element.rerender();
};

export const onInputChangeCheckTime = (element) => {
  const saveBtn = element.getElement().querySelector(`.event__save-btn`);

  const timeFormat = `YY-MM-DD HH:mm`;
  const startTimeInput = element.getElement().querySelector(`#event-start-time-1`);
  let startTime = startTimeInput.value;
  const endTimeInput = element.getElement().querySelector(`#event-end-time-1`);
  let endTime = endTimeInput.value;

  if (!startTime || !endTime) {
    element._isSaveBtnBlocked = true;
    saveBtn.disabled = true;
    return false;
  }

  startTime = moment(startTime, timeFormat);
  endTime = moment(endTime, timeFormat);

  const diff = endTime.diff(startTime, `minutes`);

  const result = diff > 0 ? true : false;
  element._isSaveBtnBlocked = !result;

  // check validity of destination:
  const destinationInput = element.getElement().querySelector(`#event-destination-1`);

  const isValidDestination = checkDestinationValidity(destinationInput.value);

  saveBtn.disabled = !isValidDestination || !result;

  return result;
};

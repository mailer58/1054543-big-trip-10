import {} from './../mock/point-of-route.js';

import {
  MONTHS_MAP
} from './../const.js';

import {
  adjustTimeFormat,
  setCase,
  createElement,
  render,
  RenderPosition,
  sortPointsOfRouteByTime
} from './../utils.js';

import {
  EditEventFormComponent
} from './forms.js';

export {
  renderEventCards
};

let prevMarkUpForPointOfRoute;
let prevEditEventForm;
let prevEventsList;

/* ----------------------------------------------------------*/
// mark-up:

const createMarkUpForPointOfRoute = (sameDatePointOfRoute) => {
  const [startHours, startMinutes] = getHoursMinutesForPointTime(sameDatePointOfRoute.startTime);
  const [endHours, endMinutes] = getHoursMinutesForPointTime(sameDatePointOfRoute.endTime);
  const icon = setCase(sameDatePointOfRoute.eventIcon, `toLowerCase`);
  return `<li class="trip-events__item">
  <div class="event">
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${icon}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${sameDatePointOfRoute.eventType + ` ` + sameDatePointOfRoute.destination}</h3>

    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${createDateTime(`start`, sameDatePointOfRoute)}">${startHours + `:` + startMinutes}</time>
        &mdash;
        <time class="event__end-time" datetime="${createDateTime(`end`, sameDatePointOfRoute)}">${endHours + `:` + endMinutes}</time>
      </p>
      <p class="event__duration">${getEventDuration(sameDatePointOfRoute)}</p>
    </div>

    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${sameDatePointOfRoute.price}</span>
    </p>

    <h4 class="visually-hidden">Offers:</h4>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
    </div>
    </li>
    `;
};

class MarkUpForPointOfRouteComponent {
  constructor() {
    this._element = null;
  }

  getTemplate(sameDatePoint) {
    return createMarkUpForPointOfRoute(sameDatePoint);
  }

  getElement(sameDatePoint) {
    if (!this._element) {
      this._element = createElement(this.getTemplate(sameDatePoint));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

const createMarkUpForDayNumber = (entry) => {
  return `<li class="trip-days__item  day">
   <div class="day__info">
     <span class="day__counter">${entry[0]}</span>
     <time class="day__date" datetime="${createDateTime(`yearMonthDay`, entry[1][0])}">
     ${MONTHS_MAP.get(entry[1][0].startTime.getMonth())} 
     ${entry[1][0].startTime.getDate()}
     </time>
   </div>`;
};

class MarkUpForDayNumberComponent {
  constructor() {
    this._element = null;
  }

  getTemplate(entry) {
    return createMarkUpForDayNumber(entry);
  }

  getElement(entry) {
    if (!this._element) {
      this._element = createElement(this.getTemplate(entry));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}


const renderEventCards = (events) => {

  const pointsOfRouteMap = createMapOfSetsOfSameDays(events);
  // add unordered list of days of trips:
  const tripSortMenuMarkUp = document.getElementsByClassName(`trip-events__trip-sort`)[0];
  const tripDaysList = createElement(`<ul class="trip-days"></ul>`);
  render(tripSortMenuMarkUp, tripDaysList, RenderPosition.AFTER);

  // add days of trip:
  for (const entry of pointsOfRouteMap) {
    const markUpForDayNumberComponent = new MarkUpForDayNumberComponent();
    render(tripDaysList, markUpForDayNumberComponent.getElement(entry), RenderPosition.APPEND);

    const tripDayItem = markUpForDayNumberComponent.getElement(entry).querySelector(`.day__info`);
    // create unordered list for events:
    const eventsList = createElement(`<ul class="trip-events__list"></ul>`);
    render(tripDayItem, eventsList, RenderPosition.AFTER);

    // create points of route for the set of days:
    for (const sameDatePointOfRoute of entry[1]) {
      const markUpForPointOfRoute = new MarkUpForPointOfRouteComponent();
      const rollUpBtn = markUpForPointOfRoute.getElement(sameDatePointOfRoute).querySelector(`.event__rollup-btn`);

      const replaceCardToEdit = () => {
        eventsList.replaceChild(editEventForm.getElement(sameDatePointOfRoute), markUpForPointOfRoute.getElement(sameDatePointOfRoute));
      };
      const replaceEditToCard = () => {
        eventsList.replaceChild(markUpForPointOfRoute.getElement(sameDatePointOfRoute), editEventForm.getElement(sameDatePointOfRoute));
      };
      const onEscKeyDown = (evt) => {
        const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
        const editForm = document.getElementsByClassName(`event  event--edit`)[0];
        if (isEscKey && editForm) {
          replaceEditToCard();
          document.removeEventListener(`keydown`, onEscKeyDown);
        }
      };
      // add eventListeners:


      rollUpBtn.addEventListener(`click`, () => {
        const editForm = document.getElementsByClassName(`event  event--edit`)[0];
        if (editForm) {
          // remove opened editForm:
          // document.removeEventListener(`keydown`, onEscKeyDown);
          prevEventsList.replaceChild(prevMarkUpForPointOfRoute, prevEditEventForm);

        }
        replaceCardToEdit();
        document.addEventListener(`keydown`, onEscKeyDown);
        // save previous edit form and point of route:
        prevMarkUpForPointOfRoute = markUpForPointOfRoute.getElement(sameDatePointOfRoute);
        prevEditEventForm = editEventForm.getElement(sameDatePointOfRoute);
        prevEventsList = eventsList;
      });

      const editEventForm = new EditEventFormComponent();
      const saveBtn = editEventForm.getElement(sameDatePointOfRoute).querySelector(`.event__save-btn`);

      saveBtn.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        replaceEditToCard();
      });

      // render a point of route:
      render(eventsList, markUpForPointOfRoute.getElement(sameDatePointOfRoute), RenderPosition.APPEND);

      // render offers:
      const offersHeader = markUpForPointOfRoute.getElement().querySelector(`.event > h4`);
      const offersComponent = new OffersComponent();
      const offersMarkUp = offersComponent.getElement(sameDatePointOfRoute.offers);
      render(offersHeader, offersMarkUp, RenderPosition.AFTER);
    }
  }
};

// create mark-up for offers in list of events:
const createOffersMarkUp = (offers) => {
  const offersMarkUp = [];
  offersMarkUp.push(`<ul class="event__selected-offers">`);
  for (const offer of offers) {
    if (offer.isChecked) {
      offersMarkUp.push(
          `<li class="event__offer">
       <span class="event__offer-title">${offer.type + ` ` + offer.name}</span>
        +
       €&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>`
      );
    }
  }
  offersMarkUp.push(`</ul>`);
  return offersMarkUp.join(`\n`);
};

class OffersComponent {
  constructor() {
    this._element = null;
  }

  getTemplate(offers) {
    return createOffersMarkUp(offers);
  }

  getElement(offers) {
    if (!this._element) {
      this._element = createElement(this.getTemplate(offers));
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

/* ---------------------------------------------------------------*/
// time:

// create format of time for datetime attribute:
const createDateTime = (event, sameDatePointOfRoute) => {
  let dateTime;
  if (event === `start` || `yearMonthDay`) {
    const startYear = sameDatePointOfRoute.startTime.getFullYear();
    let startMonth = sameDatePointOfRoute.startTime.getMonth();
    const startDay = adjustTimeFormat(sameDatePointOfRoute.startTime.getDate());
    if (event === `start`) {
      startMonth = startMonth + 1; // month + 1 => get html format
      const startHour = adjustTimeFormat(sameDatePointOfRoute.startTime.getHours());
      const startMinute = adjustTimeFormat(sameDatePointOfRoute.startTime.getMinutes());
      startMonth = adjustTimeFormat(startMonth);
      dateTime = `${startYear}-${startMonth}-${startDay}T${startHour}:${startMinute}`;
    }
    if (event === `yearMonthDay`) {
      dateTime = `${startYear}-${startMonth}-${startDay}`;
    }
  }
  if (event === `end`) {
    const endYear = sameDatePointOfRoute.endTime.getFullYear();
    let endMonth = sameDatePointOfRoute.endTime.getMonth();
    endMonth = endMonth + 1;
    endMonth = adjustTimeFormat(endMonth);
    const endDay = adjustTimeFormat(sameDatePointOfRoute.endTime.getDate());
    const endHour = adjustTimeFormat(sameDatePointOfRoute.endTime.getHours());
    const endMinute = adjustTimeFormat(sameDatePointOfRoute.endTime.getMinutes());
    dateTime = `${endYear}-${endMonth}-${endDay}T${endHour}:${endMinute}`;
  }
  return dateTime;
};

// get time difference between end and start of event:
const getEventDuration = (event) => {
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const diff = event.endTime - event.startTime;

  const days = Math.floor(diff / day);
  const hours = Math.floor((diff - days * day) / hour);
  const minutes = Math.floor((diff - days * day - hours * hour) / minute);

  if (days) {

    return `${adjustTimeFormat(days)}D ${adjustTimeFormat(hours)}H ${adjustTimeFormat(minutes)}M`;
  } else if (hours) {

    return `${adjustTimeFormat(hours)}H ${adjustTimeFormat(minutes)}M`;
  }
  return `${adjustTimeFormat(minutes)}M`;
};


// get hours and minutes for mark-up:
const getHoursMinutesForPointTime = (pointTime) => {
  let hours = pointTime.getHours();
  hours = adjustTimeFormat(hours);
  let minutes = pointTime.getMinutes();
  minutes = adjustTimeFormat(minutes);
  return [hours, minutes];
};

const createDaysCounters = (events) => {
  events = sortPointsOfRouteByTime(events);
  let numberOfDaySet = 1;
  for (let i = 0; i < events.length; i++) {
    if (i === 0) {
      // set first collection of days:
      events[i].days = 1;
    }
    if (i > 0) {
      if (events[i].startTime.getFullYear() === events[i - 1].startTime.getFullYear() &&
        events[i].startTime.getMonth() === events[i - 1].startTime.getMonth() &&
        events[i].startTime.getDate() === events[i - 1].startTime.getDate()) {
        events[i].days = numberOfDaySet;
      } else {
        numberOfDaySet++;
        events[i].days = numberOfDaySet;
      }
    }
  }
  // pick quantity of sets of days
  const quantityOfSetsOfDays = numberOfDaySet;
  return [events, quantityOfSetsOfDays];
};

const createMapOfSetsOfSameDays = (events) => {
  const quantityOfSetsOfDays = createDaysCounters(events)[1];
  const setsOfSameDaysMap = new Map();
  for (let j = 1; j <= quantityOfSetsOfDays; j++) {
    const setsOfSameDays = [];
    for (let i = 0; i < events.length; i++) {
      if (j === events[i].days) {
        setsOfSameDays.push(events[i]);
      }
      setsOfSameDaysMap.set(j, setsOfSameDays);
    }
  }
  return setsOfSameDaysMap;
};

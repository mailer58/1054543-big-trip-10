import {} from './../mock/point-of-route.js';

import {
  MONTHS_MAP
} from './../const.js';

import {
  adjustTimeFormat,
  setCase,
  createElement,
  render,
  RenderPosition
} from './../utils.js';

import {
  EditEventFormComponent
} from './forms.js';

export {
  renderEventCards
};

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
    <ul class="event__selected-offers">
    ${createOffers(sameDatePointOfRoute.offers)}
    </ul>

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


const renderEventCards = (pointsOfRoute) => {
  const pointsOfRouteMap = createMapOfSetsOfSameDays(pointsOfRoute);
  // add unordered list of days of trips:
  const tripSortMenuMarkUp = document.getElementsByClassName(`trip-events__trip-sort`)[0];
  const tripDayList = createElement(`<ul class="trip-days"></ul>`);
  render(tripSortMenuMarkUp, tripDayList, RenderPosition.AFTER);

  // add days of trip:
  for (const entry of pointsOfRouteMap) {
    const markUpForDayNumberComponent = new MarkUpForDayNumberComponent();
    render(tripDayList, markUpForDayNumberComponent.getElement(entry), RenderPosition.APPEND);

    const tripDayItem = markUpForDayNumberComponent.getElement(entry).querySelector(`.day__info`);
    // create unordered list for events:
    const eventsList = createElement(`<ul class="trip-events__list"></ul>`);
    render(tripDayItem, eventsList, RenderPosition.AFTER);

    // create points of route for the set of days:
    for (const sameDatePointOfRoute of entry[1]) {
      const markUpForPointOfRoute = new MarkUpForPointOfRouteComponent();
      const rollUpBtn = markUpForPointOfRoute.getElement(sameDatePointOfRoute).querySelector(`.event__rollup-btn`);
      rollUpBtn.addEventListener(`click`, () => {
        eventsList.replaceChild(editEventForm.getElement(sameDatePointOfRoute), markUpForPointOfRoute.getElement(sameDatePointOfRoute));
      });

      const editEventForm = new EditEventFormComponent();
      const saveBtn = editEventForm.getElement(sameDatePointOfRoute).querySelector(`.event__save-btn`);
      saveBtn.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        eventsList.replaceChild(markUpForPointOfRoute.getElement(sameDatePointOfRoute), editEventForm.getElement(sameDatePointOfRoute));
      });
      // create mark-up for point of route:
      render(eventsList, markUpForPointOfRoute.getElement(sameDatePointOfRoute), RenderPosition.APPEND);
    }
  }
};

// create mark-up for offers in list of events:
const createOffers = (offers) => {
  const offersMarkUp = [];
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
  return offersMarkUp.join(`\n`);
};

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
    return `${days}D ${hours}H ${minutes}M`;
  } else if (hours) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
};


// get hours and minutes for mark-up:
const getHoursMinutesForPointTime = (pointTime) => {
  let hours = pointTime.getHours();
  hours = adjustTimeFormat(hours);
  let minutes = pointTime.getMinutes();
  minutes = adjustTimeFormat(minutes);
  return [hours, minutes];
};

// sort events by time:
const sortPointsOfRouteByTime = (pointsOfRoute) => {
  pointsOfRoute.sort(function (a, b) {
    return a.startTime - b.startTime;
  });
  return pointsOfRoute;
};

const createDaysCounters = (pointsOfRoute) => {
  pointsOfRoute = sortPointsOfRouteByTime(pointsOfRoute);
  let numberOfDaySet = 1;
  for (let i = 0; i < pointsOfRoute.length; i++) {
    if (i === 0) {
      // set first collection of days:
      pointsOfRoute[i].days = 1;
    }
    if (i > 0) {
      if (pointsOfRoute[i].startTime.getDate() === pointsOfRoute[i - 1].startTime.getDate()) {
        pointsOfRoute[i].days = numberOfDaySet;
      } else {
        numberOfDaySet++;
        pointsOfRoute[i].days = numberOfDaySet;
      }
    }
  }
  // pick quantity of sets of days
  const quantityOfSetsOfDays = numberOfDaySet;
  return [pointsOfRoute, quantityOfSetsOfDays];
};

const createMapOfSetsOfSameDays = (pointsOfRoute) => {
  const returnedArray = createDaysCounters(pointsOfRoute);
  pointsOfRoute = returnedArray[0];
  const quantityOfSetsOfDays = returnedArray[1];
  const setsOfSameDaysMap = new Map();
  for (let j = 1; j <= quantityOfSetsOfDays; j++) {
    const setsOfSameDays = [];
    for (let i = 0; i < pointsOfRoute.length; i++) {
      if (j === pointsOfRoute[i].days) {
        setsOfSameDays.push(pointsOfRoute[i]);
      }
      setsOfSameDaysMap.set(j, setsOfSameDays);
    }
  }
  return setsOfSameDaysMap;
};

import AbstractComponent from './abstract-component.js';
import PointController from './../controllers/point-controller.js';

import moment from 'moment';
import he from 'he';

import {
  SortType,
  Case
} from './../const.js';

import {
  transformEventTypeText,
  adjustTimeFormat,
  setCase,
  sortPointsOfRouteByTime
} from './../utils/common.js';

import {
  createElement,
  render,
  RenderPosition,
} from './../utils/render.js';

const MARGIN_LEFT = `80px`;

/* ----------------------------------------------------------*/
// mark-up:

const createMarkUpForPointOfRoute = (point) => {
  const destination = he.encode(point.destination.name); // make data safe

  const price = point.price;

  const startTime = moment(point.startTime);
  const startDateTime = startTime.format(`YYYY-MM-DDTHH:mm`);
  const startHoursMinutes = startTime.format(`HH:mm`);

  const endTime = moment(point.endTime);
  const endDateTime = endTime.format(`YYYY-MM-DDTHH:mm`);
  const endHoursMinutes = endTime.format(`HH:mm`);

  const icon = point.eventType;
  const eventType = transformEventTypeText(setCase(point.eventType, Case.UPPER));

  return `<li class="trip-events__item">
  <div class="event">
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${icon}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${eventType} ${destination}</h3>

    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${startDateTime}">${startHoursMinutes}</time>
        &mdash;
        <time class="event__end-time" datetime="${endDateTime}">${endHoursMinutes}</time>
      </p>
      <p class="event__duration">${getEventDuration(point)}</p>
    </div>

    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>

    <h4 class="visually-hidden">Offers:</h4>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
    </div>
    </li>
    `;
};

export default class MarkUpForPointOfRouteComponent extends AbstractComponent {
  constructor(sameDatePoint) {
    super();
    this._point = sameDatePoint;
  }

  getTemplate() {
    return createMarkUpForPointOfRoute(this._point);
  }

  setRollUpBtnHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}

const createMarkUpForDayNumber = (entry) => {
  const dateTime = moment(entry[1][0].startTime);
  return `<li class="trip-days__item  day">
   <div class="day__info">
     <span class="day__counter">${entry[0]}</span>
     <time class="day__date" datetime="${dateTime.format(`YYYY-MM-DD`)}">
     ${dateTime.format(`MMM`)} 
     ${dateTime.format(`DD`)}
     </time>
   </div>`;
};

class MarkUpForDayNumberComponent extends AbstractComponent {
  constructor(day) {
    super();
    this._day = day;
  }

  getTemplate() {
    return createMarkUpForDayNumber(this._day);
  }
}

export const renderEventCards = (events, container, onDataChange, onViewChange, tripController) => {

  const showedControllers = [];

  // add unordered list of days of trips:
  const tripSortMenu = document.getElementsByClassName(`trip-events__trip-sort`)[0];

  // sort and render by event:
  if (tripController._currentSortType === SortType.EVENT) {

    const pointsOfRouteMap = createMapOfSetsOfSameDays(events);

    // add list trip:
    render(tripSortMenu, container.getElement(), RenderPosition.AFTER);

    // add days of trip:
    for (const entry of pointsOfRouteMap) {
      const markUpForDayNumberComponent = new MarkUpForDayNumberComponent(entry);
      render(container.getElement(), markUpForDayNumberComponent.getElement(), RenderPosition.APPEND);

      const tripDayItem = markUpForDayNumberComponent.getElement().querySelector(`.day__info`);
      // create unordered list for events:
      const eventsList = createElement(`<ul class="trip-events__list"></ul>`);
      render(tripDayItem, eventsList, RenderPosition.AFTER);

      // create points of route for the set of days:
      for (const sameDatePointOfRoute of entry[1]) {
        const pointController = new PointController(eventsList, onDataChange, onViewChange, tripController);
        pointController.render(sameDatePointOfRoute);
        showedControllers.push(pointController);
      }
    }
  } else if (tripController._currentSortType === SortType.PRICE) {
    // sort and render by price:
    const points = tripController._pointsModel.getPoints();
    const sortedPoints = points.slice().sort((a, b) => b.price - a.price);

    // create unordered list for events:
    const eventsList = createElement(`<ul class="trip-events__list"></ul>`);
    eventsList.style.marginLeft = MARGIN_LEFT;
    render(tripSortMenu, eventsList, RenderPosition.AFTER);

    for (const point of sortedPoints) {
      const pointController = new PointController(eventsList, onDataChange, onViewChange, tripController);
      pointController.render(point);
      showedControllers.push(pointController);
    }
  } else if (tripController._currentSortType === SortType.TIME) {
    // sort and render by time:
    const points = tripController._pointsModel.getPoints();
    const sortedPoints = points.slice().sort((a, b) => {
      const eventDuration1 = a.endTime.getTime() - a.startTime.getTime();
      const eventDuration2 = b.endTime.getTime() - b.startTime.getTime();
      return eventDuration2 - eventDuration1;
    });

    // create unordered list for events:
    const eventsList = createElement(`<ul class="trip-events__list"></ul>`);
    eventsList.style.marginLeft = MARGIN_LEFT;
    render(tripSortMenu, eventsList, RenderPosition.AFTER);

    for (const point of sortedPoints) {
      const pointController = new PointController(eventsList, onDataChange, onViewChange, tripController);
      pointController.render(point);
      showedControllers.push(pointController);
    }


  }
  return showedControllers;
};

/* ---------------------------------------------------------------*/
// time:

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

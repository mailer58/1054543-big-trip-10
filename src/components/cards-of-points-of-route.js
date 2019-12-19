import {
} from './../mock/point-of-route.js';

import {
  MONTHS_MAP
} from './../const.js';


export {
  createEventCards
};

/* ----------------------------------------------------------*/
// mark-up:

const createMarkUpForPointOfRoute = (sameDatePointOfRoute) => {
  const startHours = getHoursMinutesForStartEndTime(sameDatePointOfRoute, `startTime`)[0];
  const startMinutes = getHoursMinutesForStartEndTime(sameDatePointOfRoute, `startTime`)[1];
  const endHours = getHoursMinutesForStartEndTime(sameDatePointOfRoute, `endTime`)[0];
  const endMinutes = getHoursMinutesForStartEndTime(sameDatePointOfRoute, `endTime`)[1];
  return `<li class="trip-events__item">
  <div class="event">
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${sameDatePointOfRoute.eventIcon}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${sameDatePointOfRoute.eventType + ` ` + sameDatePointOfRoute.destination}</h3>

    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${createDateTime(`start`, sameDatePointOfRoute)}">${startHours + `:` + startMinutes}</time>
        &mdash;
        <time class="event__end-time" datetime="${createDateTime(`end`, sameDatePointOfRoute)}">${endHours + `:` + endMinutes}</time>
      </p>
      <p class="event__duration">${getTimeDifference(sameDatePointOfRoute)}</p>
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

const createMarkUpForDayNumber = (entry) => {
  return `<li class="trip-days__item  day">
   <div class="day__info">
     <span class="day__counter">${entry[0]}</span>
     <time class="day__date" datetime="${createDateTime(`yearMonthDay`, entry[1][0])}">
     ${MONTHS_MAP.get(entry[1][0].startTime.getMonth())} 
     ${entry[1][0].startTime.getDate()}
     </time>
   </div>
   <ul class="trip-events__list">`;
};

const createEventCards = (pointsOfRoute) => {
  const pointsOfRouteMap = createMapOfSetsOfSameDays(pointsOfRoute);
  const pointsOfRouteMarkUp = [];
  //  create mark-up for number of set of days:
  pointsOfRouteMarkUp.push(`<ul class="trip-days">`);
  for (const entry of pointsOfRouteMap) {
    pointsOfRouteMarkUp.push(createMarkUpForDayNumber(entry));
    // create points of route for the set of days:
    for (const sameDatePointOfRoute of entry[1]) {
      // create mark-up for point of route:
      pointsOfRouteMarkUp.push(createMarkUpForPointOfRoute(sameDatePointOfRoute));
    }
    // create end of markUp for set of days:
    pointsOfRouteMarkUp.push(`
      </ul>
      </li>
      `);
  }
  return pointsOfRouteMarkUp.join(`\n`);
};

// create mark-up for offers in list of events:
const createOffers = (offers) => {
  const offersMarkUp = [];
  for (const offer of offers) {
    if (offer.isChecked === true) {
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
    const startDay = sameDatePointOfRoute.startTime.getDate() > 9 ? sameDatePointOfRoute.startTime.getDate() : `0` + sameDatePointOfRoute.startTime.getDate();
    if (event === `start`) {
      const startHour = sameDatePointOfRoute.startTime.getHours() > 9 ? sameDatePointOfRoute.startTime.getHours() : `0` + sameDatePointOfRoute.startTime.getHours();
      const startMinute = sameDatePointOfRoute.startTime.getMinutes() > 9 ? sameDatePointOfRoute.startTime.getMinutes() : `0` + sameDatePointOfRoute.startTime.getMinutes();
      startMonth = startMonth + 1; // month + 1 => get html format
      startMonth = startMonth > 9 ? startMonth : `0` + startMonth;
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
    endMonth = endMonth > 9 ? endMonth : `0` + endMonth;
    const endDay = sameDatePointOfRoute.endTime.getDate() > 9 ? sameDatePointOfRoute.endTime.getDate() : `0` + sameDatePointOfRoute.endTime.getDate();
    const endHour = sameDatePointOfRoute.endTime.getHours() > 9 ? sameDatePointOfRoute.endTime.getHours() : `0` + sameDatePointOfRoute.endTime.getHours();
    const endMinute = sameDatePointOfRoute.endTime.getMinutes() > 9 ? sameDatePointOfRoute.endTime.getMinutes() : `0` + sameDatePointOfRoute.endTime.getMinutes();
    dateTime = `${endYear}-${endMonth}-${endDay}T${endHour}:${endMinute}`;
  }
  return dateTime;
};

// get time difference between end and start of event:
const getTimeDifference = (sameDatePointOfRoute) => {
  const oneMinute = 1000 * 60;
  const oneHour = 1000 * 60 * 60;
  const oneDay = 1000 * 60 * 60 * 24;

  let eventDurationDiffDaysRound;
  let eventDurationDiffHoursRound;
  let eventDurationDiffMinutesRound;

  // get start and end time:
  const startTimeOfEvent = sameDatePointOfRoute.startTime;
  const endTimeOfEvent = sameDatePointOfRoute.endTime;

  // get difference between the end and the start of event:
  const eventDurationDiff = endTimeOfEvent - startTimeOfEvent;

  // get total number of days:
  const eventDurationDiffDaysTotal = eventDurationDiff / oneDay;

  // get round value of a day:
  eventDurationDiffDaysRound = String(eventDurationDiffDaysTotal).split(`.`);
  eventDurationDiffDaysRound = eventDurationDiffDaysRound[0];

  // get total number of hours:
  const eventDurationDiffHoursTotal = eventDurationDiff / oneHour;

  // get difference between total number of hours and number of hours
  // that consist in rounded days:
  eventDurationDiffHoursRound = eventDurationDiffHoursTotal - eventDurationDiffDaysRound * 24;
  eventDurationDiffHoursRound = String(eventDurationDiffHoursRound).split(`.`);
  eventDurationDiffHoursRound = eventDurationDiffHoursRound[0];

  // get total number of minutes:
  const eventDurationDiffMinutesTotal = eventDurationDiff / oneMinute;

  // get difference in minutes:
  eventDurationDiffMinutesRound = eventDurationDiffMinutesTotal - (eventDurationDiffDaysRound * 24 * 60) - eventDurationDiffHoursRound * 60;
  eventDurationDiffMinutesRound = String(eventDurationDiffMinutesRound).split(`.`);
  eventDurationDiffMinutesRound = eventDurationDiffMinutesRound[0];

  // adjust values of time:
  eventDurationDiffDaysRound = eventDurationDiffDaysRound > 9 ? eventDurationDiffDaysRound : `0` + eventDurationDiffDaysRound;
  eventDurationDiffHoursRound = eventDurationDiffHoursRound > 9 ? eventDurationDiffHoursRound : `0` + eventDurationDiffHoursRound;
  eventDurationDiffMinutesRound = eventDurationDiffMinutesRound > 9 ? eventDurationDiffMinutesRound : `0` + eventDurationDiffMinutesRound;

  // adjust output of time:
  let outputTime;
  switch (true) {
    case eventDurationDiff / oneDay >= 1: // output: days hours minutes
      outputTime = eventDurationDiffDaysRound + `D ` + eventDurationDiffHoursRound + `H ` + eventDurationDiffMinutesRound + `M`;
      break;
    case eventDurationDiff / oneHour >= 1: // output: hours minutes
      outputTime = eventDurationDiffHoursRound + `H ` + eventDurationDiffMinutesRound + `M`;
      break;
    case eventDurationDiff / oneHour < 1: // output: minutes
      outputTime = eventDurationDiffMinutesRound + `M`;
      break;
  }
  return outputTime;
};

// get hours and minutes for mark-up:
const getHoursMinutesForStartEndTime = (pointOfRoute, event) => {
  let hours;
  let minutes;
  if (event === `startTime`) {
    hours = pointOfRoute.startTime.getHours();
    hours = hours > 9 ? hours : `0` + hours;
    minutes = pointOfRoute.startTime.getMinutes();
    minutes = minutes > 9 ? minutes : `0` + minutes;
  }
  if (event === `endTime`) {
    hours = pointOfRoute.endTime.getHours();
    hours = hours > 9 ? hours : `0` + hours;
    minutes = pointOfRoute.endTime.getMinutes();
    minutes = minutes > 9 ? minutes : `0` + minutes;
  }
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
  const returnedArray = [pointsOfRoute, quantityOfSetsOfDays];
  return returnedArray;
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

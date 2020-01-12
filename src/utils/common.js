import {
  MONTHS_MAP
} from './../const.js';

export {
  setCase,
  transformEventTypeText,
  adjustTimeFormat,
  computeTotalPrice,
  renderTripInfo,
  sortPointsOfRouteByTime
};

const setCase = (str, action) => {
  if (!str) {
    return str;
  }
  let outputString;
  if (action === `toUpperCase`) {
    outputString = str[0].toUpperCase() + str.slice(1);
  } else if (action === `toLowerCase`) {
    outputString = str[0].toLowerCase() + str.slice(1);
  }
  return outputString;
};

// get event type:
const transformEventTypeText = (eventText) => {
  switch (eventText) {
    case `Taxi`:
    case `Bus`:
    case `Train`:
    case `Ship`:
    case `Transport`:
    case `Drive`:
    case `Flight`:
      eventText = eventText + ` to`;
      break;
    case `Check-in`:
      eventText = `Check into`;
      break;
    case `Sightseeing`:
    case `Restaurant`:
      eventText = eventText + ` at`;
      break;
  }
  return eventText;
};

// add zero to format of time if there is necessity:
const adjustTimeFormat = (eventTime) => {
  const time = eventTime > 9 ? eventTime : `0` + eventTime;
  return time;
};


const computeTotalPrice = (events) => {
  let totalPrice = 0;
  // compute total price:
  for (const pointOfRoute of events) {
    totalPrice = totalPrice + pointOfRoute.price;
    if (pointOfRoute.offers.length !== 0) {
      for (const offer of pointOfRoute.offers) {
        if (offer.isChecked) {
          totalPrice = totalPrice + offer.price;
        }
      }
    }
  }
  // set total price in mark-up:
  document.querySelector(`.trip-info__cost-value`).textContent = totalPrice;
};

// render information about trip in the header:
const renderTripInfo = (events) => {
  events = sortPointsOfRouteByTime(events);
  const routeTitle = document.querySelector(`.trip-info__title`);
  const datesTitle = document.querySelector(`.trip-info__dates`);
  // if there are points of route:
  if (events.length > 0) {
    // get set of nonrecurrent towns:
    const nonrecurrentTowns = new Set();
    for (const item of events) {
      nonrecurrentTowns.add(item.destination);
    }
    // get count of nonrecurrent towns:
    const nonReccurentTownsCount = nonrecurrentTowns.size;

    const firstTown = events[0].destination;
    const startTime = events[0].startTime;
    const lastTown = events[events.length - 1].destination;
    const endTime = events[events.length - 1].endTime;


    let route;
    // adjust route output:
    if (nonReccurentTownsCount > 2) {
      route = firstTown + ` — ... — ` + lastTown;
    }
    if (nonReccurentTownsCount === 2) {
      route = firstTown + ` — ` + lastTown;
    }

    if (nonReccurentTownsCount === 1) {
      route = firstTown;
    }

    const startMonth = MONTHS_MAP.get(startTime.getMonth());
    const endMonth = MONTHS_MAP.get(endTime.getMonth());
    // adjust time values:
    const startDay = adjustTimeFormat(startTime.getDate());
    const endDay = adjustTimeFormat(endTime.getDate());

    // adjust time output:
    let time;
    if (startTime.getMonth() !== endTime.getMonth()) {
      time = startMonth + ` ` + startDay + ` — ` + endMonth + ` ` + endDay;
    } else if (startTime.getMonth() === endTime.getMonth() &&
      startTime.getDate() !== endTime.getDate()) {
      time = startMonth + ` ` + startDay + ` — ` + endDay;
    } else if (startTime.getMonth() === endTime.getMonth() &&
      startTime.getDate() === endTime.getDate()) {
      time = startMonth + ` ` + startDay;
    }
    // change mark-up:
    routeTitle.textContent = route;
    datesTitle.textContent = time;
  } else { // // if there are no points of route:
    routeTitle.textContent = ``;
    datesTitle.textContent = ``;

  }
};

// sort events by time:
const sortPointsOfRouteByTime = (events) => {
  events.sort(function (a, b) {
    return a.startTime - b.startTime;
  });
  return events;
};


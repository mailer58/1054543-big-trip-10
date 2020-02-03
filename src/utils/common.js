import {
  MONTHS_MAP,
  Transport,
  Stops,
  Case
} from './../const.js';

import moment from 'moment';

export {
  setCase,
  transformEventTypeText,
  adjustTimeFormat,
  computeTotalPrice,
  renderTripInfo,
  sortPointsOfRouteByTime
};

const setCase = (str, action) => {
  if (action === Case.UPPER) {
    return str[0].toUpperCase() + str.slice(1);
  } else if (action === Case.LOWER) {
    return str[0].toLowerCase() + str.slice(1);
  }
  return null;
};

// get event type:
const transformEventTypeText = (eventText) => {
  switch (eventText) {
    case Transport.TAXI:
    case Transport.BUS:
    case Transport.TRAIN:
    case Transport.SHIP:
    case Transport.TRANSPORT:
    case Transport.DRIVE:
    case Transport.FLIGHT:
      eventText = eventText + ` to`;
      break;
    case Stops.CHECKIN:
      eventText = `Check into`;
      break;
    case Stops.SIGHTSEEING:
    case Stops.RESTAURANT:
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
      nonrecurrentTowns.add(item.destination.name);
    }
    // get count of nonrecurrent towns:
    const nonReccurentTownsCount = nonrecurrentTowns.size;

    const firstTown = events[0].destination.name;
    const startTime = events[0].startTime;
    const lastTown = events[events.length - 1].destination.name;
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
  events.sort((a, b) => {
    return a.startTime - b.startTime;
  });
  return events;
};

export const getDateFromInput = (time) => {
  const timeFormat = `DD/MM/YY HH:mm`;
  const date = moment(time, timeFormat);
  const year = date.get(`year`);
  const month = date.get(`month`);
  const day = date.get(`date`);
  const hours = date.get(`hours`);
  const minutes = date.get(`minutes`);

  return new Date(year, month, day, hours, minutes);

};

// get data for format of server:
export const toRAW = (id, formData = {}) => {
  const {
    formStartTime,
    formEndTime,
    formDestination,
    formEventType,
    formOffers,
    formFavorite,
    formPrice
  } = formData;

  const formatTime = `YYYY-MM-DDTHH:mmZ`;
  const startTime = moment(formStartTime).format(formatTime);
  const endTime = moment(formEndTime).format(formatTime);

  // clone objects of offers:
  const offers = [];
  formOffers.forEach((offer) => offers.push(JSON.parse(JSON.stringify(offer))));

  return {
    'id': id,
    'destination': formDestination,
    'date_from': startTime,
    'date_to': endTime,
    'offers': offers,
    'base_price': formPrice,
    'type': formEventType,
    'is_favorite': formFavorite
  };
};

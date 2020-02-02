import moment from 'moment';

import {
  FilterType
} from './../const.js';

// get future or past events:

export const getFuturePoints = (points) => {

  return points.filter((point) => {

    const now = moment();
    const eventStart = moment(point.startTime);
    const diff = now.diff(eventStart, `minutes`);

    return diff < 0;

  });
};

export const getPastPoints = (points) => {

  return points.filter((point) => {

    const now = moment();
    const eventEnd = moment(point.endTime);
    const diff = now.diff(eventEnd, `minutes`);

    return diff > 0;

  });
};

export const getPointsByFilter = (points, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return points;

    case FilterType.FUTURE:
      return getFuturePoints(points);

    case FilterType.PAST:
      return getPastPoints(points);
  }

  return points;
};

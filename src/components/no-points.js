import AbstractComponent from './abstract-component';

import {
  FilterType
} from './../const.js';


const createNoEventsMarkUp = (activeFilterType) => {
  let message;

  switch (activeFilterType) {
    case FilterType.ALL:
      message = `Click New Event to create your first point`;
      break;
    case FilterType.FUTURE:
      message = `There are no future events.`;
      break;
    case FilterType.PAST:
      message = `There are no past events.`;
      break;
    case FilterType.NOEVENTS:
      message = `There are no events.`;
      break;
  }

  return (
    `<p class="trip-events__msg">${message}</p>
`);
};

export default class NoEventsComponent extends AbstractComponent {
  constructor(activeFilterType) {
    super();
    this._activeFilterType = activeFilterType;
  }

  getTemplate() {
    return createNoEventsMarkUp(this._activeFilterType);
  }
}

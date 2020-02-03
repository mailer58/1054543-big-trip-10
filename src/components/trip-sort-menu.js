import AbstractComponent from './abstract-component';

import {
  SortType
} from './../const.js';


const tripSortItems = Object.values(SortType);

const createTripSortMenu = (currentSortType) => {
  const sortType = currentSortType || `event`;
  const elementsOfMarkup = [];
  elementsOfMarkup.push(`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <span class="trip-sort__item  trip-sort__item--day">Day</span>`);
  for (const item of tripSortItems) {
    const isChecked = item === sortType ? `checked` : ``;
    elementsOfMarkup.push(`<div class="trip-sort__item  trip-sort__item--${item}">
                   <input id="sort-${item}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${item}" ${isChecked}>
                   <label class="trip-sort__btn" for="sort-${item}" data-sort-type ="${item}">
                   ${item}`);
    if (item === `time` || item === `price`) {
      elementsOfMarkup.push(`<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
                       <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"></path>
                     </svg>`);
    }
    elementsOfMarkup.push(
        `</label>
     </div>`);
  }

  elementsOfMarkup.push(`<span class="trip-sort__item  trip-sort__item--offers">Offers</span>
               </form>`);

  return elementsOfMarkup.join(`\n`);
};

export default class TripSortMenuComponent extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.EVENT;
  }

  getTemplate() {
    return createTripSortMenu(this._currentSortType);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      if (sortType) {
        this._currentSortType = sortType;
        const inputId = `#sort-` + sortType;
        this.getElement().querySelector(inputId).checked = true;

        handler(sortType);
      }
    });
  }
}

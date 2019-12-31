import {createElement} from './../utils.js';

const filterTypes = [`everything`, `future`, `past`];

const createFilterTemplate = () => {
  let filtersMarkUp = [];
  filtersMarkUp.push(`<form class="trip-filters" action="#" method="get">`);
  for (const filter of filterTypes) {
    const isChecked = filter === `everything` ? `checked` : ``;
    filtersMarkUp.push(`<div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${isChecked}>
      <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
    </div>`);
  }
  filtersMarkUp.push(`</form>`);
  filtersMarkUp = filtersMarkUp.join(`\n`);
  return filtersMarkUp;
};

export default class FilterComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}



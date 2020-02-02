import AbstractComponent from './abstract-component';

import {
  FilterType
} from './../const.js';

import {
  getPointsByFilter
} from './../utils/filter.js';

const filterTypes = Object.values(FilterType);

const createFilterTemplate = () => {
  let filtersMarkUp = [];
  filtersMarkUp.push(`<form class="trip-filters" action="#" method="get">`);
  for (const filter of filterTypes) {
    const isChecked = filter === `everything` ? `checked` : ``;
    if (filter !== FilterType.NOEVENTS) { // exclude no events from markup
      filtersMarkUp.push(`<div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${isChecked}>
      <label class="trip-filters__filter-label" data-filter-type="${filter}" for="filter-${filter}">${filter}</label>
    </div>`);
    }
  }
  filtersMarkUp.push(`</form>`);
  filtersMarkUp = filtersMarkUp.join(`\n`);
  return filtersMarkUp;
};

export default class FilterComponent extends AbstractComponent {
  constructor() {
    super();
    this._currenFilterType = FilterType.ALL;
    this._tripController = null;
  }

  getTemplate() {
    return createFilterTemplate();
  }

  getTripController(tripController) {
    this._tripController = tripController;
  }

  setFilterTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const filterType = evt.target.dataset.filterType;

      if (this._currenFilterType === filterType) {
        return;
      }
      const allPoints = this._tripController._pointsModel.getPointsAll();
      const pastPoints = getPointsByFilter(allPoints, FilterType.PAST);
      const futurePoints = getPointsByFilter(allPoints, FilterType.FUTURE);

      if (filterType === `past` && pastPoints.length > 0 ||
      filterType === `future` && futurePoints.length > 0 ||
      filterType === `everything`) {
        this._currenFilterType = filterType;
        const inputId = `#filter-` + filterType;
        this.getElement().querySelector(inputId).checked = true;
        handler(filterType);
      }
    });
  }
}

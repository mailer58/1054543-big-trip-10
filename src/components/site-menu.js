import {createElement} from './../utils.js';

const itemsOfSiteMenu = [`Table`, `Stats`];

const createSiteMenuTemplate = () => {
  let siteMenuMarkUp = [];
  siteMenuMarkUp.push(`<nav class="trip-controls__trip-tabs  trip-tabs">`);
  for (const item of itemsOfSiteMenu) {
    const activeBtn = item === `Table` ? ` ` + `trip-tabs__btn--active` : ``;
    siteMenuMarkUp.push(`<a class="trip-tabs__btn${activeBtn}" href="#">${item}</a>`);
  }
  siteMenuMarkUp.push(`</nav>`);
  siteMenuMarkUp = siteMenuMarkUp.join(`\n`);
  return siteMenuMarkUp;
};

export default class SiteMenuComponent {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSiteMenuTemplate();
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


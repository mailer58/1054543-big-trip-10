import AbstractComponent from './abstact-component';

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

export default class SiteMenuComponent extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }
}


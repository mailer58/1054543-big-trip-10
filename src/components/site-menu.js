import AbstractComponent from './abstract-component';

const itemsOfSiteMenu = [`Table`, `Stats`];

export const MenuItem = {
  TABLE: `table`,
  STATISTICS: `stats`
};

const createSiteMenuTemplate = () => {
  let siteMenuMarkUp = [];
  let id;
  siteMenuMarkUp.push(`<nav class="trip-controls__trip-tabs  trip-tabs">`);

  for (const item of itemsOfSiteMenu) {
    const activeBtn = item === `Table` ? ` ` + `trip-tabs__btn--active` : ``;
    id = item === `Table` ? `table` : `stats`;
    siteMenuMarkUp.push(`<a id="${id}" class="trip-tabs__btn${activeBtn}" href="#">${item}</a>`);
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

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const clickedItemId = evt.target.id;
      let clickedItem = clickedItemId;
      clickedItem = document.getElementById(clickedItem);
      const menuCollection = this.getElement().querySelectorAll(`.trip-tabs__btn`);

      let secondItem;
      for (const element of menuCollection) {
        if (element.id !== clickedItemId) {
          secondItem = element.id;
          secondItem = document.getElementById(secondItem);
          break;
        }
      }

      // toggle style of inactive element of menu:
      if (!clickedItem.classList.contains(`trip-tabs__btn--active`)) {
        clickedItem.classList.toggle(`trip-tabs__btn--active`);
        secondItem.classList.toggle(`trip-tabs__btn--active`);
      }

      handler(clickedItemId);
    });
  }

}

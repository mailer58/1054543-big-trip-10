import AbstractComponent from './abstract-component';

export default class OffersComponent extends AbstractComponent {
  constructor(offers) {
    super();
    this._offers = offers;
  }

  getTemplate() {
    return createOffersMarkUp(this._offers);
  }
}

// create mark-up for offers in list of events:
const createOffersMarkUp = (offers) => {
  const offersMarkUp = [];
  offersMarkUp.push(`<ul class="event__selected-offers">`);
  for (const offer of offers) {
    if (offer.isChecked) {
      offersMarkUp.push(
          `<li class="event__offer">
         <span class="event__offer-title">${offer.title}</span>
          +
         €&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`
      );
    }
  }
  offersMarkUp.push(`</ul>`);
  return offersMarkUp.join(`\n`);
};

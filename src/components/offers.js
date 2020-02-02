import AbstractComponent from './abstract-component';

const MAX_OFFERS_NUMBER = 3;

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
  const checkedOffers = offers.filter((offer) => offer.isChecked);
  if (checkedOffers.length > 0) {
    let i = 0;
    for (const offer of checkedOffers) {
      i++;
      if (i <= MAX_OFFERS_NUMBER) {
        offersMarkUp.push(
            `<li class="event__offer">
         <span class="event__offer-title">${offer.title}</span>
          +
         €&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`
        );
      }
    }
  }
  offersMarkUp.push(`</ul>`);
  return offersMarkUp.join(`\n`);
};

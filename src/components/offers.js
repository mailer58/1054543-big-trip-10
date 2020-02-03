import AbstractComponent from './abstract-component';

const MAX_OFFERS_NUMBER = 3;

export default class OffersComponent extends AbstractComponent {
  constructor(offers) {
    super();
    this._offers = offers;
  }

  getTemplate() {
    return createOffersMarkup(this._offers);
  }
}

// create mark-up for offers in list of events:
const createOffersMarkup = (offers) => {
  const elementsOfMarkup = [];
  elementsOfMarkup.push(`<ul class="event__selected-offers">`);
  const checkedOffers = offers.filter((offer) => offer.isChecked);
  if (checkedOffers.length > 0) {
    let i = 0;
    for (const offer of checkedOffers) {
      i++;
      if (i <= MAX_OFFERS_NUMBER) {
        elementsOfMarkup.push(
            `<li class="event__offer">
         <span class="event__offer-title">${offer.title}</span>
          +
         €&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`
        );
      }
    }
  }
  elementsOfMarkup.push(`</ul>`);
  return elementsOfMarkup.join(`\n`);
};

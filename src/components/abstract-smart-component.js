import AbstractComponent from './abstract-component.js';

import {
  descriptionsMap,
} from './../mock/point-of-route.js';

export default class AbstractSmartComponent extends AbstractComponent {
  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElement = this.getElement();
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, oldElement);

    this.recoveryListeners();
  }

  onDestinationInputChange() {
    // change description:
    const element = this.getElement();
    const destinationInput = element.querySelector(`#event-destination-1`);
    this._destination = destinationInput.value;
    this._description = descriptionsMap[this._destination];
    this._price = element.querySelector(`.event__input--price`).value;
    this._startTime = element.querySelector(`#event-start-time-1`).value;
    this._endTime = element.querySelector(`#event-end-time-1`).value;
    const descriptionText = element.querySelector(`.event__destination-description`);
    if (descriptionText) {
      descriptionText.textContent = this._description;
    }
  }
}

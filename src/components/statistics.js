import AbstractSmartComponent from './abstract-smart-component.js';

export default class Statistics extends AbstractSmartComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();

    this.rerender();
  }

  recoveryListeners() {

  }
}

const createStatisticsTemplate = () => {
  return `<h2>Stat</h2>`;

};

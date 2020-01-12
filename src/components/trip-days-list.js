import AbstractComponent from './abstract-component';

const createTripDaysListMarkUp = () => {
  return (
    `<ul class="trip-days"></ul>`
  );
};

export default class TripDaysListComponent extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createTripDaysListMarkUp();
  }
}

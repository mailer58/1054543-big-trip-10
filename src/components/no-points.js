import AbstractComponent from './abstract-component';

const createNoEventsMarkUp = () => {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>
`);
};

export default class NoEventsComponent extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createNoEventsMarkUp();
  }
}

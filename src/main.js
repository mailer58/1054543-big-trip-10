import {
  generatePointsOfRoute,
} from './mock/point-of-route.js';

import
{renderEventCards}
  from './components/cards-of-points-of-route.js';

import
SiteMenuComponent
  from './components/site-menu.js';

import
FilterComponent
  from './components/filter.js';

import NewEventFormComponent, {
  toggleListenersOfEventListOptions,
  removeNewEventForm,
  onEventListBtnClick,
  onEscKeyDownCloseForm,
  onSaveBtnOfNewEventFormClick,
  onCloseEditFormBtnClick,
} from './components/forms.js';

import {
  render,
  removePromptText,
  RenderPosition,
  computeTotalPrice,
  renderTripInfo
} from './utils.js';

import
TripSortMenuComponent
  from './components/trip-sort-menu.js';


const numberOfPointsOfRoute = 5;

const tripControlsHeader = document.querySelector(`.trip-controls > h2:nth-child(1)`);
const filterControlsHeader = document.querySelector(`.trip-controls > h2:nth-child(2)`);
const tripEventsHeader = document.querySelector(`.trip-events > h2:nth-child(1)`);
const newEventBtn = document.querySelector(`.trip-main__event-add-btn`);

export {
  pointsOfRoute
};

// handler:
const onNewEventBtnClick = () => {
  onCloseEditFormBtnClick();
  removePromptText();
  const tripSortMenu = document.getElementsByClassName(`trip-sort`)[0];
  // render newEventForm:
  const newEventForm = new NewEventFormComponent();
  if (!tripSortMenu) {
    render(tripEventsHeader, newEventForm.getElement(), RenderPosition.AFTER);
  } else {
    render(tripSortMenu, newEventForm.getElement(), RenderPosition.AFTER);
  }

  toggleListenersOfEventListOptions(`addListeners`);
  newEventBtn.toggleAttribute(`disabled`);
  const eventResetButton = document.getElementsByClassName(`event__reset-btn`)[0];
  const eventSaveButton = document.getElementsByClassName(`event__save-btn`)[0];
  eventSaveButton.classList.add(`new-event`);
  eventResetButton.addEventListener(`click`, removeNewEventForm);
  eventSaveButton.addEventListener(`click`, onSaveBtnOfNewEventFormClick);
  document.addEventListener(`keydown`, onEscKeyDownCloseForm);

  const eventListBtn = document.getElementsByClassName(`event__type-btn`)[0];
  eventListBtn.addEventListener(`click`, onEventListBtnClick);
  const eventTypeTextForm = document.getElementsByClassName(`event__type-output`)[0];
  eventTypeTextForm.textContent = `Flight to`;
};

// render components:
const siteMenu = new SiteMenuComponent();
render(tripControlsHeader, siteMenu.getElement(), RenderPosition.AFTER);
const filter = new FilterComponent();
render(filterControlsHeader, filter.getElement(), RenderPosition.AFTER);

newEventBtn.addEventListener(`click`, onNewEventBtnClick);

// show sorting menu:
const tripSortMenu = new TripSortMenuComponent();
render(tripEventsHeader, tripSortMenu.getElement(), RenderPosition.AFTER);

// generate an array of points of route:
const pointsOfRoute = generatePointsOfRoute(numberOfPointsOfRoute);

// show list of events:
renderEventCards(pointsOfRoute);

// add event listeners for roll-up buttons:
// toggleEventListenersForRollUpBtns(`addListeners`);

// compute and show total price:
computeTotalPrice(pointsOfRoute);

renderTripInfo(pointsOfRoute);


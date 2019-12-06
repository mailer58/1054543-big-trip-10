import {createSiteMenuTemplate} from './components/site-menu.js';
import {createFilterTemplate} from './components/filter.js';
import {createNewEventForm,
  toggleListenersOfEventListOptions,
  removeNewEventForm, onEventListBtnClick,
  onEscKeyDownCloseForm, onSaveButtonClick,
  onCloseEditFormBtnClick
} from './components/forms.js';
import {render, createPromptText} from './components/utils.js';

const tripControlsHeader = document.querySelector(`.trip-controls > h2:nth-child(1)`);
const filterControlsHeader = document.querySelector(`.trip-controls > h2:nth-child(2)`);
const tripEventsHeader = document.querySelector(`.trip-events > h2:nth-child(1)`);
const newEventBtn = document.querySelector(`.trip-main__event-add-btn`);


// remove the prompt:
const removePromptText = () => {
  const promptText = document.getElementsByClassName(`prompt`)[0];
  if (promptText) {
    promptText.remove();
  }
};

// handler:
const onNewEventBtnClick = () => {
  onCloseEditFormBtnClick();
  removePromptText();
  const events = document.getElementsByClassName(`trip-sort`)[0];
  // if there are no events add an first event:
  if (!events) {
    render(tripEventsHeader, createNewEventForm(), `afterend`);
  } else {
    render(events, createNewEventForm(), `afterend`);
  }
  toggleListenersOfEventListOptions(`addListeners`);
  newEventBtn.toggleAttribute(`disabled`);
  const eventResetButton = document.getElementsByClassName(`event__reset-btn`)[0];
  const eventSaveButton = document.getElementsByClassName(`event__save-btn`)[0];
  eventResetButton.addEventListener(`click`, removeNewEventForm);
  eventSaveButton.addEventListener(`click`, onSaveButtonClick);
  document.addEventListener(`keydown`, onEscKeyDownCloseForm);

  const eventListBtn = document.getElementsByClassName(`event__type-btn`)[0];
  eventListBtn.addEventListener(`click`, onEventListBtnClick);
  const eventTypeTextForm = document.getElementsByClassName(`event__type-output`)[0];
  eventTypeTextForm.textContent = `Flight to`;
};

// render components:
render(tripControlsHeader, createSiteMenuTemplate(), `afterend`);
render(filterControlsHeader, createFilterTemplate(), `afterend`);

createPromptText();

newEventBtn.addEventListener(`click`, onNewEventBtnClick);

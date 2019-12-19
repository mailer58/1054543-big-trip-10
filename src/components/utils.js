export {setUpperCase, render, createPromptText,
  removePromptText, transformEventTypeText};
const setUpperCase = (str) => {
  if (!str) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
};

// render html:
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// create the prompt:
const createPromptText = () => {
  const events = document.getElementsByClassName(`trip-sort`)[0];
  const promptText = document.getElementsByClassName(`prompt`)[0];
  if (!events && !promptText) {
    const prompt = document.createElement(`h2`);
    prompt.classList.add(`prompt`);
    prompt.textContent = `Click New Event to create your first point`;
    const tripEvents = document.querySelector(`.trip-events`);
    tripEvents.append(prompt);
  }
};

// remove the prompt:
const removePromptText = () => {
  const promptText = document.getElementsByClassName(`prompt`)[0];
  if (promptText) {
    promptText.remove();
  }
};

// get event type:
const transformEventTypeText = (eventText) => {
  switch (eventText) {
    case `Taxi`:
    case `Bus`:
    case `Train`:
    case `Ship`:
    case `Transport`:
    case `Drive`:
    case `Flight`:
      eventText = eventText + ` to`;
      break;
    case `Check-in`:
      eventText = `Check into`;
      break;
    case `Sightseeing`:
    case `Restaurant`:
      eventText = eventText + ` at`;
      break;
  }
  return eventText;
};

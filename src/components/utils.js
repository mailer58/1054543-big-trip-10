export {setUpperCase, render, createPromptText};
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

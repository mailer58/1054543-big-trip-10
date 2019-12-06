export {setUpperCase, render};
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

// render:
export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTER: `after`,
  APPEND: `append`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, component, place) => {
  switch (place) {
    case RenderPosition.PREPEND:
      container.prepend(component);
      break;
    case RenderPosition.APPEND:
      container.append(component);
      break;
    case RenderPosition.AFTER:
      container.after(component);
      break;
  }
};

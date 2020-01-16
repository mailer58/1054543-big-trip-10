import {
  generatePointsOfRoute,
} from './mock/point-of-route.js';

import TripDaysListComponent from './components/trip-days-list.js';

import TripController from './controllers/trip-controller.js';

import Points from './models/points.js';

import
SiteMenuComponent
  from './components/site-menu.js';

import
FilterComponent
  from './components/filter.js';

import {
  render,
  RenderPosition,
} from './utils/render.js';

const numberOfPointsOfRoute = 5;

const tripControlsHeader = document.querySelector(`.trip-controls > h2:nth-child(1)`);
const filterControlsHeader = document.querySelector(`.trip-controls > h2:nth-child(2)`);

export {
  pointsOfRoute
};

// render menu and filters:
const siteMenu = new SiteMenuComponent();
render(tripControlsHeader, siteMenu.getElement(), RenderPosition.AFTER);
const filter = new FilterComponent();
render(filterControlsHeader, filter.getElement(), RenderPosition.AFTER);


// generate an array of points of route:
const pointsOfRoute = generatePointsOfRoute(numberOfPointsOfRoute);
const pointsModel = new Points();
pointsModel.setPoints(pointsOfRoute);

// render events:
const tripDaysListComponent = new TripDaysListComponent();
const tripController = new TripController(tripDaysListComponent, pointsModel);
tripController.render();



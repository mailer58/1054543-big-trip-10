import API from './api.js';

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

const tripControlsHeader = document.querySelector(`.trip-controls > h2:nth-child(1)`);
const filterControlsHeader = document.querySelector(`.trip-controls > h2:nth-child(2)`);

const AUTHORIZATION = `Basic RVjB3wrqow5KNfZELpc`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip/`;

// render menu and filters:
const siteMenu = new SiteMenuComponent();
render(tripControlsHeader, siteMenu.getElement(), RenderPosition.AFTER);

const filter = new FilterComponent();
render(filterControlsHeader, filter.getElement(), RenderPosition.AFTER);

// create api:
const api = new API(END_POINT, AUTHORIZATION);

// create maps:
export const destinationsMap = new Map();
export const photosMap = new Map();
export const offersMap = new Map();

// create a model:
const pointsModel = new Points();

// create tripDaysListComponent:
const tripDaysListComponent = new TripDaysListComponent();

// get destinations from server:
const allDestinations = api.getDestinations();

// get offers from server:
const allOffers = api.getOffers();

// get points from server:
const allPoints = api.getPoints();

Promise.all([allDestinations, allOffers, allPoints])
  .then((data) => {
    const [destinations, offers, points] = data;

    destinations.forEach((item) => {
      destinationsMap.set(item.name, item.description);
      photosMap.set(item.name, item.pictures);
    });

    offers.forEach((item) => {
      offersMap.set(item.type, item.offers);
    });

    pointsModel.setPoints(points);

    // create tripController:
    const tripController = new TripController(tripDaysListComponent, filter, pointsModel, api);

    // render events:
    tripController.render();
  });

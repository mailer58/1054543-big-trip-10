import AbstractSmartComponent from './abstract-smart-component.js';

import moment from 'moment';

import {
  render,
  RenderPosition
} from '../utils/render.js';

import {
  FilterType
}
  from './../const.js';

import {
  transformEventTypeText,
  setCase,
} from './../utils/common.js';

import Chart from 'chart.js';

const MARGIN_LEFT = `170px`;

const allTransport = [
  `taxi`,
  `bus`,
  `train`,
  `ship`,
  `transport`,
  `drive`,
  `flight`
];

export default class Statistics extends AbstractSmartComponent {
  constructor(tripController) {
    super();
    this._pointsModel = tripController._pointsModel;
    this._noEventsComponent = tripController._noEventsComponent;
  }

  renderStats() {
    const eventsSection = document.querySelector(`.trip-events`);
    const points = this._pointsModel.getPoints();
    this.getElement().style.marginLeft = MARGIN_LEFT;

    if (this._pointsModel.getPoints().length > 0) {
      render(eventsSection, this.getElement(), RenderPosition.AFTER);

      Chart.defaults.global.defaultFontSize = 17;

      // create the chart of expenses:
      const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`).getContext(`2d`);

      const [
        events,
        expenses
      ] = computeExpenses(points);

      const expensesChart = new Chart(moneyCtx, {
        type: `horizontalBar`,

        data: {
          labels: events,
          datasets: [{
            label: `MONEY (€)`,
            data: expenses,
            backgroundColor: `#ff9000`,
            barPercentage: 0.8
          }]
        },

        options: {
          title: {
            display: true,
            text: `STATISTICS`,
            fontSize: 25,
          }
        }
      });

      // create the chart of transport:
      const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`).getContext(`2d`);

      const [
        transport,
        counters
      ] = computeTransport(points);

      const transportChart = new Chart(transportCtx, {
        type: `horizontalBar`,

        // The data for our dataset
        data: {
          labels: transport,
          datasets: [{
            label: `TRANSPORT (occasions)`,
            data: counters,
            backgroundColor: `#00f00b`,
            barPercentage: 0.8
          }]
        },
      });

      // create the chart of time:
      const timeCtx = this.getElement().querySelector(`.statistics__chart--time`).getContext(`2d`);

      const [
        eventsInfo,
        hours
      ] = computeTime(points);

      const timeChart = new Chart(timeCtx, {
        type: `horizontalBar`,

        // The data for our dataset
        data: {
          labels: eventsInfo,
          datasets: [{
            label: `TIME (hours)`,
            data: hours,
            backgroundColor: `#5e61f4`,
            barPercentage: 0.8
          }]
        },

        // Configuration options go here
        options: {}
      });

    } else { // no stats:
      // set type of message for noEventsComponent:
      this._noEventsComponent._activeFilterType = FilterType.NOEVENTS;

      // show message of noEventsComponent:
      render(eventsSection, this._noEventsComponent.getElement(), RenderPosition.AFTER);
    }
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();

    this.rerender();
  }

  recoveryListeners() {

  }
}

const createStatisticsTemplate = () => {
  return (`<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>
    
          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>
    
          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>
    
          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`);

};

const computeExpenses = (points) => {
  // get set of events:
  const typesOfEvents = new Set();
  points.forEach((point) => typesOfEvents.add(point.eventType));

  // count expenses for each event:
  const expenses = [];
  const initialValue = 0;

  typesOfEvents.forEach((eventType) => {

    // filter points by events:
    const filteredPoints = points.filter((point) => point.eventType === eventType);

    let sameTypeEventsTotalPrice = 0;

    // compute total price of events of same type:
    filteredPoints.forEach((filteredPoint) => {

      // price of event:
      const eventPrice = filteredPoint.price;

      // count price of all included offers:
      const offersPrice = filteredPoint.offers.reduce((accumulator, currentValue) => accumulator + currentValue.price, initialValue);

      // get total price of event:
      const totalEventPrice = eventPrice + offersPrice;

      // get total price of events of same type:
      sameTypeEventsTotalPrice = sameTypeEventsTotalPrice + totalEventPrice;
    });

    expenses.push(sameTypeEventsTotalPrice);

  });

  let events = Array.from(typesOfEvents);

  events = events.map((event) => setCase(event, `toUpperCase`));

  return [events, expenses];
};

const computeTransport = (points) => {
  const counters = [];
  const transportSet = new Set();

  // get set of used transport:
  allTransport.forEach((item) => {
    points.forEach((point) => {
      if (item === point.eventType) {
        transportSet.add(item);
      }
    });
  });

  let transport = Array.from(transportSet);

  // count using of transport:
  transport.forEach((item) => {
    let counter = 0;
    points.forEach((point) => {
      if (item === point.eventType) {
        counter++;
      }
    });
    counters.push(counter);
  });

  transport = transport.map((item) => setCase(item, `toUpperCase`));

  return [transport, counters];
};

const computeTime = (points) => {
  const eventsInfo = [];
  const hours = [];
  points.forEach((point) => {
    const startTime = moment(point.startTime);
    const endTime = moment(point.endTime);
    const diff = endTime.diff(startTime, `hours`);
    const eventInfo = transformEventTypeText(setCase(point.eventType, `toUpperCase`)) + ` ` + point.destination.name;
    eventsInfo.push(eventInfo);
    hours.push(diff);
  });

  return [eventsInfo, hours];
};

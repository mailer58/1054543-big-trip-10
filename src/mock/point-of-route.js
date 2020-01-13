import {
  transformEventTypeText
} from './../utils/common.js';

export {
  generatePointsOfRoute,
  DESTINATIONS,
};

const events = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`,
  `Check-in`,
  `Sightseeing`,
  `Restaurant`
];

const RANDOM_ARR_LENGTHS = {
  min: 1,
  max: 3
};

const DESTINATIONS = [
  `Amsterdam`,
  `Geneva`,
  `Chamonix`,
  `Saint Petersburg`
];

const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;
const descriptionSplit = DESCRIPTION.split(`.`);

const getRandomItemFromArray = (arr) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

export const descriptionsMap = {
  'Chamonix': `Chamonix is a winter sports resort town. As the highest European mountain west of Russia,[11] Mont Blanc attracts mountain climbers.`,
  'Saint Petersburg': `Saint Petersburg is situated on the Neva River, at the head of the Gulf of Finland on the Baltic Sea.`,
  'Amsterdam': `Amsterdam is the capital and most populous city of the Netherlands`,
  'Geneva': `Geneva is the second-most populous city in Switzerland (after Zürich) and the most populous city of Romandy, the French-speaking part of Switzerland.`,

};

export const offersMap = {
  'Bus': [{
    type: `Add:`,
    name: `luggage`,
    price: 12,
    isChecked: false,
  }],
  'Train': [{
    type: `Add:`,
    name: `luggage`,
    price: 12,
    isChecked: false,
  },
  {
    type: `Add:`,
    name: `meal`,
    price: 5,
    isChecked: false,
  }, {
    type: `Switch to:`,
    name: `comfort class`,
    price: 100,
    isChecked: false,
  }],
  'Ship': [{
    type: `Add:`,
    name: `luggage`,
    price: 20,
    isChecked: false,
  },
  {
    type: `Add:`,
    name: `meal`,
    price: 15,
    isChecked: false,
  }, {
    type: `Switch to:`,
    name: `comfort class`,
    price: 200,
    isChecked: false,
  }],
  'Transport': [{
    type: `Add:`,
    name: `luggage`,
    price: 20,
    isChecked: false,
  },
  {
    type: `Add:`,
    name: `meal`,
    price: 12,
    isChecked: false,
  }, {
    type: `Switch to:`,
    name: `comfort class`,
    price: 50,
    isChecked: false,
  }],
  'Flight': [{
    type: `Add:`,
    name: `luggage`,
    price: 500,
    isChecked: false,
  },
  {
    type: `Add:`,
    name: `meal`,
    price: 30,
    isChecked: false,
  }, {
    type: `Switch to:`,
    name: `comfort class`,
    price: 300,
    isChecked: false,
  }],
};

const generatePointOfRoute = () => {
  const destination = getRandomItemFromArray(DESTINATIONS);
  const eventType = getRandomItemFromArray(events);
  let offersMin = [];
  switch (eventType) {
    case `Bus`:
      offersMin.push({
        type: `Add:`,
        name: `luggage`,
        price: 12,
        isChecked: true,
      });
      break;
    case `Train`:
      offersMin.push({
        type: `Add:`,
        name: `luggage`,
        price: 15,
        isChecked: true,
      },
      {
        type: `Add:`,
        name: `meal`,
        price: 5,
        isChecked: true,
      }, {
        type: `Switch to:`,
        name: `comfort class`,
        price: 100,
        isChecked: true,
      });
      break;
    case `Ship`:
      offersMin.push({
        type: `Add:`,
        name: `luggage`,
        price: 20,
        isChecked: true,
      },
      {
        type: `Add:`,
        name: `meal`,
        price: 15,
        isChecked: true,
      }, {
        type: `Switch to:`,
        name: `comfort class`,
        price: 200,
        isChecked: true,
      });
      break;
    case `Transport`:
      offersMin.push({
        type: `Add:`,
        name: `luggage`,
        price: 20,
        isChecked: true,
      },
      {
        type: `Add:`,
        name: `meal`,
        price: 12,
        isChecked: true,
      }, {
        type: `Switch to:`,
        name: `comfort class`,
        price: 50,
        isChecked: true,
      });
      break;
    case `Flight`:
      offersMin.push({
        type: `Add:`,
        name: `luggage`,
        price: 500,
        isChecked: true,
      },
      {
        type: `Add:`,
        name: `meal`,
        price: 30,
        isChecked: true,
      }, {
        type: `Switch to:`,
        name: `comfort class`,
        price: 300,
        isChecked: true,
      });
      break;
    default:
      offersMin = [];
      break;
  }

  // generate random date:
  const startTime = new Date(
      2019,
      getRandomInteger(10, 11),
      getRandomInteger(1, 5),
      0,
      0
  );
  startTime.setHours(getRandomInteger(0, 23), getRandomInteger(0, 59));
  const endTime = new Date();
  endTime.setFullYear(startTime.getFullYear());
  endTime.setMonth(startTime.getMonth());
  endTime.setDate(startTime.getDate() + getRandomInteger(0, 1));
  endTime.setHours(getRandomInteger(0, 23), getRandomInteger(0, 59));
  if (endTime.getDate() === startTime.getDate() &&
    endTime.getHours() < startTime.getHours()) {
    endTime.setHours(startTime.getHours() + getRandomInteger(1, 3));
  }

  const randomPhoto = `http://picsum.photos/300/150?r=\${randomPhoto}`;

  return {
    eventType: transformEventTypeText(eventType),
    destination,
    eventIcon: eventType,
    startTime,
    endTime,
    price: getRandomInteger(1, 1000),
    photo: randomPhoto,
    description: getRandomTextArray(),
    offers: offersMin,
    days: ``,
    favorite: false,
  };
};

const generatePointsOfRoute = (count) => {
  return new Array(count)
    .fill(``)
    .map(generatePointOfRoute);
};

const getRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomTextArray = () => {
  let randomTextArray = [];
  // get a random length of array:
  const randomArrayLength = getRandomInteger(RANDOM_ARR_LENGTHS.min, RANDOM_ARR_LENGTHS.max);
  // get a copy of descriptionSplit:
  const descriptionSplitCopy = descriptionSplit.slice();
  randomTextArray.length = randomArrayLength;
  // get a random array from descriptionSplit:
  for (let i = 0; i < randomTextArray.length; i++) {
    const randomIndex = Math.floor(Math.random() * descriptionSplitCopy.length);
    const randomPhrase = descriptionSplitCopy[randomIndex];
    randomTextArray[i] = randomPhrase;
    descriptionSplitCopy.splice(randomIndex, 1);
  }
  randomTextArray = randomTextArray.join(`.`) + `.`;
  return randomTextArray;
};

import {
  transformEventTypeText
} from './../utils.js';

export {
  generatePointsOfRoute,
  DESTINATIONS,
};

const offerTypes = [`Add`, `Switch to`, `Add`, `Choose`, `Travel by`];

const offerTypesNamesMap = {
  'Add': [`luggage`, `meal`],
  'Switch to': `comfort class`,
  'Choose': `seats`,
  'Travel by': `train`,
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

const DESTINATIONS = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`];
const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;
const descriptionSplit = DESCRIPTION.split(`.`);

const MAX_OFFER_PRICE = 100;

const OffersNumber = {
  max: 2,
  min: 0
};

const getRandomItemFromArray = (arr) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

const generateOffers = () => {
  const offers = [];
  // copy offerTypesNamesMap object:
  const offerTypesNamesMapCopy = Object.assign({}, offerTypesNamesMap);
  // generate offers:
  let j = 0;
  for (const i of offerTypes) {
    let offerTypesNamesMapCopyValue = offerTypesNamesMapCopy[i];
    if (i === `Add`) {
      if (j <= 1) {
        offerTypesNamesMapCopyValue = offerTypesNamesMapCopy[i][j];
        j++;
      }
    }
    offers.push({
      type: i,
      name: offerTypesNamesMapCopyValue,
      price: getRandomInteger(1, MAX_OFFER_PRICE),
      isChecked: true,
    });
  }
  return offers;
};

const generatePointOfRoute = () => {
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
  // generate random event:
  const eventText = getRandomItemFromArray(events);
  // get array of offers:
  const offers = generateOffers();
  const offersCopy = offers.slice();
  const offersMin = [];
  let randomPhoto = getRandomInteger(1, 1000);
  randomPhoto = `http://picsum.photos/300/150?r=\${randomPhoto}`;
  // get random offers:
  for (let i = 0; i < getRandomInteger(OffersNumber.min, OffersNumber.max); i++) {
    const randomIndex = getRandomInteger(0, offersCopy.length - 1);
    offersMin.push(offersCopy[randomIndex]);
    offersCopy.splice(randomIndex, 1);
  }

  return {
    eventType: transformEventTypeText(eventText),
    destination: getRandomItemFromArray(DESTINATIONS),
    eventIcon: eventText,
    startTime,
    endTime,
    price: getRandomInteger(1, 1000),
    photo: randomPhoto,
    description: getRandomTextArray(),
    offers: offersMin,
    days: ``
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



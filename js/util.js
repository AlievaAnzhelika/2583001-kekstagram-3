const ALERT_SHOW_TIME = 5000;
const NUMBER_RANDOM_PHOTOS = 10;
const DEBOUNCE_DELAY = 500;

const getRandomInteger = (firstNumber, secondNumber) => {
  const lower = Math.ceil(Math.min(firstNumber, secondNumber));
  const upper = Math.floor(Math.max(firstNumber, secondNumber));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const isEscapeKey = (evt) => evt.key === 'Escape';

const debounce = (callback, timeoutDelay = DEBOUNCE_DELAY) => {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

const getRandomPhotos = (photos) => {
  const availablePhotos = photos.slice();
  const randomPhotos = [];

  for (let i = 0; i < NUMBER_RANDOM_PHOTOS && availablePhotos.length > 0; i++) {
    const randomIndex = getRandomInteger(0, availablePhotos.length - 1);
    const [randomPhoto] = availablePhotos.splice(randomIndex, 1);

    randomPhotos.push(randomPhoto);
  }

  return randomPhotos;
};

export {isEscapeKey, ALERT_SHOW_TIME, debounce, getRandomPhotos};

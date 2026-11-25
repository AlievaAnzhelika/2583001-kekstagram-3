import {createDataPicture, comparePhotos} from './miniatures.js';
import {setUserFormSubmit, onFormSubmitSuccess, onFormSubmitFail} from './form.js';
import {getData} from './api.js';
import {ALERT_SHOW_TIME, getRandomInteger, debounce} from './util.js';

const NUMBER_RANDOM_PHOTOS = 10;

const pictureContainer = document.querySelector('.pictures');
const imageFilters = document.querySelector('.img-filters');

const filterDefaultButton = document.querySelector('#filter-default');
const filterRandomButton = document.querySelector('#filter-random');
const filterDiscussedButton = document.querySelector('#filter-discussed');

const setActiveFilter = (button) => {
  const activeButton = imageFilters.querySelector('.img-filters__button--active');

  activeButton.classList.remove('img-filters__button--active');

  button.classList.add('img-filters__button--active');
};

getData()
  .then((photos) => {
    createDataPicture(pictureContainer, photos);

    const debounceResult = debounce((filteredPhotos) => {
      createDataPicture(pictureContainer, filteredPhotos);
    });

    imageFilters.classList.remove('img-filters--inactive');

    filterDefaultButton.addEventListener('click', () => {
      setActiveFilter(filterDefaultButton);
      debounceResult(photos);
    });

    filterRandomButton.addEventListener('click', () => {
      setActiveFilter(filterRandomButton);

      const availablePhotos = photos.slice();
      const randomPhotos = [];

      for (let i = 0; i < NUMBER_RANDOM_PHOTOS && availablePhotos.length > 0; i++) {
        const randomIndex = getRandomInteger(0, availablePhotos.length - 1);
        const deletePhotosArray = availablePhotos.splice(randomIndex, 1);
        randomPhotos.push(deletePhotosArray[0]);
      }

      debounceResult(randomPhotos);
    });

    filterDiscussedButton.addEventListener('click', () => {
      setActiveFilter(filterDiscussedButton);

      debounceResult(photos.slice().sort(comparePhotos));
    });
  })
  .catch(() => {
    const dataError = document.querySelector('#data-error').content.querySelector('.data-error').cloneNode(true);

    document.body.append(dataError);

    setTimeout(() => {
      dataError.remove();
    }, ALERT_SHOW_TIME);
  });

setUserFormSubmit(onFormSubmitSuccess, onFormSubmitFail);

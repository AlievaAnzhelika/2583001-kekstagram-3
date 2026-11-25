import {renderPhotos, comparePhotos} from './miniatures.js';
import {setUserFormSubmit, onFormSubmitSuccess, onFormSubmitFail} from './form.js';
import {getData} from './api.js';
import {ALERT_SHOW_TIME, debounce, getRandomPhotos} from './util.js';

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
    renderPhotos(pictureContainer, photos);

    const renderFilteredPhotos = debounce((filteredPhotos) => {
      renderPhotos(pictureContainer, filteredPhotos);
    });

    imageFilters.classList.remove('img-filters--inactive');

    filterDefaultButton.addEventListener('click', () => {
      setActiveFilter(filterDefaultButton);
      renderFilteredPhotos(photos);
    });

    filterRandomButton.addEventListener('click', () => {
      setActiveFilter(filterRandomButton);
      renderFilteredPhotos(getRandomPhotos(photos));
    });

    filterDiscussedButton.addEventListener('click', () => {
      setActiveFilter(filterDiscussedButton);

      renderFilteredPhotos(photos.slice().sort(comparePhotos));
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

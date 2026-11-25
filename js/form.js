import {sendData} from './api.js';
import {isEscapeKey} from './util.js';

const MAX_HASHTAGS_COUNT = 5;
const MAX_DESCRIPTION_COUNT = 140;

const HASHTAG_PATTERN = /^#[a-zа-яё0-9]{1,19}$/i;

const SCALE_CONTROL_MIN = 25;
const SCALE_CONTROL_MAX = 100;
const SCALE_CONTROL_STEP = 25;

const EFFECT_SETTINGS = {
  chrome: {
    min: 0,
    max: 1,
    step: 0.1
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1
  }
};

const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Публикую...',
};

const uploadForm = document.querySelector('.img-upload__form');
const fileUploadControl = uploadForm.querySelector('.img-upload__input');
const previewWindow = uploadForm.querySelector('.img-upload__overlay');
const closePreviewButton = uploadForm.querySelector('.img-upload__cancel');

const textHashtags = uploadForm.querySelector('.text__hashtags');
const textDescription = uploadForm.querySelector('.text__description');

const scaleControlSmaller = uploadForm.querySelector('.scale__control--smaller');
const scaleControlBigger = uploadForm.querySelector('.scale__control--bigger');
const scaleControlValue = uploadForm.querySelector('.scale__control--value');
const previewImage = uploadForm.querySelector('.img-upload__preview img');

const effectLevelValue = uploadForm.querySelector('.effect-level__value');
const effectLevelContainer = uploadForm.querySelector('.img-upload__effect-level');
const effectSlider = uploadForm.querySelector('.effect-level__slider');
const effectList = uploadForm.querySelector('.effects__list');

const submitButton = uploadForm.querySelector('.img-upload__submit');
const previewPhotoEffects = document.querySelectorAll('.effects__preview');

let currentObjectUrl;


const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper'
});

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = SubmitButtonText.SENDING;
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = SubmitButtonText.IDLE;
};

const onPreviewClick = () => {
  previewWindow.classList.add('hidden');
  document.body.classList.remove('modal-open');

  uploadForm.reset();
  resetEffect();
  pristine.reset();
  previewImage.style.transform = '';

  previewImage.src = 'img/upload-default-image.jpg';

  previewPhotoEffects.forEach((previewPhotoEffect) => {
    previewPhotoEffect.style.backgroundImage = '';
  });

  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }

  document.removeEventListener('keydown', onDocumentKeydown);
};

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    onPreviewClick();
  }
}

const onPreviewChange = (evt) => {
  const file = evt.target.files[0];

  if (!file) {
    return;
  }

  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(`.${it}`));

  if (!matches) {
    fileUploadControl.value = '';
    return;
  }

  currentObjectUrl = URL.createObjectURL(file);

  previewPhotoEffects.forEach((previewPhotoEffect) => {
    previewPhotoEffect.style.backgroundImage = `url("${currentObjectUrl}")`;
  });

  previewWindow.classList.remove('hidden');
  document.body.classList.add('modal-open');

  previewImage.src = currentObjectUrl;

  effectLevelContainer.classList.add('hidden');
  previewImage.style.filter = '';

  document.addEventListener('keydown', onDocumentKeydown);
};

closePreviewButton.addEventListener('click', onPreviewClick);
fileUploadControl.addEventListener('change', onPreviewChange);

const getHashtags = (value) => {
  const trimmedValue = value.trim();

  if (trimmedValue === '') {
    return [];
  }

  const hashtags = trimmedValue.split(/\s+/);
  return hashtags;
};

const validateHashtagCount = (value) => {
  const hashtags = getHashtags(value);
  return hashtags.length <= MAX_HASHTAGS_COUNT;
};

const validateHashtagText = (value) => {
  const hashtags = getHashtags(value);
  return hashtags.every((elem) => HASHTAG_PATTERN.test(elem));
};

const validateHashtagRepeat = (value) => {
  const hashtags = getHashtags(value);
  const hashtagsLowerCase = hashtags.map((tag) => tag.toLowerCase());
  return new Set(hashtagsLowerCase).size === hashtags.length;
};

const validateTextDescription = (value) => value.length <= MAX_DESCRIPTION_COUNT;

pristine.addValidator(
  textHashtags,
  validateHashtagText,
  'Введён невалидный хэштег'
);

pristine.addValidator(
  textHashtags,
  validateHashtagCount,
  'Можно указать не больше 5 хэштегов'
);

pristine.addValidator(
  textHashtags,
  validateHashtagRepeat,
  'Хэштеги не должны повторяться'
);

pristine.addValidator(
  textDescription,
  validateTextDescription,
  'Длина комментария не может составлять больше 140 символов'
);

const setUserFormSubmit = (onSuccess, onFail) => {
  uploadForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(new FormData(evt.target))
        .then(onSuccess)
        .catch(() => {
          onFail();
        })
        .finally(unblockSubmitButton);
    }
  });
};

const onFormSubmitSuccess = () => {
  onPreviewClick();

  const successWindow = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
  const successButton = successWindow.querySelector('.success__button');

  const closeSuccessWindow = () => {
    successWindow.remove();
    document.removeEventListener('keydown', onSuccessKeydown);
  };

  function onSuccessKeydown(evt) {
    if (isEscapeKey(evt)) {
      closeSuccessWindow();
    }
  }

  successButton.addEventListener('click', closeSuccessWindow);

  successWindow.addEventListener('click', (evt) => {
    if (evt.target === successWindow) {
      closeSuccessWindow();
    }
  });

  document.body.appendChild(successWindow);
  document.addEventListener('keydown', onSuccessKeydown);
};

const onFormSubmitFail = () => {
  const errorWindow = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
  const errorButton = errorWindow.querySelector('.error__button');

  const closeErrorWindow = () => {
    document.removeEventListener('keydown', onErrorKeydown, true);
    errorWindow.remove();
  };

  function onErrorKeydown(evt) {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
      closeErrorWindow();
    }
  }

  errorButton.addEventListener('click', closeErrorWindow);

  errorWindow.addEventListener('click', (evt) => {
    if (evt.target === errorWindow) {
      closeErrorWindow();
    }
  });

  document.body.append(errorWindow);
  document.addEventListener('keydown', onErrorKeydown, true);
};

const onTextFieldKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

textHashtags.addEventListener('keydown', onTextFieldKeydown);
textDescription.addEventListener('keydown', onTextFieldKeydown);

scaleControlSmaller.addEventListener('click', () => {
  let newScaleValue = parseInt(scaleControlValue.value, 10);

  if (newScaleValue > SCALE_CONTROL_MIN) {
    newScaleValue -= SCALE_CONTROL_STEP;
  }

  scaleControlValue.value = `${newScaleValue}%`;
  previewImage.style.transform = `scale(${newScaleValue / 100})`;
});

scaleControlBigger.addEventListener('click', () => {
  let newScaleValue = parseInt(scaleControlValue.value, 10);

  if (newScaleValue < SCALE_CONTROL_MAX) {
    newScaleValue += SCALE_CONTROL_STEP;
  }

  scaleControlValue.value = `${newScaleValue}%`;
  previewImage.style.transform = `scale(${newScaleValue / 100})`;
});

noUiSlider.create(effectSlider, {
  range: {
    min: 0,
    max: 1,
  },
  start: 1,
  step: 0.1,
  connect: 'lower',
});

effectSlider.noUiSlider.on('update', () => {
  effectLevelValue.value = Number(effectSlider.noUiSlider.get());
  const effect = uploadForm.querySelector('input[name="effect"]:checked');
  switch (effect.value) {
    case 'none':
      previewImage.style.filter = '';
      break;
    case 'chrome':
      previewImage.style.filter = `grayscale(${effectLevelValue.value})`;
      break;
    case 'sepia':
      previewImage.style.filter = `sepia(${effectLevelValue.value})`;
      break;
    case 'marvin':
      previewImage.style.filter = `invert(${effectLevelValue.value}%)`;
      break;
    case 'phobos':
      previewImage.style.filter = `blur(${effectLevelValue.value}px)`;
      break;
    case 'heat':
      previewImage.style.filter = `brightness(${effectLevelValue.value})`;
      break;
  }
});

function resetEffect() {
  effectSlider.noUiSlider.updateOptions({
    range: {
      min: 0,
      max: 1,
    },
    start: 1,
    step: 0.1,
  });

  effectLevelContainer.classList.add('hidden');
  previewImage.style.filter = '';
}

effectList.addEventListener('change', (evt) => {
  const effect = evt.target.value;

  if (effect === 'none') {
    resetEffect();
    return;
  }

  const settings = EFFECT_SETTINGS[effect];
  effectLevelContainer.classList.remove('hidden');

  effectSlider.noUiSlider.updateOptions({
    range: {
      min: settings.min,
      max: settings.max,
    },
    start: settings.max,
    step: settings.step,
  });
});

export {setUserFormSubmit, onFormSubmitSuccess, onFormSubmitFail};

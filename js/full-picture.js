import {isEscapeKey} from './util.js';

const IMG_COMMENT_SIZE = 35;

const bigPicture = document.querySelector('.big-picture');
const commentsList = bigPicture.querySelector('.social__comments');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const socialCommentCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');

const createImgComment = (comment) => {
  const newImgComment = document.createElement('img');
  newImgComment.classList.add('social__picture');

  newImgComment.src = comment.avatar;
  newImgComment.alt = comment.name;
  newImgComment.width = IMG_COMMENT_SIZE;
  newImgComment.height = IMG_COMMENT_SIZE;

  return newImgComment;
};

const createParagraphComment = (comment) => {
  const newTextComment = document.createElement('p');
  newTextComment.classList.add('social__text');

  newTextComment.textContent = comment.message;

  return newTextComment;
};

const createComments = (photo) => {
  commentsList.replaceChildren();

  photo.comments.forEach((comment) => {
    const newComment = document.createElement('li');
    newComment.classList.add('social__comment');

    const newImgComment = createImgComment(comment);
    const newParagraphComment = createParagraphComment(comment);

    newComment.append(newImgComment, newParagraphComment);
    commentsList.append(newComment);
  });
};

const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
};

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
}

const openBigPicture = (photo) => {
  bigPicture.querySelector('.big-picture__img img').src = photo.url;
  bigPicture.querySelector('.big-picture__img img').alt = photo.description;
  bigPicture.querySelector('.social__caption').textContent = photo.description;
  bigPicture.querySelector('.likes-count').textContent = photo.likes;
  bigPicture.querySelector('.social__comment-total-count').textContent = photo.comments.length;
  bigPicture.querySelector('.social__comment-shown-count').textContent = photo.comments.length;

  createComments(photo);

  socialCommentCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
};

closeButton.addEventListener('click', closeBigPicture);

export {openBigPicture};

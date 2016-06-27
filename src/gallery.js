'use strict';
var galleryBlock = document.querySelector('.overlay-gallery');
var closeBtn = document.querySelector('.overlay-gallery-close');
var picturesContainer = document.querySelector('.overlay-gallery-preview');
var images = document.querySelectorAll('.photogallery-image > img');
var currentNumber = document.querySelector('.preview-number-current');
var totalNumber = document.querySelector('.preview-number-total');
var prevLinkNode = document.querySelector('.overlay-gallery-control-left');
var nextLinkNode = document.querySelector('.overlay-gallery-control-right');
var photoGallery = document.querySelector('.photogallery');

//* @param {Array.<Object>}
var galleryPictures = [];

/** @constant {number} */
var KEY_CODE_ESC = 27;

var currentIndex;

var img = new Image();

photoGallery.addEventListener('click', onContainerClick);

/**
 * @param {Array.<Object>} evt
 */
function onContainerClick(evt) {
  if (evt.target.dataset.number !== void 0) {
    showGallery(Number(evt.target.dataset.number));
  }
}

/**
 * @param {number} pictureNumber
 */
function showGallery(pictureNumber) {

  nextLinkNode.addEventListener('click', showNextPic);
  prevLinkNode.addEventListener('click', showPrevPic);

  closeBtn.addEventListener('click', hideGallery);
  document.addEventListener('keydown', closeGalleryEsc);

  galleryBlock.classList.remove('invisible');

  showPicture(pictureNumber);
}

function showNextPic() {
  showPicture(++currentIndex);
}

function showPrevPic() {
  showPicture(--currentIndex);
}

/**
 * @param {number} pictureNumber
 */
function showPicture(pictureNumber) {
  currentIndex = pictureNumber;

  if (currentIndex > galleryPictures.length - 1) {
    currentIndex = 0;
  }

  if (currentIndex < 0) {
    currentIndex = galleryPictures.length - 1;
  }
  img.setAttribute('src', galleryPictures[currentIndex]);
  picturesContainer.appendChild(img);
  currentNumber.textContent = currentIndex + 1;
  totalNumber.textContent = images.length;
}

/**
 * @param {Array.<number>} nodeList
 */
function collectPictures(nodeList) {
  var i;
  for (i = 0; i < nodeList.length; i++) {
    galleryPictures.push(nodeList[i].getAttribute('src'));

    nodeList[i].dataset.number = i;
  }
}

function closeGalleryEsc(evt) {
  if (evt.which === KEY_CODE_ESC) {
    hideGallery();
  }
}

function hideGallery() {
  nextLinkNode.removeEventListener('click', showNextPic);

  prevLinkNode.removeEventListener('click', showPrevPic);

  closeBtn.removeEventListener('click', hideGallery);

  document.removeEventListener('keydown', closeGalleryEsc);

  galleryBlock.classList.add('invisible');
}

collectPictures(images);

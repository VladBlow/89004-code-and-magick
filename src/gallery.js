'use strict';
var galleryBlock = document.querySelector('.overlay-gallery');
var closeBtn = document.querySelector('.overlay-gallery-close');
var picturesContainer = document.querySelector('.overlay-gallery-preview');
var images = document.querySelectorAll('.photogallery-image > img');
var currentNumber = document.querySelector('.preview-number-current');
var totalNumber = document.querySelector('.preview-number-total');
var prevLinkNode = document.querySelector('.overlay-gallery-control-left');
var nextLinkNode = document.querySelector('.overlay-gallery-control-right');

//* @param {Array.<Object>}
var galleryPictures = [];

/** @constant {number} */
var KEY_CODE_ESC = 27;

var currentIndex;

var img = new Image();

var Gallery = function() {
  this.onContainerClick = this.onContainerClick.bind(this);
  this.showGallery = this.showGallery.bind(this);
  this.showNextPic = this.showNextPic.bind(this);
  this.showPrevPic = this.showPrevPic.bind(this);
  this.showPicture = this.showPicture.bind(this);
  this.collectPictures = this.collectPictures.bind(this);
  this.closeGalleryEsc = this.closeGalleryEsc.bind(this);
  this.hideGallery = this.hideGallery.bind(this);
  this.changeHash = this.changeHash.bind(this);
  this.onHashChange = this.onHashChange.bind(this);

  this.element = document.querySelector('.overlay-gallery');

  this.collectPictures(images);

  this.onHashChange();

  window.addEventListener('hashchange', this.onHashChange);
};

/**
 * @param {Array.<Object>} evt
 */
Gallery.prototype.onContainerClick = function(evt) {
  evt.preventDefault();
  if (evt.target.dataset.number !== void 0) {
    // self.showGallery(Number(evt.target.dataset.number));
    console.log(this);
    this.changeHash(evt.target.getAttribute('src'));

  }
};

/**
 * @param {number} pictureNumber
 */
Gallery.prototype.showGallery = function(pictureNumber) {

  nextLinkNode.addEventListener('click', this.showNextPic);
  prevLinkNode.addEventListener('click', this.showPrevPic);

  closeBtn.addEventListener('click', this.hideGallery);
  document.addEventListener('keydown', this.closeGalleryEsc);

  galleryBlock.classList.remove('invisible');

  this.showPicture(pictureNumber);
};

Gallery.prototype.showNextPic = function() {
  var nextSrc = galleryPictures[++currentIndex] || galleryPictures[0];
  this.showGallery(currentIndex++);
  this.changeHash(nextSrc);
};

Gallery.prototype.showPrevPic = function() {
  var nextSrc = galleryPictures[--currentIndex] || galleryPictures[galleryPictures.length - 1];
  this.showGallery(currentIndex--);
  this.changeHash(nextSrc);
};

Gallery.prototype.showPicture = function(pictureNumber) {
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
  this.changeHash(galleryPictures[currentIndex]);
};

Gallery.prototype.collectPictures = function(nodeList) {
  var i;
  for (i = 0; i < nodeList.length; i++) {
    galleryPictures.push(nodeList[i].getAttribute('src'));

    nodeList[i].dataset.number = i;
  }
};

Gallery.prototype.closeGalleryEsc = function(evt) {
  if (evt.which === KEY_CODE_ESC) {
    this.hideGallery();
  }
};

Gallery.prototype.hideGallery = function() {
  nextLinkNode.removeEventListener('click', this.showNextPic);

  prevLinkNode.removeEventListener('click', this.showPrevPic);

  closeBtn.removeEventListener('click', this.hideGallery);

  document.removeEventListener('keydown', this.closeGalleryEsc);

  galleryBlock.classList.add('invisible');

  this.changeHash();
};

Gallery.prototype.changeHash = function(photoSrc) {
  if (photoSrc) {
    window.location.hash = '#photo/' + photoSrc;
  } else {
    window.location.hash = '';
  }
};

Gallery.prototype.hashRegMatch = /#photo\/(\S+)/;

Gallery.prototype.onHashChange = function() {
  var hashValidate = location.hash.match(this.hashRegMatch);
  if (hashValidate) {
    var pictureIndex = galleryPictures.indexOf(hashValidate[1]);
    this.showGallery(pictureIndex);
  }
};

module.exports = new Gallery();

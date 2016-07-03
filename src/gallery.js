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
  var self = this;

  this.element = document.querySelector('.overlay-gallery');

  /**
   * @param {Array.<Object>} evt
   */
  this.onContainerClick = function(evt) {
    evt.preventDefault();
    if (evt.target.dataset.number !== void 0) {
      // self.showGallery(Number(evt.target.dataset.number));
      self.changeHash(evt.target.getAttribute('src'));
    }
  };

  /**
   * @param {number} pictureNumber
   */
  this.showGallery = function(pictureNumber) {

    nextLinkNode.addEventListener('click', this.showNextPic);
    prevLinkNode.addEventListener('click', this.showPrevPic);

    closeBtn.addEventListener('click', this.hideGallery);
    document.addEventListener('keydown', this.closeGalleryEsc);

    galleryBlock.classList.remove('invisible');

    self.showPicture(pictureNumber);
  };

  this.showNextPic = function() {
    var nextSrc = galleryPictures[++currentIndex] || galleryPictures[0];
    self.showGallery(currentIndex++);
    self.changeUrl(nextSrc);
  };

  this.showPrevPic = function() {
    var nextSrc = galleryPictures[--currentIndex] || galleryPictures[galleryPictures.length - 1];
    self.showGallery(currentIndex--);
    self.changeUrl(nextSrc);
  };

  this.showPicture = function(pictureNumber) {
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
    self.setHash(galleryPictures[currentIndex]);
  };

  this.collectPictures = function(nodeList) {
    var i;
    for (i = 0; i < nodeList.length; i++) {
      galleryPictures.push(nodeList[i].getAttribute('src'));

      nodeList[i].dataset.number = i;
    }
  };

  this.closeGalleryEsc = function(evt) {
    if (evt.which === KEY_CODE_ESC) {
      self.hideGallery();
    }
  };

  this.hideGallery = function() {
    nextLinkNode.removeEventListener('click', this.showNextPic);

    prevLinkNode.removeEventListener('click', this.showPrevPic);

    closeBtn.removeEventListener('click', this.hideGallery);

    document.removeEventListener('keydown', this.closeGalleryEsc);

    galleryBlock.classList.add('invisible');

    self.changeHash();
  };

  this.changeHash = function(photoSrc) {
    if (photoSrc) {
      window.location.hash = '#photo/' + photoSrc;
    } else {
      window.location.hash = '';
    }
  };

  this.hashRegMatch = /#photo\/(\S+)/;

  self.collectPictures(images);

  this.onHashChange = function() {
    var hashValidate = location.hash.match(self.hashRegMatch);
    if (hashValidate) {
      var pictureIndex = galleryPictures.indexOf(hashValidate[1]);
      self.showGallery(pictureIndex);
    }
  };

  this.onHashChange();

  window.addEventListener('hashchange', this.onHashChange);
};

module.exports = new Gallery();

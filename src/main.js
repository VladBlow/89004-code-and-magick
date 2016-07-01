'use strict';

require('./form');
require('./game');

var gallery = require('./gallery');
var filtered = require('./filter');
var filtersType = require('./filters-type');
var load = require('./load');
var Review = require('./review');


var photoGallery = document.querySelector('.photogallery');
var headerClouds = document.querySelector('.header-clouds');
var blockDemo = document.querySelector('.demo');

var reviewFilter = document.querySelector('.reviews-filter');
reviewFilter.classList.add('invisible');

var reviewList = document.querySelector('.reviews-list');
var moveToX = 0;
var reviews = [];

/** @type {Array.<Object>} */
var filteredReviews = [];

/** @constant {number} */
var PAGE_SIZE = 3;

/** @type {number} */
var pageNumber = 1;

var DEFAULT_FILTER = localStorage.getItem('lastFilter') || filtersType.ALL;

var setStartFilter = localStorage.getItem('lastFilter') || DEFAULT_FILTER;

/** @param {Array.<Object>} reviews */
var renderReviews = function(rev, page, replace) {

  if (replace) {
    reviewList.innerHTML = '';
    // filteredReviews.forEach(function(review) {
    //   review.remove();
    // });
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  var container = document.createDocumentFragment();

  rev.slice(from, to).forEach(function(data) {
    filteredReviews.push(new Review(data, container));
    reviewFilter.classList.remove('invisible');
  });

  reviewList.appendChild(container);
};

/** @param {string} filter */
var setFilterEnabled = function(filter) {
  var filterSwitches = reviewFilter.elements['reviews'];
  if (filterSwitches.value !== filtersType) {
    filterSwitches.value = filtersType;
  }

  filteredReviews = filtered(reviews, filter);

  pageNumber = 0;
  renderReviews(filteredReviews, pageNumber, true);
};

var setFiltrationEnabled = function() {
  reviewFilter.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('reviews-filter-item')) {
      setFilterEnabled(evt.target.getAttribute('for'));
    }
  });
};



/** @return {boolean} */
var isCloudReached = function() {
  var cloudPosition = headerClouds.getBoundingClientRect();
  return cloudPosition.top - 200 <= 0;
};

/** @return {boolean} */
var isDemoReached = function() {
  var demoPosition = blockDemo.getBoundingClientRect();
  return demoPosition.bottom <= 0;
};

/**
 * @param {Array} hotels
 * @param {number} page
 * @param {number} pageSize
 * @return {boolean}
 */

var setMoreReviewEnabled = function() {
  var moreReviewButton = document.querySelector('.reviews-controls-more');

  moreReviewButton.classList.remove('invisible');

  moreReviewButton.onclick = function() {
    pageNumber++;
    renderReviews(filteredReviews, pageNumber);
  };
};

var setScrollEnabled = function() {

  var oldScroll = document.body.scrollTop;

  window.addEventListener('scroll', function() {

    if(isDemoReached()) {
      window.game.setStatus(window.Game.Verdict.PAUSE);
    }

    if(isCloudReached()) {

      var newScroll = document.body.scrollTop;

      var direction = newScroll - oldScroll;
      oldScroll = newScroll;

      if(direction > 0) {
        moveToX += 10;
      } else {
        moveToX -= 10;
      }

      headerClouds.style.backgroundPosition = moveToX + 'px 0px';
    }
  });
};

photoGallery.addEventListener('click', gallery.onContainerClick);

load(function(loadedReviews) {
  reviews = loadedReviews;
  setFilterEnabled(true);
  setFiltrationEnabled(setStartFilter);
  setMoreReviewEnabled();
  setScrollEnabled();
});

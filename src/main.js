'use strict';

require('./form');
require('./game');

var filtered = require('./filter');
var load = require('./load');
var getElementsFromTemplate = require('./get-element-from-template');


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


/** @param {Array.<Object>} reviews */
var renderReviews = function(rev, page, replace) {

  if (replace) {
    reviewList.innerHTML = '';
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  rev.slice(from, to).forEach(function(data) {
    getElementsFromTemplate(data, reviewList);
    reviewFilter.classList.remove('invisible');
  });
};

/** @param {string} filter */
var setFilterEnabled = function(filter) {
  filteredReviews = filtered(reviews, filter);

  pageNumber = 0;
  renderReviews(filteredReviews, pageNumber, true);
};

var setFiltrationEnabled = function() {
  var filters = reviewFilter.querySelectorAll('[name=reviews]');
  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = function() {
      setFilterEnabled(this.id);
    };
  }
};

/** @return {boolean} */
var isCloudReached = function() {
  var cloudPosition = headerClouds.getBoundingClientRect();
  return cloudPosition.top - 200 >= 0;
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
    renderReviews(filteredReviews, pageNumber);
    pageNumber++;
  };
};

var setScrollEnabled = function() {

  var oldScroll = document.body.scrollTop;

  window.addEventListener('scroll', function() {

    isDemoReached() && window.game.setStatus(window.Game.Verdict.PAUSE);

    if(isCloudReached()) return;

    var newScroll = document.body.scrollTop;

    var direction = newScroll - oldScroll;
    oldScroll = newScroll;

    if(direction > 0) {
      moveToX += 10;
    } else {
      moveToX -= 10;
    }

    headerClouds.style.backgroundPosition = moveToX + 'px 0px';

  });
};

load(function(loadedReviews) {
  reviews = loadedReviews;
  setFilterEnabled(true);
  setFiltrationEnabled();
  setMoreReviewEnabled();
  setScrollEnabled();
});

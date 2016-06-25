'use strict';

/** @param {function(Array.<Object>)} callback */
var load = function(callback) {
  var reviewsList = document.querySelector('.reviews');
  reviewsList.classList.add('.reviews-list-loading');

  /** @constant {string} */
  var REVIEWS_LOAD_URL = 'http://o0.github.io/assets/json/reviews.json';

  var xhr = new XMLHttpRequest();

  /** @param {ProgressEvent} evt */
  xhr.onload = function(evt) {
    reviewsList.classList.remove('.reviews-list-loading');
    var loadedData = JSON.parse(evt.target.response);
    callback(loadedData);
  };

  /** @param {ProgressEvent} */
  xhr.onerror = function() {
    reviewsList.classList.remove('.reviews-list-loading');
    reviewsList.classList.add('.reviews-load-failure');
  };

  xhr.open('GET', REVIEWS_LOAD_URL);
  xhr.send();
};

module.exports = load;

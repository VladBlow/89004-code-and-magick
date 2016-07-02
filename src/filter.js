'use strict';

var filterType = require('./filters-type');

var filtered = function(reviews, filter) {
  var reviewsToFilter = reviews.slice(0);

  var getFilterGoodReviews = function() {
    reviewsToFilter = reviewsToFilter.filter(function(item) {
      return item.rating >= 3;
    });
  };

  var getFilterBadReviews = function() {
    reviewsToFilter = reviewsToFilter.filter(function(item) {
      return item.rating <= 2;
    });
  };

  switch (filter) {
    case filterType.ALL:
      break;

    case filterType.RECENT:
      reviewsToFilter.sort(function(a, b) {
        return b.data - a.data;
      });
      break;

    case filterType.GOOD:
      getFilterGoodReviews();
      reviewsToFilter.sort(function(a, b) {
        return b.rating - a.rating;
      });
      break;

    case filterType.BAD:
      getFilterBadReviews();
      reviewsToFilter.sort(function(a, b) {
        return a.rating - b.rating;
      });
      break;

    case filterType.POPULAR:
      reviewsToFilter.sort(function(a, b) {
        return b.review_usefulness - a.review_usefulness;
      });
      break;
  }

  localStorage.setItem('lastFilter', filter);

  return reviewsToFilter;
};

module.exports = filtered;

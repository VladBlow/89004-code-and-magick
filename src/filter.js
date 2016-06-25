'use strict';

var filtered = function(filter) {
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
    case 'reviews-all':
      break;

    case 'reviews-recent':
      reviewsToFilter.sort(function(a, b) {
        return b.data - a.data;
      });
      break;

    case 'reviews-good':
      getFilterGoodReviews();
      reviewsToFilter.sort(function(a, b) {
        return b.rating - a.rating;
      });
      break;

    case 'reviews-bad':
      getFilterBadReviews();
      reviewsToFilter.sort(function(a, b) {
        return a.rating - b.rating;
      });
      break;

    case 'reviews-popular':
      reviewsToFilter.sort(function(a, b) {
        return b.review_usefulness - a.review_usefulness;
      });
      break;
  }

  return reviewsToFilter;
};

module.exports = filtered;

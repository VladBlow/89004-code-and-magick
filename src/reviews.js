'use strict';

(function() {
  var reviewFilter = document.querySelector('.reviews-filter');
  reviewFilter.classList.add('invisible');

  var template = document.querySelector('template');
  var reviewList = document.querySelector('.reviews-list');
  var headerClouds = document.querySelector('.header-clouds');
  var blockDemo = document.querySelector('.demo');
  var moveToX = 0;
  var elementToClone;
  var reviews;

  /** @type {Array.<Object>} */
  var filteredReviews = [];

  /** @type {number} */
  var IMAGE_LOAD_TIMEOUT = 10000;

  /** @constant {string} */
  var REVIEWS_LOAD_URL = 'http://o0.github.io/assets/json/reviews.json';

  /** @constant {number} */
  var PAGE_SIZE = 3;

  /** @type {number} */
  var pageNumber = 1;

  if ('content' in template) {
    elementToClone = template.content.querySelector('.review');
  } else {
    elementToClone = template.querySelector('.review');
  }

  /**
   * @param {Object} data
   * @param {HTMLElement} container
   * @return {HTMLElement}
   */
  var getElementsFromTemplate = function(data, container) {

    var element = elementToClone.cloneNode(true);
    var reviewAuthor = element.querySelector('.review-author');

    element.querySelector('.review-rating').textContent = data.rating;
    element.querySelector('.review-text').textContent = data.description;
    container.appendChild(element);

    var backgroundImage = new Image();
    var backgroundLoadTimeout;

    backgroundImage.onload = function() {
      reviewAuthor.src = backgroundImage.src;
      reviewAuthor.width = 124;
      reviewAuthor.height = 124;
      reviewAuthor.alt = data.author.name;
      reviewAuthor.title = data.author.name;
      console.log(data.author.picture);
      clearTimeout(backgroundLoadTimeout);
    };

    backgroundImage.onerror = function() {
      element.classList.add('review-load-failure');
    };

    backgroundImage.src = data.author.picture;

    backgroundLoadTimeout = setTimeout(function() {
      backgroundImage.src = '';
      element.classList.add('review-load-failure');
    }, IMAGE_LOAD_TIMEOUT);

    return element;
  };

  /** @param {function(Array.<Object>)} callback */
  var getReviews = function(callback) {
    var reviewsList = document.querySelector('.reviews');
    reviewsList.classList.add('.reviews-list-loading');
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

  /**
   * @param {Array.<Object>} hotels
   * @param {string} filter
   */
  var getFilteredReviews = function(filter) {
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

  /** @param {string} filter */
  var setFilterEnabled = function(filter) {
    filteredReviews = getFilteredReviews(filter);

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

  getReviews(function(loadedReviews) {
    reviews = loadedReviews;
    setFilterEnabled(true);
    setFiltrationEnabled();
    setMoreReviewEnabled();
    setScrollEnabled();
  });
})();

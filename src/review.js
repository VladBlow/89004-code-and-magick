'use strict';

var getElementsFromTemplate = require('./get-element-from-template');

/**
 * @param {Object} data
 * @param {Element} container
 * @constructor
 */
var Review = function(data, container) {
  this.element = getElementsFromTemplate(data, container);

  this.element.addEventListener('click', this.onReviewClick);
  container.appendChild(this.element);
};

Review.prototype.onReviewClick = function() {
  var reviewQuiz = document.querySelector('.review-quiz-answer');

  reviewQuiz.classList.add('review-quiz-answer-active');
};

Review.prototype.remove = function() {
  this.element.removeEventListener('click', this.onReviewClick);
  this.container.remove(this.element);
};


module.exports = Review;

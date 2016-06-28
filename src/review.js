'use strict';

var getElementsFromTemplate = require('./get-element-from-template');

/**
 * @param {Object} data
 * @param {Element} container
 * @constructor
 */
var Review = function(data, container) {
  this.data = data;
  this.element = getElementsFromTemplate(this.data, container);

  this.onReviewClick = function(evt) {
    var reviewQuiz= document.querySelector('.review-quiz-answer');

    reviewQuiz.classList.add('review-quiz-answer-active');
  };

  this.remove = function() {
    this.element.removeEventListener('click', this.onReviewClick);
    this.element.parentNode.removeChild(this.element);
  };

  this.element.addEventListener('click', this.onReviewClick);
  container.appendChild(this.element);
};


module.exports = Review;

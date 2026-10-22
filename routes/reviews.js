const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../expressMiddleware.js')
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schema.js')
const ExpressError = require('../utils/ExpressError')
const Review = require('../models/reviews');
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds.js');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;
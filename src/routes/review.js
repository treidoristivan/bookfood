const Review = require('express').Router()
const { GetAllReview, GetDetaiReview, CreateReview, UpdateReview, DeleteReview } = require('../controllers/review')
const AuthToken = require('../middleware/AuthToken')

Review.get('/', AuthToken, GetAllReview)
Review.get('/:id', AuthToken, GetDetaiReview)
Review.post('/', AuthToken, CreateReview)
Review.patch('/:id', AuthToken, UpdateReview)
Review.delete('/:id', AuthToken, DeleteReview)

module.exports = { Review }

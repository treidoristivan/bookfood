const Reviews = require('express').Router()
const { GetAllReview, GetDetailReview, CreateReview, UpdateReview, DeleteReview } = require('../controllers/reviews')
const checkAuthToken = require('../middleware/authMiddleware')

Reviews.get('/', checkAuthToken, GetAllReview)
Reviews.post('/', checkAuthToken, CreateReview)
Reviews.get('/:id', checkAuthToken, GetDetailReview)
Reviews.patch('/:id', checkAuthToken, UpdateReview)
Reviews.delete('/:id', checkAuthToken, DeleteReview)
module.exports = Reviews

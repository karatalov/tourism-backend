import { Router } from 'express'
import {
	addTourReview,
	deleteTourReview,
	addCarReview,
	deleteCarReview,
	getAllSiteReviews,
	addSiteReview,
	deleteSiteReview,
} from './review.controllers'
import { authMiddleware } from '../../middleware/auth'

const router = Router()

router.post('/tour/:tourId', authMiddleware, addTourReview)
router.delete('/tour/:id', authMiddleware, deleteTourReview)

router.post('/car/:carId', authMiddleware, addCarReview)
router.delete('/car/:id', authMiddleware, deleteCarReview)

router.get('/site', getAllSiteReviews)
router.post('/site', authMiddleware, addSiteReview)
router.delete('/site/:id', authMiddleware, deleteSiteReview)

export default router

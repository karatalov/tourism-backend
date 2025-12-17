import { Router } from 'express'
import {
	getAllTours,
	getTourById,
	createTour,
	updateTour,
	deleteTour,
} from './tour.controllers'
import { authMiddleware } from '../../middleware/auth'

const router = Router()

router.get('/', getAllTours)
router.get('/:id', getTourById)
router.post('/', authMiddleware, createTour)
router.put('/:id', authMiddleware, updateTour)
router.delete('/:id', authMiddleware, deleteTour)

export default router

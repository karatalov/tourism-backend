import { Router } from 'express'
import {
	getFavoriteTours,
	addFavoriteTour,
	removeFavoriteTour,
	getFavoriteCars,
	addFavoriteCar,
	removeFavoriteCar,
} from './user.controllers'
import { authMiddleware } from '../../middleware/auth'

const router = Router()

router.get('/favorites/tours', authMiddleware, getFavoriteTours)
router.post('/favorites/tours/:tourId', authMiddleware, addFavoriteTour)
router.delete('/favorites/tours/:tourId', authMiddleware, removeFavoriteTour)

router.get('/favorites/cars', authMiddleware, getFavoriteCars)
router.post('/favorites/cars/:carId', authMiddleware, addFavoriteCar)
router.delete('/favorites/cars/:carId', authMiddleware, removeFavoriteCar)

export default router

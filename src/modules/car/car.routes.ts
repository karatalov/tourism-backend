import { Router } from 'express'
import {
	getAllCars,
	getCarById,
	createCar,
	updateCar,
	deleteCar,
} from './car.controllers'
import { authMiddleware } from '../../middleware/auth'

const router = Router()

router.get('/', getAllCars)
router.get('/:id', getCarById)
router.post('/', authMiddleware, createCar)
router.put('/:id', authMiddleware, updateCar)
router.delete('/:id', authMiddleware, deleteCar)

export default router

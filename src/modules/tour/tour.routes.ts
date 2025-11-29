import { Router } from 'express'
import tourControllers from './tour.controllers'

const router = Router()

router.get('/tours', tourControllers.getAllTour)
router.post('/create', tourControllers.createTour)

export default router

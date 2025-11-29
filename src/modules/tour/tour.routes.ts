import { Router } from 'express'
import tourControllers from './tour.controllers'

const router = Router()

router.get('/tours', tourControllers.getAllTour)

export default router

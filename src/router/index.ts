import { Router } from 'express'
import authRouter from '../modules/auth/auth.routes'
import tourRouter from '../modules/tour/tour.routes'
import carsRouter from '../modules/car/car.routes'
import reviewRoutes from '../modules/review/review.routes'
import userRoutes from '../modules/user/user.routes'

const globalRouter = Router()

globalRouter.use('/auth', authRouter)
globalRouter.use('/tours', tourRouter)
globalRouter.use('/cars', carsRouter)
globalRouter.use('/reviews', reviewRoutes)
globalRouter.use('/users', userRoutes)

export default globalRouter

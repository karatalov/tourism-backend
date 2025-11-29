import { Router } from 'express'
import authRouter from '../modules/auth/auth.routes'
import tourRouter from '../modules/tour/tour.routes'

const globalRouter = Router()

globalRouter.use('/auth', authRouter)
globalRouter.use('/travel', tourRouter)

export default globalRouter

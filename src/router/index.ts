import { Router } from 'express'
import authRouter from '../modules/auth/auth.routes'

const globalRouter = Router()

globalRouter.use('/auth', authRouter)

export default globalRouter

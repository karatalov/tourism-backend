import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import globalRouter from './router'

const buildServer = () => {
	const server = express()

	server.use(
		cors({
			origin: process.env.FRONTEND_URL || '*',
			credentials: true,
			methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
		})
	)

	server.use(express.json())

	server.get('/', (req, res) => {
		res.status(200).json({
			success: true,
			message: '🏔️ Tourism API v1 ThreeX',
			endpoints: {
				auth: '/api/v1/auth',
				tours: '/api/v1/tours',
				cars: '/api/v1/cars',
				reviews: '/api/v1/reviews',
				users: '/api/v1/users',
			},
		})
	})

	server.use('/api/v1', globalRouter)

	return server
}

export default buildServer

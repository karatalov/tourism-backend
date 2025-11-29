import 'dotenv/config'
import express from 'express'
import globalRouter from './router'

const buildServer = () => {
	const server = express()
	server.use(express.json())
	server.get('/', (req, res) => {
		res.status(200).json({
			success: true,
			message: 'Server runned successful',
		})
	})
	server.use('/api/v1', globalRouter)
	return server
}

export default buildServer

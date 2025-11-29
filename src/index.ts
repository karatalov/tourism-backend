import buildServer from './app'

const startServer = () => {
	const server = buildServer()
	const PORT = process.env.PORT || 3000
	try {
		server.listen({
			port: PORT,
			host: '0.0.0.0',
		}),
			() => {
				console.log(new Date().toLocaleString())
				console.log(`Server runned in http://localhost:${PORT}`)
			}
	} catch (error) {
		console.log(`Server crushed ${error}`)
	}
}
startServer()

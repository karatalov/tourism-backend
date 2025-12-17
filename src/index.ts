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
				console.log(`🚀 Сервер запущен на http://localhost:${PORT}`)
				console.log(`📚 API документация: http://localhost:${PORT}/api/v1`)
			}
	} catch (error) {
		console.log(`Server crushed ${error}`)
	}
}
startServer()

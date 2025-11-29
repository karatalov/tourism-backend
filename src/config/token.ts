import jwt from 'jsonwebtoken'

export const generateToken = (id: string, email: string): string => {
	const secret = process.env.JWT_SECRET

	if (!secret) {
		throw new Error('JWT_SECRET не задан в переменных окружения')
	}

	return jwt.sign({ id, email }, secret, {
		expiresIn: '7d',
	})
}

export const verifyToken = (token: string) => {
	const secret = process.env.JWT_SECRET
	if (!secret) {
		throw new Error('JWT_SECRET не задан в переменных окружения')
	}

	try {
		return jwt.verify(token, secret) as { id: string; email: string }
	} catch (error) {
		throw new Error('Недействительный токен')
	}
}

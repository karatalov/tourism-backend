import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/generateToken'

declare global {
	namespace Express {
		interface Request {
			user?: {
				userId: string
				email: string
			}
		}
	}
}

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]

		if (!token) {
			return res.status(401).json({
				success: false,
				message: 'Необходима авторизация',
			})
		}

		const decoded = verifyToken(token)
		req.user = decoded
		next()
	} catch (error) {
		res.status(401).json({
			success: false,
			message: 'Неверный или истёкший токен',
		})
	}
}

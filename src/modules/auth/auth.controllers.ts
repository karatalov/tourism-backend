import { Request, Response } from 'express'
import prisma from '../../config/prisma'
import { hashPassword, comparePassword } from '../../utils/hashPassword'
import { generateToken } from '../../utils/generateToken'

export const register = async (req: Request, res: Response) => {
	try {
		const { username, email, password } = req.body

		if (!username || !email || !password) {
			return res.status(400).json({
				success: false,
				message: 'Заполните все поля',
			})
		}

		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ email }, { username }],
			},
		})

		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: 'Пользователь с таким email или username уже существует',
			})
		}

		const hashedPassword = await hashPassword(password)

		const user = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
			select: {
				id: true,
				username: true,
				email: true,
				avatar: true,
				createdAt: true,
			},
		})

		const token = generateToken({ userId: user.id, email: user.email })

		res.status(201).json({
			success: true,
			message: 'Регистрация прошла успешно',
			user,
			token,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при регистрации',
		})
	}
}

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: 'Введите email и пароль',
			})
		}

		const user = await prisma.user.findUnique({
			where: { email },
		})

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'Пользователь не найден',
			})
		}

		const isPasswordValid = await comparePassword(password, user.password)

		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: 'Неверный пароль',
			})
		}

		const token = generateToken({ userId: user.id, email: user.email })

		res.status(200).json({
			success: true,
			message: 'Вход выполнен успешно',
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				avatar: user.avatar,
			},
			token,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при входе',
		})
	}
}

export const getMe = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.userId

		if (!userId) {
			return res.status(401).json({
				success: false,
				message: 'Не авторизован',
			})
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				username: true,
				email: true,
				avatar: true,
				createdAt: true,
				_count: {
					select: {
						favoriteTours: true,
						favoriteCars: true,
						tourReviews: true,
						carReviews: true,
					},
				},
			},
		})

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'Пользователь не найден',
			})
		}

		res.status(200).json({
			success: true,
			user,
		})
	} catch (error) {
		console.error('Ошибка в getMe:', error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при получении данных пользователя',
		})
	}
}

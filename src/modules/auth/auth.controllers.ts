import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { generateToken } from '../../config/token'
import prisma from '../../config/prisma'

const register = async (req: Request, res: Response) => {
	try {
		const { username, email, password } = req.body

		//! Проверка обязательных полей
		if (!username || !email || !password) {
			return res.status(400).json({
				success: false,
				message: 'Все поля обязательны для заполнения',
			})
		}

		//! Проверка email
		const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
		if (!emailRegex.test(email)) {
			return res.status(400).json({
				success: false,
				message: 'Email указан неверно',
			})
		}

		//! Проверка пароля
		const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
		if (!passwordRegex.test(password)) {
			return res.status(400).json({
				success: false,
				message:
					'Пароль должен содержать минимум 8 символов и включать буквы и цифры',
			})
		}

		//! Проверяем, существует ли уже пользователь
		const existingUser = await prisma.user.findUnique({
			where: { email },
		})

		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: 'Пользователь с таким email уже существует',
			})
		}

		//! Хешируем пароль
		const hashedPassword = await bcrypt.hash(password, 10)

		//! Создаём пользователя
		const newUser = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
		})

		//! Генерация токена
		const token = generateToken(newUser.id, newUser.email)

		//! Ответ клиенту
		return res.status(201).json({
			success: true,
			message: 'Пользователь успешно зарегистрирован',
			token,
			user: {
				id: newUser.id,
				userName: newUser.username,
				email: newUser.email,
			},
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			success: false,
			message:
				error instanceof Error ? error.message : 'Ошибка при регистрации',
		})
	}
}

const login = async (req: Request, res: Response) => {
	//! Логика для входа пользователя
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: 'Все поля обязательны для заполнения',
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

		const isPasswordValid = await bcrypt.compare(password, user.password)

		if (!isPasswordValid) {
			return res.status(401).json({
				success: false,
				message: 'Неверный пароль',
			})
		}

		const token = generateToken(user.id, user.email)

		return res.status(200).json({
			success: true,
			message: 'Вход выполнен успешно',
			token,
			user: {
				id: user.id,
				userName: user.username,
				email: user.email,
			},
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : 'Ошибка при входе',
		})
	}
}

export default { register, login }

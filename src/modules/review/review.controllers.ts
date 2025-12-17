import { Request, Response } from 'express'
import prisma from '../../config/prisma'

export const addTourReview = async (req: Request, res: Response) => {
	try {
		const { tourId } = req.params
		const { rating, comment, images } = req.body
		const userId = req.user?.userId

		if (!userId) {
			return res.status(401).json({
				success: false,
				message: 'Не авторизован',
			})
		}

		if (!tourId) {
			return res.status(400).json({
				success: false,
				message: 'ID тура обязателен',
			})
		}

		if (!rating || !comment) {
			return res.status(400).json({
				success: false,
				message: 'Укажите рейтинг и комментарий',
			})
		}

		if (rating < 1 || rating > 5) {
			return res.status(400).json({
				success: false,
				message: 'Рейтинг должен быть от 1 до 5',
			})
		}

		const tourExists = await prisma.tour.findUnique({
			where: { id: tourId },
		})

		if (!tourExists) {
			return res.status(404).json({
				success: false,
				message: 'Тур не найден',
			})
		}

		const existingReview = await prisma.tourReview.findUnique({
			where: {
				tourId_userId: {
					tourId,
					userId,
				},
			},
		})

		if (existingReview) {
			return res.status(400).json({
				success: false,
				message: 'Вы уже оставили отзыв на этот тур',
			})
		}

		const review = await prisma.tourReview.create({
			data: {
				tourId,
				userId,
				rating: Number(rating),
				comment: String(comment),
				images: images && Array.isArray(images) ? images : [],
			},
			include: {
				user: {
					select: {
						id: true,
						username: true,
						avatar: true,
					},
				},
				tour: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		})

		return res.status(201).json({
			success: true,
			message: 'Отзыв успешно добавлен',
			review,
		})
	} catch (error) {
		console.error('addTourReview error:', error)
		return res.status(500).json({
			success: false,
			message: 'Ошибка при добавлении отзыва',
		})
	}
}

export const deleteTourReview = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const userId = req.user?.userId

		if (!userId) {
			return res.status(401).json({
				success: false,
				message: 'Не авторизован',
			})
		}

		if (!id) {
			return res.status(400).json({
				success: false,
				message: 'ID отзыва обязателен',
			})
		}

		const review = await prisma.tourReview.findUnique({
			where: { id },
		})

		if (!review) {
			return res.status(404).json({
				success: false,
				message: 'Отзыв не найден',
			})
		}

		if (review.userId !== userId) {
			return res.status(403).json({
				success: false,
				message: 'Вы не можете удалить чужой отзыв',
			})
		}

		await prisma.tourReview.delete({
			where: { id },
		})

		res.status(200).json({
			success: true,
			message: 'Отзыв успешно удалён',
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при удалении отзыва',
		})
	}
}

export const addCarReview = async (req: Request, res: Response) => {
	try {
		const { carId } = req.params
		const { rating, comment, images } = req.body
		const userId = req.user?.userId

		if (!userId) {
			return res.status(401).json({
				success: false,
				message: 'Не авторизован',
			})
		}

		if (!carId) {
			return res.status(400).json({
				success: false,
				message: 'ID автомобиля обязателен',
			})
		}
		if (!rating || !comment) {
			return res.status(400).json({
				success: false,
				message: 'Укажите рейтинг и комментарий',
			})
		}

		if (rating < 1 || rating > 5) {
			return res.status(400).json({
				success: false,
				message: 'Рейтинг должен быть от 1 до 5',
			})
		}

		const carExists = await prisma.car.findUnique({
			where: { id: carId },
		})

		if (!carExists) {
			return res.status(404).json({
				success: false,
				message: 'Машина не найдена',
			})
		}

		const existingReview = await prisma.carReview.findUnique({
			where: {
				carId_userId: {
					carId,
					userId: userId!,
				},
			},
		})

		if (existingReview) {
			return res.status(400).json({
				success: false,
				message: 'Вы уже оставили отзыв на эту машину',
			})
		}

		const review = await prisma.carReview.create({
			data: {
				carId,
				userId: userId!,
				rating: Number(rating),
				comment,
				images: images || [],
			},
			include: {
				user: {
					select: {
						id: true,
						username: true,
						avatar: true,
					},
				},
				car: {
					select: {
						id: true,
						model: true,
						brand: true,
					},
				},
			},
		})

		res.status(201).json({
			success: true,
			message: 'Отзыв успешно добавлен',
			review,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при добавлении отзыва',
		})
	}
}

export const deleteCarReview = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const userId = req.user?.userId

		if (!userId) {
			return res.status(401).json({
				success: false,
				message: 'Не авторизован',
			})
		}

		if (!id) {
			return res.status(400).json({
				success: false,
				message: 'ID отзыва обязателен',
			})
		}
		const review = await prisma.carReview.findUnique({
			where: { id },
		})

		if (!review) {
			return res.status(404).json({
				success: false,
				message: 'Отзыв не найден',
			})
		}

		if (review.userId !== userId) {
			return res.status(403).json({
				success: false,
				message: 'Вы не можете удалить чужой отзыв',
			})
		}

		await prisma.carReview.delete({
			where: { id },
		})

		res.status(200).json({
			success: true,
			message: 'Отзыв успешно удалён',
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при удалении отзыва',
		})
	}
}

export const getAllSiteReviews = async (req: Request, res: Response) => {
	try {
		const { category } = req.query

		const where: any = {}
		if (category) where.category = category

		const reviews = await prisma.siteReview.findMany({
			where,
			include: {
				user: {
					select: {
						id: true,
						username: true,
						avatar: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		res.status(200).json({
			success: true,
			count: reviews.length,
			reviews,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при получении отзывов',
		})
	}
}

export const addSiteReview = async (req: Request, res: Response) => {
	try {
		const { rating, comment, category } = req.body
		const userId = req.user?.userId

		if (!userId) {
			return res.status(401).json({
				success: false,
				message: 'Не авторизован',
			})
		}
		if (!rating || !comment || !category) {
			return res.status(400).json({
				success: false,
				message: 'Заполните все поля',
			})
		}

		if (rating < 1 || rating > 5) {
			return res.status(400).json({
				success: false,
				message: 'Рейтинг должен быть от 1 до 5',
			})
		}

		const validCategories = ['service', 'website', 'support']
		if (!validCategories.includes(category)) {
			return res.status(400).json({
				success: false,
				message: 'Неверная категория',
			})
		}

		const review = await prisma.siteReview.create({
			data: {
				userId: userId!,
				rating: Number(rating),
				comment,
				category,
			},
			include: {
				user: {
					select: {
						id: true,
						username: true,
						avatar: true,
					},
				},
			},
		})

		res.status(201).json({
			success: true,
			message: 'Отзыв успешно добавлен',
			review,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при добавлении отзыва',
		})
	}
}

export const deleteSiteReview = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const userId = req.user?.userId

		if (!userId) {
			return res.status(401).json({
				success: false,
				message: 'Не авторизован',
			})
		}

		if (!id) {
			return res.status(400).json({
				success: false,
				message: 'ID отзыва обязателен',
			})
		}
		const review = await prisma.siteReview.findUnique({
			where: { id },
		})

		if (!review) {
			return res.status(404).json({
				success: false,
				message: 'Отзыв не найден',
			})
		}

		if (review.userId !== userId) {
			return res.status(403).json({
				success: false,
				message: 'Вы не можете удалить чужой отзыв',
			})
		}

		await prisma.siteReview.delete({
			where: { id },
		})

		res.status(200).json({
			success: true,
			message: 'Отзыв успешно удалён',
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при удалении отзыва',
		})
	}
}

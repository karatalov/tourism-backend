import { Request, Response } from 'express'
import prisma from '../../config/prisma'

export const getFavoriteTours = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.userId

		const favorites = await prisma.favoriteTour.findMany({
			where: { userId: userId! },
			include: {
				tour: {
					include: {
						reviews: true,
						_count: {
							select: {
								favorites: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		const tours = favorites.map((fav) => {
			const avgRating =
				fav.tour.reviews.length > 0
					? fav.tour.reviews.reduce((sum, r) => sum + r.rating, 0) /
					  fav.tour.reviews.length
					: 0

			return {
				...fav.tour,
				avgRating: Number(avgRating.toFixed(1)),
				favoriteId: fav.id,
				addedAt: fav.createdAt,
			}
		})

		res.status(200).json({
			success: true,
			count: tours.length,
			tours,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при получении избранных туров',
		})
	}
}
export const addFavoriteTour = async (req: Request, res: Response) => {
	try {
		const { tourId } = req.params
		const userId = req.user?.userId

		if (!tourId) {
			return res.status(400).json({
				success: false,
				message: 'Не указан ID тура',
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

		const existingFavorite = await prisma.favoriteTour.findUnique({
			where: {
				userId_tourId: {
					userId: userId!,
					tourId,
				},
			},
		})

		if (existingFavorite) {
			return res.status(400).json({
				success: false,
				message: 'Тур уже в избранном',
			})
		}

		const favorite = await prisma.favoriteTour.create({
			data: {
				userId: userId!,
				tourId,
			},
			include: {
				tour: true,
			},
		})

		res.status(201).json({
			success: true,
			message: 'Тур добавлен в избранное',
			favorite,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при добавлении в избранное',
		})
	}
}

export const removeFavoriteTour = async (req: Request, res: Response) => {
	try {
		const { tourId } = req.params
		const userId = req.user?.userId

		if (!tourId) {
			return res.status(400).json({
				success: false,
				message: 'Не указан ID тура',
			})
		}

		const favorite = await prisma.favoriteTour.findUnique({
			where: {
				userId_tourId: {
					userId: userId!,
					tourId,
				},
			},
		})

		if (!favorite) {
			return res.status(404).json({
				success: false,
				message: 'Тур не найден в избранном',
			})
		}

		await prisma.favoriteTour.delete({
			where: {
				userId_tourId: {
					userId: userId!,
					tourId,
				},
			},
		})

		res.status(200).json({
			success: true,
			message: 'Тур удалён из избранного',
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при удалении из избранного',
		})
	}
}

export const getFavoriteCars = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.userId

		const favorites = await prisma.favoriteCar.findMany({
			where: { userId: userId! },
			include: {
				car: {
					include: {
						reviews: true,
						tour: true,
						_count: {
							select: {
								favorites: true,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		const cars = favorites.map((fav) => {
			const avgRating =
				fav.car.reviews.length > 0
					? fav.car.reviews.reduce((sum, r) => sum + r.rating, 0) /
					  fav.car.reviews.length
					: 0

			return {
				...fav.car,
				avgRating: Number(avgRating.toFixed(1)),
				favoriteId: fav.id,
				addedAt: fav.createdAt,
			}
		})

		res.status(200).json({
			success: true,
			count: cars.length,
			cars,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при получении избранных машин',
		})
	}
}

export const addFavoriteCar = async (req: Request, res: Response) => {
	try {
		const { carId } = req.params
		const userId = req.user?.userId

		if (!carId) {
			return res.status(400).json({
				success: false,
				message: 'Не указан ID машины',
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

		const existingFavorite = await prisma.favoriteCar.findUnique({
			where: {
				userId_carId: {
					userId: userId!,
					carId,
				},
			},
		})

		if (existingFavorite) {
			return res.status(400).json({
				success: false,
				message: 'Машина уже в избранном',
			})
		}

		const favorite = await prisma.favoriteCar.create({
			data: {
				userId: userId!,
				carId,
			},
			include: {
				car: true,
			},
		})

		res.status(201).json({
			success: true,
			message: 'Машина добавлена в избранное',
			favorite,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при добавлении в избранное',
		})
	}
}

export const removeFavoriteCar = async (req: Request, res: Response) => {
	try {
		const { carId } = req.params
		const userId = req.user?.userId

		if (!carId) {
			return res.status(400).json({
				success: false,
				message: 'Не указан ID машины',
			})
		}

		const favorite = await prisma.favoriteCar.findUnique({
			where: {
				userId_carId: {
					userId: userId!,
					carId,
				},
			},
		})

		if (!favorite) {
			return res.status(404).json({
				success: false,
				message: 'Машина не найдена в избранном',
			})
		}

		await prisma.favoriteCar.delete({
			where: {
				userId_carId: {
					userId: userId!,
					carId,
				},
			},
		})

		res.status(200).json({
			success: true,
			message: 'Машина удалена из избранного',
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при удалении из избранного',
		})
	}
}

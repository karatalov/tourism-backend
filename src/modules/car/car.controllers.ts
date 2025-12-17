import { Request, Response } from 'express'
import prisma from '../../config/prisma'
import { Prisma } from '@prisma/client'

const toNumber = (value: any, fallback: number = 0): number => {
	const num = Number(value)
	return isNaN(num) ? fallback : num
}

export const getAllCars = async (req: Request, res: Response) => {
	try {
		const { brand, minPrice, maxPrice, year, transmission } = req.query as {
			[key: string]: string | undefined
		}

		const where: Prisma.CarWhereInput = {}

		if (brand) where.brand = brand
		if (transmission) where.transmission = transmission
		if (year) where.year = toNumber(year)

		if (minPrice || maxPrice) {
			where.price = {}
			if (minPrice) where.price.gte = toNumber(minPrice)
			if (maxPrice) where.price.lte = toNumber(maxPrice)
		}

		const cars = await prisma.car.findMany({
			where,
			include: {
				tour: {
					select: {
						id: true,
						name: true,
					},
				},
				reviews: {
					include: {
						user: {
							select: {
								id: true,
								username: true,
								avatar: true,
							},
						},
					},
				},
				_count: {
					select: {
						favorites: true,
					},
				},
			},
		})

		const carsWithRating = cars.map((car) => {
			const avgRating =
				car.reviews.length > 0
					? car.reviews.reduce((sum, r) => sum + r.rating, 0) /
					  car.reviews.length
					: 0

			return {
				...car,
				avgRating: Number(avgRating.toFixed(1)),
			}
		})

		res.status(200).json({
			success: true,
			count: carsWithRating.length,
			cars: carsWithRating,
		})
	} catch (error) {
		console.error('getAllCars error:', error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при получении машин',
		})
	}
}

export const getCarById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		if (!id) {
			return res.status(400).json({
				success: false,
				message: 'ID машины обязателен',
			})
		}

		const car = await prisma.car.findUnique({
			where: { id },
			include: {
				tour: {
					select: {
						id: true,
						name: true,
						city: true,
					},
				},
				reviews: {
					include: {
						user: {
							select: {
								id: true,
								username: true,
								avatar: true,
							},
						},
					},
					orderBy: { createdAt: 'desc' },
				},
				_count: {
					select: {
						favorites: true,
					},
				},
			},
		})

		if (!car) {
			return res.status(404).json({
				success: false,
				message: 'Машина не найдена',
			})
		}

		const avgRating =
			car.reviews.length > 0
				? car.reviews.reduce((sum, r) => sum + r.rating, 0) / car.reviews.length
				: 0

		res.status(200).json({
			success: true,
			car: {
				...car,
				avgRating: Number(avgRating.toFixed(1)),
			},
		})
	} catch (error) {
		console.error('getCarById error:', error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при получении машины',
		})
	}
}

export const createCar = async (req: Request, res: Response) => {
	try {
		const {
			tourId,
			model,
			brand,
			price,
			capacity,
			drive,
			year,
			places,
			transmission,
			fuelType,
			images,
		} = req.body

		if (
			!model ||
			!brand ||
			!price ||
			!capacity ||
			!drive ||
			!year ||
			!places ||
			!transmission ||
			!fuelType
		) {
			return res.status(400).json({
				success: false,
				message: 'Заполните все обязательные поля',
			})
		}

		const car = await prisma.car.create({
			data: {
				tourId: tourId || null,
				model: String(model),
				brand: String(brand),
				price: Number(price),
				capacity: Number(capacity),
				drive: String(drive),
				year: Number(year),
				places: Number(places),
				transmission: String(transmission),
				fuelType: String(fuelType),
				images: Array.isArray(images) ? images : images ? [images] : [],
			},
		})

		res.status(201).json({
			success: true,
			message: 'Машина успешно добавлена',
			car,
		})
	} catch (error: any) {
		console.error('createCar error:', error)
		if (error.code === 'P2003') {
			return res.status(400).json({
				success: false,
				message: 'Неверный tourId — такой тур не существует',
			})
		}
		res.status(500).json({
			success: false,
			message: 'Ошибка при создании машины',
		})
	}
}

export const updateCar = async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		if (!id) {
			return res.status(400).json({
				success: false,
				message: 'ID машины обязателен',
			})
		}

		const data = req.body

		const allowedFields = [
			'model',
			'brand',
			'price',
			'capacity',
			'drive',
			'year',
			'places',
			'transmission',
			'fuelType',
			'images',
			'tourId',
		] as const

		const updateData: Prisma.CarUpdateInput = {}

		for (const field of allowedFields) {
			if (data[field] !== undefined && field !== 'tourId') {
				updateData[field] =
					field === 'price' ||
					field === 'capacity' ||
					field === 'year' ||
					field === 'places'
						? Number(data[field])
						: data[field]
			}
		}

		if (data.tourId !== undefined) {
			if (data.tourId === null) {
				updateData.tour = { disconnect: true }
			} else if (typeof data.tourId === 'string' && data.tourId.trim()) {
				updateData.tour = { connect: { id: data.tourId } }
			}
		}

		const car = await prisma.car.update({
			where: { id },
			data: updateData,
		})

		res.status(200).json({
			success: true,
			message: 'Машина успешно обновлена',
			car,
		})
	} catch (error: any) {
		console.error('updateCar error:', error)

		if (error.code === 'P2025') {
			return res
				.status(404)
				.json({ success: false, message: 'Машина не найдена' })
		}
		if (error.code === 'P2025' && error.meta?.cause?.includes('tour')) {
			return res.status(400).json({ success: false, message: 'Тур не найден' })
		}

		res.status(500).json({
			success: false,
			message: 'Ошибка при обновлении машины',
		})
	}
}

export const deleteCar = async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		if (!id) {
			return res.status(400).json({
				success: false,
				message: 'ID машины обязателен',
			})
		}

		await prisma.car.delete({
			where: { id },
		})

		res.status(200).json({
			success: true,
			message: 'Машина успешно удалена',
		})
	} catch (error: any) {
		console.error('deleteCar error:', error)

		if (error.code === 'P2025') {
			return res.status(404).json({
				success: false,
				message: 'Машина не найдена',
			})
		}

		res.status(500).json({
			success: false,
			message: 'Ошибка при удалении машины',
		})
	}
}

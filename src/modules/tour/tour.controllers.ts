import { Request, Response } from 'express'
import prisma from '../../config/prisma'
import { Prisma } from '@prisma/client'

const toNumber = (value: any, defaultValue: number = 0): number => {
	const num = Number(value)
	return isNaN(num) ? defaultValue : num
}

export const getAllTours = async (req: Request, res: Response) => {
	try {
		const { city, category, minPrice, maxPrice, sort } = req.query as {
			[key: string]: string | undefined
		}

		const where: Prisma.TourWhereInput = {
			AND: [],
		}

		if (city) where.city = city
		if (category) where.category = category

		if (minPrice || maxPrice) {
			where.price = {}
			if (minPrice) where.price.gte = toNumber(minPrice)
			if (maxPrice) where.price.lte = toNumber(maxPrice)
		}

		const orderBy: Prisma.TourOrderByWithRelationInput =
			sort === 'price_asc'
				? { price: 'asc' }
				: sort === 'price_desc'
				? { price: 'desc' }
				: sort === 'newest'
				? { createdAt: 'desc' }
				: { createdAt: 'desc' }

		const tours = await prisma.tour.findMany({
			where,
			orderBy,
			include: {
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
				cars: true,
				_count: {
					select: {
						favorites: true,
						reviews: true,
					},
				},
			},
		})

		const toursWithRating = tours.map((tour) => {
			const avgRating =
				tour.reviews.length > 0
					? tour.reviews.reduce((sum, r) => sum + r.rating, 0) /
					  tour.reviews.length
					: 0

			return {
				...tour,
				avgRating: Number(avgRating.toFixed(1)),
			}
		})

		res.status(200).json({
			success: true,
			count: toursWithRating.length,
			tours: toursWithRating,
		})
	} catch (error) {
		console.error('getAllTours error:', error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при получении туров',
		})
	}
}

export const getTourById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		if (!id) {
			return res.status(400).json({
				success: false,
				message: 'ID тура обязателен',
			})
		}

		const tour = await prisma.tour.findUnique({
			where: { id },
			include: {
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
				cars: {
					include: {
						reviews: true,
					},
				},
				_count: {
					select: {
						favorites: true,
					},
				},
			},
		})

		if (!tour) {
			return res.status(404).json({
				success: false,
				message: 'Тур не найден',
			})
		}

		const avgRating =
			tour.reviews.length > 0
				? tour.reviews.reduce((sum, r) => sum + r.rating, 0) /
				  tour.reviews.length
				: 0

		res.status(200).json({
			success: true,
			tour: {
				...tour,
				avgRating: Number(avgRating.toFixed(1)),
			},
		})
	} catch (error) {
		console.error('getTourById error:', error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при получении тура',
		})
	}
}

export const createTour = async (req: Request, res: Response) => {
	try {
		const {
			name,
			price,
			description,
			city,
			category,
			date,
			images,
			duration,
			maxPeople,
		} = req.body

		if (
			!name ||
			!price ||
			!description ||
			!city ||
			!category ||
			!date ||
			!duration ||
			!maxPeople
		) {
			return res.status(400).json({
				success: false,
				message: 'Заполните все обязательные поля',
			})
		}

		const tour = await prisma.tour.create({
			data: {
				name: String(name),
				price: Number(price),
				description: String(description),
				city: String(city),
				category: String(category),
				date: String(date),
				images: images ? (Array.isArray(images) ? images : [images]) : [],
				duration: Number(duration),
				maxPeople: Number(maxPeople),
			},
		})

		res.status(201).json({
			success: true,
			message: 'Тур успешно создан',
			tour,
		})
	} catch (error) {
		console.error('createTour error:', error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при создании тура',
		})
	}
}

export const updateTour = async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		if (!id) {
			return res.status(400).json({
				success: false,
				message: 'ID тура обязателен',
			})
		}

		const data = req.body

		const allowedFields = [
			'name',
			'price',
			'description',
			'city',
			'category',
			'date',
			'images',
			'duration',
			'maxPeople',
		]
		const filteredData = Object.keys(data)
			.filter((key) => allowedFields.includes(key))
			.reduce((obj, key) => {
				obj[key] = data[key]
				return obj
			}, {} as any)

		if (filteredData.price !== undefined)
			filteredData.price = Number(filteredData.price)
		if (filteredData.duration !== undefined)
			filteredData.duration = Number(filteredData.duration)
		if (filteredData.maxPeople !== undefined)
			filteredData.maxPeople = Number(filteredData.maxPeople)

		const tour = await prisma.tour.update({
			where: { id },
			data: filteredData,
		})

		res.status(200).json({
			success: true,
			message: 'Тур успешно обновлён',
			tour,
		})
	} catch (error: any) {
		if (error.code === 'P2025') {
			return res.status(404).json({
				success: false,
				message: 'Тур не найден',
			})
		}
		console.error('updateTour error:', error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при обновлении тура',
		})
	}
}

export const deleteTour = async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		if (!id) {
			return res.status(400).json({
				success: false,
				message: 'ID тура обязателен',
			})
		}

		await prisma.tour.delete({
			where: { id },
		})

		res.status(200).json({
			success: true,
			message: 'Тур успешно удалён',
		})
	} catch (error: any) {
		if (error.code === 'P2025') {
			return res.status(404).json({
				success: false,
				message: 'Тур не найден',
			})
		}
		console.error('deleteTour error:', error)
		res.status(500).json({
			success: false,
			message: 'Ошибка при удалении тура',
		})
	}
}

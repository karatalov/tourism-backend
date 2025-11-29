import { Request, Response } from 'express'
import prisma from '../../config/prisma'

const getAllTour = async (req: Request, res: Response) => {
	try {
		const tours = await prisma.tour.findMany({
			include: {
				review: true,
				cars: true,
			},
		})

		res.status(200).json({
			success: true,
			message: 'Все туры успешно получены',
			tours,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Ошибка при получении туров' })
	}
}

const createTour = async (req: Request, res: Response) => {
	try {
		const { name, description, price, city, category, date, cars, reviews } =
			req.body

		if (!name || !description || !price || !city || !category || !date) {
			return res
				.status(400)
				.json({ message: 'Все поля обязательны для заполнения' })
		}

		const data: any = {
			name,
			description,
			price: Number(price),
			city,
			category,
			date,
		}

		if (cars && Array.isArray(cars) && cars.length > 0) {
			data.cars = {
				create: cars.map((car: any) => ({
					model: car.model,
					price: Number(car.price),
					capacity: car.capacity,
					drive: car.drive,
					year: car.year,
					places: car.places,
				})),
			}
		}

		if (reviews && Array.isArray(reviews) && reviews.length > 0) {
			data.review = {
				create: reviews.map((rev: any) => ({
					rating: rev.rating,
					comment: rev.comment,
					user: rev.userId ? { connect: { id: rev.userId } } : undefined,
				})),
			}
		}

		const newTour = await prisma.tour.create({
			data,
			include: {
				cars: true,
				review: true,
			},
		})

		res.status(201).json({
			success: true,
			message: 'Тур успешно создан',
			tour: newTour,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Ошибка при создании тура' })
	}
}

export default {
	getAllTour,
	createTour,
}

import { Request, Response } from 'express'
import prisma from '../../config/prisma'

const getAllTour = async (req: Request, res: Response) => {
	try {
		const tours = await prisma.tour.findMany()

		res.status(200).json({
			success: true,
			tours,
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Ошибка при получении туров' })
	}
}

export default {
	getAllTour,
}

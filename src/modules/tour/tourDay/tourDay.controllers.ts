import { Request, Response } from "express";
import prisma from "../../../config/prisma";

export const createTourDay = async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params;
    const { dayNumber, title } = req.body;

    if (!tourId) {
      return res.status(400).json({ message: "tourId is required" });
    }

    if (typeof dayNumber !== "number") {
      return res.status(400).json({ message: "dayNumber must be a number" });
    }

    const day = await prisma.tourDay.create({
      data: {
        tourId,
        dayNumber,
        title: title ?? null,
      },
    });

    res.status(201).json(day);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create tour day" });
  }
};

export const getTourDays = async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params;

    if (!tourId) {
      return res.status(400).json({ message: "tourId is required" });
    }

    const days = await prisma.tourDay.findMany({
      where: { tourId },
      orderBy: { dayNumber: "asc" },
      include: {
        items: { orderBy: { createdAt: "asc" } },
      },
    });

    res.json(days);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tour days" });
  }
};

export const updateTourDay = async (req: Request, res: Response) => {
  try {
    const { dayId } = req.params;
    const { dayNumber, title } = req.body;

    if (!dayId) {
      return res.status(400).json({ message: "dayId is required" });
    }

    const day = await prisma.tourDay.update({
      where: { id: dayId },
      data: {
        ...(dayNumber !== undefined && { dayNumber }),
        ...(title !== undefined && { title }),
      },
    });

    res.json(day);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update tour day" });
  }
};

export const deleteTourDay = async (req: Request, res: Response) => {
  try {
    const { dayId } = req.params;

    if (!dayId) {
      return res.status(400).json({ message: "dayId is required" });
    }

    await prisma.tourDay.delete({
      where: { id: dayId },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete tour day" });
  }
};

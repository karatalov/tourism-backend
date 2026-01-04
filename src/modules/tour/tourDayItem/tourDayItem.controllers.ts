import { Request, Response } from "express";
import prisma from "../../../config/prisma";

export const createTourDayItem = async (req: Request, res: Response) => {
  try {
    const { dayId } = req.params;
    const {
      title,
      description,
      images,
      pointStart,
      pointEnd,
      location,
      price,
      duration,
      complexity,
    } = req.body;

    if (!dayId) {
      return res.status(400).json({ message: "dayId is required" });
    }

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "title and description are required" });
    }

    const item = await prisma.tourDayItem.create({
      data: {
        dayId,
        title,
        description,
        images: images ?? [],
        pointStart,
        pointEnd,
        location,
        price,
        duration,
        complexity,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create tour day item" });
  }
};

export const getTourDayItems = async (req: Request, res: Response) => {
  try {
    const { dayId } = req.params;

    if (!dayId) {
      return res.status(400).json({ message: "dayId is required" });
    }

    const items = await prisma.tourDayItem.findMany({
      where: { dayId },
      orderBy: { createdAt: "asc" },
    });

    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tour day items" });
  }
};

export const updateTourDayItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const {
      title,
      description,
      images,
      pointStart,
      pointEnd,
      location,
      price,
      duration,
      complexity,
    } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "itemId is required" });
    }

    const item = await prisma.tourDayItem.update({
      where: { id: itemId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(images !== undefined && { images }),
        ...(pointStart !== undefined && { pointStart }),
        ...(pointEnd !== undefined && { pointEnd }),
        ...(location !== undefined && { location }),
        ...(price !== undefined && { price }),
        ...(duration !== undefined && { duration }),
        ...(complexity !== undefined && { complexity }),
      },
    });

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update tour day item" });
  }
};

export const deleteTourDayItem = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({ message: "itemId is required" });
    }

    await prisma.tourDayItem.delete({
      where: { id: itemId },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete tour day item" });
  }
};

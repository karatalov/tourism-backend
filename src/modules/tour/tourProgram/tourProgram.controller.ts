import { Request, Response } from "express";
import prisma from "../../../config/prisma";

export const getTourProgram = async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params;

    if (!tourId) {
      return res.status(400).json({ message: "tourId is required" });
    }

    const program = await prisma.tourDay.findMany({
      where: { tourId },
      orderBy: { dayNumber: "asc" },
      include: {
        items: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    res.json({
      tourId,
      days: program,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch tour program" });
  }
};

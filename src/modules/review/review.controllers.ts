import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { t } from "../../locale/i18n/settings";

export const addTourReview = async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params;
    const { rating, comment, images } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: t("review.not_authorized", req.lang),
      });
    }

    if (!tourId) {
      return res.status(400).json({
        success: false,
        message: t("review.tour_id_required", req.lang),
      });
    }

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: t("review.rating_comment_required", req.lang),
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: t("review.rating_range", req.lang),
      });
    }

    const tourExists = await prisma.tour.findUnique({
      where: { id: tourId },
    });

    if (!tourExists) {
      return res.status(404).json({
        success: false,
        message: t("review.tour_not_found", req.lang),
      });
    }

    const existingReview = await prisma.tourReview.findUnique({
      where: {
        tourId_userId: {
          tourId,
          userId,
        },
      },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: t("review.already_left", req.lang),
      });
    }

    const review = await prisma.tourReview.create({
      data: {
        tourId,
        userId,
        rating: Number(rating),
        comment: String(comment),
        images: Array.isArray(images) ? images : [],
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
        tour: {
          select: { id: true, name: true },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: t("review.created", req.lang),
      review,
    });
  } catch (error) {
    console.error("addTourReview error:", error);
    return res.status(500).json({
      success: false,
      message: t("review.create_error", req.lang),
    });
  }
};

export const deleteTourReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: t("review.not_authorized", req.lang),
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: t("review.id_required", req.lang),
      });
    }

    const review = await prisma.tourReview.findUnique({
      where: { id },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: t("review.not_found", req.lang),
      });
    }

    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: t("review.forbidden", req.lang),
      });
    }

    await prisma.tourReview.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: t("review.deleted", req.lang),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: t("review.delete_error", req.lang),
    });
  }
};

export const addCarReview = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const { rating, comment, images } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: t("review.not_authorized", req.lang),
      });
    }

    if (!carId) {
      return res.status(400).json({
        success: false,
        message: t("review.car_id_required", req.lang),
      });
    }

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: t("review.rating_comment_required", req.lang),
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: t("review.rating_range", req.lang),
      });
    }

    const carExists = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!carExists) {
      return res.status(404).json({
        success: false,
        message: t("review.car_not_found", req.lang),
      });
    }

    const existingReview = await prisma.carReview.findUnique({
      where: {
        carId_userId: { carId, userId },
      },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: t("review.already_left", req.lang),
      });
    }

    const review = await prisma.carReview.create({
      data: {
        carId,
        userId,
        rating: Number(rating),
        comment,
        images: Array.isArray(images) ? images : [],
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
        car: {
          select: { id: true, model: true, brand: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: t("review.created", req.lang),
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: t("review.create_error", req.lang),
    });
  }
};

export const deleteCarReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: t("review.not_authorized", req.lang),
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: t("review.id_required", req.lang),
      });
    }

    const review = await prisma.carReview.findUnique({
      where: { id },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: t("review.not_found", req.lang),
      });
    }

    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: t("review.forbidden", req.lang),
      });
    }

    await prisma.carReview.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: t("review.deleted", req.lang),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: t("review.delete_error", req.lang),
    });
  }
};

export const getAllSiteReviews = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const where: any = {};
    if (category) where.category = category;

    const reviews = await prisma.siteReview.findMany({
      where,
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: t("review.get_all_error", req.lang),
    });
  }
};

export const addSiteReview = async (req: Request, res: Response) => {
  try {
    const { rating, comment, category } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: t("review.not_authorized", req.lang),
      });
    }

    if (!rating || !comment || !category) {
      return res.status(400).json({
        success: false,
        message: t("review.fill_all_fields", req.lang),
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: t("review.rating_range", req.lang),
      });
    }

    const validCategories = ["service", "website", "support"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: t("review.invalid_category", req.lang),
      });
    }

    const review = await prisma.siteReview.create({
      data: {
        userId,
        rating: Number(rating),
        comment,
        category,
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: t("review.created", req.lang),
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: t("review.create_error", req.lang),
    });
  }
};

export const deleteSiteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: t("review.not_authorized", req.lang),
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: t("review.id_required", req.lang),
      });
    }

    const review = await prisma.siteReview.findUnique({
      where: { id },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: t("review.not_found", req.lang),
      });
    }

    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: t("review.forbidden", req.lang),
      });
    }

    await prisma.siteReview.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: t("review.deleted", req.lang),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: t("review.delete_error", req.lang),
    });
  }
};

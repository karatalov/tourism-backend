import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { t } from "../../locale/i18n/settings";

export const getFavoriteTours = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

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
        createdAt: "desc",
      },
    });

    const tours = favorites.map((fav) => {
      const avgRating =
        fav.tour.reviews.length > 0
          ? fav.tour.reviews.reduce((sum, r) => sum + r.rating, 0) /
            fav.tour.reviews.length
          : 0;

      return {
        ...fav.tour,
        avgRating: Number(avgRating.toFixed(1)),
        favoriteId: fav.id,
        addedAt: fav.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      count: tours.length,
      tours,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: t("favorite.get_tours_error", req.lang),
    });
  }
};

export const addFavoriteTour = async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params;
    const userId = req.user?.userId;

    if (!tourId) {
      return res.status(400).json({
        success: false,
        message: t("favorite.tour_id_required", req.lang),
      });
    }

    const tourExists = await prisma.tour.findUnique({
      where: { id: tourId },
    });

    if (!tourExists) {
      return res.status(404).json({
        success: false,
        message: t("favorite.tour_not_found", req.lang),
      });
    }

    const existingFavorite = await prisma.favoriteTour.findUnique({
      where: {
        userId_tourId: {
          userId: userId!,
          tourId,
        },
      },
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: t("favorite.tour_already_added", req.lang),
      });
    }

    const favorite = await prisma.favoriteTour.create({
      data: {
        userId: userId!,
        tourId,
      },
      include: {
        tour: true,
      },
    });

    res.status(201).json({
      success: true,
      message: t("favorite.tour_added", req.lang),
      favorite,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: t("favorite.add_error", req.lang),
    });
  }
};

export const removeFavoriteTour = async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params;
    const userId = req.user?.userId;

    if (!tourId) {
      return res.status(400).json({
        success: false,
        message: t("favorite.tour_id_required", req.lang),
      });
    }

    const favorite = await prisma.favoriteTour.findUnique({
      where: {
        userId_tourId: {
          userId: userId!,
          tourId,
        },
      },
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: t("favorite.tour_not_in_favorites", req.lang),
      });
    }

    await prisma.favoriteTour.delete({
      where: {
        userId_tourId: {
          userId: userId!,
          tourId,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: t("favorite.tour_removed", req.lang),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: t("favorite.remove_error", req.lang),
    });
  }
};

export const getFavoriteCars = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

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
        createdAt: "desc",
      },
    });

    const cars = favorites.map((fav) => {
      const avgRating =
        fav.car.reviews.length > 0
          ? fav.car.reviews.reduce((sum, r) => sum + r.rating, 0) /
            fav.car.reviews.length
          : 0;

      return {
        ...fav.car,
        avgRating: Number(avgRating.toFixed(1)),
        favoriteId: fav.id,
        addedAt: fav.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      count: cars.length,
      cars,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: t("favorite.get_cars_error", req.lang),
    });
  }
};

export const addFavoriteCar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const userId = req.user?.userId;

    if (!carId) {
      return res.status(400).json({
        success: false,
        message: t("favorite.car_id_required", req.lang),
      });
    }

    const carExists = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!carExists) {
      return res.status(404).json({
        success: false,
        message: t("favorite.car_not_found", req.lang),
      });
    }

    const existingFavorite = await prisma.favoriteCar.findUnique({
      where: {
        userId_carId: {
          userId: userId!,
          carId,
        },
      },
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: t("favorite.car_already_added", req.lang),
      });
    }

    const favorite = await prisma.favoriteCar.create({
      data: {
        userId: userId!,
        carId,
      },
      include: {
        car: true,
      },
    });

    res.status(201).json({
      success: true,
      message: t("favorite.car_added", req.lang),
      favorite,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: t("favorite.add_error", req.lang),
    });
  }
};

export const removeFavoriteCar = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const userId = req.user?.userId;

    if (!carId) {
      return res.status(400).json({
        success: false,
        message: t("favorite.car_id_required", req.lang),
      });
    }

    const favorite = await prisma.favoriteCar.findUnique({
      where: {
        userId_carId: {
          userId: userId!,
          carId,
        },
      },
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: t("favorite.car_not_in_favorites", req.lang),
      });
    }

    await prisma.favoriteCar.delete({
      where: {
        userId_carId: {
          userId: userId!,
          carId,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: t("favorite.car_removed", req.lang),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: t("favorite.remove_error", req.lang),
    });
  }
};

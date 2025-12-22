import { Request, Response } from "express";
import prisma from "../../config/prisma";
import { hashPassword, comparePassword } from "../../utils/hashPassword";
import { generateToken } from "../../utils/generateToken";
import { t } from "../../locale/i18n/settings";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: t("auth.fill_all_fields", req.lang),
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: t("auth.user_exists", req.lang),
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    const token = generateToken({ userId: user.id, email: user.email });

    res.status(201).json({
      success: true,
      message: t("auth.register_success", req.lang),
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: t("auth.register_error", req.lang),
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: t("auth.enter_email_password", req.lang),
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: t("auth.user_not_found", req.lang),
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: t("auth.invalid_password", req.lang),
      });
    }

    const token = generateToken({ userId: user.id, email: user.email });

    res.status(200).json({
      success: true,
      message: t("auth.login_success", req.lang),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: t("auth.login_error", req.lang),
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: t("auth.not_authorized", req.lang),
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            favoriteTours: true,
            favoriteCars: true,
            tourReviews: true,
            carReviews: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: t("auth.user_not_found", req.lang),
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Ошибка в getMe:", error);
    res.status(500).json({
      success: false,
      message: t("auth.getme_error", req.lang),
    });
  }
};

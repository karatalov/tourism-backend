import { Request, Response, NextFunction } from "express";
import type { Lang } from "../locale/i18n/settings";

declare global {
  namespace Express {
    interface Request {
      lang: Lang;
    }
  }
}

export const langFromPathMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { lang } = req.params;

  if (!["ru", "en", "ky"].includes(lang as any)) {
    return res.status(404).json({
      success: false,
      message: "Invalid language",
    });
  }

  req.lang = lang as Lang;
  next();
};

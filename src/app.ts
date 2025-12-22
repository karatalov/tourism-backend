import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import session from "express-session";

import globalRouter from "./router";
import { langFromPathMiddleware } from "./middleware/langFromPath";
import { swaggerServe, swaggerSetup } from "./swagger";

const buildServer = (): Express => {
  const server = express();

  server.use(cors());
  server.use(express.json());

  server.use(
    session({
      secret: process.env.ADMIN_COOKIE_SECRET!,
      resave: false,
      saveUninitialized: false,
    })
  );

  server.get("/", (_, res) => {
    res.json({
      success: true,
      message: "🏔️ Tourism API v1 ThreeX",
      examples: ["/ru/api/v1/auth", "/en/api/v1/tours", "/ky/api/v1/cars"],
    });
  });

  server.use("/:lang/api/v1", langFromPathMiddleware, globalRouter);
  server.use("/docs", swaggerServe, swaggerSetup);

  return server;
};

export default buildServer;

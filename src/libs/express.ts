import { defaultValidationConfig, env, ROUTE_PREFIX } from "@/common";
import {
  ErrorLogger,
  HttpErrorHandler,
  RequestLogger,
  RouteNotFoundHandler,
} from "@/middlewares";
import express, { Express } from "express";
import { ForbiddenError, useExpressServer } from "routing-controllers";

import { ToHttpError } from "@/middlewares/errors/ToHttpError";
import cors from "cors";
import helmet from "helmet";
import { Logger } from ".";

const securityMiddleware = (app: Express) => {
  app.enable("trust proxy");
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || env.keys.CORS_WHITELIST.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new ForbiddenError("Not allowed by CORS"), false);
        }
      },
      credentials: true,
    })
  );
};

const standardMiddleware = (app: Express) => {
  app.use(express.json());
};

export const app = express();

securityMiddleware(app);
standardMiddleware(app);

useExpressServer(app, {
  controllers: [],
  routePrefix: ROUTE_PREFIX,
  defaultErrorHandler: false,
  validation: defaultValidationConfig,
  middlewares: [
    RequestLogger,
    RouteNotFoundHandler,
    ToHttpError,
    HttpErrorHandler,
    ErrorLogger,
  ],
});

app.listen(env.keys.PORT, () => {
  Logger.info(`HTTP server listening on port ${env.keys.PORT}`);
});

import { defaultValidationConfig, env, ROUTE_PREFIX } from "@/common";
import {
  ErrorLogger,
  HttpErrorHandler,
  RequestLogger,
  RouteNotFoundHandler,
} from "@/middlewares";
import express, { Express } from "express";
import { useExpressServer } from "routing-controllers";

import { ToHttpError } from "@/middlewares/errors/ToHttpError";
import cors from "cors";
import helmet from "helmet";
import { Logger } from ".";

import { HelloWorldController } from "@/modules/hello-world";

const securityMiddleware = (app: Express) => {
  app.enable("trust proxy");
  app.use(helmet());
  app.use(cors());
};

const standardMiddleware = (app: Express) => {
  app.use(express.json());
};

export const app = express();

securityMiddleware(app);
standardMiddleware(app);

useExpressServer(app, {
  controllers: [HelloWorldController],
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

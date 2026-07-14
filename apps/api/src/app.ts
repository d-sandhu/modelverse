import { randomUUID } from "node:crypto";
import { Prisma, type PrismaClient } from "@prisma/client";
import cors from "cors";
import express, { type ErrorRequestHandler, type RequestHandler } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import pino from "pino";
import pinoHttp from "pino-http";
import { z, ZodError } from "zod";

type Repository = Pick<
  PrismaClient,
  | "world"
  | "provenance"
  | "session"
  | "worldProgress"
  | "score"
  | "modelGuess"
  | "worldRating"
  | "analyticsEvent"
>;
export type AppOptions = {
  repository?: Repository;
  corsOrigin?: string;
  logLevel?: string;
};
const asyncRoute =
  (
    handler: (request: express.Request, response: express.Response) => Promise<void>,
  ): RequestHandler =>
  (request, response, next) => {
    void handler(request, response).catch(next);
  };
const jsonValue = z.record(z.unknown()).default({});
const parameter = (value: string | string[] | undefined, name: string): string =>
  z.string().min(1, `${name} is required`).parse(value);
const toJson = (value: Record<string, unknown>): Prisma.InputJsonObject =>
  JSON.parse(JSON.stringify(value)) as Prisma.InputJsonObject;

export const createApp = (options: AppOptions = {}) => {
  const app = express();
  const logger = pino({ level: options.logLevel ?? "silent" });
  app.disable("x-powered-by");
  app.use((request, response, next) => {
    const id = request.header("x-request-id") ?? randomUUID();
    response.setHeader("x-request-id", id);
    next();
  });
  app.use(pinoHttp({ logger }));
  app.use(helmet());
  app.use(cors({ origin: options.corsOrigin ?? "http://localhost:5173" }));
  app.use(express.json({ limit: "64kb" }));
  app.use(
    "/api",
    rateLimit({
      windowMs: 60_000,
      limit: 180,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
  );
  app.get("/health", (_request, response) =>
    response.json({ status: "ok", service: "modelverse-api" }),
  );
  const repository = options.repository;
  const requireRepository = (): Repository => {
    if (repository === undefined)
      throw Object.assign(new Error("Database is unavailable"), { statusCode: 503 });
    return repository;
  };
  app.get(
    "/api/worlds",
    asyncRoute(async (_request, response) => {
      response.json(
        await requireRepository().world.findMany({
          where: { published: true },
          orderBy: { title: "asc" },
        }),
      );
    }),
  );
  app.get(
    "/api/worlds/:worldId",
    asyncRoute(async (request, response) => {
      const world = await requireRepository().world.findUnique({
        where: { id: parameter(request.params.worldId, "worldId") },
      });
      if (world === null) {
        response.status(404).json({ error: "World not found" });
        return;
      }
      response.json(world);
    }),
  );
  app.get(
    "/api/worlds/:worldId/provenance",
    asyncRoute(async (request, response) => {
      const value = await requireRepository().provenance.findUnique({
        where: { worldId: parameter(request.params.worldId, "worldId") },
      });
      if (value === null) {
        response.status(404).json({ error: "Provenance not found" });
        return;
      }
      response.json(value);
    }),
  );
  app.post(
    "/api/sessions",
    asyncRoute(async (request, response) => {
      const body = z
        .object({ clientId: z.string().min(1).max(128).optional() })
        .parse(request.body);
      const value = await requireRepository().session.create({
        data: { clientId: body.clientId ?? null },
      });
      response.status(201).json(value);
    }),
  );
  app.put(
    "/api/sessions/:sessionId/progress",
    asyncRoute(async (request, response) => {
      const body = z
        .object({
          worldId: z.string().min(1),
          schemaVersion: z.number().int().nonnegative(),
          value: jsonValue,
        })
        .parse(request.body);
      const sessionId = parameter(request.params.sessionId, "sessionId");
      const id = `${sessionId}:${body.worldId}`;
      const value = await requireRepository().worldProgress.upsert({
        where: { id },
        create: {
          id,
          sessionId,
          worldId: body.worldId,
          schemaVersion: body.schemaVersion,
          value: toJson(body.value),
        },
        update: { schemaVersion: body.schemaVersion, value: toJson(body.value) },
      });
      response.json(value);
    }),
  );
  app.post(
    "/api/scores",
    asyncRoute(async (request, response) => {
      const body = z
        .object({
          sessionId: z.string(),
          worldId: z.string(),
          category: z.string().min(1),
          value: z.number(),
          metadata: jsonValue,
        })
        .parse(request.body);
      response.status(201).json(
        await requireRepository().score.create({
          data: { ...body, metadata: toJson(body.metadata) },
        }),
      );
    }),
  );
  app.get(
    "/api/scores/:worldId",
    asyncRoute(async (request, response) => {
      response.json(
        await requireRepository().score.findMany({
          where: { worldId: parameter(request.params.worldId, "worldId") },
          orderBy: { value: "desc" },
          take: 100,
        }),
      );
    }),
  );
  app.post(
    "/api/model-guesses",
    asyncRoute(async (request, response) => {
      const body = z
        .object({
          sessionId: z.string(),
          worldId: z.string(),
          guess: z.string().min(1).max(120),
        })
        .parse(request.body);
      response
        .status(201)
        .json(await requireRepository().modelGuess.create({ data: body }));
    }),
  );
  app.post(
    "/api/world-ratings",
    asyncRoute(async (request, response) => {
      const body = z
        .object({
          sessionId: z.string(),
          worldId: z.string(),
          rating: z.number().int().min(1).max(5),
        })
        .parse(request.body);
      response
        .status(201)
        .json(await requireRepository().worldRating.create({ data: body }));
    }),
  );
  app.post(
    "/api/events",
    asyncRoute(async (request, response) => {
      const body = z
        .object({
          sessionId: z.string().nullable().optional(),
          name: z.string().min(1).max(120),
          properties: jsonValue,
        })
        .parse(request.body);
      response.status(202).json(
        await requireRepository().analyticsEvent.create({
          data: {
            sessionId: body.sessionId ?? null,
            name: body.name,
            properties: toJson(body.properties),
          },
        }),
      );
    }),
  );
  app.use((_request, response) =>
    response.status(404).json({ error: "Route not found" }),
  );
  const errorHandler: ErrorRequestHandler = (
    error: unknown,
    request,
    response,
    _next,
  ) => {
    const requestId = response.getHeader("x-request-id");
    if (error instanceof ZodError) {
      response
        .status(400)
        .json({ error: "Validation failed", issues: error.issues, requestId });
      return;
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    const status =
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      typeof error.statusCode === "number"
        ? error.statusCode
        : 500;
    request.log.error({ error, requestId }, "request failed");
    response
      .status(status)
      .json({ error: status >= 500 ? "Internal server error" : message, requestId });
  };
  app.use(errorHandler);
  return app;
};

import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";
describe("API shell", () => {
  it("reports health without a database", async () => {
    const response = await request(createApp()).get("/health").expect(200);
    expect(response.body).toEqual({ status: "ok", service: "modelverse-api" });
    expect(response.headers["x-request-id"]).toBeTypeOf("string");
  });
  it("validates JSON routes before database work", async () => {
    await request(createApp()).post("/api/scores").send({ value: "bad" }).expect(400);
  });
  it("returns a controlled unavailable response without a database", async () => {
    await request(createApp()).get("/api/worlds").expect(503);
  });
});

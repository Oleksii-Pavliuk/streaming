import request from 'supertest';
import app from './app';
import { describe, test, expect } from '@jest/globals';


describe("GET /health", () => {
  describe("do the health check", () => {

    test("should respond with a 200 status code", async () => {
      const response = await request(app).get("/health");
      expect(response.statusCode).toBe(200);
    })

    test("should respond with a 404 status code", async () => {
      const response = await request(app).post("/healts");
      expect(response.statusCode).toBe(404);
    });
  });

});
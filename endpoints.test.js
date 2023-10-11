const request = require("supertest");
const app = require("./server.js");
const db = require("./database");

describe("Endpoint Availability", () => {
  // Test for Health Check
  test("GET /health-check should return 'Hello World'", async () => {
    const res = await request(app).get("/health-check");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Hello World");
  });

  // Test for Database Connection Check (Success)
  test("GET /checkDatabaseConnection should return success message", async () => {
    const res = await request(app).get("/checkDatabaseConnection");
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Database is connected");
  });
    // Test for Top Movies (Data Validation)
    test("GET /movies/top should return valid array", async () => {
      const res = await request(app).get("/movies/top");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  
    // Test for Top Actors (Data Validation)
    test("GET /actors/top should return valid array", async () => {
      const res = await request(app).get("/actors/top");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  
    // Test for Movie Details with Invalid ID
    test("GET /movies/details/:id should handle invalid ID", async () => {
      const res = await request(app).get("/movies/details/invalid_id");
      expect(res.statusCode).toEqual(200)
    });

    // Test for Actor Details with Invalid ID
    test("GET /actors/details/:id should handle invalid ID", async () => {
      const res = await request(app).get("/actors/details/invalid_id");
      expect(res.statusCode).toEqual(200);
    });
  
    // Test for All Movie Genres (Data Format)
    test("GET /movies/genres should return valid array", async () => {
      const res = await request(app).get("/movies/genres");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  
    // Test for All Movies (Data Validation)
    test("GET /movies/all should return valid array", async () => {
      const res = await request(app).get("/movies/all");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  
    // Test for All Actors (Data Validation)
    test("GET /actors/all should return valid array", async () => {
      const res = await request(app).get("/actors/all");
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  
});

import supertest from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/user.model.js";

const request = supertest(app);

beforeAll(async () => {
  const MONGO_DB_TEST_URI = process.env.MONGO_DB_TEST_URI;
  await mongoose.connect(MONGO_DB_TEST_URI);
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Authentication", () => {
  it("should sign up a new user", async () => {
    const user = {
      fullName: "Jane Doe",
      username: "janedoe",
      password: "password123",
      confirmPassword: "password123",
      gender: "female",
    };

    const response = await request.post("/api/auth/signup").send(user);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "Signed up successfully");
  });

  it("should not sign up a user with existing username", async () => {
    const existingUser = {
      fullName: "John Doe",
      username: "johndoe",
      password: "password123",
      confirmPassword: "password123",
      gender: "male",
    };
    await request.post("/api/auth/signup").send(existingUser);

    const newUser = {
      fullName: "Jane Doe",
      username: "johndoe",
      password: "password123",
      confirmPassword: "password123",
      gender: "female",
    };

    const response = await request.post("/api/auth/signup").send(newUser);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Username already exists");
  });

  it("should login an existing user", async () => {
    const user = {
      fullName: "Jane Doe",
      username: "janedoe",
      password: "password123",
      confirmPassword: "password123",
      gender: "female",
    };
    await request.post("/api/auth/signup").send(user);

    const response = await request.post("/api/auth/login").send({
      username: user.username,
      password: user.password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("fullName", user.fullName);
    expect(response.body).toHaveProperty("username", user.username);
    expect(response.body).toHaveProperty("profilePic");
  });

  it("should not login with incorrect username or password", async () => {
    const response = await request.post("/api/auth/login").send({
      username: "nonexistentuser",
      password: "wrongpassword",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid username or password");
  });

  it("should set a cookie upon successful login", async () => {
    const user = {
      fullName: "Jane Doe",
      username: "janedoe",
      password: "password123",
      confirmPassword: "password123",
      gender: "female",
    };
    await request.post("/api/auth/signup").send(user);

    const response = await request.post("/api/auth/login").send({
      username: user.username,
      password: user.password,
    });

    expect(response.statusCode).toBe(200);

    const cookies = response.headers["set-cookie"];
    expect(cookies).toBeDefined();

    const cookie = cookies[0];
    expect(cookie).toContain("jwt");
  });

  it("should logout a user", async () => {
    const response = await request.post("/api/auth/logout");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Logged out successfully");
  });

  it("should invalidate JWT upon logout request", async () => {
    const response = await request.post("/api/auth/logout").send();

    expect(response.statusCode).toBe(200);

    const cookies = response.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies).toHaveLength(1);

    const cookie = cookies[0];
    expect(cookie).toContain("jwt=;");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

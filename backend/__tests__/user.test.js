import supertest from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../app.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

const request = supertest(app);
let users;
let mainUserId;
let otherUserIds;
let mainUserToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_DB_TEST_URI);

  await User.deleteMany({});
  await Message.deleteMany({});
  await Conversation.deleteMany({});

  users = await User.insertMany([
    {
      fullName: "Main User",
      username: "mainuser",
      password: "password",
      gender: "male",
    },
    {
      fullName: "User Two",
      username: "usertwo",
      password: "password",
      gender: "female",
    },
    {
      fullName: "User Three",
      username: "userthree",
      password: "password",
      gender: "prefer not to say",
    },
  ]);

  mainUserId = users[0]._id;
  otherUserIds = [users[1]._id, users[2]._id];

  mainUserToken = jwt.sign({ userId: mainUserId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  await Promise.all(
    otherUserIds.map((userId) =>
      Message.create({
        senderId: mainUserId,
        receiverId: userId,
        message: `Hello ${userId}`,
      })
    )
  );
});

describe("Retrieve User List for Sidebar Excluding Logged-in User", () => {
  it("should return a list of users excluding the logged-in user", async () => {
    const response = await request
      .get("/api/users")
      .set("Cookie", `jwt=${mainUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body.some((user) => user._id === mainUserId)).toBe(false);
  });

  it("should ensure that no sensitive information, such as passwords, is returned in the user list", async () => {
    const response = await request
      .get("/api/users")
      .set("Cookie", `jwt=${mainUserToken}`);

    expect(response.status).toBe(200);
    response.body.forEach((user) => {
      expect(user.password).toBeUndefined();
    });
  });

  it("should deny access without a valid JWT token", async () => {
    const response = await request.get("/api/users");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Unauthorized - No Token Provided");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

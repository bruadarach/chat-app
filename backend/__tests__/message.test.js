import supertest from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../app.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

const request = supertest(app);
let userToken;
let user;
let anotherUser;
let anotherUserId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_DB_TEST_URI);

  await User.deleteMany({});
  await Message.deleteMany({});
  await Conversation.deleteMany({});

  user = await User.create({
    fullName: "Test User",
    username: "testuser",
    password: "password",
    gender: "female",
  });

  anotherUser = await User.create({
    fullName: "Another User",
    username: "anotheruser",
    password: "password",
    gender: "male",
  });

  anotherUserId = anotherUser._id.toString();

  userToken = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
});

describe("Secure Messaging Functionality", () => {
  describe("Model and Data Integrity", () => {
    it("should correctly create and retrieve a Conversation", async () => {
      const conversation = await Conversation.create({
        participants: [user._id, anotherUser._id],
        messages: [],
      });

      expect(conversation.participants).toHaveLength(2);
      expect(conversation.messages).toEqual([]);
      expect(conversation.participants).toContainEqual(user._id);
      expect(conversation.participants).toContainEqual(anotherUser._id);
    });

    it("should correctly create and link a Message to a Conversation", async () => {
      const conversation = await Conversation.create({
        participants: [user._id, anotherUser._id],
      });

      const message = await Message.create({
        senderId: user._id,
        receiverId: anotherUser._id,
        message: "Hello, World!",
      });

      conversation.messages.push(message._id);
      await conversation.save();

      const updatedConversation = await Conversation.findById(
        conversation._id
      ).populate("messages");

      expect(updatedConversation.messages).toHaveLength(1);
      expect(updatedConversation.messages[0].message).toBe("Hello, World!");
      expect(updatedConversation.messages[0].senderId).toEqual(user._id);
      expect(updatedConversation.messages[0].receiverId).toEqual(
        anotherUser._id
      );
    });
  });

  describe("Authentication and Authorization", () => {
    let sentMessageId;
    const sentMessageContent = "Hello Test";

    it("should deny access to send a message without a valid JWT token", async () => {
      const response = await request
        .post(`/api/messages/send/${anotherUserId}`)
        .send({ message: "Hello, World!" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Unauthorized - No Token Provided");
    });

    it("should grant access to send a message with a valid JWT token", async () => {
      const response = await request
        .post(`/api/messages/send/${anotherUserId}`)
        .set("Cookie", `jwt=${userToken}`)
        .send({ message: sentMessageContent });

      expect(response.status).toBe(201);
      expect(response.body.message).toEqual(sentMessageContent);
      sentMessageId = response.body._id;
    });

    it("should deny access to retrieve messages without a valid JWT token", async () => {
      const response = await request.get(`/api/messages/${anotherUserId}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Unauthorized - No Token Provided");
    });

    it("should grant access to retrieve messages with a valid JWT token", async () => {
      const response = await request
        .get(`/api/messages/${anotherUserId}`)
        .set("Cookie", `jwt=${userToken}`);

      expect(response.status).toBe(200); //
      expect(Array.isArray(response.body)).toBeTruthy();

      const retrievedMessage = response.body.find(
        (message) => message._id === sentMessageId
      );

      expect(retrievedMessage).toBeTruthy();
      expect(retrievedMessage.message).toEqual(sentMessageContent);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

import dotenv from "dotenv";
import connectToMongoDB from "./db/connectToMongoDB.js";
import { server } from "./socket/socket.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});

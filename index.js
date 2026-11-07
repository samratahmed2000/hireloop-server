import express from "express";
import cors from "cors";
import "dotenv/config";
import { MongoClient } from "mongodb";

const app = express();
const PORT = process.env.PORT || 8000;

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

app.use(cors());
app.use(express.json());

const connectedClient = await connectToMongoDB();
const db = connectedClient.db("hireloopDB");
const userCollection = db.collection("users");
const jobCollection = db.collection("jobs");

app.get("/", (req, res) => {
  res.send("Hireloop server is running");
});

app.listen(PORT, () => {
  console.log(`Hireloop is running at ${PORT}`);
});

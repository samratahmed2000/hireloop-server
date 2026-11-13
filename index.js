import express from "express";
import cors from "cors";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

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

const connectedClient = await connectToMongoDB();
const database = connectedClient.db("hireloopDB");
const userCollection = database.collection("users");
const jobCollection = database.collection("jobs");

app.get("/", (req, res) => {
  res.send("Hireloop server is running");
});

// users
app.get("/users", async (req, res) => {
  const cursor = userCollection.find({});
  const result = await cursor.toArray();
  res.send(result);
});

// jobs
app.get("/jobs", async (req, res) => {
  const cursor = jobCollection.find({});
  const result = await cursor.toArray();
  res.send(result);
});

app.post("/jobs", async (req, res) => {
  const jobs = req.body;
  const result = await jobCollection.insertOne(jobs);
  res.send(result);
});

app.patch("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await jobCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: data },
  );
  res.send(result);
});

app.delete("/jobs/:id", async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid job id" });
  }
  const result = await jobCollection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    return res.status(404).send({ message: "Job not found" });
  }
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Hireloop is running at ${PORT}`);
});

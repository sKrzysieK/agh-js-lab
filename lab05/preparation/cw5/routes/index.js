import express from "express";
import { MongoClient } from "mongodb";
const router = express.Router();

router.get("/students", async function (req, res, next) {
  const client = new MongoClient("mongodb://127.0.0.1:27017");
  await client.connect();
  const db = client.db("AGH");
  const collection = db.collection("students");
  const students = await collection.find({}).toArray();
  client.close();
  res.render("index2", { students });
});

router.get("/students/:faculty", async (req, res, next) => {
    try {
      const faculty = req.params.faculty.toUpperCase();
      const client = new MongoClient("mongodb://127.0.0.1:27017");
      await client.connect();
      const db = client.db("AGH");
      const collection = db.collection("students");
      const students = await collection.find({ faculty }).toArray();
      client.close();
      res.render("index2", { students });
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).send("Internal Server Error");
    }
  });

export default router;

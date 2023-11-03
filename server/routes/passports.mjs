import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/material_record", async (req, res) => {
  const collection = await db.collection("material_records");
  const cursor = await collection.find(req.query);
  const result = await cursor.toArray();
  res.send(result).status(200);
});

router.post("/material_record", async (req, res) => {
  let doc = req.body;
  doc.timestamp = new Date();
  const collection = await db.collection("material_records");
  const result = await collection.insertOne(doc);
  // console.log(`${result.insertedCount} documents were inserted`);
  res.send(result).status(201);
});

router.delete("/material_record", async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "Request does not have a body" });
    return;
  }
  let doc = req.body;
  const collection = await db.collection("material_records");
  const result = await collection.deleteOne(doc);
  // console.log(`${result.insertedCount} documents were inserted`);
  res.send(result);
});


router.get("/operation_record", async (req, res) => {
  const collection = await db.collection("operation_records");
  const cursor = await collection.find(req.query);
  const result = await cursor.toArray();
  res.send(result).status(200);
});

router.post("/operation_record", async (req, res) => {
  let doc = req.body;
  doc.timestamp = new Date();
  const collection = await db.collection("operation_records");
  const result = await collection.insertOne(doc);
  // console.log(`${result.insertedCount} documents were inserted`);
  res.send(result).status(201);
});

router.put("/operation_record", async (req, res) => {
  let doc = req.body;
  const options = { upsert: true };
  doc.timestamp = new Date();
  const collection = await db.collection("operation_records");
  const result = await collection.updateOne(req.query, doc, options);
  // console.log(`${result.insertedCount} documents were inserted`);
  res.send(result).status(201);
});

router.delete("/operation_record", async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400).send({ message: "Request does not have a body" });
    return;
  }
  let doc = req.body;
  const collection = await db.collection("operation_records");
  const result = await collection.deleteOne(doc);
  // console.log(`${result.insertedCount} documents were inserted`);
  res.send(result);
});

export default router;

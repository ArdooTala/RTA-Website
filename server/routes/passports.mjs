import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/material_record", async (req, res) => {
  const collection = await db.collection("material_records");
//   const q = {};
//   q[req.query.qkey] = req.query.qvalue;
//   console.log(req.query);
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
  res.send(result);
});

export default router;

import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a single material by name
// router.get("/:mat_block_name", async (req, res) => {
//   const pipeline = [
//     {
//       $match: {
//         name: req.params.mat_block_name,
//       },
//     },
//     { $project: { name: 1, type: 1 } },
//   ];

//   let collection = await db.collection("material_blocks");
//   const aggCursor = collection.aggregate(pipeline);

//   let aggRes = await aggCursor.toArray();
//   // console.log(aggRes);
//   res.send(aggRes).status(200);
// });

router.post("/material_record", async (req, res) => {
  let doc = req.body;
  doc.timestamp = new Date();
  const collection = await db.collection("material_records");
  const result = await collection.insertOne(doc);
  // console.log(`${result.insertedCount} documents were inserted`);
  res.send(result);
});

export default router;

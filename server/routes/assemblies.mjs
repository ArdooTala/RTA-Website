import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all the assemblies.
router.get("/", async (req, res) => {
  const pipeline = [
    { $project: { "assembly.assembly_name": 1 } },
    { $group: { _id: "$assembly.assembly_name", count: { $sum: 1 } } },
  ];

  let collection = await db.collection("assembled_parts");
  const aggCursor = collection.aggregate(pipeline);
  // for await (const doc of aggCursor) {
  //   console.log(doc);
  // }
  let aggRes = await aggCursor.toArray();
  console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get a single assembly by name
router.get("/:name", async (req, res) => {
  let collection = await db.collection("assembled_parts");
  let query = { "assembly.assembly_name": req.params.name };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

export default router;
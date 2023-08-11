import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all the materials.
router.get("/", async (req, res) => {
  const pipeline = [{ $project: { name: 1, type: 1 } }];

  let collection = await db.collection("material_blocks");
  const aggCursor = collection.aggregate(pipeline);

  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get a list of all the material types.
router.get("/types", async (req, res) => {
  const pipeline = [
    {
      $group: {
        _id: "$type",
        count: {
          $sum: 1,
        },
      },
    },
  ];

  let collection = await db.collection("material_blocks");
  const aggCursor = collection.aggregate(pipeline);

  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get a list of all the materials by type.
router.get("/bytype", async (req, res) => {
  const pipeline = [
    {
      $match: {
        type: { $in: req.query.types.split(",") },
      },
    },
    { $project: { name: 1, type: 1 } },
  ];

  let collection = await db.collection("material_blocks");
  const aggCursor = collection.aggregate(pipeline);

  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get a single material by name
router.get("/:mat_block_name", async (req, res) => {
  const pipeline = [
    {
      $match: {
        name: req.params.mat_block_name,
      },
    },
    {
      $lookup: {
        from: "material_records",
        localField: "name",
        foreignField: "block_name",
        as: "records",
      },
    },
  ];

  let collection = await db.collection("material_blocks");
  const aggCursor = collection.aggregate(pipeline);

  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get a single material by name
router.post("/", async (req, res) => {
  let doc = req.body;
  doc.timestamp = new Date();
  const collection = await db.collection("material_blocks");
  const result = await collection.insertOne(doc);
  // console.log(`${result.insertedCount} documents were inserted`);
  res.send(result).status(201);
});

export default router;

import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all the parts.
router.get("/", async (req, res) => {
  let collection = await db.collection("assembly_ops");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// Get a single part by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("assembly_ops");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Create a new part.
router.post("/", async (req, res) => {
  // let newDocument = {
  //   name: req.body.name,
  //   position: req.body.position,
  //   level: req.body.level,
  // };
  let newDocument = req.body;
  console.log(newDocument);
  let collection = await db.collection("assembly_ops");
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// // This section will help you update a record by id.
// router.patch("/:id", async (req, res) => {
//   const query = { _id: new ObjectId(req.params.id) };
//   const updates = {
//     $set: {
//       name: req.body.name,
//       position: req.body.position,
//       level: req.body.level,
//     },
//   };

//   let collection = await db.collection("records");
//   let result = await collection.updateOne(query, updates);

//   res.send(result).status(200);
// });

// // This section will help you delete a record
// router.delete("/:id", async (req, res) => {
//   const query = { _id: new ObjectId(req.params.id) };

//   const collection = db.collection("records");
//   let result = await collection.deleteOne(query);

//   res.send(result).status(200);
// });

export default router;

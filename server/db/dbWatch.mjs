import express from "express";
import db from "./conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

let last_update = Date.now();
// const collection = await db.collection("assembly_ops");

let changeStream;
async function run() {
  console.log("Running MongoDB WATCH");
  try {
    const collection = await db.collection("assembly_ops");
    // Open a Change Stream on the "haikus" collection
    changeStream = collection.watch();
    // Print change events
    for await (const change of changeStream) {
      last_update = Date.now();
      console.log(`Received change [${last_update}]:\n`, change);
    }

    console.warn("Stopping MongoDB WATCH");
    await changeStream.close();
  } finally {
    await changeStream.close();
  }
  console.warn("MongoDB WATCH Stopped");
}

run().catch(console.dir);

router.get("/", async (req, res) => {
  res.send({ last_update: last_update }).status(200);
});

export default router;

import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all the assemblies.
router.get("/", async (req, res) => {
  const pipelineOpRecs = [
    {
      $project: {
        "operation.assembly_name": { $substr: ["$part_name", 1, 5] },
      },
    },
    { $group: { _id: "$operation.assembly_name", count: { $sum: 1 } } },
  ];
  let collectionOpRecs = await db.collection("operation_records");
  const aggCursorOpRecs = collectionOpRecs.aggregate(pipelineOpRecs);

  let aggResOpRecs = (await aggCursorOpRecs.toArray()).map((x) => {
    x.manual = true;
    return x;
  });

  res.send(aggResOpRecs).status(200);
});

// Get the assembly's assembly times
router.get("/timestamps/:assembly_name", async (req, res) => {
  const pipeline = [
    {
      $match: {
        part_name: { $regex: `P${req.params.assembly_name}.*` },
      },
    },
    {
      $sort: {
        start_time: 1,
      },
    },
    {
      $project: {
        "assembly.part_name": "$part_name",
        start_time: "$start_time",
        end_time: "$end_time",
        type: "0",
      },
    },
  ];

  let collection = await db.collection("operation_records");
  const aggCursor = collection.aggregate(pipeline);
  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get all the assembly times
router.get("/part_durations/", async (req, res) => {
  const pipeline = [
    {
      $project: {
        part_name: 1,
        op_type: "0",
        start_time: 1,
        end_time: 1,
        time_span: {
          $subtract: [
            {
              $dateFromString: {
                dateString: "$end_time",
              },
            },
            {
              $dateFromString: {
                dateString: "$start_time",
              },
            },
          ],
        },
        durations: {
          $map: {
            input: "$durations",
            as: "dur",
            in: {
              $let: {
                vars: {
                  durT: {
                    $map: {
                      input: "$$dur",
                      as: "du",
                      in: {
                        $dateFromString: {
                          dateString: "$$du",
                          onError: "$$du",
                        },
                      },
                    },
                  },
                },
                in: {
                  $subtract: [
                    {
                      $arrayElemAt: ["$$durT", 1],
                    },
                    {
                      $arrayElemAt: ["$$durT", 0],
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    {
      $project: {
        part_name: 1,
        start_time: 1,
        end_time: 1,
        time_span: 1,
        total_duration: {
          $sum: "$durations",
        },
      },
    },
  ];

  let collection = await db.collection("operation_records");
  const aggCursor = collection.aggregate(pipeline);
  let aggRes = await aggCursor.toArray();
  res.send(aggRes).status(200);
});

// Get the assembly's assembly times
router.get("/part_durations/:assembly_name", async (req, res) => {
  const pipeline = [
    {
      $match: {
        part_name: { $regex: `P${req.params.assembly_name}.*` },
      },
    },
    {
      $project: {
        part_name: 1,
        op_type: "0",
        start_time: 1,
        end_time: 1,
        time_span: {
          $subtract: [
            {
              $dateFromString: {
                dateString: "$end_time",
              },
            },
            {
              $dateFromString: {
                dateString: "$start_time",
              },
            },
          ],
        },
        durations: {
          $map: {
            input: "$durations",
            as: "dur",
            in: {
              $let: {
                vars: {
                  durT: {
                    $map: {
                      input: "$$dur",
                      as: "du",
                      in: {
                        $dateFromString: {
                          dateString: "$$du",
                          onError: "$$du",
                        },
                      },
                    },
                  },
                },
                in: {
                  $subtract: [
                    {
                      $arrayElemAt: ["$$durT", 1],
                    },
                    {
                      $arrayElemAt: ["$$durT", 0],
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    {
      $project: {
        part_name: 1,
        start_time: 1,
        end_time: 1,
        time_span: 1,
        total_duration: {
          $sum: "$durations",
        },
      },
    },
  ];

  let collection = await db.collection("operation_records");
  const aggCursor = collection.aggregate(pipeline);
  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

export default router;

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

  let collection = await db.collection("assembly_ops");
  const aggCursor = collection.aggregate(pipeline);

  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get all the workloads by count
router.get("/workloads", async (req, res) => {
  const pipeline = [
    {
      $project: {
        assembly: 1,
        "operations.executer": 1,
      },
    },
    {
      $unwind: {
        path: "$operations",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $group: {
        _id: "$operations.executer",
        count: {
          $sum: 1,
        },
      },
    },
  ];

  let collection = await db.collection("assembly_ops");
  const aggCursor = collection.aggregate(pipeline);

  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get the assembly workloads by count
router.get("/workloads/:assembly_name", async (req, res) => {
  const pipeline = [
    {
      $match: {
        "assembly.assembly_name": req.params.assembly_name,
      },
    },
    {
      $project: {
        assembly: 1,
        "operations.executer": 1,
      },
    },
    {
      $unwind: {
        path: "$operations",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $group: {
        _id: "$operations.executer",
        count: {
          $sum: 1,
        },
      },
    },
  ];

  let collection = await db.collection("assembly_ops");
  const aggCursor = collection.aggregate(pipeline);

  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get all the assemblies hole errors
router.get("/hole_errors/", async (req, res) => {
  const pipeline = [
    {
      $match: {
        "operations.reports.key": "hole_pos_error",
      },
    },
    {
      $unwind: {
        path: "$operations",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        "operations.reports.key": "hole_pos_error",
      },
    },
    {
      $replaceWith: {
        _id: "$_id",
        assembly: "$assembly.assembly_name",
        part: "$assembly.part_name",
        report: {
          $first: "$operations.reports.value",
        },
      },
    },
  ];

  let collection = await db.collection("assembly_ops");
  const aggCursor = collection.aggregate(pipeline);
  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get the assembly hole errors
router.get("/hole_errors/:assembly_name", async (req, res) => {
  const pipeline = [
    {
      $match: {
        "assembly.assembly_name": req.params.assembly_name,
      },
    },
    {
      $match: {
        "operations.reports.key": "hole_pos_error",
      },
    },
    {
      $unwind: {
        path: "$operations",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        "operations.reports.key": "hole_pos_error",
      },
    },
    {
      $replaceWith: {
        _id: "$_id",
        assembly: "$assembly.assembly_name",
        part: "$assembly.part_name",
        report: {
          $first: "$operations.reports.value",
        },
      },
    },
  ];

  let collection = await db.collection("assembly_ops");
  const aggCursor = collection.aggregate(pipeline);

  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get all the operations success rate
router.get("/success_rate/", async (req, res) => {
  const pipeline = [
    {
      $project: {
        "operations.reports": 0,
        "operations.timestamp": 0,
        "operations.end_time": 0,
        "operations.start_time": 0,
      },
    },
    {
      $unwind: {
        path: "$operations",
        includeArrayIndex: "op_index",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $replaceWith: "$operations",
    },
    {
      $match: {
        result: {
          $exists: true,
          $in: ["sm_aborted", "sm_succeeded"],
        },
      },
    },
    {
      $group: {
        _id: "$type",
        results: {
          $push: "$result",
        },
      },
    },
    {
      $project: {
        ops_count: {
          $size: "$results",
        },
        success_count: {
          $size: {
            $filter: {
              input: "$results",
              as: "r",
              cond: {
                $eq: ["$$r", "sm_succeeded"],
              },
            },
          },
        },
        failure_count: {
          $size: {
            $filter: {
              input: "$results",
              as: "r",
              cond: {
                $eq: ["$$r", "sm_aborted"],
              },
            },
          },
        },
      },
    },
  ];

  let collection = await db.collection("assembly_ops");
  const aggCursor = collection.aggregate(pipeline);
  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get the assembly operations success rate
router.get("/success_rate/:assembly_name", async (req, res) => {
  const pipeline = [
    {
      $match: {
        "assembly.assembly_name": req.params.assembly_name,
      },
    },
    {
      $project: {
        "operations.reports": 0,
        "operations.timestamp": 0,
        "operations.end_time": 0,
        "operations.start_time": 0,
      },
    },
    {
      $unwind: {
        path: "$operations",
        includeArrayIndex: "op_index",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $replaceWith: "$operations",
    },
    {
      $match: {
        result: {
          $exists: true,
          $in: ["sm_aborted", "sm_succeeded"],
        },
      },
    },
    {
      $group: {
        _id: "$type",
        results: {
          $push: "$result",
        },
      },
    },
    {
      $project: {
        ops_count: {
          $size: "$results",
        },
        success_count: {
          $size: {
            $filter: {
              input: "$results",
              as: "r",
              cond: {
                $eq: ["$$r", "sm_succeeded"],
              },
            },
          },
        },
        failure_count: {
          $size: {
            $filter: {
              input: "$results",
              as: "r",
              cond: {
                $eq: ["$$r", "sm_aborted"],
              },
            },
          },
        },
      },
    },
  ];

  let collection = await db.collection("assembly_ops");
  const aggCursor = collection.aggregate(pipeline);
  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get all the parts success rate
router.get("/parts_success_rate/", async (req, res) => {
  const pipeline = [
    {
      $project: {
        assembly: 1,
        "operations.result": 1,
        succeeded: {
          $allElementsTrue: {
            $map: {
              input: "$operations",
              as: "op",
              in: {
                $eq: ["$$op.result", "sm_succeeded"],
              },
            },
          },
        },
      },
    },
    {
      $group: {
        _id: "$assembly.assembly_name",
        results: {
          $push: "$succeeded",
        },
      },
    },
    {
      $project: {
        ops_count: {
          $size: "$results",
        },
        success_count: {
          $size: {
            $filter: {
              input: "$results",
              as: "r",
              cond: {
                $eq: ["$$r", true],
              },
            },
          },
        },
        failure_count: {
          $size: {
            $filter: {
              input: "$results",
              as: "r",
              cond: {
                $eq: ["$$r", false],
              },
            },
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        ops_count: {
          $sum: "$ops_count",
        },
        success_count: {
          $sum: "$success_count",
        },
        failure_count: {
          $sum: "$failure_count",
        },
      },
    },
  ];

  let collection = await db.collection("assembly_ops");
  const aggCursor = collection.aggregate(pipeline);
  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get the assembly parts success rate
router.get("/parts_success_rate/:assembly_name", async (req, res) => {
  const pipeline = [
    {
      $match: {
        "assembly.assembly_name": req.params.assembly_name,
      },
    },
    {
      $project: {
        assembly: 1,
        "operations.result": 1,
        succeeded: {
          $allElementsTrue: {
            $map: {
              input: "$operations",
              as: "op",
              in: {
                $eq: ["$$op.result", "sm_succeeded"],
              },
            },
          },
        },
      },
    },
    {
      $group: {
        _id: "$assembly.assembly_name",
        results: {
          $push: "$succeeded",
        },
      },
    },
    {
      $project: {
        ops_count: {
          $size: "$results",
        },
        success_count: {
          $size: {
            $filter: {
              input: "$results",
              as: "r",
              cond: {
                $eq: ["$$r", true],
              },
            },
          },
        },
        failure_count: {
          $size: {
            $filter: {
              input: "$results",
              as: "r",
              cond: {
                $eq: ["$$r", false],
              },
            },
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        ops_count: {
          $sum: "$ops_count",
        },
        success_count: {
          $sum: "$success_count",
        },
        failure_count: {
          $sum: "$failure_count",
        },
      },
    },
  ];

  let collection = await db.collection("assembly_ops");
  const aggCursor = collection.aggregate(pipeline);
  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get all the assembly times
router.get("/timestamps/", async (req, res) => {
  const pipeline = [
    {
      $unwind: {
        path: "$operations",
        includeArrayIndex: "op_index",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $sort: {
        "operations.start_time": 1,
      },
    },
    {
      $project: {
        assembly: 1,
        start_time: "$operations.start_time",
        end_time: "$operations.end_time",
        type: "$operations.type",
      },
    },
  ];

  let collection = await db.collection("assembly_ops");
  const aggCursor = collection.aggregate(pipeline);
  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get the assembly's assembly times
router.get("/timestamps/:assembly_name", async (req, res) => {
    const pipeline = [
      {
        $match: {
          "assembly.assembly_name": req.params.assembly_name,
        },
      },
      {
        $unwind: {
          path: "$operations",
          includeArrayIndex: "op_index",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $sort: {
          "operations.start_time": 1,
        },
      },
      {
        $project: {
          assembly: 1,
          start_time: "$operations.start_time",
          end_time: "$operations.end_time",
          type: "$operations.type",
        },
      },
    ];
  
    let collection = await db.collection("assembly_ops");
    const aggCursor = collection.aggregate(pipeline);
    let aggRes = await aggCursor.toArray();
    // console.log(aggRes);
    res.send(aggRes).status(200);
  });

// Get a single assembly by name
router.get("/:name", async (req, res) => {
  let collection = await db.collection("assembly_ops");
  let query = { "assembly.assembly_name": req.params.name };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

export default router;

// [
//   {
//     $project: {
//       assembly: 1,
//       "operations.result": 1,
//       succeeded: {
//         $allElementsTrue: {
//           $map: {
//             input: "$operations",
//             as: "op",
//             in: {
//               $eq: ["$$op.result", "sm_succeeded"],
//             },
//           },
//         },
//       },
//     },
//   },
//   {
//     $group: {
//       _id: "$assembly.assembly_name",
//       results: {
//         $push: "$succeeded",
//       },
//     },
//   },
//   {
//     $project: {
//       ops_count: {
//         $size: "$results",
//       },
//       success_count: {
//         $size: {
//           $filter: {
//             input: "$results",
//             as: "r",
//             cond: {
//               $eq: ["$$r", true],
//             },
//           },
//         },
//       },
//       failure_count: {
//         $size: {
//           $filter: {
//             input: "$results",
//             as: "r",
//             cond: {
//               $eq: ["$$r", false],
//             },
//           },
//         },
//       },
//     },
//   },
//   {
//     $group: {
//       _id: null,
//       ops_count: {
//         $sum: "$ops_count",
//       },
//       success_count: {
//         $sum: "$success_count",
//       },
//       failure_count: {
//         $sum: "$failure_count",
//       },
//     },
//   },
// ];

import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get a list of all the assemblies.
router.get("/", async (req, res) => {
  const pipelineAssOps = [
    { $project: { "operation.assembly_name": 1 } },
    { $group: { _id: "$operation.assembly_name", count: { $sum: 1 } } },
  ];
  let collectionAssOps = await db.collection("assembly_ops_2");
  const aggCursorAssOps = collectionAssOps.aggregate(pipelineAssOps);

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

  let aggResAssOps = (await aggCursorAssOps.toArray()).map((x) => {
    x.manual = false;
    return x;
  });
  let aggResOpRecs = (await aggCursorOpRecs.toArray()).map((x) => {
    x.manual = true;
    return x;
  });
  // console.log(aggResAssOps);

  res.send(aggResAssOps.concat(aggResOpRecs)).status(200);
});

router.get("/operations", async (req, res) => {
  const pipeline = [
    {
      $sort: {
        start_time: 1,
      },
    },
    {
      $group: {
        _id: "$operation.part_name",
        operations: {
          $push: "$$ROOT",
        },
      },
    },
    { $limit: 10 },
  ];

  let collection = await db.collection("assembly_ops_2");
  const aggCursor = collection.aggregate(pipeline);

  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

router.get("/operations/:assembly_name", async (req, res) => {
  const pipeline = [
    { $match: { "operation.assembly_name": req.params.assembly_name } },
    {
      $sort:
        /**
         * Provide any number of field/order pairs.
         */
        {
          start_time: 1,
        },
    },
    {
      $group: {
        _id: "$operation.part_name",
        operations: {
          $push: "$$ROOT",
        },
      },
    },
  ];

  let collection = await db.collection("assembly_ops_2");
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
        executer: 1,
      },
    },
    {
      $group: {
        _id: "$executer",
        count: {
          $sum: 1,
        },
      },
    },
  ];

  let collection = await db.collection("assembly_ops_2");
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
        "operation.assembly_name": req.params.assembly_name,
      },
    },
    {
      $project: {
        executer: 1,
      },
    },
    {
      $group: {
        _id: "$executer",
        count: {
          $sum: 1,
        },
      },
    },
  ];

  let collection = await db.collection("assembly_ops_2");
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
        "reports.key": "hole_pos_error",
      },
    },
    {
      $unwind: {
        path: "$reports",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        "reports.key": "hole_pos_error",
      },
    },
    {
      $replaceWith: {
        _id: "$_id",
        assembly: "$operation.assembly_name",
        part: "$operation.part_name",
        report: "$reports.value",
      },
    },
  ];

  let collection = await db.collection("assembly_ops_2");
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
        "operation.assembly_name": req.params.assembly_name,
      },
    },
    {
      $match: {
        "reports.key": "hole_pos_error",
      },
    },
    {
      $unwind: {
        path: "$reports",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        "reports.key": "hole_pos_error",
      },
    },
    {
      $replaceWith: {
        _id: "$_id",
        assembly: "$operation.assembly_name",
        part: "$operation.part_name",
        report: "$reports.value",
      },
    },
  ];

  let collection = await db.collection("assembly_ops_2");
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
        reports: 0,
        "operations.end_time": 0,
        "operations.start_time": 0,
      },
    },
    {
      $match: {
        result: {
          $exists: true,
          $in: ["sm_aborted", "sm_succeeded", "sm_recovered"],
        },
      },
    },
    {
      $group: {
        _id: "$operation.type",
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
        recovered_count: {
          $size: {
            $filter: {
              input: "$results",
              as: "r",
              cond: {
                $eq: ["$$r", "sm_recovered"],
              },
            },
          },
        },
      },
    },
  ];

  let collection = await db.collection("assembly_ops_2");
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
        "operation.assembly_name": req.params.assembly_name,
      },
    },
    {
      $project: {
        reports: 0,
        end_time: 0,
        start_time: 0,
      },
    },
    {
      $match: {
        result: {
          $exists: true,
          $in: ["sm_aborted", "sm_succeeded", "sm_recovered"],
        },
      },
    },
    {
      $group: {
        _id: "$operation.type",
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
        recovered_count: {
          $size: {
            $filter: {
              input: "$results",
              as: "r",
              cond: {
                $eq: ["$$r", "sm_recovered"],
              },
            },
          },
        },
      },
    },
  ];

  let collection = await db.collection("assembly_ops_2");
  const aggCursor = collection.aggregate(pipeline);
  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// // Get all the parts success rate
// router.get("/parts_success_rate/", async (req, res) => {
//   const pipeline = [
//     {
//       $project: {
//         assembly: 1,
//         "operations.result": 1,
//         succeeded: {
//           $allElementsTrue: {
//             $map: {
//               input: "$operations",
//               as: "op",
//               in: {
//                 $eq: ["$$op.result", "sm_succeeded"],
//               },
//             },
//           },
//         },
//       },
//     },
//     {
//       $group: {
//         _id: "$assembly.assembly_name",
//         results: {
//           $push: "$succeeded",
//         },
//       },
//     },
//     {
//       $project: {
//         ops_count: {
//           $size: "$results",
//         },
//         success_count: {
//           $size: {
//             $filter: {
//               input: "$results",
//               as: "r",
//               cond: {
//                 $eq: ["$$r", true],
//               },
//             },
//           },
//         },
//         failure_count: {
//           $size: {
//             $filter: {
//               input: "$results",
//               as: "r",
//               cond: {
//                 $eq: ["$$r", false],
//               },
//             },
//           },
//         },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         ops_count: {
//           $sum: "$ops_count",
//         },
//         success_count: {
//           $sum: "$success_count",
//         },
//         failure_count: {
//           $sum: "$failure_count",
//         },
//       },
//     },
//   ];

//   let collection = await db.collection("assembly_ops");
//   const aggCursor = collection.aggregate(pipeline);
//   let aggRes = await aggCursor.toArray();
//   // console.log(aggRes);
//   res.send(aggRes).status(200);
// });

// // Get the assembly parts success rate
// router.get("/parts_success_rate/:assembly_name", async (req, res) => {
//   const pipeline = [
//     {
//       $match: {
//         "assembly.assembly_name": req.params.assembly_name,
//       },
//     },
//     {
//       $project: {
//         assembly: 1,
//         "operations.result": 1,
//         succeeded: {
//           $allElementsTrue: {
//             $map: {
//               input: "$operations",
//               as: "op",
//               in: {
//                 $eq: ["$$op.result", "sm_succeeded"],
//               },
//             },
//           },
//         },
//       },
//     },
//     {
//       $group: {
//         _id: "$assembly.assembly_name",
//         results: {
//           $push: "$succeeded",
//         },
//       },
//     },
//     {
//       $project: {
//         ops_count: {
//           $size: "$results",
//         },
//         success_count: {
//           $size: {
//             $filter: {
//               input: "$results",
//               as: "r",
//               cond: {
//                 $eq: ["$$r", true],
//               },
//             },
//           },
//         },
//         failure_count: {
//           $size: {
//             $filter: {
//               input: "$results",
//               as: "r",
//               cond: {
//                 $eq: ["$$r", false],
//               },
//             },
//           },
//         },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         ops_count: {
//           $sum: "$ops_count",
//         },
//         success_count: {
//           $sum: "$success_count",
//         },
//         failure_count: {
//           $sum: "$failure_count",
//         },
//       },
//     },
//   ];

//   let collection = await db.collection("assembly_ops");
//   const aggCursor = collection.aggregate(pipeline);
//   let aggRes = await aggCursor.toArray();
//   // console.log(aggRes);
//   res.send(aggRes).status(200);
// });

// Get all the assembly times
router.get("/timestamps/", async (req, res) => {
  const pipeline = [
    {
      $sort: {
        start_time: 1,
      },
    },
    {
      $project: {
        assembly: "$operation",
        start_time: "$start_time",
        end_time: "$end_time",
        type: "$operation.type",
      },
    },
  ];

  let collection = await db.collection("assembly_ops_2");
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
        "operation.assembly_name": req.params.assembly_name,
      },
    },
    {
      $sort: {
        start_time: 1,
      },
    },
    {
      $project: {
        assembly: "$operation",
        start_time: "$start_time",
        end_time: "$end_time",
        type: "$operation.type",
      },
    },
  ];

  let collection = await db.collection("assembly_ops_2");
  const aggCursor = collection.aggregate(pipeline);
  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get all the assembly times
router.get("/durations/", async (req, res) => {
  const pipeline = [
    {
      $sort: {
        start_time: 1,
      },
    },
    {
      $project: {
        operation: "$operation",
        executer: 1,
        duration: {
          $subtract: ["$end_time", "$start_time"],
        },
      },
    },
    {
      $group: {
        _id: {
          type: "$operation.type",
          executer: "$executer",
        },
        total: {
          $sum: "$duration",
        },
        durations: {
          $push: "$duration",
        },
      },
    },
    {
      $sort: {
        "_id.type": 1,
      },
    },
  ];

  // [
  //   {
  //     '$sort': {
  //       'start_time': 1
  //     }
  //   }, {
  //     '$project': {
  //       'operation': '$operation',
  //       'duration': {
  //         '$subtract': [
  //           '$end_time', '$start_time'
  //         ]
  //       }
  //     }
  //   }, {
  //     '$group': {
  //       '_id': '$operation.type',
  //       'duration': {
  //         '$sum': '$duration'
  //       }
  //     }
  //   }, {
  //     '$sort': {
  //       '_id': 1
  //     }
  //   }
  // ];

  let collection = await db.collection("assembly_ops_2");
  const aggCursor = collection.aggregate(pipeline);
  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get the assembly's assembly times
router.get("/durations/:assembly_name", async (req, res) => {
  const pipeline = [
    {
      $match: {
        "operation.assembly_name": req.params.assembly_name,
      },
    },
    {
      $sort: {
        start_time: 1,
      },
    },
    {
      $project: {
        operation: "$operation",
        executer: 1,
        duration: {
          $subtract: ["$end_time", "$start_time"],
        },
      },
    },
    {
      $group: {
        _id: {
          type: "$operation.type",
          executer: "$executer",
        },
        total: {
          $sum: "$duration",
        },
        durations: {
          $push: "$duration",
        },
      },
    },
    {
      $sort: {
        "_id.type": 1,
      },
    },
  ];

  let collection = await db.collection("assembly_ops_2");
  const aggCursor = collection.aggregate(pipeline);
  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

// Get a single assembly by name
router.get("/robotic/:name", async (req, res) => {
  let collection = await db.collection("assembly_ops");
  let query = { "assembly.assembly_name": req.params.name };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// Get all the assembly times
router.get("/part_durations/", async (req, res) => {
  const pipeline = [
    {
      $group: {
        _id: {
          part_name: "$operation.part_name",
          op_type: "$operation.type",
        },
        durations: {
          $push: {
            $arrayElemAt: [
              {
                $zip: {
                  inputs: [["$start_time"], ["$end_time"]],
                },
              },
              0,
            ],
          },
        },
        start_time: {
          $min: "$start_time",
        },
        end_time: {
          $max: "$end_time",
        },
      },
    },
    {
      $project: {
        part_name: "$_id.part_name",
        op_type: "$_id.op_type",
        start_time: 1,
        end_time: 1,
        time_span: {
          $subtract: ["$end_time", "$start_time"],
        },
        durations: {
          $map: {
            input: "$durations",
            as: "dur",
            in: {
              $subtract: [
                {
                  $arrayElemAt: ["$$dur", 1],
                },
                {
                  $arrayElemAt: ["$$dur", 0],
                },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        part_name: 1,
        op_type: 1,
        start_time: 1,
        end_time: 1,
        time_span: 1,
        total_duration: {
          $sum: "$durations",
        },
      },
    },
  ];

  let collection = await db.collection("assembly_ops_2");
  const aggCursor = collection.aggregate(pipeline);
  let aggRes = await aggCursor.toArray();
  res.send(aggRes).status(200);
});

// Get the assembly's assembly times
router.get("/part_durations/:assembly_name", async (req, res) => {
  const pipeline = [
    {
      $match: {
        "operation.assembly_name": req.params.assembly_name,
      },
    },
    {
      $group: {
        _id: {
          part_name: "$operation.part_name",
          op_type: "$operation.type",
        },
        durations: {
          $push: {
            $arrayElemAt: [
              {
                $zip: {
                  inputs: [["$start_time"], ["$end_time"]],
                },
              },
              0,
            ],
          },
        },
        start_time: {
          $min: "$start_time",
        },
        end_time: {
          $max: "$end_time",
        },
      },
    },
    {
      $project: {
        part_name: "$_id.part_name",
        op_type: "$_id.op_type",
        start_time: 1,
        end_time: 1,
        time_span: {
          $subtract: ["$end_time", "$start_time"],
        },
        durations: {
          $map: {
            input: "$durations",
            as: "dur",
            in: {
              $subtract: [
                {
                  $arrayElemAt: ["$$dur", 1],
                },
                {
                  $arrayElemAt: ["$$dur", 0],
                },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        part_name: 1,
        op_type: 1,
        start_time: 1,
        end_time: 1,
        time_span: 1,
        total_duration: {
          $sum: "$durations",
        },
      },
    },
  ];

  let collection = await db.collection("assembly_ops_2");
  const aggCursor = collection.aggregate(pipeline);
  let aggRes = await aggCursor.toArray();
  // console.log(aggRes);
  res.send(aggRes).status(200);
});

export default router;

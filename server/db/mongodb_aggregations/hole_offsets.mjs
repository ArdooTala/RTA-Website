import { MongoClient } from "mongodb";

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    $match: {
      "operations.reports.key": "hole_pos_error",
    },
  },
  {
    $project: {
      assembly: 1,
      hole_errors: {
        $filter: {
          input: "$operations",
          as: "op",
          cond: {
            $anyElementTrue: [
              {
                $map: {
                  input: "$$op.reports",
                  as: "reps",
                  in: {
                    $eq: ["$$reps.key", "hole_pos_error"],
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
];

const client = await MongoClient.connect("", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const coll = client.db("test_reconwood_2").collection("assembly_ops");
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();

//////////////////////////////////////////////////////////////////////////////

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

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
const coll = client.db("test_reconwood_2").collection("assembled_parts");
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();

import express from "express";
import { request, gql, GraphQLClient } from "graphql-request";
import db from "../db/conn.mjs";

const graphQLClient = new GraphQLClient("https://speckle.xyz/graphql", {
  headers: {
    authorization: "Bearer " + "cc88bd24757613820df460097dcf70085a8caa17c2", // process.env.STEPZEN_API_KEY,
  },
});

const router = express.Router();

// Get a list of all the assemblies.
router.get("/", async (req, res) => {
  const query = gql`
    query test2($Q1: [JSONObject!], $Q2: [JSONObject!]) {
      stream(id: "d04df34394") {
        id
        name
        object(id: "ca3275b79e92a383ecddc2de7da46fc3") {
          id
          children(query: $Q1, select: ["id", "ClusterName"], limit: 1000) {
            objects {
              data
              sub_clusters: children(
                query: $Q1
                depth: 2
                select: ["id", "ClusterName"]
                limit: 1000
              ) {
                objects {
                  data
                }
              }
              parts: children(
                query: $Q2
                depth: 2
                select: ["id", "PartName"]
                limit: 1000
              ) {
                objects {
                  data
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    branch: "ss23_st",
    Q1: [
      {
        field: "ClusterName",
        value: "",
        operator: "!=",
      },
    ],
    Q2: [
      {
        field: "PartName",
        value: "",
        operator: "!=",
      },
    ],
  };

  const data = await graphQLClient.request(query, variables);

  res.send(data.stream).status(200);
});

// Get a list of the Parts in an assembly.
router.get("/:cluster_name", async (req, res) => {
  let collection = await db.collection("clusters");

  // Query for a movie that has the title 'Back to the Future'
  const mongoQuery = { name: req.params.cluster_name };
  const speckleID = await collection.findOne(mongoQuery);

  if (!speckleID) {
    res.send({}).status(400);
    return;
  }

  const query = gql`
    query AssemblyParts(
      $streamId: String!
      $objectId: String!
      $select: [String]
    ) {
      stream(id: $streamId) {
        object(id: $objectId) {
          children(select: $select) {
            objects {
              id
              data
            }
          }
        }
      }
    }
  `;

  const variables = {
    streamId: speckleID.speckle.stream_id,
    objectId: speckleID.speckle.referenced_object,
    select: ["PartName", "PartType", "\\@NutsLoc", "BoltsGeo"],
  };

  const data = await graphQLClient.request(query, variables);

  res.send(data.stream).status(200);
});

export default router;

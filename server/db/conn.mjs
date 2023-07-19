import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.ATLAS_URI || "";
console.log("ConnectionString: " + connectionString);
// const connectionString =
//   "mongodb+srv://Ardeshir:Ardoo8812@rw-cluster0.dbnjtu1.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
  console.log("Connected to Database.");
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
} catch (e) {
  console.error(e);
}

const dbName = process.env.DB_NAME || "";
let db = conn.db(dbName);

export default db;

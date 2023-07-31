import express from "express";
import cors from "cors";
import parts from "./routes/parts.mjs";
import assemblies from "./routes/assemblies.mjs";
import materials from "./routes/materials.mjs";
import projects from "./routes/projects.mjs";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

app.use(cors());

app.use("/materials", materials);
app.use("/parts", parts);
app.use("/assemblies", assemblies);
app.use("/projects", projects);

// start the Express server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port: ${PORT}`);
});

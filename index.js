import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/dbConfig.js";
import employeeRouter from "./Routers/employeeRouter.js";
import timesheetRouter from "./Routers/timesheetRouter.js";

dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/employee", employeeRouter);
app.use("/api/timesheet", timesheetRouter);

app.listen(port, () => {
  console.log("App is running in the port -", port);
});

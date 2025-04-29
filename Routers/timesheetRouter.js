// Routers/timesheetRouter.js
import express from "express";
import {
  getTimesheet,
  addOrUpdateTimesheet,
} from "../Controllers/timesheetController.js";
import authMiddleware from "../Middleware/employeeMiddleware.js";

const router = express.Router();

router.get("/get", authMiddleware, getTimesheet);
router.post("/addorupdate", authMiddleware, addOrUpdateTimesheet);
export default router;

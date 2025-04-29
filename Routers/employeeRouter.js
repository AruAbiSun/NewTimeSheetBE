import express from "express";
import {
  forgotPassword,
  getEmployee,
  loginEmployee,
  registerEmployee,
  resetPassword,
} from "../Controllers/employeeController.js";
import authMiddleware from "../Middleware/employeeMiddleware.js";

const router = express.Router();

router.post("/register", registerEmployee);
router.post("/login", loginEmployee);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/getemployee", authMiddleware, getEmployee);
export default router;

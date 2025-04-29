import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Employee from "../Models/employeeSchema.js";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.employee = decoded;
    const employee = await Employee.findById(req.employee._id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Invaid token, Internal server error" });
  }
};

export default authMiddleware;

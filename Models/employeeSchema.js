import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  token: String,
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;

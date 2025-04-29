// Models/timesheetSchema.js
import mongoose from "mongoose";

const timesheetSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  leaveType: { type: String, default: "" },
  workingHours: { type: [String], required: true },
  leaveHours: { type: [String], required: true },
  totalHours: { type: Number, default: 0 },
  dateRange: { type: String, required: true },
  selectedDate: { type: Date },
});

export default mongoose.model("Timesheet", timesheetSchema);

import Timesheet from "../Models/timesheetSchema.js";

export const getTimesheet = async (req, res) => {
  try {
    console.log("Received query parameters:", req.query);
    if (!req.employee || !req.employee._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Employee not authenticated" });
    }
    const employeeId = req.employee._id;
    const { selectedDate } = req.query;
    if (!selectedDate || isNaN(new Date(selectedDate))) {
      return res.status(400).json({ message: "Invalid date provided" });
    }
    console.log("Received selectedDate:", selectedDate);
    console.log("Received query parameters:", req.query);

    const selectedDateObj = new Date(selectedDate);

    const startOfWeek = new Date(selectedDateObj);
    startOfWeek.setDate(
      selectedDateObj.getDate() - (selectedDateObj.getDay() % 7)
    );
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const dateRange = `${startOfWeek.toISOString().split("T")[0]}_${
      endOfWeek.toISOString().split("T")[0]
    }`;

    console.log("Fetching timesheet for range:", dateRange);

    const timesheets = await Timesheet.findOne({ employeeId, dateRange });
    res
      .status(200)
      .json({ message: "Timesheets fetched successfully", data: timesheets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching timesheets" });
  }
};

export const addOrUpdateTimesheet = async (req, res) => {
  try {
    const { leaveType, workingHours, leaveHours, selectedDate } = req.body;

    if (!req.employee || !req.employee._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Employee not authenticated" });
    }

    if (!selectedDate) {
      return res.status(400).json({ message: "Invalid date provided" });
    }

    const employeeId = req.employee._id;

    const selectedDateObj = new Date(selectedDate);
    const startOfWeek = new Date(selectedDateObj);
    startOfWeek.setDate(
      selectedDateObj.getDate() - (selectedDateObj.getDay() % 7)
    );
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const dateRange = `${startOfWeek.toISOString().split("T")[0]}_${
      endOfWeek.toISOString().split("T")[0]
    }`;
    console.log("Calculated dateRange:", dateRange);

    const calculatedTotalHours = workingHours.reduce((total, hour, index) => {
      return total + (Number(hour) || 0) + (Number(leaveHours[index]) || 0);
    }, 0);

    const existingTimesheet = await Timesheet.findOne({
      employeeId,
      dateRange,
    });
    if (existingTimesheet) {
      existingTimesheet.leaveType = leaveType;
      existingTimesheet.workingHours = workingHours;
      existingTimesheet.leaveHours = leaveHours;
      existingTimesheet.totalHours = calculatedTotalHours;
      existingTimesheet.selectedDate = selectedDateObj;
      await existingTimesheet.save();
      return res.status(200).json({
        message: "Timesheet updated successfully",
        data: existingTimesheet,
      });
    }

    const newTimesheet = new Timesheet({
      employeeId,
      leaveType,
      workingHours,
      leaveHours,
      totalHours: calculatedTotalHours,
      dateRange,
      selectedDate: selectedDateObj,
    });
    await newTimesheet.save();
    res
      .status(201)
      .json({ message: "Timesheet added successfully", data: newTimesheet });
  } catch (error) {
    console.error("Error in addOrUpdateTimesheet:", error);
    res.status(500).json({ message: "Error adding or updating timesheet" });
  }
};

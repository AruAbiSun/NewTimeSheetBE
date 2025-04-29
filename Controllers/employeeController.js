import Employee from "../Models/employeeSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const registerEmployee = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({
        message: "Email already registered. Please use a different email.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);
    const newEmployee = new Employee({
      username,
      email,
      password: hashPassword,
      role,
    });
    await newEmployee.save();

    const resetUrl = `tourmaline-lebkuchen-4bed6c.netlify.app/login`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: newEmployee.email,
      subject: "Welcome message",
      html: `<p>Hi ${username},</p>
             <p>Welcome to our platform! You can log in using the link below:</p>
             <p><a href="${resetUrl}">Click here to log in</a></p>
             <p>Thank you for joining us!</p>`,
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Register Successful", data: newEmployee });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Register Failed, Internal Server error" });
  }
};

export const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: "Employee not found" });
    }
    const passwordMatch = await bcrypt.compare(password, employee.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ _id: employee._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    employee.token = token;
    await employee.save();
    res.status(200).json({
      message: "Login Successful",
      data: employee,
      token: token,
      employeeName: employee.username,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login Failed" });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employeeId = req.employee._id;
    const employee = await Employee.findById(employeeId);
    res.status(200).json({ message: "Welcome", data: employee });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Employee not found" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: "employee not found" });
    }
    const token = jwt.sign({ _id: employee._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    employee.token = token;
    await employee.save();

    const resetUrl = `tourmaline-lebkuchen-4bed6c.netlify.app/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: employee.email,
      subject: "password reset request",
      html: `<p>click <a href="${resetUrl}">here</a> to reset your password. This link is expires in 1 hour</p>`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: "password reset link sent to your email" });
  } catch (error) {
    console.log(error);
    res.status(500), json({ message: "error sending reset link" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: "token and password are required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findById(decoded._id);
    if (!employee) {
      return res.status(404).json({ message: "employee not found" });
    }

    employee.password = await bcrypt.hash(password, 10);
    await employee.save();
    res.status(200).json({ message: "password has been reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "invalid or expired token" });
  }
};

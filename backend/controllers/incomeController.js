const User = require("../models/User");
const Income = require("../models/Income");
const XLSX = require("xlsx");
const { isValidObjectId } = require("mongoose"); // Import isValidObjectId

//add
exports.addIncome = async (req, res) => {
  const userId = req.user?._id; // Optional chaining to avoid undefined errors
  const { source, icon, amount, date } = req.body;

  // Validate input
  if (!userId) {
    return res.status(404).json({ message: "User not found" });
  }
  if (!source || !amount || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the income already exists
    const existingIncome = await Income.findOne({ userId, source, date });
    if (existingIncome) {
      return res.status(400).json({ message: "Income already exists" });
    }

    // Create new income
    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (err) {
    console.error("Error in addIncome:", err); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }
};
//get
exports.getAllIncome = async (req, res) => {
  const userId = req.user._id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
//delete
exports.deleteIncome = async (req, res) => {
  const incomeId = req.params.id;

  if (!isValidObjectId(incomeId)) {
    return res.status(400).json({ message: "Invalid income ID" });
  }

  try {
    const deletedIncome = await Income.findOneAndDelete({ _id: incomeId });

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json({ message: "Income deleted successfully" });
  } catch (err) {
    console.error("Error in deleteIncome:", err);
    res.status(500).json({ message: "Server error" });
  }
};
//download
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user._id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    // data for excel
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toLocaleDateString("en-US"),
    }));
    // create excel file
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Income");
    XLSX.writeFile(workbook, "income.xlsx");
    res.download("income.xlsx");
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

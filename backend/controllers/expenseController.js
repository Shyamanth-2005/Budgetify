const User = require("../models/User");
const Expense = require("../models/Expense");
const XLSX = require("xlsx");

exports.addExpense = async (req, res) => {
  const userId = req.user?._id;
  const { category, icon, amount, date } = req.body;

  // Validate input
  if (!userId) {
    return res.status(404).json({ message: "User not found" });
  }
  if (!category || !amount || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingExpense = await Expense.findOne({
      userId,
      category,
      date,
    });
    if (existingExpense) {
      return res.status(400).json({ message: "Expense already exists" });
    }

    // Create new expense
    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (err) {
    console.error("Error in addEncome:", err); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllExpense = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expense);
  } catch (err) {
    console.error("Error in getAllExpense:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Error in deleteExpense:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date.toLocaleDateString("en-US"),
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expense");
    XLSX.writeFile(workbook, "expense.xlsx");
    res.download("expense.xlsx");
  } catch (err) {
    console.error("Error in downloadExpenseExcel:", err);
    res.status(500).json({ message: "Server error" });
  }
};

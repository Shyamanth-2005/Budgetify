const User = require("../models/User");
const jwt = require("jsonwebtoken");
// generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};
// register user
exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  // validate user input
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  try {
    // check if user already exists
    const exsistingUser = await User.findOne({ email });
    if (exsistingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // create the user
    const user = await User.create({
      fullName,
      email,
      password,
      profileImageUrl,
    });

    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error registering user ", error: err.message });
  }
};
//Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error logging in user", error: err.message });
  }
};
// get user info
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Corrected model reference
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Added return
    }

    res.status(200).json(user); // Send the user data in the response
  } catch (err) {
    console.error("Error fetching user info:", err); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error fetching user info", error: err.message });
  }
};

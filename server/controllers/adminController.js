import generateToken from "../utils/generateToken.js";

export const loginAdmin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required.",
    });
  }

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = generateToken();

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid username or password.",
  });
};
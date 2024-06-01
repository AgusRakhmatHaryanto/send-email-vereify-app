const authService = require("../services/authService");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await authService.register(name, email, password);
    res
      .status(201)
      .send(
        "Registration successful. Please check your email to verify your account."
      );
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    await authService.verifyEmail(token);
    res.send("Email verified successfully.");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await authService.login(email, password);
    res.json({ token, user });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
};

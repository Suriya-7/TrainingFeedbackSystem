import jwt from "jsonwebtoken";

const generateToken = () => {
  return jwt.sign(
    {
      username: process.env.ADMIN_USERNAME,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

export default generateToken;
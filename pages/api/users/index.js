import { login } from "../../../services/userService";

export default async (req, res) => {
  const token = await login("lucho", "1234");
  res.status(200).json({ token: token });
};

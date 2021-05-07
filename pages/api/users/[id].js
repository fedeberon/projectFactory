import { loginUser } from "../../../services/userService";

export default function handler(req, res) {
    // const token = await loginUser("lucho","1234");
  //   console.log(token);
  //   res.status(200).json({ token: token });
  const { id } = req.query;
  console.log(req.query);
  res.status(200).json({ id: id });
}
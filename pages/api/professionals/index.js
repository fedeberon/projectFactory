export default async (req, res) => {
//   const token = await loginUser("lucho", "1234");
//   console.log(token);
  res.status(200).json({ token: "professional" });
};

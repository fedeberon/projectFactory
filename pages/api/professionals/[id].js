import { getSession } from "next-auth/client";
import { getById } from "../../../services/professionalService";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (session) {
    const { id } = req.query;

    const json = await getById(id, session);
    return res.status(200).json(json);
  }
  return res.status(401).json({ message: `Unauthorized` });
}

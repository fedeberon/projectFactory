import { getSession } from "next-auth/client";
import { getById, setProject } from "../../../services/projectService";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (req.method === "POST") {
    let { id } = req.query;
    const project = await setProject(req.body, session.accessToken, id);
    return res.status(200).json(project);
  }

  if (session) {
    const { id } = req.query;
    const json = await getById(id, session.accessToken);
    return res.status(200).json(json);
  }
  return res.status(401).json({ message: `Unauthorized` });
}

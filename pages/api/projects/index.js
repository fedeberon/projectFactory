import { getSession } from "next-auth/client";
import { findAll, addProject } from "../../../services/projectService";

export default async (req, res) => {
  let token;
  const session = await getSession({ req });

  if (req.method === 'POST') {
    const project = await addProject(req.body, session.accessToken);
    return res.status(200).json(project);
  }

  let { page, size } = req.__NEXT_INIT_QUERY;

  if (!page || page <= 0) {
    page = 0;
  }
  if (!size || size <= 0) {
    size = process.env.NEXT_PUBLIC_SIZE_PER_PAGE;
  }

  if (session) {
    token = session.accessToken;
    const json = await findAll(page, size, token);
    return res.status(200).json(json);
  }
  return res.status(401).json({ message: `Unauthorized` });
};
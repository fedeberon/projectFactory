import { getSession } from 'next-auth/client';
import { getById } from '../../../services/projectService';

export default async function handler(req, res) {

  const session = await getSession({ req });
  if (session) {
    const { id } = req.query;
    console.log("REQ_QUERY-------", req.query);

    const json = await getById(id, session);
    console.log("PROJECT_BY_ID----------", json);
    return res.status(200).json(json);
  }
  return res.status(401).json({ message: `Unauthorized` });
}

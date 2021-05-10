import { getSession } from 'next-auth/client';
import { getProfesionalById } from '../../../services/professionalService';

export default async function handler(req, res) {

  const session = await getSession({ req });
  if (session) {
    const { id } = req.query;
    console.log("REQ_QUERY-------", req.query);

    const json = await getProfesionalById(id, session);
    console.log("PROFESSIONALS_BY_ID----------", json);
    return res.status(200).json(json);
  }
  return res.status(401).json({ message: `Unauthorized` });
}

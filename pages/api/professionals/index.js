import { getSession } from "next-auth/client";
import { findAll } from "../../../services/professionalService";

export default async (req, res) => {
  const { page, size } = req.query;
  if (page && size) {
    if (!(size <= 0)) {
      const session = await getSession({ req });
      if (session) {
        const json = await findAll(page, size, session);
        return res.status(200).json(json);
      }
    } else {
      return res.status(400).json({
        message: `Size or page cannot be set to zero or less to zero`,
        page,
        size,
      });
    }
  } else {
    return res.status(400).json({
      message: `Missing params`,
      page: "Unwritten parameter",
      size: "Unwritten parameter",
    });
  }
  return res.status(401).json({ message: `Unauthorized` });
};

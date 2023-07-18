import nc from "next-connect";
import { sign } from "jsonwebtoken";
import { respondWithBadRequest } from "@utils/apiutil";

export default nc({})
  .get(async (req, res, next) => {
    if (!req.query.id) {
      return respondWithBadRequest(res, "Request has to contain user ID!");
    }
    res.status(200).json({
      jwt: sign({"_id": req.query.id}, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 * 365
      })
    });
  });

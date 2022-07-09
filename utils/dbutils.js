import dbConnect from "./connectdb";
import {respondWithInternalServerError} from "./apiutil";

export async function checkDBConnection(req, res, next) {
  const {conn} = await dbConnect();

  if (!conn) {
    return respondWithInternalServerError(res, "Could not connect to database");
  }

  next();
}

export default {checkDBConnection};

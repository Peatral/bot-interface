export function respondWithError(res, status, error, message) {
  return res.status(status).json({
    status: status,
    error: error,
    message: message,
  });
}

export function respondWithInternalServerError(res, message) {
  return respondWithError(res, 500, "Internal Server Error", message);
}

export function respondWithBadRequest(res, details) {
  return respondWithError(res, 400, "Bad Request", {
    text: "Look at details for more information",
    details: details,
  });
}

export function respondWithUnauthorized(res) {
  return respondWithError(
    res,
    401,
    "Unauthorized",
    "You are not authorized to access this resource",
  );
}

export function respondWithMethodNotAllowed(res, method) {
  return respondWithError(
    res,
    405,
    "Method Not Allowed",
    `Method ${method} is not allowed on this endpoint`,
  );
}

export function respondWithNotFound(res, message) {
  return respondWithError(res, 404, "Not Found", message);
}

export function respondWithCreated(res, location) {
  return res.status(201).json({
    status: 201,
    message: "Created",
    location: location,
  });
}

export default {
  respondWithError,
  respondWithInternalServerError,
  respondWithBadRequest,
  respondWithUnauthorized,
  respondWithMethodNotAllowed,
  respondWithNotFound,
  respondWithCreated,
};

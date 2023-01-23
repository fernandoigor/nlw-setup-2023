import { FastifyInstance } from "fastify";
import { DefaultError } from "../../../application/error/DefaultError";

export const authMiddleware = async (request, response) => {
  try {
    const { userId } = await request.jwtVerify();
    request.headers.userId = userId;
  } catch (err) {
    response.send(err);
  }
};

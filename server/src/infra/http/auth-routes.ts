import fastify, { FastifyInstance } from "fastify";
import { compare } from "bcrypt";
import { z } from "zod";
import {
  createUserByEmailAndPassword,
  createUserByExternalId,
  findUserByEmail,
  findUserByExternalId,
} from "../../application/user/user-services";
import { generateTokens } from "../../lib/jwt";
import { authMiddleware } from "./middlewares/auth-middleware";
import axios from "axios";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", async (request, response) => {
    const createUserBody = z.object({
      username: z.string(),
      email: z
        .string()
        .email()
        .transform((val) => val.toLowerCase()),
      password: z.string().min(6).max(32),
    });
    const { username, email, password } = createUserBody.parse(request.body);

    const emailAlreadyExists = await findUserByEmail(email);
    console.log(emailAlreadyExists);
    if (emailAlreadyExists) {
      response.status(409).send({ message: "Email already exists." });
      return;
    }
    const user = await createUserByEmailAndPassword({
      username,
      email,
      password,
    });
  });
  app.post("/auth/login", async (request, response) => {
    const loginUserBody = z.object({
      email: z.string().email(),
      password: z.string(),
    });
    const { email, password } = loginUserBody.parse(request.body);

    const userExists = await findUserByEmail(email);
    if (!userExists) {
      throw new Error("Invalid login credentials.");
    }
    const validPassword = await compare(password, userExists.password);

    if (!validPassword) {
      response.status(403).send({ message: "Invalid login credentials." });
      // throw new Error("Invalid login credentials.");
    }
    // const token = await generateTokens(userExists);
    const token = await app.jwt.sign({ userId: userExists.id });

    return {
      id: userExists.id,
      username: userExists.username,
      token: token,
    };
  });
  app.post("/auth/github", async (request, response) => {
    const createUserBody = z.object({
      code: z.string(),
    });
    const { code } = createUserBody.parse(request.body);

    console.log(code);

    // const emailAlreadyExists = await findUserByEmail(email);
    // console.log(emailAlreadyExists);
    // if (emailAlreadyExists) {
    //   response.status(409).send({ message: "Email already exists." });
    //   return;
    // }
    // const user = await createUserByEmailAndPassword({
    //   username,
    //   email,
    //   password,
    // });

    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const SCOPE = "identity";
    console.log(
      `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}`
    );

    const getToken = await axios.get(
      `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const token = getToken.data.split("&scope")[0].split("access_token=")[1];
    // const test = await fetch(
    //   `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${params.code}&redirect_uri=${REDIRECT_URI}`
    // );

    console.log(`Bearer ${token}`);
    try {
      const getProfile = await axios.get(`https://api.github.com/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { name, login, id, avatar_url } = getProfile.data;
      // console.log({ name, login, id, avatar_url });
      const externalId = `github_${id}`;

      const userAlreadyExists = await findUserByExternalId(externalId);

      if (userAlreadyExists) {
        const token = await app.jwt.sign({ userId: userAlreadyExists.id });

        return {
          id: userAlreadyExists.id,
          username: userAlreadyExists.username,
          avatar: userAlreadyExists.avatar,
          token: token,
        };
      } else {
        const user = await createUserByExternalId({
          username: login,
          externalId: externalId,
          avatar: avatar_url,
        });
        const token = await app.jwt.sign({ userId: user.id });

        return {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          token: token,
        };
      }
    } catch (err) {
      console.log(err);
    }
  });
}

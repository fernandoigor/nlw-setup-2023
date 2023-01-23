import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { appRoutes } from "./infra/http/routes";
import { authRoutes } from "./infra/http/auth-routes";
import { authMiddleware } from "./infra/http/middlewares/auth-middleware";

const PORT = 3000;
const app = Fastify();

app.register(cors, {
  origin: "*",
  methods: "GET,PUT,POST,DELETE,OPTIONS,HEAD",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
});
app.register(jwt, {
  secret: process.env.JWT_ACCESS_SECRET,
});
app.register(authRoutes);
app.register(appRoutes);

app.decorate("authenticate", authMiddleware);

app
  .listen({
    port: PORT,
  })
  .then(() => {
    console.log(`HTTP Server running on ${PORT}!`);
  });

import { prisma } from "../../lib/prisma";
import { hash } from "bcrypt";

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  return user ?? null;
}
export async function findUserByExternalId(id: string) {
  const user = await prisma.user.findFirst({
    where: {
      id_oauth: id,
    },
  });
  return user ?? null;
}

export async function createUserByEmailAndPassword({
  username,
  password,
  email,
}) {
  password = await hash(password, 12);

  return prisma.user.create({
    data: {
      id_oauth: "",
      username,
      email,
      password,
    },
  });
}
export async function createUserByExternalId({ username, externalId, avatar }) {
  return prisma.user.create({
    data: {
      id_oauth: externalId,
      username,
      avatar,
      email: "",
      password: "",
    },
  });
}

export async function findUserById(id) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function createAnonymousUser() {
  const user = await prisma.user.create({
    data: {
      state: {
        create: {},
      },
    },
    include: {
      state: true,
    },
  });

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user };
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  errorFormat: "minimal",
});

export default async function handler(req, res) {
  try {
    const create = await prisma.test.create({
      data: {
        name: "A test 1",
      },
    });
    return res.status(200).send({
      title: "test",
    });
  } catch (err) {
    console.log(err);
  }
}

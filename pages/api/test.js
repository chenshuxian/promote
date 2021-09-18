import { PrismaClient, PrismaErrors } from "@prisma/client";
import { DATE, GETIP } from "../../function/common";
const prisma = new PrismaClient({
  errorFormat: "minimal",
});
export default async function (req, res) {
  try {
    let count = await prisma.test.create({
      data: {
        name: "test",
      },
    });
    res.json({ succes: true });
  } catch (err) {
    res.json({ err });
  }
}

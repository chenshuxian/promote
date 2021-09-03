import { PrismaClient, PrismaErrors } from "@prisma/client";
import { DATE, GETIP } from "../../function/common";
const prisma = new PrismaClient({
  errorFormat: "minimal",
});
export default async function (req, res) {
  try {
    let count = await prisma.pv.findUnique({
      where: {
        id: 1,
      },
    });
    res.json({ count });
  } catch (err) {
    res.json({ err });
  }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  errorFormat: "minimal",
});

export default async function handler(req, res) {
  let town = req.body.town;
  const data = prisma.apply.findMany({
    where: {
      AND: [
        {
          status: {
            equals: 2,
          },
        },
        {
          town: {
            equals: town,
          },
        },
      ],
    },
    select: {
      status: true,
      id: true,
      name: true,
      bank_account: true,
      bank_id: true,
      bank_name: true,
      phone: true,
      update_time: true,
    },
  });

  return res.json({ data });
}

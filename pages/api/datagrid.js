// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import withSession from "../../lib/session";
const prisma = new PrismaClient({
  errorFormat: "minimal",
});

export default withSession(async (req, res) => {
  const user = req.session.get("user");

  if (user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    console.log(user);
    try {
      const data = await prisma.apply.findMany({
        where: {
          AND: [
            {
              status: {
                equals: 2,
              },
            },
            {
              town: {
                equals: parseInt(user.town),
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
      // console.log(data);
      res.json({
        isLoggedIn: true,
        data,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
});

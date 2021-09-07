// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import withSession from "../../lib/session";
import { genWhere } from "../../lib/sqllibs";
const prisma = new PrismaClient({
  errorFormat: "minimal",
});

export default withSession(async (req, res) => {
  const user = req.session.get("user");
  const sdate = req.body.sdate;
  const edate = req.body.edate;
  const id = req.body.id;

  if (user) {
    let town = parseInt(user.town);
    let where = genWhere(town, sdate, edate, user.roles);
    if (id) {
      where = ` WHERE id="${id}"`;
    }
    console.log("dg where :" + where);
    try {
      const data = await prisma.$queryRaw(`
      SELECT id,name,bank_account,bank_id,parent_id,parent_name,
      status,phone,update_time,relationship,file_number,town,status,
      editor
      FROM apply ${where} limit 10000
    `);
      // const data = await prisma.apply.findMany({
      //   where: {
      //     AND: and,
      //   },
      //   select: {
      //     status: true,
      //     id: true,
      //     name: true,
      //     bank_account: true,
      //     bank_id: true,
      //     parent_id: true,
      //     parent_name: true,
      //     status: true,
      //     phone: true,
      //     update_time: true,
      //     relationship: true,
      //     file_number: true,
      //     town: true,
      //     status: true,
      //   },
      // });
      // console.log(data);
      res.json({
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

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

  if (user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    // let town = {
    //   town: {
    //     equals: parseInt(user.town),
    //   },
    // };
    // //console.log(user.roles);
    // //查詢所有鄉鎮
    // if (user.roles === 3) {
    //   town = {};
    // }

    // let and = [
    //   {
    //     status: {
    //       equals: 2,
    //     },
    //   },
    //   town,
    // ];

    // if (sdate) {
    //   and.push({
    //     update_time: {
    //       gte: sdate + "T00:00:00.000Z",
    //       lt: edate + "T23:59:59.000Z",
    //     },
    //   });
    // }

    let town = parseInt(user.town);
    let where = genWhere(town, sdate, edate, user.roles);
    console.log("dg where :" + where);
    try {
      const data = await prisma.$queryRaw(`
      SELECT id,name,bank_account,bank_id,parent_id,parent_name,status,phone,update_time,relationship,file_number,town,status
      FROM apply ${where} limit 20000
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

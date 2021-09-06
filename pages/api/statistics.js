// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// 返回統計數據
import { RotateLeftSharp } from "@material-ui/icons";
import { PrismaClient } from "@prisma/client";
import e from "express";
import withSession from "../../lib/session";
const prisma = new PrismaClient({
  errorFormat: "minimal",
});

const townExId = {
  1: "51",
  2: "00",
  3: "53",
  4: "55",
  5: "56",
  6: "57",
};

const common = async (town, status, roles, sdate, edate, total = false) => {
  let where = `WHERE status = ${status}`;

  if (sdate) {
    where =
      where +
      ` and (update_time BETWEEN "${sdate}T00:00:00.000Z" AND "${edate}T23:59:59.000Z")`;
  }

  // 縣府超級使用都無此限制
  if (roles !== 3) {
    // 狀態為2以編碼查找,因為已審核以公所代碼查找
    if (status == 2) {
      if (town == 2) {
        // 金湖不一樣
        where = where + ` and file_number < 5000000`;
      } else {
        where = where + ` and file_number like "${townExId[town]}%"`;
      }
    } else {
      // 其他已申請、已撥款都以鄉鎮
      where = where + ` and town=${town}`;
    }
  }

  if (total) {
    if (roles !== 3) {
      where = `WHERE town=${town}`;
    } else {
      where = "";
    }
  }
  console.log(where);
  // console.log(and);

  try {
    // const data = await prisma.apply.count({
    //   where: {
    //     AND: and,
    //   },
    // });
    const data = await await prisma.$queryRaw(`
    SELECT count(*) as total
    FROM apply ${where} 
  `);
    console.log("total:" + data[0].total);
    return data[0].total;
  } catch (err) {
    console.log(err);
  }
};

const total = async (town) => {
  try {
    const data = await prisma.apply.count();
    console.log("unapply:" + data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default withSession(async (req, res) => {
  const user = req.session.get("user");
  const sdate = req.body.sdate;
  const edate = req.body.edate;

  if (user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    let town = parseInt(user.town);
    let roles = user.roles;

    try {
      const t = await common(town, 0, roles, sdate, edate, true);
      const u = await common(town, 0, roles, sdate, edate);
      const a = await common(town, 1, roles, sdate, edate);
      const f = await common(town, 2, roles, sdate, edate);
      const p = await common(town, 3, roles, sdate, edate);

      res.json({
        t,
        u,
        a,
        f,
        p,
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

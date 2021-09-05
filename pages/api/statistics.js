// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// 返回統計數據
import { RotateLeftSharp } from "@material-ui/icons";
import { PrismaClient } from "@prisma/client";
import withSession from "../../lib/session";
const prisma = new PrismaClient({
  errorFormat: "minimal",
});

const common = async (town, status, roles, sdate, edate, total = false) => {
  let and = [
    {
      status: {
        equals: status,
      },
    },
  ];

  if (sdate) {
    and.push({
      update_time: {
        gte: sdate + "T00:00:00.000Z",
        lt: edate + "T23:59:59.000Z",
      },
    });
  }
  // 總人數不包含日期及狀態，所以判斷放在日期和狀態後面
  if (total) {
    and = [];
  }

  // 依各鄉鎮查詢;
  if (roles !== 3) {
    and.push({
      town: {
        equals: town,
      },
    });
  }

  // console.log(and);

  try {
    const data = await prisma.apply.count({
      where: {
        AND: and,
      },
    });
    // console.log("total:" + data);
    return data;
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

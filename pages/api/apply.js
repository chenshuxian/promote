// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, PrismaErrors } from "@prisma/client";
import { DATE, GETIP } from "../../function/common";
const ipInt = require("ip-to-int");
const prisma = new PrismaClient({
  errorFormat: "minimal",
});

const checkdata = async (id, house_id, born) => {
  let msg = [];
  try {
    const user = await prisma.apply.findUnique({
      where: {
        id: id,
      },
      select: {
        house_id: true,
        born: true,
      },
    });

    if (user.house_id !== house_id) {
      msg.push("戶號");
    }
    if (user.born !== born) {
      msg.push("生日");
    }
    return msg;
  } catch (err) {
    console.log(err.code);
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    // 新增申請資料
    // let ip =
    //   req.headers["x-forwarded-for"] ||
    //   req.ip ||
    //   req.connection.remoteAddress ||
    //   req.socket.remoteAddress ||
    //   req.connection.socket.remoteAddress ||
    //   "";
    // if (ip.split(",").length > 0) {
    //   ip = ip.split(",")[0];
    // }
    // // ipv6 取得ip
    // ip = ip.substr(ip.lastIndexOf(":") + 1, ip.length);
    // console.log("apply :" + ip);
    req.body.ip = GETIP(req);

    let title = "申請成功";
    let msg = "已完成申請流程，靜待後續審核";
    let errMsg;
    let id = req.body.id;
    let house_id = req.body.house_id;
    let born = req.body.born;
    let status = req.body.status ? req.body.status : 1;

    // 驗證生日及戶號
    errMsg = await checkdata(id, house_id, born);
    // console.log(`errMsg ${errMsg.length} ${errMsg} `);
    // 驗證正確
    if (errMsg.length === 0) {
      try {
        const update = await prisma.apply.updateMany({
          where: {
            AND: [
              {
                born: {
                  equals: req.body.born,
                },
              },
              {
                id: {
                  equals: req.body.id,
                },
              },
              {
                house_id: {
                  equals: req.body.house_id,
                },
              },
            ],
          },
          data: {
            status: status,
            bank_account: req.body.bank_account,
            bank_id: req.body.bank_id,
            bank_name: req.body.bank_name,
            phone: req.body.phone,
            email: req.body.email,
            ip: req.body.ip,
            update_time: DATE(),
          },
        });

        return res.status(200).json({
          title,
          msg,
        });
      } catch (err) {
        console.log(err);
        if (err.code === "P2002") {
          return res.status(400).json({
            title: "申請失敗",
            msg: "此身分證已經被申請，請確認輸入是否有誤",
          });
        }
        return res.status(400).send("建檔失敗");
      }
    } else {
      //驗證失敗
      return res.status(200).json({
        title: "申請驗證失敗，身分證、戶號、生日需正確",
        msg: errMsg.toString() + "驗證失敗",
      });
    }
  } else {
    res.status(200).json({ name: "John Doe GET" });
  }
}

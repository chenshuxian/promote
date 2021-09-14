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
        status: true,
      },
    });

    if (user.house_id.toUpperCase() !== house_id.toUpperCase()) {
      msg.push("戶號");
    }
    if (user.born !== born) {
      msg.push("生日");
    }
    if (user.status == 2) {
      msg.push("已審核不可進行修改");
    }
    if (user.status == 3) {
      msg.push("已撥款不可進行修改");
    }
    return msg;
  } catch (err) {
    console.log(err.code);
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    // 新增申請資料
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

        console.log(update);

        if (update.count) {
          return res.status(200).json({
            success: true,
            title,
            msg,
            update,
          });
        } else {
          return res.status(200).json({
            title: "申請失敗",
            msg: "請備好本人身分證與各地民政單位連絡",
            update,
          });
        }
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
        success: false,
        title: "申請驗證失敗、戶號、生日需正確",
        msg: errMsg.toString() + "驗證失敗",
      });
    }
  } else {
    res.status(200).json({ name: "John Doe GET" });
  }
}

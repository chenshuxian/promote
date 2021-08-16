// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, PrismaErrors } from "@prisma/client";
const ipInt = require("ip-to-int");
const prisma = new PrismaClient({
  errorFormat: "minimal",
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    // 新增申請資料
    let ip =
      req.connection.remoteAddress === "::1"
        ? "127.0.0.1"
        : req.connection.remoteAddress;
    req.body.ip = parseInt(ipInt(ip).toInt());
    try {
      const add = await prisma.apply.create({
        data: req.body,
      });
      return res.status(204).json({
        title: "申請成功",
        msg: "",
      });
    } catch (err) {
      if (err.code === "P2002") {
        return res.status(400).json({
          title: "申請失敗",
          msg: "此身份證已經被申請，請確認輸入是否有誤",
        });
      }
      return res.status(400).send("建檔失敗");
    }
  } else {
    res.status(200).json({ name: "John Doe GET" });
  }
}

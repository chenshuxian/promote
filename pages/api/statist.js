import { PrismaClient, PrismaErrors } from "@prisma/client";
import { DATE, GETIP } from "../../function/common";
import { ipLocation } from "iplocation";
import ipToInt from "ip-to-int";

const prisma = new PrismaClient({
  errorFormat: "minimal",
});
export default async function (req, res) {
  try {
    const total = await prisma.$queryRaw(
      `select count(*) as total from promote.apply group by town order by town`
    );
    const noApply = await prisma.$queryRaw(
      `select count(*) as total from promote.apply where status = 0 group by town order by town`
    );
    const apply = await prisma.$queryRaw(
      `select count(*) as total from promote.apply where status = 1 group by town order by town`
    );
    const ok = await prisma.$queryRaw(
      `select count(*) as total from promote.apply where status = 2 group by town order by town`
    );
    const pay = await prisma.$queryRaw(
      `select count(*) as total from promote.apply where status = 3 group by town order by town`
    );

    const onlineApply = await prisma.$queryRaw(
      `select count(*) as total from promote.apply where (editor = "" or editor like "蔡%") and pay_date <> "2021-08-30" and status <> 0`
    );

    const papperApply = await prisma.$queryRaw(
      `select count(*) as total from promote.apply where file_number <> -1 and status > 1`
    );

    const totalPay = await prisma.$queryRaw(
      `select count(*) as total from promote.apply where status = 3`
    );

    const noApplyTotal = await prisma.$queryRaw(
      `select count(*) as total from promote.apply where status = 0`
    );

    const ip = await prisma.$queryRaw(
      `select ip from promote.apply where ip <> 0`
    );

    console.log("ip info: " + ipToInt(2093442120).toIP());

    // IP
    // TAIPEI :  124.199.96.0 - 124.199.111.255
    // 2093441024 ~ 2093445119
    // 654835712 ~ 655359999

    // let ipinfo = await ipLocation("59.102.186.152");
    // console.log("ip info:" + ipinfo);
    res.json({
      total,
      noApply,
      apply,
      ok,
      pay,
      onlineApply,
      papperApply,
      totalPay,
      noApplyTotal,
    });
  } catch (err) {
    res.json({ err });
  }
}

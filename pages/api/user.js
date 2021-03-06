import { NoteTwoTone } from "@material-ui/icons";
import { PrismaClient } from "@prisma/client";
import { DATE, GETIP } from "../../function/common";
const prisma = new PrismaClient();

let hidden = function (str, frontLen, endLen) {
  var len = str.length - frontLen - endLen;
  var xing = "";
  for (var i = 0; i < len; i++) {
    xing += "*";
  }
  return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
};

const town = {
  1: "jc",
  2: "jh",
  3: "js",
  4: "jn",
  5: "lu",
  6: "wq",
};

const townToCh = {
  1: "金城",
  2: "金湖",
  3: "金沙",
  4: "金寧",
  5: "烈嶼",
  6: "烏坵",
};

export default async function handler(req, res) {
  const q = req.body.q;
  const api = req.body.api;
  const editor = req.body.editor;
  let status = 99;
  req.body.ip = GETIP(req);

  if (req.method === "POST") {
    switch (api) {
      case "checkOnline": {
        try {
          const user = await prisma.apply.updateMany({
            where: {
              AND: [
                {
                  status: {
                    equals: 1,
                  },
                },
                {
                  editor: {
                    equals: "",
                  },
                },
                {
                  is_same_name: {
                    equals: 1,
                  },
                },
              ],
            },
            data: {
              status: 2,
              update_time: DATE(),
              editor: req.body.name,
            },
          });

          console.log(`checkOnline: ${JSON.stringify(user)}`);

          if (user) {
            return res.status(200).send({
              title: "線上審核",
              msg: `今天線上審核總數 ${user.count}`,
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
        break;
      }
      // 確認使用者狀態
      case "checkStatus": {
        try {
          const user = await prisma.apply.findUnique({
            where: {
              id: q,
            },
            select: {
              status: true,
            },
          });

          if (user) {
            status = user.status;
          }

          return res.status(200).send({
            title: "處理進度",
            status,
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
        break;
      }

      case "checkStatusBorn": {
        let data = {};
        let newUser;
        let nLen;
        let endLen;
        try {
          const user = await prisma.apply.findMany({
            where: {
              AND: [
                {
                  born: {
                    equals: q.born,
                  },
                },
                {
                  id: {
                    equals: q.id,
                  },
                },
              ],
            },
            select: {
              status: true,
              name: true,
              bank_account: true,
            },
          });
          let have = Object.keys(user).length;

          if (have) {
            console.log(user[0].name);
            newUser = user[0];
            nLen = newUser.name.length;
            endLen = nLen > 2 ? 1 : 0;
            // 已申請有銀行帳號了
            let name = hidden(newUser.name, 1, endLen);
            data.name = name;

            //只有大於1審核中的狀態才返回銀行帳號
            if (newUser.status >= 1) {
              let bank_account = hidden(newUser.bank_account, 3, 3);
              data.bank_account = bank_account;
            }
            status = newUser.status;
          }

          return res.status(200).send({
            title: "申請進度",
            status,
            data,
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
      }

      case "checkName": {
        let msg = "銀行戶名必須與申請人相同";
        let is_same = 0;
        let same;
        try {
          const user = await prisma.apply.findMany({
            where: {
              AND: [
                {
                  name: {
                    equals: q.name.trim(),
                  },
                },
                {
                  id: {
                    equals: q.id,
                  },
                },
              ],
            },
            select: {
              name: true,
            },
          });

          same = Object.keys(user).length;
          // 戶名和申請人相同
          if (same) {
            msg = "銀行戶名與申請人相同";
            is_same = 1;
            // console.log("update" + update);
            //msg = "申請人與銀行戶同相同";
          } else {
            is_same = 0;
          }

          if (q.id) {
            await prisma.apply.updateMany({
              where: {
                AND: [
                  {
                    status: {
                      lte: 1,
                    },
                  },
                  {
                    id: {
                      equals: q.id,
                    },
                  },
                ],
              },
              data: {
                is_same_name: is_same,
              },
            });
          }

          return res.status(200).send({
            is_same,
            msg,
          });
        } catch (err) {
          //console.log(err);
          return res.status(400).json({
            title: "申請失敗",
            msg: err,
          });
        }
      }
      // 管理端取得客戶生日及姓名進行核查
      // 先判斷使用者狀態 > 1以上都不可以進行處理
      case "getUserProfile": {
        let have, name, born, addr, file_number, house_id;
        status = 99;
        try {
          const user = await prisma.apply.findUnique({
            where: {
              id: q.id,
            },
            select: {
              status: true,
              name: true,
              born: true,
              addr: true,
              chun: true,
              lin: true,
              town: true,
              house_id: true,
              file_number: true,
            },
          });

          have = Object.keys(user).length;
          // 戶名和申請人相同
          if (have) {
            status = user.status;
            name = user.name;
            born = user.born;
            file_number = user.file_number;
            house_id = user.house_id;
            if (user.lin == "0") {
              // 陸配
              addr = user.addr;
            } else {
              addr = `金門縣${townToCh[user.town]}鎮(鄉)${user.chun}${
                user.lin
              }鄰${user.addr}`;
            }
          }

          return res.status(200).send({
            status,
            name,
            born,
            addr,
            file_number,
            house_id,
          });
        } catch (err) {
          console.log(err);
          return res.status(400).json({
            title: "申請失敗",
            status: 99,
            err,
          });
        }
      }
      // 管理端上傳用戶資料
      // 管理端上傳狀態都為2，已審核
      case "addUserFromAdmin": {
        console.log(DATE());
        // let bankTable = `${town[q.town]}_${q.bank_id}`;
        // console.log("user api bankTable: " + bankTable);

        // 總表更新
        try {
          const user = await prisma["apply"].update({
            where: {
              id: q.id,
            },
            data: {
              status: 2,
              bank_id: q.bank_id,
              bank_account: q.bank_account,
              editor: editor,
              parent_id: q.parent_id,
              parent_name: q.parent_name,
              phone: q.phone,
              reason: parseInt(q.reason),
              relationship: parseInt(q.relationship),
              update_time: DATE(),
              ip: req.body.ip,
              file_number: parseInt(q.file_number),
              other: req.body.other,
            },
          });

          // console.log(`update ${JSON.stringify(bank)}`);

          let have = Object.keys(user).length;
          // 戶名和申請人相同
          if (have) {
            return res.status(200).json({
              msg: "資料審核成功",
              title: "紙本用戶資料審核",
            });
          }
        } catch (err) {
          console.log(err);
          return res.status(400).json({
            title: "更新失敗",
            status: 99,
            err,
          });
        }
      }

      // 確認fileNumber
      case "checkFileNumber": {
        if (q.file_number !== null) {
          try {
            const fileNumber = await prisma["apply"].findMany({
              where: {
                file_number: q.file_number,
              },
              select: {
                file_number: true,
              },
            });

            console.log("USER API FILENUMBER: " + fileNumber);
            let have = Object.keys(fileNumber).length;

            // 戶名和申請人相同
            if (have) {
              return res.status(200).json({
                already: true,
                msg: `編號 ${fileNumber[0].file_number} 已存在 `,
              });
            } else {
              return res.status(200).json({
                already: false,
                msg: `此編號尚未使用`,
              });
            }
          } catch (err) {
            console.log(err);
            return res.status(400).json({
              title: "更新失敗",
              status: 99,
              err,
            });
          }
        }
      }

      default:
        console.log(`Sorry, we are out of.`);
    }
  } else {
    res.status(200).json({ name: "NOT POST" });
  }
}

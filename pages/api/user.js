import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

let hidden = function (str, frontLen, endLen) {
  var len = str.length - frontLen - endLen;
  var xing = "";
  for (var i = 0; i < len; i++) {
    xing += "*";
  }
  return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
};

export default async function handler(req, res) {
  const q = req.body.q;
  const api = req.body.api;
  let status = 99;

  if (req.method === "POST") {
    switch (api) {
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
              msg: "此身份證已經被申請，請確認輸入是否有誤",
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

            if (newUser.status > 1) {
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
              msg: "此身份證已經被申請，請確認輸入是否有誤",
            });
          }
          return res.status(400).send("建檔失敗");
        }
      }
      case "checkName": {
        let msg = "銀行戶名必預與申請人相同";
        let is_same = 0;
        let same;
        try {
          const user = await prisma.apply.findMany({
            where: {
              AND: [
                {
                  name: {
                    equals: q.name,
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
            msg = "申請者與銀行戶名相同";
            is_same = 1;
            // console.log("update" + update);
            msg = "申請人與銀行戶同相同";
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
          console.log(err);
          if (err.code === "P2002") {
            return res.status(400).json({
              title: "申請失敗",
              msg: "此身份證已經被申請，請確認輸入是否有誤",
            });
          }
          return res.status(400).send("建檔失敗");
        }
      }
      default:
        console.log(`Sorry, we are out of ${expr}.`);
    }
    // 查詢狀態
    // if (api === "checkStatus") {
    //   status = 99;
    //   try {
    //     const user = await prisma.apply.findUnique({
    //       where: {
    //         id: q,
    //       },
    //       select: {
    //         status: true,
    //       },
    //     });

    //     if (user) {
    //       status = user.status;
    //     }

    //     return res.status(200).send({
    //       title: "處理進度",
    //       status,
    //     });
    //   } catch (err) {
    //     console.log(err);
    //     if (err.code === "P2002") {
    //       return res.status(400).json({
    //         title: "申請失敗",
    //         msg: "此身份證已經被申請，請確認輸入是否有誤",
    //       });
    //     }
    //     return res.status(400).send("建檔失敗");
    //   }
    // }

    // if (api === "checkStatusBorn") {
    //   status = 99;
    //   let data = {};
    //   let newUser;
    //   let nLen;
    //   let endLen;
    //   try {
    //     const user = await prisma.apply.findMany({
    //       where: {
    //         AND: [
    //           {
    //             born: {
    //               equals: q.born,
    //             },
    //           },
    //           {
    //             id: {
    //               equals: q.id,
    //             },
    //           },
    //         ],
    //       },
    //       select: {
    //         status: true,
    //         name: true,
    //         bank_account: true,
    //       },
    //     });
    //     let have = Object.keys(user).length;

    //     if (have) {
    //       console.log(user[0].name);
    //       newUser = user[0];
    //       nLen = newUser.name.length;
    //       endLen = nLen > 2 ? 1 : 0;
    //       // 已申請有銀行帳號了
    //       let name = hidden(newUser.name, 1, endLen);
    //       data.name = name;

    //       if (newUser.status > 1) {
    //         let bank_account = hidden(newUser.bank_account, 3, 3);
    //         data.bank_account = bank_account;
    //       }
    //       status = newUser.status;
    //     }

    //     return res.status(200).send({
    //       title: "申請進度",
    //       status,
    //       data,
    //     });
    //   } catch (err) {
    //     console.log(err);
    //     if (err.code === "P2002") {
    //       return res.status(400).json({
    //         title: "申請失敗",
    //         msg: "此身份證已經被申請，請確認輸入是否有誤",
    //       });
    //     }
    //     return res.status(400).send("建檔失敗");
    //   }
    // }

    // 確認用戶名與銀行戶是否相同
    // if (api === "checkName") {
    //   // console.log("checkName");
    //   let msg = "銀行戶名必預與申請人相同";
    //   let is_same = 0;
    //   let same;
    //   try {
    //     const user = await prisma.apply.findMany({
    //       where: {
    //         AND: [
    //           {
    //             name: {
    //               equals: q.name,
    //             },
    //           },
    //           {
    //             id: {
    //               equals: q.id,
    //             },
    //           },
    //         ],
    //       },
    //       select: {
    //         name: true,
    //       },
    //     });

    //     same = Object.keys(user).length;
    //     // 戶名和申請人相同
    //     if (same) {
    //       msg = "申請者與銀行戶名相同";
    //       is_same = 1;
    //       // console.log("update" + update);
    //       msg = "申請人與銀行戶同相同";
    //     } else {
    //       is_same = 0;
    //     }

    //     if (q.id) {
    //       await prisma.apply.updateMany({
    //         where: {
    //           AND: [
    //             {
    //               status: {
    //                 lte: 1,
    //               },
    //             },
    //             {
    //               id: {
    //                 equals: q.id,
    //               },
    //             },
    //           ],
    //         },
    //         data: {
    //           is_same_name: is_same,
    //         },
    //       });
    //     }

    //     return res.status(200).send({
    //       is_same,
    //       msg,
    //     });
    //   } catch (err) {
    //     console.log(err);
    //     if (err.code === "P2002") {
    //       return res.status(400).json({
    //         title: "申請失敗",
    //         msg: "此身份證已經被申請，請確認輸入是否有誤",
    //       });
    //     }
    //     return res.status(400).send("建檔失敗");
    //   }
    // }
  } else {
    res.status(200).json({ name: "NOT POST" });
  }
}

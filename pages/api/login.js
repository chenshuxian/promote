// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient, PrismaErrors } from "@prisma/client";
import { DATE } from "../../function/common";
import withSession from "../../lib/session";
const prisma = new PrismaClient({
  errorFormat: "minimal",
});

export default withSession(async (req, res) => {
  const q = req.body.q;
  const api = req.body.api;

  if (req.method === "POST") {
    switch (api) {
      case "login": {
        console.log(q.id);
        console.log(q.pw);
        try {
          const user = await prisma.users.findMany({
            where: {
              AND: [
                {
                  id: {
                    equals: q.id,
                  },
                },
                {
                  password: {
                    equals: q.pw,
                  },
                },
              ],
            },
            select: {
              is_fix_pw: true,
              roles: true,
              name: true,
              id: true,
              town: true,
            },
          });

          let have = Object.keys(user).length;
          if (have) {
            req.session.set("user", {
              id: user[0].id,
              roles: user[0].roles,
              is_fix_pw: user[0].is_fix_pw,
              town: user[0].town,
              name: user[0].name
            });
            await req.session.save();
            return res.status(200).send(user);
          } else {
            return res.status(200).send({ fail: true, msg: "帳號或密碼錯誤" });
          }
        } catch (err) {
          console.log(err);
        }
        break;
      }

      case "fixPw": {
        console.log("fixpw");
        console.log(q.id);
        console.log(q.pw);
        try {
          const user = await await prisma.users.update({
            where: {
              id: q.id,
            },
            data: {
              is_fix_pw: 0,
              password: q.pw,
            },
          });

          console.log("update: " + user);
          if (user) {
            req.session.set("user", {
              id: user.id,
              roles: user.roles,
              is_fix_pw: user.is_fix_pw,
              town: user.town,
            });
            await req.session.save();
            return res.status(200).send(user);
          }
        } catch (err) {
          console.log(err);
        }
        break;
      }

      default:
        console.log("no match");
    }
  } else {
    res.status(200).json({ name: "John Doe GET" });
  }
});

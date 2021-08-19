"use strict";
(() => {
var exports = {};
exports.id = 86;
exports.ids = [86];
exports.modules = {

/***/ 8802:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(212);
/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
 // import { check } from "prettier";

const ipInt = __webpack_require__(5903);

const prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({
  errorFormat: "minimal"
});

const checkdata = async (id, house_id, born) => {
  let msg = [];

  try {
    const user = await prisma.apply.findUnique({
      where: {
        id: id
      },
      select: {
        house_id: true,
        born: true
      }
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

async function handler(req, res) {
  if (req.method === "POST") {
    // 新增申請資料
    let ip = req.connection.remoteAddress === "::1" ? "127.0.0.1" : req.connection.remoteAddress;
    req.body.ip = parseInt(ipInt(ip).toInt());
    let title = "申請成功";
    let msg = "已完成申請留程，靜待後續審核";
    let errMsg;
    let id = req.body.id;
    let house_id = req.body.house_id;
    let born = req.body.born;
    let status = req.body.status ? req.body.status : 1;
    errMsg = await checkdata(id, house_id, born); // console.log(`errMsg ${errMsg.length} ${errMsg} `);
    // 驗證正確

    if (errMsg.length === 0) {
      try {
        const update = await prisma.apply.updateMany({
          where: {
            AND: [{
              born: {
                equals: req.body.born
              }
            }, {
              id: {
                equals: req.body.id
              }
            }, {
              house_id: {
                equals: req.body.house_id
              }
            }]
          },
          data: {
            status: status,
            bank_account: req.body.bank_account,
            bank_id: req.body.bank_id,
            bank_name: req.body.bank_name,
            phone: req.body.phone
          }
        });
        return res.status(200).json({
          title,
          msg
        });
      } catch (err) {
        console.log(err);

        if (err.code === "P2002") {
          return res.status(400).json({
            title: "申請失敗",
            msg: "此身份證已經被申請，請確認輸入是否有誤"
          });
        }

        return res.status(400).send("建檔失敗");
      }
    } else {
      //驗證失敗
      return res.status(200).json({
        title: "申請驗證失敗，身份證、戶號、生日需正確",
        msg: errMsg.toString() + "驗證失敗"
      });
    }
  } else {
    res.status(200).json({
      name: "John Doe GET"
    });
  }
}

/***/ }),

/***/ 212:
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ 5903:
/***/ ((module) => {

module.exports = require("ip-to-int");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(8802));
module.exports = __webpack_exports__;

})();
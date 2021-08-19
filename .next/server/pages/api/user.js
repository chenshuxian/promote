"use strict";
(() => {
var exports = {};
exports.id = 541;
exports.ids = [541];
exports.modules = {

/***/ 5107:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(212);
/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);

const prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();
async function handler(req, res) {
  const q = req.body.q;
  const api = req.body.api;
  let status;

  if (req.method === "POST") {
    // 查詢狀態
    if (api === "checkStatus") {
      status = 99;

      try {
        const user = await prisma.apply.findUnique({
          where: {
            id: q
          },
          select: {
            status: true
          }
        });

        if (user) {
          status = user.status;
        }

        return res.status(200).send({
          title: "處理進度",
          status
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
    } // 確認用戶名與銀行戶是否相同


    if (api === "checkName") {
      // console.log("checkName");
      let msg = "銀行戶名必預與申請人相同";
      let is_same = 0;
      let same;

      try {
        const user = await prisma.apply.findMany({
          where: {
            AND: [{
              name: {
                equals: q.name
              }
            }, {
              id: {
                equals: q.id
              }
            }]
          },
          select: {
            name: true
          }
        });
        same = Object.keys(user).length; // 戶名和申請人相同

        if (same) {
          msg = "申請者與銀行戶名相同";
          is_same = 1; // console.log("update" + update);

          msg = "申請人與銀行戶同相同";
        } else {
          is_same = 0;
        }

        const update = await prisma.apply.update({
          where: {
            id: q.id
          },
          data: {
            is_same_name: is_same
          }
        });
        return res.status(200).send({
          is_same,
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

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(5107));
module.exports = __webpack_exports__;

})();
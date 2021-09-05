const XLSX = require("xlsx-style");
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// 返回統計數據
import { PrismaClient } from "@prisma/client";
import withSession from "../../lib/session";
import { getRange, getColAndRow, merge } from "../../lib/xlslibs";
const prisma = new PrismaClient({
  errorFormat: "minimal",
});

// 日期
let today = new Date();
let y = today.getFullYear();
let m = today.getMonth() + 1;
let d = today.getDate();
let sendday = `${y}-${m}-${d}`;

let gov = {
  1: "金城鎮公所",
  2: "金湖鎮公所",
  3: "金沙鎮公所",
  4: "金寧鄉公所",
  5: "烈嶼鄉公所",
  6: "烏坵鄉公所",
};

let townExId = {
  1: "51",
  2: "00",
  3: "53",
  4: "55",
  5: "56",
  6: "57",
};

const common = async (town, bank, bank_id, sdate, edate, other = false) => {
  let And = [
    {
      town: {
        equals: town,
      },
    },
    {
      status: {
        equals: 2,
      },
    },
    {
      bank_id: {
        equals: bank_id,
      },
    },
  ];

  // 代領
  if (other) {
    And.push({
      parent_id: {
        not: "",
      },
    });
  }

  if (sdate) {
    And.push({
      update_time: {
        gte: sdate + "T00:00:00.000Z",
        lt: edate + "T23:59:59.000Z",
      },
    });
  }

  try {
    const data = await prisma.apply.count({
      where: {
        AND: And,
      },
    });
    // console.log(`${bank} : ${data}`);
    return data;
  } catch (err) {
    console.log(err);
  }
};

const setString = async (sheet) => {
  for (let z in sheet) {
    /* all keys that do not begin with "!" correspond to cell addresses */
    if (z[0] === "!") continue;
    // console.log("!" + z + "=" + JSON.stringify(sheet[z].v));
    sheet[z].t = "s";
  }
};

// 返回總報表格式
const totalData = async (town, user, sdate, edate) => {
  // 總數據
  //土地已審核總申請
  const tudi = await common(town, "tudi", "005", sdate, edate);
  //郵局已審核總申請
  const post = await common(town, "post", "700", sdate, edate);
  //郵局已審核總申請
  const hez = await common(town, "hez", "224", sdate, edate);

  // 代為申請
  //土地已審核代申請
  const tudi1 = await common(town, "tudi1", "005", sdate, edate, true);
  //郵局已審核代申請
  const post1 = await common(town, "post1", "700", sdate, edate, true);
  //郵局已審核代申請
  const hez1 = await common(town, "hez1", "224", sdate, edate, true);

  //本人
  //土地已審核本申請
  const tudiSelf = tudi - tudi1;
  //郵局已審核本申請
  const postSelf = post - post1;
  //郵局已審核本申請
  const hezSelf = hez - hez1;

  // JSON DATA 設定
  const data = {
    B2: { v: gov[town] },
    B5: { v: sendday },
    C5: { v: tudiSelf },
    D5: { v: postSelf },
    E5: { v: hezSelf },
    F5: { v: tudiSelf + postSelf + hezSelf },
    G5: { v: tudi1 },
    H5: { v: post1 },
    I5: { v: hez1 },
    J5: { v: tudi1 + post1 + hez1 },
    K5: { v: tudi },
    L5: { v: post },
    M5: { v: hez },
    N5: { v: tudi + post + hez },
    B13: { v: user.name },
  };

  let benRen = tudiSelf + postSelf + hezSelf;
  let dailin = tudi1 + post1 + hez1;
  let total = benRen + dailin;

  return { data, statist: { benRen, dailin, post, tudi, hez, total } };
};

// 將數據轉換成worksheets吃的格式
// {
//  "A2":{"v":"01"},
//  "B2":{"v":5100302},
//  "C2":{"v":"蒲雨琳"},
//  ...}

const formatData = async (_listData, town, user, statist) => {
  let lastRow = _listData.length + 5;
  // header 設定
  let header = {
    A1: {
      v: "金門縣政府『紓困金核發系統』鄉鎮公所建檔清冊",
      s: { alignment: { horizontal: "center" } },
    },
    C2: { v: gov[town] },
    L2: { v: sendday },
    K2: { v: "製表日期" },
    A3: { v: "項次" },
    B3: { v: "鄉鎮序號" },
    C3: { v: "申請人" },
    D3: { v: "身分證號" },
    E3: { v: "監護人姓名" },
    F3: { v: "監護人身分證號" },
    G3: { v: "郵局局號" },
    H3: { v: "郵局帳號" },
    I3: { v: "土銀帳號" },
    J3: { v: "信合社帳號" },
    K3: { v: "手機號碼" },
    L3: { v: "建檔日" },
    M3: { v: "備註" },
  };

  let _headers = [
    "sid",
    "file_number",
    "name",
    "id",
    "parent_name",
    "parent_id",
    "post_id",
    "post",
    "tudi",
    "hz",
    "phone",
    "update_time",
  ];
  // 依據銀行代號新增對映欄位;
  for (let i in _listData) {
    let day = new Date(_listData[i].update_time);
    let y = day.getFullYear();
    let m = day.getMonth() + 1;
    let d = day.getDate();
    _listData[i].post = "";
    _listData[i].post_id = "";
    _listData[i].tudi = "";
    _listData[i].hz = "";
    _listData[i].editor = "";
    _listData[i].sid = parseInt(1) + parseInt(i);
    _listData[i].update_time = `${y}-${m}-${d}`;

    if (_listData[i].bank_id === "700") {
      _listData[i].post_id = _listData[i].bank_account.substr(0, 7);
      _listData[i].post = _listData[i].bank_account.substr(7, 7);
    }
    if (_listData[i].bank_id === "224") {
      _listData[i].hz = _listData[i].bank_account;
    }
    if (_listData[i].bank_id === "005") {
      _listData[i].tudi = _listData[i].bank_account;
    }
  }

  let str = "";
  let listData = _listData.map((v, i) =>
    _headers.map((k, j) => {
      str =
        str + `"${[String.fromCharCode(65 + j) + (i + 4)]}":{"v":"${v[k]}"},`;
    })
  );
  str = `{${str.substr(0, str.length - 1)}}`;
  str = JSON.parse(str);

  const footer = {
    [`A${lastRow}`]: { v: "小計" },
    [`D${lastRow}`]: { v: `${statist.benRen} 筆` },
    [`F${lastRow}`]: { v: `${statist.dailin} 筆` },
    [`H${lastRow}`]: { v: `${statist.post} 筆` },
    [`I${lastRow}`]: { v: `${statist.tudi} 筆` },
    [`J${lastRow}`]: { v: `${statist.hez} 筆` },
    [`A${lastRow + 1}`]: { v: `合計:${statist.total} 筆 (書面資料併附)` },
    [`A${lastRow + 2}`]: { v: `製表(聯絡)人:` },
    [`C${lastRow + 2}`]: { v: user.name },
    [`D${lastRow + 2}`]: { v: `覆核:` },
    [`K${lastRow + 2}`]: { v: `主(管)官:` },
    [`A${lastRow + 3}`]: { v: `聯絡資訊:` },
    [`A${lastRow + 5}`]: { v: `附記:` },
    [`B${lastRow + 5}`]: {
      v: `1.本表請印製2份，核章後1份含書面送縣府民政處點收，1份自存。`,
    },
    [`B${lastRow + 6}`]: {
      v: `2.序號7個編碼:金城鎮5100001起，金湖鎮5200001起，金沙5300001起，金寧5500001起，烈嶼5600001起`,
    },
    [`B${lastRow + 7}`]: {
      v: `3.收件審核時請依上列編碼規則於申請書預編(唯一)序號，此為建檔必填之序號。`,
    },
    [`B${lastRow + 8}`]: {
      v: `4.申請書請依「鄉鎮序號」彙整後併本表匯送縣府，方便縣府人員審核。`,
    },
  };

  return Object.assign({}, header, str, footer);
};

// 返回報表清單格式
const reportData = async (town, user, sdate, edate) => {
  let town1 = {};

  //console.log(user.roles);
  //查詢所有鄉鎮
  // if (user.roles !== 3) {
  //   town1 = {
  //     town: {
  //       equals: town,
  //     },
  //   };
  // }

  // let and = [
  //   {
  //     status: {
  //       equals: 2,
  //     },
  //   },
  //   town1,
  // ];

  // if (sdate) {
  //   and.push({
  //     update_time: {
  //       gte: sdate + "T00:00:00.000Z",
  //       lt: edate + "T23:59:59.000Z",
  //     },
  //   });
  // }

  let where = `WHERE status = 2`;

  // 各鄉鎮用戶依file_number 取得各自資料
  if (user.roles !== 3) {
    where = where + ` and file_number like "${townExId[town]}%"`;
  }
  // 如果有時間加間
  if (sdate) {
    where =
      where +
      ` and (update_time BETWEEN "${sdate}T00:00:00.000Z" AND "${edate}T23:59:59.000Z"`;
  }

  // console.log(`where :` + where);

  try {
    // const data = await prisma.apply.findMany({
    //   where: {
    //     AND: and,
    //   },
    //   orderBy: {
    //     file_number: "asc",
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     bank_account: true,
    //     bank_id: true,
    //     parent_id: true,
    //     parent_name: true,
    //     phone: true,
    //     update_time: true,
    //     file_number: true,
    //   },
    // });
    const data = await prisma.$queryRaw(`
      SELECT id,name,bank_account,bank_id,parent_id,parent_name,phone,update_time,file_number
      FROM apply ${where} ORDER BY file_number ASC
    `);
    // console.log(data);

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

    // 讀取 Excel Template 匯出 worksheets
    const workbook = XLSX.readFile("./report/townReport.xlsx", {
      cellStyles: true,
    });
    // 取得模版
    const worksheets = workbook.SheetNames;
    const total = workbook.Sheets[worksheets[0]];
    const report = workbook.Sheets[worksheets[1]];

    // 將 sheet 欄位設為 string
    setString(total);
    setString(report);

    // 取得數據
    try {
      const data = await totalData(town, user, sdate, edate);
      const listData = await reportData(town, user, sdate, edate);

      // 設定欄位寬度
      var wscols = [{ wch: 15 }, { wch: 12 }];
      total["!cols"] = wscols;

      // 產出報表
      const output = merge(total, data.data);
      var reportOutput = await formatData(listData, town, user, data.statist);
      // reportOutput["!cols"] = wscols;

      // 範圍
      const ref = getRange(total);
      const reportRef = getRange(reportOutput);
      console.log("REF " + reportRef);
      reportOutput["!merges"] = [{ s: { c: 0, r: 0 }, e: { c: 12, r: 0 } }];
      reportOutput["!cols"] = [
        { wch: 7 },
        { wch: 10 },
        { wch: 8 },
        { wch: 12 },
        { wch: 10 },
        { wch: 12 },
        { wch: 8 },
        { wch: 8 },
        { wch: 12 },
        { wch: 12 },
        { wch: 10 },
        { wch: 8 },
        { wch: 5 },
      ];

      // 生成 workbook
      const wb = {
        SheetNames: ["sheet_1"],
        Sheets: {
          sheet_1: {
            "!ref": ref,
            ...output,
          },
        },
      };

      const wb2 = {
        SheetNames: ["sheet_2"],
        Sheets: {
          sheet_2: Object.assign({}, reportOutput, { "!ref": reportRef }),
        },
      };

      XLSX.writeFile(wb, `./report/${sendday}_${gov[town]}_total.xlsx`);
      XLSX.writeFile(wb2, `./report/${sendday}_${gov[town]}_list.xlsx`);

      res.json({
        data,
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

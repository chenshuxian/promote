const townExId = {
  1: "51",
  2: "00",
  3: "53",
  4: "55",
  5: "56",
  6: "57",
};

const genWhere = (town, sdate, edate, roles, status = 2) => {
  let where = `WHERE status = ${status}`;

  // 各鄉鎮用戶依file_number 取得各自資料
  if (roles !== 3) {
    if (town === 2) {
      // 金湖
      where = where + ` and file_number < 5000000`;
    } else {
      where = where + ` and file_number like "${townExId[town]}%"`;
    }
  }
  // 如果有時間加間
  if (sdate) {
    where =
      where +
      ` and (update_time BETWEEN "${sdate}T00:00:00.000Z" AND "${edate}T23:59:59.000Z")`;
  }

  return where;
};

module.exports = {
  genWhere,
};

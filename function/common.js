import { useState, useEffect } from "react";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CancelIcon from "@material-ui/icons/Cancel";
import PresentToAllIcon from "@material-ui/icons/PresentToAll";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { green } from "@material-ui/core/colors";
const ipInt = require("ip-to-int");

export const STATUS = {
  0: "未申請",
  1: "審核中",
  2: "審核通過, 資料不可進行修改，如需修改請與各地方民政單位連絡",
  3: "金縣府紓困金已撥款, 請至銀行帳戶查詢確認",
  4: "撥款失敗，請攜帶本人身分證、有效銀行帳戶至各民政單位進行查核",
  99: "資格不符,請輸入正確的身分證",
};

export const STATUSICON = {
  0: <ErrorOutlineIcon color="secondary" style={{ fontSize: 50 }} />,
  1: <PresentToAllIcon color="secondary" style={{ fontSize: 50 }} />,
  2: <CheckCircleOutlineIcon style={{ fontSize: 50, color: green[500] }} />,
  3: <MonetizationOnIcon style={{ fontSize: 50, color: green[500] }} />,
  4: <CancelIcon color="secondary" style={{ fontSize: 50 }} />,
  99: <CancelIcon color="secondary" style={{ fontSize: 50 }} />,
};

export const DATE = () => new Date(Date.now() + 8 * 60 * 60 * 1000);

export const GETIP = (req) => {
  let ip =
    req.headers["x-forwarded-for"] ||
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress ||
    "";

  console.log("commone " + ip);
  if (ip.split(",").length > 0) {
    ip = ip.split(",")[0];
  }

  if (ip === "::1") {
    ip = "127.0.0.1";
  }
  // ipv6 取得ip
  ip = ip.substr(ip.lastIndexOf(":") + 1, ip.length);
  return parseInt(ipInt(ip).toInt());
};

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== "undefined") {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      // Add event listener
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

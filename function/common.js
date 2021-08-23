import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CancelIcon from "@material-ui/icons/Cancel";
import PresentToAllIcon from "@material-ui/icons/PresentToAll";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { green } from "@material-ui/core/colors";

export const STATUS = {
  0: "未申請",
  1: "審核中",
  2: "審核通過, 資料不可進行修改，如需修改請與各地方戶政單位連絡",
  3: "金縣府紓困金已撥款, 請至銀行帳戶查詢確認",
  99: "資格不符,請輸入正確的身份證",
};

export const STATUSICON = {
  0: <ErrorOutlineIcon color="secondary" style={{ fontSize: 50 }} />,
  1: <PresentToAllIcon color="secondary" style={{ fontSize: 50 }} />,
  2: <CheckCircleOutlineIcon style={{ fontSize: 50, color: green[500] }} />,
  3: <MonetizationOnIcon style={{ fontSize: 50, color: green[500] }} />,
  99: <CancelIcon color="secondary" style={{ fontSize: 50 }} />,
};

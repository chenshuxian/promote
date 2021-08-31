import { TextField, Select } from "mui-rff";
import { Paper, Grid, Button, MenuItem } from "@material-ui/core";
import Image from "next/image";
import icon from "../public/newIcon.jpg";

export default function adminField(
  setBank_len,
  bank_len,
  name,
  born,
  addr,
  profile,
  checkFileNum,
  relation,
  setRelation,
  other,
  setOther
) {
  return [
    {
      size: 12,
      md: 12,
      field: <Image src={icon} />,
    },
    {
      size: 12,
      md: 6,
      field: (
        <TextField
          label="申請人身分證"
          name="id"
          margin="none"
          required={true}
          placeholder="w123456789"
          variant="outlined"
          onBlur={profile}
          inputProps={{
            maxLength: 10,
          }}
        />
      ),
    },
    {
      size: 12,
      md: 6,
      field: (
        <TextField
          label="編碼序號"
          name="file_number"
          margin="none"
          required={true}
          placeholder="7碼數字組成"
          variant="outlined"
          onBlur={checkFileNum}
          inputProps={{
            maxLength: 7,
          }}
        />
      ),
    },
    {
      size: 12,
      md: 6,
      field: (
        <TextField
          label="姓名"
          name="name"
          margin="none"
          placeholder="由系統自動帶入"
          variant="outlined"
          value={name}
          disabled
        />
      ),
    },
    {
      size: 12,
      md: 6,
      field: (
        <TextField
          label="出生年月日"
          name="born"
          margin="none"
          placeholder="由系統自動帶入"
          variant="outlined"
          value={born}
          disabled
        />
      ),
    },
    {
      size: 12,
      md: 12,
      field: (
        <TextField
          label="地址"
          name="addr"
          margin="none"
          placeholder="由系統自動帶入"
          variant="outlined"
          value={addr}
          disabled
        />
      ),
    },

    {
      size: 12,
      md: 6,
      field: (
        <Select
          name="relationship"
          label="與帳戶人關係"
          formControlProps={{ margin: "none" }}
          variant="outlined"
          onClick={(event) => {
            // console.log(event.target.value);
            let val = event.target.value;
            if (val == "0" || val === undefined) {
              setRelation(relation);
            } else {
              if (event.target.value !== "1") {
                //console.log("本人1");
                setRelation(false);
              } else {
                //console.log("本人2");
                setRelation(true);
              }
              // 控制其他輸入框
              if (event.target.value !== "5") {
                //console.log("其他1");
                setOther(true);
              } else {
                //console.log("其他2");
                setOther(false);
              }
            }
          }}
        >
          <MenuItem value="1">本人</MenuItem>
          <MenuItem value="2">父親</MenuItem>
          <MenuItem value="3">母親</MenuItem>
          <MenuItem value="4">監護人</MenuItem>
          <MenuItem value="5">其他</MenuItem>
        </Select>
      ),
    },
    {
      size: 12,
      md: 6,
      field: (
        <TextField
          label="聯絡電話或手機"
          name="phone"
          margin="none"
          required={true}
          variant="outlined"
          inputProps={{
            maxLength: 10,
          }}
        />
      ),
    },
    {
      size: 12,
      md: 6,
      field: (
        <TextField
          label="其他關係"
          name="other"
          margin="none"
          placeholder="關係選擇其他時需要填入"
          variant="outlined"
          disabled={other}
        />
      ),
    },

    {
      size: 12,
      md: 6,
      field: (
        <Select
          name="reason"
          label="特殊原因"
          formControlProps={{ margin: "none" }}
          variant="outlined"
          disabled={relation}
        >
          <MenuItem value="0"></MenuItem>
          <MenuItem value="1">未成年</MenuItem>
          <MenuItem value="2">警示帳戶</MenuItem>
          <MenuItem value="3">凍結帳戶</MenuItem>
        </Select>
      ),
    },
    {
      size: 12,
      md: 6,
      field: (
        <TextField
          label="法定代理(領)人證號"
          name="parent_id"
          margin="none"
          placeholder="w123456789"
          variant="outlined"
          disabled={relation}
          inputProps={{
            maxLength: 10,
          }}
        />
      ),
    },
    {
      size: 12,
      md: 6,
      field: (
        <TextField
          label="代理(領)人姓名"
          name="parent_name"
          margin="none"
          variant="outlined"
        />
      ),
    },
    {
      size: 12,
      md: 6,
      field: (
        <Select
          name="bank_id"
          label="銀行機構代號"
          formControlProps={{ margin: "none" }}
          variant="outlined"
          onClick={(event) => {
            let len = event.target.value === "005" ? 12 : 14;
            setBank_len(len);
            // setBank_id(event.target.value);
          }}
        >
          <MenuItem value="005">005 土地銀行</MenuItem>
          <MenuItem value="700">700 郵局</MenuItem>
          <MenuItem value="224">224 金門信用合作社</MenuItem>
        </Select>
      ),
    },
    {
      size: 12,
      md: 6,
      field: (
        <TextField
          label="銀行帳號"
          name="bank_account"
          margin="none"
          required={true}
          variant="outlined"
          inputProps={{
            maxLength: bank_len,
          }}
        />
      ),
    },
  ];
}

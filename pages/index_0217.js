import React, { useState } from "react";
import { Form } from "react-final-form";
import { TextField, Select, Checkboxes } from "mui-rff";
import { makeStyles } from "@material-ui/core";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CancelIcon from "@material-ui/icons/Cancel";
import SecurityIcon from "@material-ui/icons/Security";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TModal from "./components/modal.js";
import post from "../src/post";
import Image from "next/image";
import houseId from "../public/house_id.jpeg";
import NyModal from "./components/NyModal";
import PrivateModal from "./components/PrivateModal";
import PersonalModal from "./components/PersonalModal";
import validate from "../function/validate";
import { STATUS } from "../function/common";
import km from "../public/newIcon.jpg";
import DescriptionIcon from "@material-ui/icons/Description";

import {
  Typography,
  Paper,
  Grid,
  Button,
  MenuItem,
  IconButton,
} from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    padding: 40,
  },
  section: {
    marginTop: 10,
    marginBottom: 5,
  },
  line: {
    borderBottom: "2px solid gainsboro",
  },
  title: {
    marginLeft: 20,
  },
  indent: {
    textIndent: "-1.5em",
    marginLeft: "2.5em",
  },
});

const checkSubmit = async (values) => {
  console.log(values);
};

export default function Home() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [nyOpen, setNyOpen] = useState(false);
  const [privateOpen, setPrivateOpen] = useState(false);
  const [personalOpen, setPersonalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [checked, setChecked] = useState("none");
  const [nameCheck, setNameCheck] = useState("");
  const [buttonDisable, setButtonDisable] = useState(true);
  const [id, setID] = useState("");
  const [formValues, setFormValues] = useState("");
  const [bank_len, setBank_len] = useState(12);

  const handleOpen = () => {
    setContent(<Image src={houseId} />);
    setTitle("戶號位於戶口名簿左上方");
    setOpen(true);
  };
  // 確認使用者狀態
  /*
    狀態 >=2 跳出提醒
    並把送出鈕disable
  */
  const checkStatus = (event) => {
    //console.log(event.target.value);
    // const status = {
    //   0: "未申請",
    //   1: "審核中",
    //   2: "審核通過, 資料不可進行修改，如需修改請與各地方民政單位連絡",
    //   3: "已撥款, 請至銀行帳戶查詢確認",
    //   99: "資格不符,請輸入正確的身分證",
    // };

    // 將使用者身分證存入status
    setID(event.target.value);
    const data = { api: "checkStatus", q: event.target.value };
    post(process.env.NEXT_PUBLIC_API_USER_URL, data)
      .then((data) => {
        // 如果狀態為審核通過，資料將不可以進行修正
        if (data.status >= 2) {
          setTitle(data.title);
          setContent(STATUS[data.status]);
          setButtonDisable(true);
          setOpen(true);
        } else {
          setButtonDisable(false);
        }
      })
      .catch((error) => console.error(error));
  };

  // 確認使用者戶名
  // 提醒線上申請銀行戶名需與本人同名
  const checkName = (event) => {
    //console.log(event.target.value);
    const data = { api: "checkName", q: { name: event.target.value, id: id } };
    post(process.env.NEXT_PUBLIC_API_USER_URL, data)
      .then((data) => {
        if (data.is_same) {
          setNameCheck(
            <>
              <CheckCircleOutlineIcon color="primary" />
              <Typography>{data.msg}</Typography>
            </>
          );
        } else {
          setNameCheck(
            <>
              <CancelIcon color="error" />
              <Typography>{data.msg}</Typography>
            </>
          );
        }
      })
      .catch((error) => console.error(error));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNyClose = () => {
    setNyOpen(false);
  };

  const handlePClose = () => {
    setPrivateOpen(false);
  };

  const handlePersonalClose = () => {
    setPersonalOpen(false);
  };

  // obj to arr
  const objToArr = (values) => {
    let idToText = {
      bank_id: "銀行機構",
      house_id: "戶號",
      id: "身分證",
      born: "出生年月日",
      phone: "手機號碼",
      bank_account: "銀行帳號",
      bank_name: "銀行戶名",
      email: "電子郵件",
    };
    let arr = [];
    let obj = {};
    for (const [key, value] of Object.entries(values)) {
      console.log(`${key}: ${value}`);
      if (key !== "notice1" && key !== "notice2") {
        obj = { name: idToText[key], value: value };
        arr.push(obj);
      }
    }
    console.log(arr);
    return arr;
  };

  // 申請處理確認
  // 打開新的提示框要求使用者確認
  const onSubmit = async (values) => {
    // 去除申請明
    // delete values.notice1;
    // delete values.notice2;
    // 1. 彈出 NyModal
    let title = "個人資訊確認";
    let newValues = objToArr(values);
    let today = new Date();
    let y = today.getFullYear();
    let m = today.getMonth();
    let d = today.getDate();

    let content = (
      <Grid container spacing={2}>
        <Grid item>
          <Typography color="error">
            請確認所輸入資料完全正確，銀行帳戶確為本人所擁有，如因資料不全造成退匯，所衍生問題或法律責任由本人自行承擔。
          </Typography>
          <Typography>申請時間 : {`${y} - ${m + 1} - ${d}`}</Typography>
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={2}>
            {newValues.map((v, i) => {
              return (
                <Grid key={i} item xs>
                  <Typography>
                    {v.name} : {v.value}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    );

    setTitle(title);
    setContent(content);
    setNyOpen(true);
    setFormValues(values);
  };

  /*
  申請處理
  狀態由0改為1申請中
  */
  const handleSave = () => {
    setNyOpen(false);
    // formValues.bank_id;
    post(process.env.NEXT_PUBLIC_API_APPLY_URL, formValues)
      .then((data) => {
        setTitle(data.title);
        setContent(data.msg);
        setOpen(true);
      })
      .catch((error) => console.error(error));
  };

  const formFields = [
    {
      size: 6,
      field: (
        <TextField
          label="戶號"
          name="house_id"
          margin="none"
          required={true}
          placeholder="格式:F0890813"
          variant="outlined"
          inputProps={{
            maxLength: 8,
          }}
        />
      ),
    },
    {
      size: 6,
      field: (
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
          onClick={handleOpen}
        >
          <ImageSearchIcon style={{ fontSize: 30 }} />
        </IconButton>
      ),
    },
    {
      size: 6,
      field: (
        <TextField
          label="身分證"
          name="id"
          margin="none"
          required={true}
          placeholder="w123456789"
          onBlur={checkStatus}
          variant="outlined"
          inputProps={{
            maxLength: 10,
          }}
        />
      ),
    },
    {
      size: 6,
      field: (
        <TextField
          label="出生年月日"
          name="born"
          margin="none"
          required={true}
          placeholder="格式:0890813"
          variant="outlined"
          inputProps={{
            maxLength: 7,
          }}
        />
      ),
    },
    {
      size: 6,
      field: (
        <TextField
          label="聯絡電話和手機"
          name="phone"
          margin="none"
          required={true}
          placeholder="需提供正確電話"
          variant="outlined"
          inputProps={{
            maxLength: 10,
          }}
        />
      ),
    },
    {
      size: 6,
      field: (
        <TextField
          label="電子信箱"
          name="email"
          margin="none"
          placeholder="例子:example@gmail.com"
          variant="outlined"
        />
      ),
    },
    {
      size: 6,
      field: (
        <TextField
          label="銀行戶名"
          name="bank_name"
          margin="none"
          required={true}
          placeholder="銀行戶名需與紓困人相同"
          onBlur={checkName}
          variant="outlined"
        />
      ),
    },
    {
      size: 6,
      field: <Grid container>{nameCheck}</Grid>,
    },
    {
      size: 4,
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
      size: 8,
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
    {
      size: 12,
      field: (
        <Checkboxes
          name="notice1"
          formControlProps={{ margin: "none" }}
          data={{
            label:
              "茲聲明本人以上所填個人資料俱確實無訛，如有不實，願負法律責任",
            value: true,
          }}
        />
      ),
    },
    {
      size: 12,
      field: (
        <Checkboxes
          name="notice2"
          formControlProps={{ margin: "none" }}
          data={{
            label:
              "同意提供此申請相關文件中所提供之個人資料，授權供縣府發放紓困金妥善使用",
            value: true,
          }}
        />
      ),
    },
  ];

  return (
    <Grid container spacing={8}>
      <Grid item>
        <Header />
      </Grid>
      <Grid item>
        <Grid
          container
          className={classes.root}
          justifyContent="center"
          alignItems="center"
          spacing={8}
        >
          <Grid id="apply" item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Grid
                  container
                  justifyContent="space-around"
                  alignItems="center"
                >
                  <Grid item xs={12} md={6}>
                    <Grid
                      container
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item md={10} xs={12}>
                        <Image src={km} />
                      </Grid>
                      <Grid item xs={10}>
                        <Typography variant="h6">
                          金門縣因應新冠疫情紓困金說明:{" "}
                        </Typography>
                      </Grid>
                      <Grid item xs={10}>
                        <Typography>
                          1.
                          原則普發，每人5000元，存入申請人個人帳號，110年7月20日前設藉之全體縣民及取得居留證之外配皆有。
                        </Typography>
                        <Typography>2. 設藉於民政所不發。</Typography>
                        <Typography>3. 採申請制 :</Typography>
                        <Typography className={classes.indent}>
                          3.1
                          線上申請，輸入申請人身分證、出生年月日等資訊進行申請作業。
                        </Typography>
                        <Typography className={classes.indent}>
                          3.2 線下紙本，由村長及鄰長發放及收回申請表,
                          附申請人存摺封面影本，可代辦不可代領，須有
                          土地銀行、郵局或金門信用合作社之帳號 。亦可郵寄申請，
                          建議仍以鄰長實體紙本收回較佳。
                        </Typography>
                        <Typography>
                          4.
                          受理申請日自110年9月1日起至110年9月30日止(逾期不受理，視同無條件主動放棄請領權利)。
                        </Typography>
                        <Typography>
                          5.
                          如有疑問請撥各鄉(鎮)公所專線、或1999、或縣府民政處專線082-325640。
                        </Typography>
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<DescriptionIcon />}
                          onClick={() =>
                            window.open(
                              "https://www.kinmen.gov.tw/News_Content.aspx?n=1BC6B0D9638A6EE2&sms=A2C62D68901B977C&s=0560AE4B3861D97C",
                              "_blank"
                            )
                          }
                        >
                          相關申辦規定及表格下載
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Form
                          onSubmit={onSubmit}
                          checked={checked}
                          buttonDisable={buttonDisable}
                          initialValues={{
                            bank_id: "005",
                            notice1: true,
                            notice2: true,
                          }}
                          validate={(values) => {
                            return validate(values, bank_len);
                          }}
                          render={({
                            handleSubmit,
                            form,
                            submitting,
                            pristine,
                            values,
                          }) => (
                            <form onSubmit={handleSubmit} noValidate>
                              <Paper style={{ padding: 16 }}>
                                <Grid
                                  container
                                  alignItems="flex-start"
                                  spacing={2}
                                >
                                  {formFields.map((item, idx) => (
                                    <Grid item xs={12} md={item.size} key={idx}>
                                      {item.field}
                                    </Grid>
                                  ))}
                                  <Grid item>
                                    <Grid container spacing={1}>
                                      <Grid item>
                                        <Button
                                          type="button"
                                          variant="contained"
                                          onClick={form.reset}
                                          disabled={submitting || pristine}
                                        >
                                          清除
                                        </Button>
                                      </Grid>
                                      <Grid item>
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          type="submit"
                                          disabled={submitting || buttonDisable}
                                        >
                                          送出
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Paper>
                            </form>
                          )}
                        />
                      </Grid>
                      <Grid item>
                        <Grid container spacing={2}>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="secondary"
                              startIcon={<SecurityIcon />}
                              onClick={() => {
                                setPrivateOpen(true);
                              }}
                            >
                              隱私權聲明
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="secondary"
                              startIcon={<AccountBoxIcon />}
                              onClick={() => {
                                setPersonalOpen(true);
                              }}
                            >
                              個資法告知義務容
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Footer />
      <TModal
        handleClose={handleClose}
        open={open}
        content={content}
        title={title}
      />
      <NyModal
        handleClose={handleNyClose}
        handleSave={handleSave}
        open={nyOpen}
        content={content}
        title={title}
      />
      <PrivateModal handleClose={handlePClose} open={privateOpen} />
      <PersonalModal handleClose={handlePersonalClose} open={personalOpen} />
    </Grid>
  );
}

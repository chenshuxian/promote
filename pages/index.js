import React, { useState } from "react";
import ReactDOM from "react-dom";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Form } from "react-final-form";
import { TextField, Select, Checkboxes } from "mui-rff";
import { makeStyles } from "@material-ui/core";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CancelIcon from "@material-ui/icons/Cancel";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TModal from "./components/modal.js";
import post from "../src/post";
import Image from "next/image";
import houseId from "../public/house_id.jpeg";
import NyModal from "./components/NyModal";

import {
  Typography,
  Paper,
  Link,
  Grid,
  Button,
  CssBaseline,
  MenuItem,
  IconButton,
} from "@material-ui/core";

const checkFields = [
  {
    size: 12,
    field: (
      <TextField
        label="身份證"
        name="check_id"
        margin="none"
        required={true}
        placeholder="w123456789"
        variant="outlined"
      />
    ),
  },
  {
    size: 12,
    field: (
      <TextField
        label="出生年月日"
        name="chekc_born"
        margin="none"
        required={true}
        placeholder="格式:0890813"
        variant="outlined"
      />
    ),
  },
];

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
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [checked, setChecked] = useState("none");
  const [nameCheck, setNameCheck] = useState("");
  const [buttonDisable, setButtonDisable] = useState(false);
  const [id, setID] = useState("");
  const [formValues, setFormValues] = useState("");

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
    const status = {
      0: "未申請",
      1: "審核中",
      2: "審核通過",
      3: "已撥款",
      99: "資格不符,請輸入正確的身份證",
    };
    setID(event.target.value);
    const data = { api: "checkStatus", q: event.target.value };
    post("http://localhost:3000/api/user", data)
      .then((data) => {
        if (data.status >= 2) {
          setTitle(data.title);
          setContent(status[data.status]);
          setButtonDisable(true);
          setOpen(true);
        } else {
          setButtonDisable(false);
        }
      })
      .catch((error) => console.error(error));
  };

  // 確認使用者戶名
  const checkName = (event) => {
    //console.log(event.target.value);
    const data = { api: "checkName", q: { name: event.target.value, id: id } };
    post("http://localhost:3000/api/user", data)
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

  async function validate(values) {
    const errors = {};
    if (!values.id) {
      errors.id = "身份證不可為空";
    } else if (!values.id.match("^[a-zA-Z][A-Z|12]\\d{8}$")) {
      errors.id = "身份證格式錯誤, 本國W123456789, 國外AB12345678";
    }

    if (!values.born) {
      errors.born = "生日不可為空";
    } else if (isNaN(values.born) || values.born.length !== 7) {
      errors.born = "生日格式由3位數年份+2位月份+2位日期組成，如:0890102";
    }
    if (!values.bank_name) {
      errors.bank_name = "銀行戶名不可為空";
    }
    if (!values.phone) {
      errors.phone = "電話號碼不可為空";
    }
    if (!values.bank_id) {
      errors.bank_id = "銀行機構代號不可為空";
    }
    if (!values.bank_account) {
      errors.bank_account = "銀行帳號不可為空";
    } else if (
      isNaN(values.bank_account) ||
      values.bank_account.length !== 24
    ) {
      errors.bank_account = "銀行帳號由24位數字組成";
    }
    if (!values.house_id) {
      errors.house_id = "戶號不可為空";
    } else if (!values.house_id.match("^[a-zA-Z]\\d{7}$")) {
      errors.house_id = "戶號由英文字母為首+7位數字, 如: F1234567";
    }

    return errors;
  }

  function handleCheckBox(event) {
    console.log("checkbox: " + event.target.checked);
    if (event.target.checked) setChecked("block");
    else setChecked("none");
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleNyClose = () => {
    setNyOpen(false);
  };

  // obj to arr
  const objToArr = (values) => {
    let idToText = {
      bank_id: "銀行機構",
      house_id: "戶號",
      id: "身份證",
      born: "出生年月日",
      phone: "手機號碼",
      bank_account: "銀行帳號",
      bank_name: "銀行戶名",
    };
    let arr = [];
    let obj = {};
    for (const [key, value] of Object.entries(values)) {
      console.log(`${key}: ${value}`);
      obj = { name: idToText[key], value: value };
      arr.push(obj);
    }
    console.log(arr);
    return arr;
  };

  // 申請處理確認
  // 打開新的提示框要求使用者確認
  const onSubmit = async (values) => {
    // 1. 彈出 NyModal
    let title = "個人資訊確認";
    let newValues = objToArr(values);
    let content = (
      <Grid container spacing={2}>
        <Grid item>
          <Typography color="error">
            請確認所輸入資料完全正確，銀行帳戶確為本人所擁有，如因資料不全造成退匯，所衍生問題或法律責任由本人自行承擔。
          </Typography>
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
    console.log("form " + formValues);
    formValues.status = 1;
    formValues.bank_id = parseInt(formValues.bank_id);
    post("http://localhost:3000/api/apply", formValues)
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
      size: 12,
      field: (
        <TextField
          label="身份證"
          name="id"
          margin="none"
          required={true}
          placeholder="w123456789"
          onBlur={checkStatus}
          variant="outlined"
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
        />
      ),
    },
    {
      size: 6,
      field: (
        <TextField
          label="聯絡電話"
          name="phone"
          margin="none"
          required={true}
          placeholder="需提供正確電話"
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
      size: 12,
      field: (
        <Select
          name="bank_id"
          label="銀行機構代號"
          formControlProps={{ margin: "none" }}
          variant="outlined"
        >
          <MenuItem value="005">005 土地銀行</MenuItem>
          <MenuItem value="700">700 郵局</MenuItem>
          <MenuItem value="224">224 金門信用合作社</MenuItem>
        </Select>
      ),
    },
    {
      size: 12,
      field: (
        <TextField
          label="銀行帳號"
          name="bank_account"
          margin="none"
          required={true}
          variant="outlined"
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
          <Grid item>
            <Head>
              <title>金門縣振興補助申請</title>
            </Head>
          </Grid>
          <Grid item>
            <Typography variant="h2">金門縣線上振興補助申請平台</Typography>
          </Grid>
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
                        <Typography>2. 設藉於戶政所及通緝犯不發。</Typography>
                        <Typography>3. 採申請制 :</Typography>
                        <Typography className={classes.indent}>
                          3.1
                          經由本平台進行線上申請，輸入申請人身份證、出生年月日等資訊進行申請作業。
                        </Typography>
                        <Typography className={classes.indent}>
                          3.2由村長及鄰長發放及收回申請表,
                          附申請人存摺封面影本，可代辦不可代領，須有
                          土地銀行、郵局或金門信用合作社之帳號 。亦可郵寄申請，
                          建議仍以鄰長實體紙本收回較佳。
                        </Typography>
                        <Typography>
                          4.
                          受理申請期程為公告後1個月、建檔1週、審核1週，屆時以正式公告為主。
                        </Typography>
                        <Typography>
                          5. 申請表由縣府統一印製送各公所。
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Form
                      onSubmit={onSubmit}
                      checked={checked}
                      buttonDisable={buttonDisable}
                      initialValues={{ bank_id: "005" }}
                      validate={validate}
                      render={({
                        handleSubmit,
                        form,
                        submitting,
                        pristine,
                        values,
                      }) => (
                        <form onSubmit={handleSubmit} noValidate>
                          <Paper style={{ padding: 16 }}>
                            <Grid container alignItems="flex-start" spacing={2}>
                              {formFields.map((item, idx) => (
                                <Grid item xs={item.size} key={idx}>
                                  {item.field}
                                </Grid>
                              ))}
                              <Grid item style={{ marginTop: 16 }}>
                                <Button
                                  type="button"
                                  variant="contained"
                                  onClick={form.reset}
                                  disabled={submitting || pristine}
                                >
                                  清除
                                </Button>
                              </Grid>
                              <Grid item style={{ marginTop: 16 }}>
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
                          </Paper>
                        </form>
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.line}></Grid>
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography id="check" variant="h4">
                  補助查詢區
                </Typography>
              </Grid>
              <Grid container justifyContent="space-around" alignItems="center">
                <Grid item xs={12} md={5}>
                  <Form
                    onSubmit={checkSubmit}
                    validate={validate}
                    render={({
                      handleSubmit,
                      form,
                      submitting,
                      pristine,
                      values,
                    }) => (
                      <form onSubmit={handleSubmit} noValidate>
                        <Paper style={{ padding: 16 }}>
                          <Grid container alignItems="flex-start" spacing={2}>
                            {checkFields.map((item, idx) => (
                              <Grid item xs={item.size} key={idx}>
                                {item.field}
                              </Grid>
                            ))}
                            <Grid item style={{ marginTop: 16 }}>
                              <Button
                                type="button"
                                variant="contained"
                                onClick={form.reset}
                                disabled={submitting || pristine}
                              >
                                清除
                              </Button>
                            </Grid>
                            <Grid item style={{ marginTop: 16 }}>
                              <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={submitting}
                              >
                                查詢
                              </Button>
                            </Grid>
                          </Grid>
                          <pre>{JSON.stringify(values)}</pre>
                        </Paper>
                      </form>
                    )}
                  />
                </Grid>
                <Grid item xs={false} md={6}>
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item xs={false} md={6}>
                      <Typography variant="h6">
                        請於查詢欄位中輸入查詢資訊
                      </Typography>
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
    </Grid>
  );
}

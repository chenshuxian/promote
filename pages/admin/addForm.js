import React, { useState } from "react";
import Head from "next/dist/shared/lib/head";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Grid, Button, Typography } from "@material-ui/core";
import { Form } from "react-final-form";
import { adminValidate } from "../../function/validate";
import field from "../../function/field";
import Footer from "../components/Footer";
import postData from "../../src/post";
import { STATUS } from "../../function/common";
import CancelIcon from "@material-ui/icons/Cancel";
import TModal from "../components/modal";
import useUser from "../../lib/useUser";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Header from "../components/Header";
import IconButton from "@material-ui/core/IconButton";
import Router from "next/router";
import AlterModal from "../components/modal";
import NyModal from "../components/NyModal";
import Layout from "./Layout";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "100vw",
  },
  header: {
    marginTop: 90,
  },
  appbar: { flexGrow: 1 },
  title: { flexGrow: 1 },
}));

const logout = () => {
  postData("/api/logout")
    .then((data) => {
      if (!data.isLoggedIn) {
        Router.push("/admin/login");
      }
    })
    .catch((error) => console.error(error));
};

// obj to arr
const objToArr = (values) => {
  let idToText = {
    bank_id: "銀行機構",
    id: "身分證",
    born: "出生年月日",
    phone: "手機號碼",
    bank_account: "銀行帳號",
    bank_name: "銀行戶名",
    name: "姓名",
    parent_id: "代為申請人身分證",
    parent_name: "代為申請人姓名",
    reason: "代為申請原因",
    relationship: "與申請人關係",
    file_number: "編碼序號",
    other: "其他關係",
  };
  let reason = {
    0: "無",
    1: "未成年",
    2: "警示戶",
    3: "凍結戶",
  };
  let relationship = {
    1: "本人",
    2: "父親",
    3: "母親",
    4: "監護人",
    5: "其他",
  };
  let arr = [];
  let obj = {};
  for (const [key, value] of Object.entries(values)) {
    // console.log(`${key}: ${value}`);
    if (key !== "town") {
      if (key == "reason") {
        value = reason[value];
      }
      if (key == "relationship") {
        value = relationship[value];
      }
      obj = { name: idToText[key], value: value };
      arr.push(obj);
    }
  }
  console.log(arr);
  return arr;
};

// 鄉鎮代碼
const townId = {
  1: "51",
  2: "00",
  3: "53",
  4: "55",
  5: "56",
  6: "57",
};

export default function addForm(props) {
  const classes = useStyles();
  const [bank_len, setBank_len] = useState(12);
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const [addr, setAddr] = useState("");
  const [houseId, setHouseId] = useState("");
  const [open, setOpen] = useState(false);
  const [relation, setRelation] = useState(true);
  const [other, setOther] = useState(true);
  const [alOpen, setAlOpen] = useState(false);
  const [content, setContent] = useState("");
  const [alContent, setAlContent] = useState("");
  const [formValues, setFormValues] = useState("");
  const [title, setTitle] = useState("");
  const [nyOpen, setNyOpen] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(true);
  const [fileDisable, setFileDisable] = useState(true);
  const { user } = useUser({ redirectTo: "/admin/login" });
  // console.log(user);
  if (!user || user.isLoggedIn === false) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        component="main"
        className={classes.root}
        direction="row"
        spacing={2}
      >
        <Grid item xs={12}>
          <Header
            headerButton={
              <IconButton onClick={logout}>
                <ExitToAppIcon fontSize="large" />
              </IconButton>
            }
          />
        </Grid>
        <Grid item md={6} xs={12} className={classes.header}>
          Loading
        </Grid>
        <Footer />
      </Grid>
    );
  }

  const clearField = () => {
    setName("");
    setBorn("");
    setAddr("");
    setHouseId("");
    setBank_len(12);
  };
  /*
  申請處理
  狀態由0改為2申請中
  */
  const handleSave = () => {
    setNyOpen(false);
    // formValues.bank_id;formValues
    const data = {
      api: "addUserFromAdmin",
      editor: user.user.id,
      q: formValues,
    };

    postData(process.env.NEXT_PUBLIC_API_USER_URL, data)
      .then((data) => {
        console.log(data);
        document.getElementById("reset").click();

        // alert(data.msg);
        clearField();
        setTitle(data.title);
        setContent(<Typography variant="h6">{data.msg}</Typography>);
        setOpen(true);

        // let content = (
        //   <Typography variant="h2" color="secondary" align="center">
        //     {data.bank.id}
        //   </Typography>
        // );
        // setAlContent(content);
        // setAlOpen(true);
      })
      .catch((error) => console.error(error));
  };

  const onSubmit = (values) => {
    // console.log(values);
    // console.log("addFormsubmit :" + user.user.town);
    // console.log("addFormsubmit :" + user.user.editor);
    values.name = name;
    values.town = user.user.town;

    let title = "建檔資料確認";
    let newValues = objToArr(values);
    let today = new Date();
    let y = today.getFullYear();
    let m = today.getMonth();
    let d = today.getDate();

    let content = (
      <Grid container spacing={2}>
        <Grid item>
          <Typography color="error">
            請再核對相關資訊正確否，如編碼序號、銀行帳號、連絡電話等資料，無誤後按確認送出存檔。
          </Typography>
          <Typography>申請時間 : {`${y} - ${m + 1} - ${d}`}</Typography>
        </Grid>
        <Grid item>
          <Grid container direction="column" spacing={2}>
            {newValues.map((v, i) => {
              return (
                <Grid key={i} item xs>
                  {v.name == "編碼序號" ||
                  v.name == "手機號碼" ||
                  v.name == "銀行帳號" ? (
                    <Typography color="error">
                      {v.name} : {v.value}
                    </Typography>
                  ) : (
                    <Typography>
                      {v.name} : {v.value}
                    </Typography>
                  )}
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

    // 返回序號版本
    // postData(process.env.NEXT_PUBLIC_API_USER_URL, data)
    //   .then((data) => {
    //     // let content = (
    //     //   <Typography variant="h2" color="secondary" align="center">
    //     //     {data.bank.id}
    //     //   </Typography>
    //     // );
    //     // setAlContent(content);
    //     // setAlOpen(true);

    //     console.log(data);
    //   })
    //   .catch((error) => console.error(error));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAlClose = () => {
    setAlOpen(false);
  };

  const handleNyClose = () => {
    setNyOpen(false);
  };

  // 確認個人資料
  const profile = (event) => {
    const data = { api: "getUserProfile", q: { id: event.target.value } };
    postData(process.env.NEXT_PUBLIC_API_USER_URL, data)
      .then((data) => {
        console.log("check profile :" + user.user);
        if (data.status === 0 || user.user.roles !== 1) {
          // 未申請，可以進行申請
          setBorn(data.born);
          setName(data.name);
          setAddr(data.addr);
          setHouseId(data.house_id);
          setButtonDisable(false);
        } else {
          setOpen(true);
          setButtonDisable(true);
          setTitle("申請人資料核驗");
          let content = (
            <>
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <CancelIcon color="secondary" style={{ fontSize: 50 }} />
                </Grid>
                <Grid item>
                  {data.status == 99 ? (
                    <Typography>{STATUS[data.status]}</Typography>
                  ) : (
                    <>
                      <Typography color="error">
                        編碼序號: {data.file_number}
                      </Typography>
                      <Typography>申請人進度: {STATUS[data.status]}</Typography>
                      <Typography>申請人姓名: {data.name}</Typography>
                      <Typography>申請人生日: {data.born}</Typography>
                    </>
                  )}
                </Grid>
              </Grid>
            </>
          );
          setContent(content);
        }
      })
      .catch((error) => console.error(error));
  };

  // 確認檔案
  const checkFileNum = (event) => {
    const data = {
      api: "checkFileNumber",
      q: { file_number: parseInt(event.target.value) },
    };
    postData(process.env.NEXT_PUBLIC_API_USER_URL, data)
      .then((data) => {
        // 確認檔案序號是否已經存在表中
        if (user.user.roles == 1 && data.already) {
          console.log("filenumber");
          setOpen(true);
          setFileDisable(true);
          setTitle("編碼序號確認");
          let content = (
            <>
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <CancelIcon color="secondary" style={{ fontSize: 50 }} />
                </Grid>
                <Grid item>
                  <Typography>{data.msg}</Typography>
                </Grid>
              </Grid>
            </>
          );
          setContent(content);
        } else {
          // 需要先確認身份是可申請者才可以解開送出鈕
          setFileDisable(false);
        }
      })
      .catch((error) => console.error(error));
  };

  const formFields = field(
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
    setOther,
    buttonDisable,
    houseId
  );

  return (
    // <Grid
    //   container
    //   justifyContent="center"
    //   alignItems="center"
    //   component="main"
    //   className={classes.root}
    //   direction="row"
    //   spacing={2}
    // >
    //   <Grid item xs={12}>
    //     <Header
    //       headerButton={
    //         <IconButton onClick={logout}>
    //           <ExitToAppIcon fontSize="large" />
    //         </IconButton>
    //       }
    //     />
    //   </Grid>
    <Layout>
      <Grid item md={6} xs={12} className={classes.header}>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            bank_id: "005",
            relationship: "1",
            reason: "0",
            file_number: townId[user.user.town],
          }}
          buttonDisable={buttonDisable}
          fileDisable={fileDisable}
          validate={(values) => {
            return adminValidate(values, bank_len, born);
          }}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit}>
              <Paper style={{ padding: 16 }}>
                <Grid container alignItems="flex-start" spacing={2}>
                  {formFields.map((item, idx) => (
                    <Grid item xs={item.size} md={item.md} key={idx}>
                      {item.field}
                    </Grid>
                  ))}
                  <Grid item style={{ marginTop: 16 }}>
                    <Button
                      type="button"
                      variant="contained"
                      id="reset"
                      onClick={() => {
                        clearField();
                        form.reset();
                      }}
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
                      disabled={submitting || buttonDisable || fileDisable}
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
      <AlterModal
        handleClose={handleAlClose}
        open={alOpen}
        title="請將以下號碼寫在申請表上"
        content={alContent}
      />
      <NyModal
        handleClose={handleNyClose}
        handleSave={handleSave}
        open={nyOpen}
        content={content}
        title={title}
      />
      <TModal
        handleClose={handleClose}
        open={open}
        content={content}
        title={title}
      />
    </Layout>
    //   <Footer />

    //   <AlterModal
    //     handleClose={handleAlClose}
    //     open={alOpen}
    //     title="請將以下號碼寫在申請表上"
    //     content={alContent}
    //   />
    //   <NyModal
    //     handleClose={handleNyClose}
    //     handleSave={handleSave}
    //     open={nyOpen}
    //     content={content}
    //     title={title}
    //   />
    //   <TModal
    //     handleClose={handleClose}
    //     open={open}
    //     content={content}
    //     title={title}
    //   />
    // </Grid>
  );
}

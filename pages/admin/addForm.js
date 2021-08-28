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

const onSubmit = (values) => {
  console.log(values);
  const data = { api: "addUserFromAdmin", editor: "jacky", q: values };
  postData(process.env.NEXT_PUBLIC_API_USER_URL, data)
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.error(error));
};

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
      if (!data.isisLoggedIn) {
        Router.push("/admin/login");
      }
    })
    .catch((error) => console.error(error));
};

export default function addForm(props) {
  const { user } = useUser({ redirectTo: "/admin/login" });
  // console.log(user);

  const classes = useStyles();
  const [bank_len, setBank_len] = useState(12);
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [buttonDisable, setButtonDisable] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const profile = (event) => {
    const data = { api: "getUserProfile", q: { id: event.target.value } };
    postData(process.env.NEXT_PUBLIC_API_USER_URL, data)
      .then((data) => {
        if (data.status === 0) {
          // 未申請
          setBorn(data.born);
          setName(data.name);
          setButtonDisable(false);
        } else {
          setOpen(true);
          setButtonDisable(true);
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
                  <Typography>申請人為未申請狀態才可進行紙本申請</Typography>
                  {data.status == 99 ? (
                    <Typography>{STATUS[data.status]}</Typography>
                  ) : (
                    <>
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

  const formFields = field(setBank_len, bank_len, name, born, profile);

  return (
    <>
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
          <Form
            onSubmit={onSubmit}
            initialValues={{
              bank_id: "005",
              relationship: "1",
              reason: "0",
            }}
            buttonDisable={buttonDisable}
            validate={(values) => {
              return adminValidate(values, bank_len);
            }}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
              <form onSubmit={handleSubmit} noValidate>
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
        <Footer />
      </Grid>

      <TModal
        handleClose={handleClose}
        open={open}
        content={content}
        title="申請人資料核驗"
      />
    </>
  );
}

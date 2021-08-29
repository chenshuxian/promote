import React, { useState } from "react";
import { Form } from "react-final-form";
import { TextField, Select, Checkboxes } from "mui-rff";
import { makeStyles } from "@material-ui/core";
import SecurityIcon from "@material-ui/icons/Security";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TModal from "./components/modal.js";
import post from "../src/post";
import Image from "next/image";
import km from "../public/newIcon.jpg";
import { STATUS, STATUSICON } from "../function/common";
import { Typography, Paper, Grid, Button } from "@material-ui/core";

const checkFields = [
  {
    size: 12,
    field: (
      <Typography variant="h5" color="secondary">
        線上紓困查詢服務
      </Typography>
    ),
  },
  {
    size: 12,
    field: (
      <TextField
        label="身分證"
        name="id"
        margin="none"
        required={true}
        placeholder="w123456789"
        variant="outlined"
        inputProps={{
          maxLength: 10,
        }}
      />
    ),
  },
  {
    size: 12,
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
];

const useStyles = makeStyles({
  root: {
    height: "95vh",
    padding: 30,
  },
  imgs: {
    width: "80%",
  },
});

const validate = (values) => {
  const errors = {};
  if (!values.id) {
    errors.id = "身分證不可為空";
  } else if (!values.id.match("^[a-zA-Z][A-Z|12]\\d{8}$")) {
    errors.id = "身分證格式錯誤, 本國W123456789, 國外AB12345678";
  }

  if (!values.born) {
    errors.born = "生日不可為空";
  } else if (isNaN(values.born) || values.born.length !== 7) {
    errors.born = "生日格式由3位數年份+2位月份+2位日期組成，如:0890102";
  }

  return errors;
};

export default function Home() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const checkSubmit = async (values) => {
    console.log(values);
    const data = {
      api: "checkStatusBorn",
      q: { id: values.id, born: values.born },
    };

    post(process.env.NEXT_PUBLIC_API_USER_URL, data)
      .then((data) => {
        console.log(data.data.bank_account);
        if (data) {
          setTitle(data.title);
          setOpen(true);
          let content = (
            <>
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <Grid item>{STATUSICON[data.status]}</Grid>
                <Grid item>
                  <Typography>申請人進度: {STATUS[data.status]}</Typography>
                  <Typography>申請人姓名: {data.data.name}</Typography>
                  {data.data.bank_account ? (
                    <Typography>
                      申請人帳號: {data.data.bank_account}
                    </Typography>
                  ) : null}
                </Grid>
              </Grid>
            </>
          );
          setContent(content);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Header />
      <Grid
        container
        className={classes.root}
        justifyContent="center"
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <Grid item xs={12} md={6}>
          <Image src={km} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item>
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
                          <Grid item xs={12} md={item.size} key={idx}>
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
      <Footer />
      <TModal
        handleClose={handleClose}
        open={open}
        content={content}
        title={title}
      />
    </>
  );
}

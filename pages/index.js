import React from "react";
import ReactDOM from "react-dom";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Form } from "react-final-form";
import { TextField, Select, Checkboxes } from "mui-rff";
import { makeStyles } from "@material-ui/core";
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TModal from "./components/modal.js";

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

const formFields = [
  {
    size: 12,
    field: (
      <TextField
        label="身份證"
        name="id"
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
        name="born"
        margin="none"
        required={true}
        placeholder="格式:0890813"
        variant="outlined"
      />
    ),
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

const onSubmit = async (values) => {
  console.log(values);
};
const checkSubmit = async (values) => {
  console.log(values);
};

export default function Home() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState("none");
  // yes, this can even be async

  // yes, this can even be async!
  async function validate(values) {
    const errors = {};
    return errors;
  }

  function handleCheckBox(event) {
    console.log("checkbox: " + event.target.checked);
    if (event.target.checked) setChecked("block");
    else setChecked("none");
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            <Typography variant="h2">金門縣線上振興申請補助平台</Typography>
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
                              <Grid item xs={12}>
                                <Checkboxes
                                  name="help"
                                  formControlProps={{ margin: "none" }}
                                  data={{
                                    label: "未滿20代為申請",
                                    value: false,
                                  }}
                                  onClick={handleCheckBox}
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  label="戶號"
                                  name="house_id"
                                  margin="none"
                                  required={true}
                                  placeholder="格式:0890813"
                                  variant="outlined"
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <IconButton
                                  color="primary"
                                  aria-label="upload picture"
                                  component="span"
                                  onClick={handleOpen}
                                >
                                  <ImageSearchIcon style={{ fontSize: 30 }} />
                                </IconButton>
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  label="監護人身份證"
                                  name="parent_id"
                                  margin="none"
                                  required={true}
                                  placeholder="w123456789"
                                  variant="outlined"
                                  style={{ display: checked }}
                                />
                              </Grid>
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
                                  disabled={submitting}
                                >
                                  送出
                                </Button>
                              </Grid>
                            </Grid>
                            <pre>{JSON.stringify(values)}</pre>
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
      <TModal handleClose={handleClose} open={open} />
    </Grid>
  );
}

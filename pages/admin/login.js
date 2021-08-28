import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Image from "next/image";
import icon from "../../public/newIcon.jpg";
import { blue } from "@material-ui/core/colors";
import postData from "../../src/post";
import FixPwModal from "../components/FixPwModal";
import useUser from "../../lib/useUser";
import Router from "next/router";
import { AlternateEmail } from "@material-ui/icons";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      金門縣政府 {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "100vw",
    backgroundColor: blue[100],
  },
  image: {
    alignSelf: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  // const { mutateUser } = useUser({
  //   redirectTo: "/admin/addForm",
  //   redirectIfFound: true,
  // });
  const { user } = useUser({});

  // 非首次登入
  console.log("loginPage: " + user);
  if (user && user.isLoggedIn) {
    if (!user.user.is_fix_pw) {
      //console.log("userisifx");
      Router.push("/admin/addForm");
    }
  }

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  const onFixPw = (values) => {
    let data = { api: "fixPw", q: { id: id, pw: values.pw1 } };
    postData(process.env.NEXT_PUBLIC_API_LOGIN_URL, data)
      .then((data) => {
        setOpen(false);
        Router.push("/admin/addForm");
      })
      .catch((error) => console.error(error));
  };

  const onSubmit = (event) => {
    let id = document.getElementsByName("id")[0].value;
    let pw = document.getElementsByName("password")[0].value;

    let data = { api: "login", q: { id, pw } };
    postData(process.env.NEXT_PUBLIC_API_LOGIN_URL, data)
      .then((data) => {
        if (data.fail) {
          alert(data.msg);
        }

        if (data[0].is_fix_pw) {
          //密碼修改
          //打開修改密碼視窗
          setId(data[0].id);
          setOpen(true);
        } else {
          Router.push("/admin/addForm");
        }
      })
      .catch((error) => console.error(error));
  };
  return (
    <Grid container component="main" className={classes.root} spacing={1}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image}>
        <Image src={icon} />
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="帳號"
              name="id"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="密碼"
              type="password"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={onSubmit}
            >
              登入
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
      <FixPwModal open={open} onFixPw={onFixPw} id={id} />
    </Grid>
  );
}

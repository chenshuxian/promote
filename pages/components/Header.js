/* eslint-disable react/jsx-key */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Grid } from "@material-ui/core";
import Image from "next/image";
import icon from "../../public/newIcon.jpg";
import Head from "next/head";
import { blue } from "@material-ui/core/colors";
import useUser from "../../lib/useUser";

const homeSection = [
  { id: "apply", title: "申請區" },
  { id: "check", title: "查詢區" },
];

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    margin: 0,
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 999,
    borderRadius: 0,
    backgroundColor: blue[100],
  },
  link: {
    textDecoration: "none",
    color: "black",
    "&:focus, &:hover, &:visited, &:link, &:active": {
      textDecoration: "none",
    },
  },
});

const Header = (props) => {
  const classes = useStyles();
  let roles;
  const { user } = useUser({ redirectTo: "/admin/login" });
  if (!user || user.isLoggedIn === false) {
    return (
      <Paper className={classes.root}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Image src={icon} width={200} height={80}></Image>
          Loading
          <Head>
            <title>金門縣110年紓困申請</title>
          </Head>
        </Grid>
      </Paper>
    );
  }

  if (user) {
    console.log("header" + user.user.roles);
    roles = user.user.roles;
  }

  return (
    <Paper className={classes.root}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Image src={icon} width={200} height={80}></Image>
        <Grid item>
          {roles >= 2 ? props.dataViewButton : null}
          {roles >= 2 ? props.addFormButton : null}
          {props.headerButton}
        </Grid>
        <Head>
          <title>金門縣110年紓困申請</title>
        </Head>
      </Grid>
    </Paper>
  );
};

export default Header;

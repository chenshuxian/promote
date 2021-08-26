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

const homeSection = [
  { id: "apply", title: "申請區" },
  { id: "check", title: "查詢區" },
];

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    margin: 0,
    position: "fixed",
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

const Header = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Image src={icon} width={200} height={80}></Image>
        {/* <div style={{ display: "flex" }}>
          {homeSection.map((item, index) => {
            return (
              <a key={index} href={"#" + item.id} className={classes.link}>
                <Tabs value={false}>
                  <Tab label={item.title} />
                </Tabs>
              </a>
            );
          })}
        </div> */}
        <Head>
          <title>金門縣110年紓困申請</title>
        </Head>
      </Grid>
    </Paper>
  );
};

export default Header;

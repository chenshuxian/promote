import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Router from "next/router";
import postData from "../../src/post";
import useUser from "../../lib/useUser";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "100vw",
  },
  header: {
    marginTop: 90,
  },
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

const Layout = ({ children }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="flex-end"
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
      {children}
      <Footer />
    </Grid>
  );
};

export default Layout;

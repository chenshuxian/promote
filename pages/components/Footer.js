import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import { blue, blueGrey } from "@material-ui/core/colors";

const useStyles = makeStyles({
  root: {
    minHeight: 50,
    backgroundColor: blue[100],
    paddingBottom: 0,
  },
});

const Footer = () => {
  const classes = useStyles();
  const year = new Date().getFullYear();
  return (
    <Grid
      className={classes.root}
      container
      justifyContent="center"
      alignItems="center"
    >
      <Typography>© {year} 金門縣民政處 </Typography>
    </Grid>
  );
};

export default Footer;

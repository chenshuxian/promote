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
  return (
    <Grid
      className={classes.root}
      container
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        金門縣政府 {new Date().getFullYear()}
        {"."}
      </Typography>
    </Grid>
  );
};

export default Footer;

import React, { useState } from "react";
import Head from "next/dist/shared/lib/head";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Grid, Button } from "@material-ui/core";
import { Form } from "react-final-form";
import Image from "next/image";
import icon from "../../public/newIcon.jpg";
import { adminValidate } from "../../function/validate";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import { blue } from "@material-ui/core/colors";
import field from "../../function/field";
import Footer from "../components/Footer";

const onSubmit = (values) => {
  console.log(values);
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "100vw",
  },
  header: {
    backgroundColor: blue[100],
  },
}));

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default function addForm(props) {
  const classes = useStyles();
  const [bank_len, setBank_len] = useState(12);
  const formFields = field(setBank_len, bank_len);

  return (
    <>
      <Head>
        <title>金門縣振興補助申請</title>
      </Head>
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
          <ElevationScroll {...props}>
            <AppBar className={classes.header}>
              <Toolbar>
                <Image src={icon} width={200} height={80} />
              </Toolbar>
            </AppBar>
          </ElevationScroll>
        </Grid>
        <Grid item md={6} xs={12}>
          <Form
            onSubmit={onSubmit}
            initialValues={{
              bank_id: "005",
              relationship: "1",
              reason: "1",
            }}
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
                        disabled={submitting}
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
      </Grid>
      <Footer />
    </>
  );
}

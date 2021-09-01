import * as React from "react";
import Layout from "./Layout";
import { Grid, Button } from "@material-ui/core";
import { useWindowSize } from "../../function/common";
import useUser from "../../lib/useUser";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import { createTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import withSession from "../../lib/session";
import DescriptionIcon from "@material-ui/icons/Description";
import postData from "../../src/post";
import Footer from "../components/Footer";
function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const columns = [
  { field: "id", headerName: "身分證", width: 150 },
  { field: "name", headerName: "姓名", width: 150 },
  { field: "parent_id", headerName: "監護人姓名", width: 150 },
  { field: "parent_name", headerName: "監護人身分證", width: 180 },
  { field: "bank_id", headerName: "銀行代號", width: 150 },
  { field: "bank_account", headerName: "銀行帳號", width: 150 },
  { field: "phone", headerName: "連絡電話", width: 150 },
  { field: "update_time", headerName: "申報時間", width: 150 },
];

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) => ({
    root: {
      padding: theme.spacing(0.5, 0.5, 0),
      justifyContent: "flex-end",
      display: "flex",
      alignItems: "flex-end",
      flexWrap: "wrap",
    },
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      [theme.breakpoints.down("xs")]: {
        width: "100%",
      },
      margin: theme.spacing(1, 0.5, 1.5),
      "& .MuiSvgIcon-root": {
        marginRight: theme.spacing(0.5),
      },
      "& .MuiInput-underline:before": {
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    },
  }),
  { defaultTheme }
);

export default function DataView() {
  const classes = useStyles();
  const [rows, setRows] = React.useState([{}]);
  const { user } = useUser({ redirectTo: "/admin/login" });
  React.useEffect(() => {
    postData(process.env.NEXT_PUBLIC_API_DG_URL)
      .then((data) => {
        setRows(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [rows]);

  if (!user || user.isLoggedIn === false) {
    return (
      <Layout>
        <Grid item md={6} xs={12}>
          Loading
        </Grid>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Grid item md={12} xs={12} style={{ height: 740, padding: 80 }}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <form noValidate>
                <Grid
                  container
                  spacing={2}
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Grid item>
                    <TextField
                      id="sdate"
                      type="date"
                      label="起始日"
                      defaultValue={new Date()}
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      id="edate"
                      type="date"
                      label="結束始日"
                      defaultValue={new Date()}
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>{" "}
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<DescriptionIcon />}
                    >
                      報表下載
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Grid item>
              <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection
                  disableSelectionOnClick
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

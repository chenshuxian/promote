import React, { useState } from "react";
import Layout from "./Layout";
import { Grid, Button, Typography } from "@material-ui/core";
import useUser from "../../lib/useUser";
import TextField from "@material-ui/core/TextField";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import { TODAY } from "../../function/common";
import DescriptionIcon from "@material-ui/icons/Description";
import postData from "../../src/post";
import { AlternateEmail } from "@material-ui/icons";
import { common } from "@material-ui/core/colors";
function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const columns = [
  { field: "file_number", headerName: "編碼序號", width: 120 },
  { field: "id", headerName: "身分證", width: 120 },
  { field: "name", headerName: "姓名", width: 110 },
  {
    field: "town",
    headerName: "鄉鎮",
    width: 110,
    valueFormatter: (params) => {
      const status = {
        1: "金城",
        2: "金湖",
        3: "金沙",
        4: "金寧",
        5: "烈嶼",
        6: "烏坵",
      };
      return status[params.value];
    },
  },
  { field: "parent_id", headerName: "代理(領)人姓名", width: 120 },
  { field: "parent_name", headerName: "代理(領)人身分證", width: 150 },
  { field: "bank_id", headerName: "銀行代號", width: 130 },
  { field: "bank_account", headerName: "銀行帳號", width: 150 },
  {
    field: "phone",
    headerName: "連絡電話",
    width: 150,
  },
  {
    field: "relationship",
    headerName: "與申請人關係",
    width: 150,
    valueFormatter: (params) => {
      const status = {
        1: "本人",
        2: "父親",
        3: "母親",
        4: "監護人",
        5: "其他",
      };
      return status[params.value];
    },
  },
  {
    field: "status",
    headerName: "狀態",
    width: 150,
    valueFormatter: (params) => {
      const status = {
        0: "未申請",
        1: "申請中",
        2: "已審核",
        3: "已撥款",
        4: "撥款失敗",
      };
      return status[params.value];
    },
  },
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

const getData = async (sdate, edate, setRows, setStatistics) => {
  const data = { sdate, edate };
  postData(process.env.NEXT_PUBLIC_API_DG_URL, data)
    .then((data) => {
      setRows(data.data);
    })
    .catch((err) => {
      console.log(err);
    });

  postData(process.env.NEXT_PUBLIC_API_ST_URL, data)
    .then((data) => {
      setStatistics(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const genReport = (sdate, edate) => {
  const data = { sdate, edate };
  postData(process.env.NEXT_PUBLIC_API_DG_URL, data)
    .then((data) => {
      setRows(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default function DataView() {
  const today = TODAY();
  const classes = useStyles();
  const [rows, setRows] = useState([{ id: "", name: "" }]);
  const [sdate, setSdate] = useState("2021-09-03");
  const [edate, setEdate] = useState(today);
  const [statistics, setStatistics] = useState({
    t: 0,
    u: 0,
    a: 0,
    f: 0,
    p: 0,
  });
  const { user } = useUser({ redirectTo: "/admin/login" });

  React.useEffect(() => {
    /* 在這裡做 postData */
    postData(process.env.NEXT_PUBLIC_API_DG_URL)
      .then((data) => {
        setRows(data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    postData(process.env.NEXT_PUBLIC_API_ST_URL)
      .then((data) => {
        setStatistics(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handlePageChange = (nextPage) => {
    console.log("pages:" + nextPage);
  };

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
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography>總人數: {statistics.t}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>未申請: {statistics.u}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>已申請: {statistics.a}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>已審核: {statistics.f}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>已撥款: {statistics.p}</Typography>
                  </Grid>
                  <Grid item>
                    <TextField
                      id="sdate"
                      type="date"
                      label="起始日"
                      defaultValue={sdate}
                      onChange={(e) => {
                        setSdate(e.target.value);
                        getData(e.target.value, edate, setRows, setStatistics);
                      }}
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
                      defaultValue={edate}
                      className={classes.textField}
                      onChange={async (e) => {
                        await setEdate(e.target.value);
                        await getData(
                          sdate,
                          e.target.value,
                          setRows,
                          setStatistics
                        );
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>{" "}
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      // onClick={genReport(sDate, eDate)}
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
                  pageSize={100}
                  pagination
                  rowHeight={40}
                  onPageChange={handlePageChange}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

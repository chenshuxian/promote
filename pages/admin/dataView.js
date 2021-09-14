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
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import Router from "next/router";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { AlternateEmail, PagesSharp } from "@material-ui/icons";

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
  { field: "editor", headerName: "建檔人", width: 150 },
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
function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

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

const pass = async (name) => {
  //線上審核，線上申請且同名
  let data = { api: "checkOnline", name: name };
  postData(process.env.NEXT_PUBLIC_API_USER_URL, data)
    .then((data) => {
      //console.log(data);
      window.alert(data.msg);
    })
    .catch((err) => {
      console.log(err);
    });
};

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
  fetch(process.env.NEXT_PUBLIC_API_XLS_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "user-agent": "Mozilla/4.0 MDN Example",
      "content-type": "application/json",
    },
  })
    .then(function (response) {
      return response.blob();
    })
    .then(function (blob) {
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = URL.createObjectURL(blob);
      link.download = "report.xlsx";
      document.body.appendChild(link);
      link.click();
      // 釋放的 URL 物件以及移除 a 標籤
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    });
};

function QuickSearchToolbar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        className={classes.textField}
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? "visible" : "hidden" }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}

export default function DataView() {
  const today = TODAY();
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [initRows, setInitRows] = useState([]);
  const [searchText, setSearchText] = React.useState("");
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
        setInitRows(data.data);
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

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    // console.log(searchRegex);
    const filteredRows = initRows.filter((row) => {
      return Object.keys(row).some((field) => {
        // console.log(row[field].toString());
        let str = row[field] ? row[field].toString() : "test";
        return searchRegex.test(str);
      });
    });
    console.log(filteredRows.length);
    if (user.user.roles === 3 && filteredRows.length === 0) {
      // console.log("server search");
      let data = { id: searchValue };
      postData(process.env.NEXT_PUBLIC_API_DG_URL, data)
        .then((data) => {
          setRows(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setRows(filteredRows);
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
                      onClick={() => {
                        genReport(sdate, edate);
                      }}
                      startIcon={<DescriptionIcon />}
                    >
                      報表下載
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      style={{ margin: 15 }}
                      startIcon={<PersonAddIcon />}
                      onClick={() => Router.push("/admin/addForm")}
                    >
                      新增
                    </Button>
                    {user.user.roles === 3 ? (
                      <Button
                        variant="contained"
                        color="secondary"
                        style={{ margin: 15 }}
                        startIcon={<PersonAddIcon />}
                        onClick={() => {
                          let yes = window.confirm("你確認要進行線上審核嗎");
                          if (yes) {
                            pass(user.user.name);
                          }
                        }}
                      >
                        線上審核
                      </Button>
                    ) : null}
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Grid item>
              <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                  components={{ Toolbar: QuickSearchToolbar }}
                  componentsProps={{
                    toolbar: {
                      value: searchText,
                      onChange: (event) => requestSearch(event.target.value),
                      clearSearch: () => requestSearch(""),
                    },
                  }}
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

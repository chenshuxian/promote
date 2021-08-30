import * as React from "react";
import Layout from "./Layout";
import { Grid } from "@material-ui/core";
import { useWindowSize } from "../../function/common";
import useUser from "../../lib/useUser";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import { GetServerSideProps } from "next";
import { DataGrid } from "@mui/x-data-grid";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import { createTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

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
  const { user } = useUser({ redirectTo: "/admin/login" });
  const dataRows = [
    { id: 1, col1: "Hello", col2: "World" },
    { id: 2, col1: "DataGridPro", col2: "is Awesome" },
    { id: 3, col1: "Material-UI", col2: "is Amazing" },
  ];

  const [searchText, setSearchText] = React.useState("");
  const [rows, setRows] = React.useState(dataRows);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = data.rows.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setRows(filteredRows);
  };

  //   React.useEffect(() => {
  //     setRows(dataRows);
  //   }, [dataRows]);
  const size = useWindowSize();
  return (
    <Layout>
      <Grid item md={12} xs={12} style={{ height: 720, padding: 80 }}>
        <div style={{ height: 600, width: "100%", padding: 20 }}>
          <DataGrid
            components={{ Toolbar: QuickSearchToolbar }}
            rows={rows}
            columns={columns}
            componentsProps={{
              toolbar: {
                value: searchText,
                onChange: (event) => requestSearch(event.target.value),
                clearSearch: () => requestSearch(""),
              },
            }}
          />
        </div>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}

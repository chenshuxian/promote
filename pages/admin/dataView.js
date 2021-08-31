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
function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.getValue(params.id, "firstName") || ""} ${
        params.getValue(params.id, "lastName") || ""
      }`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

// const columns = [
//   { field: "id", headerName: "身分證", width: 150 },
//   { field: "name", headerName: "姓名", width: 150 },
//   { field: "parent_id", headerName: "監護人姓名", width: 150 },
//   { field: "parent_name", headerName: "監護人身分證", width: 180 },
//   { field: "bank_id", headerName: "銀行代號", width: 150 },
//   { field: "bank_account", headerName: "銀行帳號", width: 150 },
//   { field: "phone", headerName: "連絡電話", width: 150 },
//   { field: "update_time", headerName: "申報時間", width: 150 },
// ];

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
  const rows = [{}];

  //   postData(process.env.NEXT_PUBLIC_API_DG_URL, data)
  //     .then((data) => {
  //       setRows(dataRows);
  //     })
  //     .catch((error) => console.error(error));

  const [searchText, setSearchText] = React.useState("");
  // const [rows, setRows] = React.useState(dataRows);

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
  const size = useWindowSize();
  return (
    <Layout>
      <Grid item md={12} xs={12} style={{ height: 740, padding: 80 }}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Grid container spacing={2} justifyContent="flex-end">
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DescriptionIcon />}
                >
                  報表下載
                </Button>
              </Grid>
              <Grid item>
                <TextField
                  id="date"
                  type="date"
                  defaultValue={new Date()}
                  InputLabelProps={{
                    shrink: false,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <div style={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
              />
              {/* <DataGrid
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
            /> */}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}

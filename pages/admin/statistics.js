import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import Layout from "./Layout";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import postData from "../../src/post";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

function createData(name, jc, jh, js, jn, lu, wq, sum) {
  return { name, jc, jh, js, jn, lu, wq, sum };
}

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "100vw",
  },
  header: {
    padding: 90,
  },
  appbar: { flexGrow: 1 },
  title: { flexGrow: 1 },
}));

const GroupedBar = () => {
  const classes = useStyles();
  const [totalData, setTotalData] = useState([]);
  const [applyData, setApplyData] = useState([]);
  const [noApplyData, setNoApplyData] = useState([]);
  const [okData, setOkData] = useState([]);
  const [payData, setPayData] = useState([]);
  const [applyTotal, setApplyTotal] = useState([]);
  const [onlineApply, setOnlineApply] = useState([]);
  const [papperApply, setPapperApply] = useState([]);
  const [totalPay, setTotalPay] = useState([]);
  const [noApplyTotal, setNoApplyTotal] = useState([]);

  React.useEffect(() => {
    postData(process.env.NEXT_PUBLIC_API_STA_URL)
      .then((data) => {
        console.log(data);
        setTotalData(data.total.map((v, i) => v.total));
        setApplyData(data.apply.map((v, i) => v.total));
        setNoApplyData(data.noApply.map((v, i) => v.total));
        setOkData(data.ok.map((v, i) => v.total));
        setPayData(data.pay.map((v, i) => v.total));
        setOnlineApply(data.onlineApply[0].total);
        setPapperApply(data.papperApply[0].total);
        setTotalPay(data.totalPay[0].total);
        setNoApplyTotal(data.noApplyTotal[0].total);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //let ip1 = ipToInt(996588184).toIP;
  // var geo = ipLocation(ip1);
  // console.log(geo);

  const data = {
    labels: ["??????", "??????", "??????", "??????", "??????", "??????"],
    datasets: [
      {
        label: "?????????",
        data: totalData,
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: "?????????",
        data: payData,
        backgroundColor: "rgb(254, 224, 132)",
      },
      {
        label: "?????????",
        data: okData,
        backgroundColor: "rgb(105, 191, 88)",
      },

      {
        label: "?????????",
        data: applyData,
        backgroundColor: "rgb(54, 162, 235)",
      },
      {
        label: "?????????",
        data: noApplyData,
        backgroundColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const pieData = (apply = 20, noApply = 80) => {
    console.log(noApply);
    let data = {
      labels: ["?????????", "?????????"],
      datasets: [
        {
          label: "# of Votes",
          data: [parseInt(apply), parseInt(noApply)],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
          borderWidth: 1,
        },
      ],
    };
    return data;
  };

  let rows = [
    createData(
      "?????????",
      totalData[0],
      totalData[1],
      totalData[2],
      totalData[3],
      totalData[4],
      totalData[5],
      totalData[0] +
        totalData[1] +
        totalData[2] +
        totalData[3] +
        totalData[4] +
        totalData[5]
    ),
    createData(
      "????????????",
      noApplyData[0],
      noApplyData[1],
      noApplyData[2],
      noApplyData[3],
      noApplyData[4],
      noApplyData[5],
      noApplyTotal
    ),
    createData(
      "?????????,?????????",
      applyData[0] ? applyData[0] : 0,
      applyData[1] ? applyData[1] : 0,
      applyData[2] ? applyData[2] : 0,
      applyData[3] ? applyData[3] : 0,
      applyData[4] ? applyData[4] : 0,
      applyData[5] ? applyData[5] : 0,
      (applyData[0] ? applyData[0] : 0) +
        (applyData[1] ? applyData[1] : 0) +
        (applyData[2] ? applyData[2] : 0) +
        (applyData[3] ? applyData[3] : 0) +
        (applyData[4] ? applyData[4] : 0) +
        (applyData[5] ? applyData[5] : 0)
    ),
    createData(
      "?????????,?????????",
      okData[0],
      okData[1],
      okData[2],
      okData[3],
      okData[4],
      okData[5],
      okData[0] + okData[1] + okData[2] + okData[3] + okData[4] + okData[5]
    ),
    createData(
      "?????????",
      payData[0],
      payData[1],
      payData[2],
      payData[3],
      payData[4],
      payData[5],
      payData[0] +
        payData[1] +
        payData[2] +
        payData[3] +
        payData[4] +
        payData[5]
    ),
  ];

  return (
    <Layout>
      <Grid
        container
        className={classes.header}
        justifyContent="center"
        alignContent="center"
        spacing={4}
      >
        <Grid item xs={12}>
          <Typography variant="h4">?????????????????????????????????</Typography>
          <Typography variant="h6">
            ???????????????????????????: {onlineApply} ???????????????????????????:{papperApply}{" "}
            ????????????????????????: {totalPay} ??????????????????: {noApplyTotal}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={6}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>??????</TableCell>
                      <TableCell align="right">??????</TableCell>
                      <TableCell align="right">??????</TableCell>
                      <TableCell align="right">??????</TableCell>
                      <TableCell align="right">??????</TableCell>
                      <TableCell align="right">??????</TableCell>
                      <TableCell align="right">??????</TableCell>
                      <TableCell align="right">??????</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.jc}</TableCell>
                        <TableCell align="right">{row.jh}</TableCell>
                        <TableCell align="right">{row.js}</TableCell>
                        <TableCell align="right">{row.jn}</TableCell>
                        <TableCell align="right">{row.lu}</TableCell>
                        <TableCell align="right">{row.wq}</TableCell>
                        <TableCell align="right">{row.sum}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={6}>
              <Bar data={data} options={options} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default GroupedBar;

import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { useMediaQuery } from "@material-ui/core";

export default function TransitionsModal(props) {
  const theme = useTheme();
  const alignItem = useMediaQuery(theme.breakpoints.down("xs"))
    ? "flex-end"
    : "center";

  const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      alignItems: alignItem,
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));
  const classes = useStyles();

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">{props.title}</h2>
            {props.content}
            {/* <Image src={houseId} /> */}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

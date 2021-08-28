import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { TextField, Select } from "mui-rff";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { ErrorSharp, VisibilityOff } from "@material-ui/icons";
import { Form } from "react-final-form";
import { Paper, Grid } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";
import { Hidden } from "@material-ui/core";

export default function FixPwModal(props) {
  const [hide, setHide] = useState(true);

  const validate = (values) => {
    const errors = {};
    if (!values.pw1) {
      errors.pw1 = "必填欄位";
    } else if (!values.pw1.match("^(?=.*[a-z])(?=.*\\d)[a-zA-Z\\d]{6,}$")) {
      errors.pw1 = "需包含小寫英文數字至少6位數";
    }
    if (!values.pw2) {
      errors.pw2 = "必填欄位";
    } else if (values.pw1 !== values.pw2) {
      errors.pw2 = "兩個密碼必需相同";
    }

    return errors;
  };

  const formFields = [
    {
      size: 12,
      md: 12,
      field: (
        <TextField
          label="id"
          name="id"
          margin="none"
          variant="outlined"
          value={props.id}
          disabled
        />
      ),
    },
    {
      size: 12,
      md: 12,
      field: (
        <TextField
          label="密碼"
          name="pw1"
          type={hide ? "password" : "text"}
          margin="none"
          required={true}
          variant="outlined"
        />
      ),
    },
    {
      size: 12,
      md: 12,
      field: (
        <TextField
          label="確認密碼"
          name="pw2"
          type={hide ? "password" : "text"}
          margin="none"
          required={true}
          variant="outlined"
        />
      ),
    },
  ];
  return (
    <div>
      <Dialog open={props.open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">密碼修改</DialogTitle>
        <DialogContent>
          <Form
            onSubmit={props.onFixPw}
            validate={validate}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
              <form onSubmit={handleSubmit} noValidate>
                <Grid container alignItems="flex-start" spacing={2}>
                  {formFields.map((item, idx) => (
                    <Grid item xs={item.size} md={item.md} key={idx}>
                      {item.field}
                    </Grid>
                  ))}
                  <Grid item xs={12} md={4}>
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                      onClick={() => setHide(!hide)}
                    >
                      {hide ? <VisibilityOff /> : <VisibilityIcon />}
                    </IconButton>
                  </Grid>
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
              </form>
            )}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function PersonalModal(props) {
  return (
    <div>
      <Dialog
        onClose={props.handleClose}
        aria-labelledby="customized-dialog-title"
        open={props.open}
      >
        <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
          個人資料保護法告知義務內容
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            履行個人資料保護法第八條第一項告知義務內容
          </Typography>
          <Typography gutterBottom>
            一、親愛的客戶您好，由於個人資料之蒐集，涉及臺端之隱私權益，金門縣政府(以下簡稱本府)向臺端蒐集個人資料時，依據個人資料保護法（以下稱個資法）第八條第一項規定，應明確告知臺端下列事項：{" "}
            <br />
            1. 公務機關名稱。
            <br /> 2. 蒐集之目的。
            <br /> 3. 個人資料之類別。
            <br />
            4. 個人資料利用之期間、地區、對象及方式。
            <br />
            5. 當事人依個資法第三條規定得行使之權利及方式。
            <br />
            6. 當事人得自由選擇提供個人資料時，不提供將對其權益之影響。
          </Typography>
          <Typography gutterBottom>
            一、隱私權公告適用範圍： <br />
            本隱私權公告（以下簡稱本公告），適用於您在本網站及本網站提供之軟體辦理各項電子申辦及申報服務（以下簡稱本服務）時，所涉及的個人資料蒐集、處理、利用與保護，但不適用於與本服務功能連結之各政府機關網站。
            本服務係由金門縣政府（以下簡稱本府）委託太武科技電檢股份有限公司製作並協助維運。維運期間凡經由本服務連結之網站，網站均有其專屬之隱私權政策，本服務不負任何連帶責任。當您使用這些網站時，關於個人資料的保護，適用各該網站的隱私權政策。
          </Typography>
          <Typography gutterBottom>
            二、有關本府蒐集臺端個人資料之目的、個人資料類別及個人資料利用之期間、地區、對象及方式等內容，請臺端詳閱如後附表。
          </Typography>
          <Typography gutterBottom>
            三、依據個資法第三條規定，臺端就本府保有臺端之個人資料得行使下列權利：
            <br />
            1.
            除有個資法第十條所規定之例外情形外，得向本府查詢、請求閱覽或請求製給複製本，惟本府依個資法第十四條規定得酌收必要成本費用。
            <br />
            2.
            得向本府請求補充或更正，惟依個資法施行細則第十九條規定，臺端應適當釋明其原因及事實。
            <br />
            3.
            本府如有違反個資法規定蒐集、處理或利用臺端之個人資料，依個資法第十一條第四項規定，臺端得向本府請求刪除、停止蒐集、處理或利用該個人資料。
            <br />
            4.
            依個資法第十一條第二項規定，個人資料正確性有爭議者，得向本府請求停止處理或利用臺端之個人資料。惟依該項但書規定，本府因執行業務所必須，或經5.
            臺端書面同意者，並註明其爭議，不在此限。
            <br />
            5.
            依個資法第十一條第三項規定，個人資料蒐集之特定目的消失或期限屆滿時，得向本府請求刪除、停止處理或利用臺端之個人資料。惟依該項但書規定，本府因執行業務所必須或經臺端書面同意者，不在此限。
            <br />
          </Typography>
          <Typography gutterBottom>
            四、臺端如欲行使上開個資法第三條當事人權利規定，有關如何行使之方式，臺端得透過下列來電洽詢。
          </Typography>
          <Typography gutterBottom>
            五、臺端得自由選擇是否提供相關個人資料，惟臺端若拒絕提供相關個人資料，本府將無法執行必要之處理作業，致無法提供臺端相關服務。
            有關貴署向本人告知之上開事項，本人已知悉相關內容。 如下表
          </Typography>
          <Typography gutterBottom>
            特定目的說明 <br />
            辦理臺端領取金門縣紓困補貼計畫等特定目的（包括：金融爭議處理；依法定義務所進行個人資料之蒐集處理及利用；契約、類似契約或其他法律關係管理之事務；消費者、客戶管理與服務；消費者保護；資（通）訊與資料庫管理；資通安全與管理；調查、統計與研究分析；其他諮詢與顧問服務）。
          </Typography>
          <Typography gutterBottom>
            蒐集個人資料類別 <br />
            臺端國民身分證統一編號、帳戶及其他臺端在金門縣紓困線上申請網站輸入的資料。
          </Typography>
          <Typography gutterBottom>
            利用對象
            <br />
            1. 本府（含受本府委託處理事務之委外機構）。
            <br />
            2. 依法律規定或經法律授權之非公務機關。
            <br />
          </Typography>
          <Typography gutterBottom>
            利用期間 <br /> 1. 特定目的存續期間。 <br />
            2.
            依相關法令所規定（例如商業會計法等）、因執行法定業務所必須之保存期間或依個別契約就資料之保存所定之保存年限。（上開期間或保存年限，以最長者為準）{" "}
            <br />
            利用地區
            <br /> 上開「利用之對象」欄位所列之國內及國外所在地。
            <br /> 利用方式
            <br />
            符合個人資料保護相關法令，以自動化或其他非自動化之機器或載具為蒐集、處理及利用。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.handleClose} color="primary">
            關閉
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

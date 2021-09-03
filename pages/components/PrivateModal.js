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

export default function PrivateModal(props) {
  return (
    <div>
      <Dialog
        onClose={props.handleClose}
        aria-labelledby="customized-dialog-title"
        open={props.open}
      >
        <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
          隱私權公告
        </DialogTitle>
        <DialogContent dividers>
          {/* <Typography gutterBottom>生效日期：110年9月3日</Typography> */}
          <Typography gutterBottom>
            親愛的朋友，感謝您蒞臨金門縣紓困線上申請網（以下簡稱本網站），您個人的隱私權，本網站予以尊重並加以保護。為了幫助您瞭解本網站如何蒐集、處理、利用及保護您所提供的個人資訊，請您務必詳細閱讀下列資訊：
          </Typography>
          <Typography gutterBottom>
            一、隱私權公告適用範圍： <br />
            本隱私權公告（以下簡稱本公告），適用於您在本網站及本網站提供之軟體辦理各項電子申辦及申報服務（以下簡稱本服務）時，所涉及的個人資料蒐集、處理、利用與保護，但不適用於與本服務功能連結之各政府機關網站。
            本服務係由金門縣政府（以下簡稱本府）委託太武科技電檢股份有限公司製作並協助維運。維運期間凡經由本服務連結之網站，網站均有其專屬之隱私權政策，本服務不負任何連帶責任。當您使用這些網站時，關於個人資料的保護，適用各該網站的隱私權政策。
          </Typography>
          <Typography gutterBottom>
            二、個人資料之蒐集： <br />
            利用本服務需使用者提供個人資料時，本服務會依案件辦理需求請您提供身分證字號、帳戶及戶號等個人資料。
            本服務所保有之個人資料項目種類依法公開在本處網站上之個資保護專區，以供您查詢。
            本網站會記錄使用者連上本網站的IP位址、上網時間及在本網站內所瀏覽的網頁等資料，這些資料係供政府作為網站流量與網路行為調查的總量分析，以利於提升本網站的服務品質，且本網站僅對全體使用者行為總和進行分析，並不會對個別使用者進行分析。
            本服務有義務保護各使用者之隱私，不會自行修改或刪除您的個人資料及檔案。除非經過您事先同意或符合法律規定的情況始得為之。
          </Typography>
          <Typography gutterBottom>
            三、個人資料的選擇： <br />
            當您辦理各項服務需要驗證身分時，本服務會要求您提供個人資料；您可以拒絕向本服務提供個人資料，不過本服務可能因此無法為您辦理特定的服務。
          </Typography>
          <Typography gutterBottom>
            四、個人資料的利用：
            <br />
            本服務絕不會任意提供任何您的個人資料給其他團體、個人或私人企業。但有下列情形之一者除外：{" "}
            <br />
            a.配合司法單位合法的調查。
            <br />
            b.配合相關職權機關依職務需要之調查或使用。
            <br />
            c.已事先徵得您的同意所分享的個人資料。
            <br />
            法律要求：本服務於必要時將遵循中華民國法律、命令、傳票、裁判、判斷及處分要求的內容，提供適當的資訊予法定機構，這有可能包括您的個人資料。
            分析與研究用途：本服務若需要使用您的資料做為統計分析與研究報告用途時，會先將您的資料做適度去識別化之處理（遮罩、隱碼、區
            間化及K-匿名化等），使其成為無從識別特定之當事人。
          </Typography>
          <Typography gutterBottom>
            五、個人資料的共用： <br />
            本服務不會任意出售、交換、出租任何您的個人資料予其他團體或個人。
          </Typography>
          <Typography gutterBottom>
            {" "}
            六、個人資料的查閱、更正與刪除： <br />
            當您辦理各項服務時，有權查閱自己的個人資料，或依您的要求將資料更正或刪除。處理此類要求之前，府會要求使用者或申請人證明身分，並指明要查閱、修正或刪除的資訊。
          </Typography>
          <Typography gutterBottom>
            七、個人資料正確性： <br />
            本服務處理您的個人資料時，會嚴格遵守當初蒐集資訊的目的及本公告或任何適用的特定服務告知事項內容。本服務會參考其他公務機關的資料蒐集、儲存及處理慣例，以確保僅蒐集、儲存及處理提供或改善本服務執行法定職務所需的個人資料。本服務會採取合理的措施來確保所處理之個人資料的正確性、完整性及即時性，但需仰賴當事人在必要時更新或修正其個人資料。
          </Typography>
          <Typography gutterBottom>
            {" "}
            八、資訊安全： <br />
            本服務會採取適當的安全措施，來防止未經授權的資料查閱、竄改、揭露或毀損，其中包括就資料的蒐集、儲存、處理慣例及安全措施進行內部審查，並以實體的安全措施，防止本服務保有的個人資料檔案遭到未經授權的存取。
          </Typography>
          <Typography gutterBottom>
            {" "}
            九、自我保護措施： <br />
            請妥善保管您的個人資料，避免將個人資料任意提供給與您無關的任何
            人或其他機構。當您在本網站上使用本服務所提供的各項服務功能後，務
            必記得登出，並建議避免與他人共享電腦或使用公共電腦，以防止他人讀取您的個人資料或信件。
            使用者於本網站所為之行為應遵循國內、外法律規範
            ，並且對於因未遵循規範所致生之情事負全部責任。
          </Typography>
          <Typography gutterBottom>
            {" "}
            十、Cookies： <br />
            當您使用資訊設備經由網際網路使用本服務時，請您務必詳細閱讀下列有關Cookies之資訊：{" "}
            <br />
            a. Cookies是伺服器端為了區別使用者的不同喜好，由瀏覽器寫入使用者
            硬碟的一些簡短資訊，雖然Cookies會識別使用者的電腦，但是您可以
            透過在您的瀏覽器中選擇修改您對於Cookies的接受程度，如果您選擇
            拒絕所有的Cookies，您可能無法正常使用部分個人化服務。 <br /> b.
            為了提供更好、更個人化的服務及方便您參與個人化的互動活動，
            Cookies會在您註冊或登入時建立，並在您登出時修改其狀態。{" "}
          </Typography>
          <Typography gutterBottom>
            {" "}
            十一、本公告之修正： <br />
            由於社會環境及法令規定變遷或科技技術進步，本服務將採用最新技術與法規以盡全力保護您的隱私權與個人資料，並且定期審查本服務是否遵守本公告，故本服務將不定時修訂與公布本公告以合時宜。
            為保障您的權益，若本公告賦予您的權利有所變更，本網站會將變更內容公布於最新消息。
            本公告的每個版本都會在右上方標示生效日期，本府也會將本公告的存檔版本封存。也請您隨時查閱本公告。
          </Typography>
          <Typography gutterBottom>
            {" "}
            十二、隱私權保護諮詢與救濟： <br />
            如果您有任何關於本公告、其他隱私權管理或本服務使用個人資料的問題，歡迎來電詢問。
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

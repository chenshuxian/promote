export default async function validate(values, bank_len) {
  // console.log(`validate ${bank_id}`);
  const errors = {};
  if (!values.id) {
    errors.id = "身分證不可為空";
  } else if (!values.id.match("^[a-zA-Z][A-Z|12]\\d{8}$")) {
    errors.id = "身分證格式錯誤, 本國W123456789, 國外AB12345678";
  }

  if (!values.notice1) {
    errors.notice1 = "個人資料申明需要勾選";
  }

  if (!values.notice2) {
    errors.notice2 = "個人資料提供使用需求需要勾選";
  }

  if (!values.born) {
    errors.born = "生日不可為空";
  } else if (isNaN(values.born) || values.born.length !== 7) {
    errors.born = "生日格式由3位數年份+2位月份+2位日期組成，如:0890102";
  }
  if (!values.bank_name) {
    errors.bank_name = "銀行戶名不可為空";
  } else if (!values.bank_name.match("^[\u4e00-\u9fa5]+$")) {
    errors.bank_name = "銀行戶名只能輸入中文";
  }

  if (!values.phone) {
    errors.phone = "電話號碼不可為空";
  } else if (isNaN(values.phone)) {
    errors.phone = "電話號碼只能為數字";
  }
  if (!values.bank_id) {
    errors.bank_id = "銀行機構代號不可為空";
  }
  // 土銀12碼、郵局、金門合作社14碼
  if (!values.bank_account) {
    errors.bank_account = "銀行帳號不可為空";
  } else if (
    isNaN(values.bank_account) ||
    values.bank_account.length !== bank_len
  ) {
    errors.bank_account = `銀行帳號由${bank_len}位數字組成`;
  }
  if (!values.house_id) {
    errors.house_id = "戶號不可為空";
  } else if (!values.house_id.match("^[a-zA-Z][a-zA-Z|12]\\d{6}$")) {
    errors.house_id = "戶號由英數字8位組成, 如: F1234567 或 FF123456";
  }

  if (values.email) {
    var emailRule =
      /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

    if (values.email.search(emailRule) == -1) {
      errors.email = "email錯誤: ex@gmail.com";
    }
  }

  return errors;
}

// 管理介面驗證
export async function adminValidate(values, bank_len) {
  // console.log(`validate ${bank_id}`);
  const errors = {};
  if (!values.id) {
    errors.id = "身分證不可為空";
  } else if (!values.id.match("^[a-zA-Z][A-Z|12]\\d{8}$")) {
    errors.id = "身分證格式錯誤, 本國W123456789, 國外AB12345678";
  }

  if (!values.file_number) {
    errors.file_number = "編碼序號不可為空";
  } else if (!values.file_number.match("\\d{7}$")) {
    errors.file_number = "編碼序號須為7碼數字組成";
  }

  if (values.parent_id) {
    if (!values.parent_id.match("^[a-zA-Z][A-Z|12]\\d{8}$")) {
      errors.parent_id = "身分證格式錯誤, 本國W123456789, 國外AB12345678";
    }
  }

  if (values.parent_name) {
    if (!values.parent_name.match("^[\u4e00-\u9fa5]+$")) {
      errors.parent_name = "姓名只能輸入中文";
    }
  }

  if (!values.phone) {
    errors.phone = "電話號碼不可為空";
  } else if (isNaN(values.phone)) {
    errors.phone = "電話號碼只能為數字";
  }

  if (!values.bank_id) {
    errors.bank_id = "銀行機構代號不可為空";
  }
  // 土銀12碼、郵局、金門合作社14碼
  if (!values.bank_account) {
    errors.bank_account = "銀行帳號不可為空";
  } else if (
    isNaN(values.bank_account) ||
    values.bank_account.length !== bank_len
  ) {
    errors.bank_account = `銀行帳號由${bank_len}位數字組成`;
  }

  return errors;
}

使用者操作流程
輸入用戶身份證及出生年月日做驗證
選擇用戶金融機構代號,土銀、郵局、金門信用合作社
輸入金融機構帳號，限輸入數字

管理者操作流程
管理介面呈現:
每日申請人數
每鄉鎮申請百分比
代為申請功能

資料庫設計
user_apply
id: 身份證
parent_id: 監護人id
house_id : 戶號
born: 出生年月日
bank_id: 金融機構代號
bank_account: 金融機構帳號
apply_state: 0 尚未申請、1審核中、2撥款中、3已撥款
is_admin: 0 是否為管理員
is_delete: 0
create_time:
update_time:

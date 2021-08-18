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
name: 使用者名字
phone: 手機號碼
addr: 地址
town: 鄉鎮
parent_id: 監護人id
parent_name : 收款者姓名
house_id : 戶號
born: 出生年月日
is_same_name: 帳戶是否和本人同名
bank_name: 銀行帳戶姓名
bank_id: 金融機構代號
bank_account: 金融機構帳號
apply_state: 0 尚未申請、1審核中、2已審核、3已撥款、4撥款失敗
is_delete: 0
pay_date : 發放日期
reason: 非本人收原因，(未成年、警示帳戶、凍結帳戶)
relationship: 關係(本人、父母、監護人、親友)
create_time:
update_time:
pay_date: 撥款人
editor: 編輯人
reason: 他人代領原因

rule :
1. 金融帳號名稱check後端是否和本人同名，不同提出警告需為本人。
2. 本平台只提供 20~54 歲符合規定只人員申請。
3. 提供rules說明
4. 幾號發放
5. 720號之後戶號修改了
720前的資料basic
720之後修改的死亡、遷出、換地址資料與basic進行修正


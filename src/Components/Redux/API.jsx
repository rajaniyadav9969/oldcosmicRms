import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
const HTTP_ROUTE = '192.168.10.104'
// const HTTP_ROUTE = '14.141.127.254'
const API_PORT = '3000'
// const WS_PORT = '2500'

export const url = 'http://' + HTTP_ROUTE + ':' + API_PORT
export const createAPI = axios.create({ baseURL: url })
export const mediaURL = url + '/media/'
export const ws = 'ws://' + HTTP_ROUTE + ':' + API_PORT

// ------------------------------------START--------------------------------------------
// **********************************dashboard******************************************

export const GetDataSummary_API = async () => {
    const response = await createAPI.get('/dashboard/datasummaryapi');
    return response
}
export const NetPositionHistory_API = async (data) => {
    const response = await createAPI.get('/dashboard/netpositionrecapi/' + data.date + '/' + data.exchange);
    return response
}

export const GetMonthlyMTM_API = async () => {
    const response = await createAPI.get('/dashboard/getmonthlymtm');
    return response
}

export const UserConfigHistory_API = async (data) => {
    const response = await createAPI.get('/settings/userconfigrecapi/' + data.date + '/' + data.exchange);
    return response
}
export const TradeHistory_API = async (data) => {
    const response = await createAPI.post('/dashboard/tradebookapi', data);
    return response
}
export const UserPermision_API = async (data) => {
    const response = await createAPI.post('/dashboard/userconfigrecapi', data);
    return response
}
export const GetPortfolioBalance_API = async (role) => {
    const response = await createAPI.get('/dashboard/portfolioapi/' + role);
    return response
}
export const GetParityWatch_API = async () => {
    const response = await createAPI.get('/dashboard/paritywatchapi');
    return response
}
export const DeleteParityWatch_API = async (data) => {
    const response = await createAPI.put('/dashboard/paritywatchapi',data);
    return response
}
export const CreateParity_API = async (data) => {
    console.log(data);
    const response = await createAPI.post('/dashboard/paritywatchapi',data);
    return response
}
export const GetNetPosition_API = async () => {
    const response = await createAPI.get('/dashboard/netpositionapi');
    return response
}
export const GetSpreadBook_API = async () => {
    const response = await createAPI.get('/dashboard/spreadbookapi');
    return response
}
// **********************************DASHBOARD******************************************
// ------------------------------------END--------------------------------------------




// ------------------------------------START--------------------------------------------
// **********************************authentication******************************************

export const Register_User_API = async (data) => {
    const response = await createAPI.post('/authentication/register', data);
    return response
}

export const Login_User_API = async (data) => {
    const response = await createAPI.post('/authentication/login', data);
    return response
}

export const TwoFAVerifyOTP_API = async (data) => {
    const response = await createAPI.post('/authentication/verifyotp', data);
    return response
}

export const DeleteSession_API = async (data) => {
    const response = await createAPI.post('/authentication/deletesession', data);
    return response
}


export const Logout_User_API = async () => {
    const head = {
        headers: {
            "X-CSRFToken": document.cookie.split('=')[1],
        }
    }
    const response = await createAPI.get('/authentication/logout', {}, head);
    return response
}

export const Reset_PWD_API = async (data) => {
    const response = await createAPI.post('/authentication/resetpwd', data);
    return response
}

export const Update_PWD_API = async (data) => {
    const response = await createAPI.post('/authentication/updatepwd', data);
    return response
}

export const isAuthenticated_API = async () => {
    const response = await createAPI.get('/authentication/isauthenticated', {});
    return response
}
export const Change_PWD_API = async (data) => {
    const response = await createAPI.post('/authentication/changepwd', data);
    return response
}
export const GetUsersData_API = async (data) => {
    const response = await createAPI.get('/authentication/getusers/' + data.username);
    return response
}
// **********************************authentication******************************************
// ------------------------------------END--------------------------------------------



// ------------------------------------START--------------------------------------------
// **********************************settings******************************************

export const ValidateTelegramId_API = async (data) => {
    const response = await createAPI.post('/settings/updatetelegramid', data);
    return response
}

export const verifyOTP_API = async (data) => {
    const response = await createAPI.post('/settings/verifyotp', data);
    return response
}

export const UpdateUserBasicProfile_API = async (data) => {
    const response = await createAPI.put('/settings/userprofileapi', data);
    return response
}

export const SettlementHistory_API = async (data) => {
    const response = await createAPI.get('/settings/settlementapi/' + data.date + '/' + data.exchange);
    return response
}

export const SettlementUpdate_API = async (data) => {
    const response = await createAPI.put('/settings/settlementapi', data);
    return response
}

export const CreateUserConfig_API = async (data) => {
    const response = await createAPI.post('/settings/userconfigrecapi', data);
    return response
}

export const UpdateProductDetails_API = async (data) => {
    const response = await createAPI.put('/settings/productdefapi', data);
    return response
}

export const GetProductConfHis_API = async (type) => {
    const response = await createAPI.get('/settings/productdefapi/' + type);
    return response
}

export const CreateGroup_API = async (data) => {
    const response = await createAPI.post('/settings/groupnameapi', data);
    return response
}
export const GetGroupHistory_API = async () => {
    const response = await createAPI.get('/settings/groupnameapi');
    return response
}

export const GroupnameUpdate_API = async (data) => {
    const response = await createAPI.put('/settings/groupnameapi', data);
    return response
}

export const AddExchange_API = async (data) => {
    const response = await createAPI.post('/settings/exchangesettingsapi', data);
    return response
}
export const GetAddExchangeHis_API = async () => {
    const response = await createAPI.get('/settings/exchangesettingsapi');
    return response
}

export const MarginSheetConfig_API = async (data) => {
    const response = await createAPI.put('/settings/marginsheetapi', data);
    return response
}
export const GetMarginSheetConfig_API = async (data) => {
    const response = await createAPI.get('/settings/marginsheetapi/' + data.userid + '/' + data.exchange);
    return response
}

export const UpdateUserpermission_API = async (data) => {
    const response = await createAPI.put('/settings/userpermissionapi', data);
    return response
}

export const UpdateUserSettings_API = async (data) => {
    const response = await createAPI.put('/settings/usersettingsapi', data);
    return response
}


export const CreateSegment_API = async (data) => {
    const response = await createAPI.post('/settings/segmentapi', data);
    return response
}

export const GetSegmentHistory_API = async () => {
    const response = await createAPI.get('/settings/segmentapi');
    return response
}

export const SegmentUpdate_API = async (data) => {
    const response = await createAPI.put('/settings/segmentapi', data);
    return response
}

export const ExcludeUserId_API = async (data) => {
    const response = await createAPI.post('/settings/excludeuseridapi', data);
    return response
}
export const GetExcludeUserIdHis_API = async () => {
    const response = await createAPI.get('/settings/excludeuseridapi');
    return response
}
export const TradeConversion_API = async (data) => {
    const response = await createAPI.get('/settings/conversionapi/' + data.scripcode);
    return response
}

export const UpdateTradeConversion_API = async (data) => {
    const response = await createAPI.put('/settings/conversionapi', data[0]);
    return response
}

export const GetColumns_API = async (id) => {
    const response = await createAPI.get('/settings/tablesettingsapi/' + id);
    return response
}

export const UpdateColumns_API = async (data) => {
    const response = await createAPI.put('/settings/tablesettingsapi', data);
    return response
}

export const GetTelegramBotConfig_API = async () => {
    const response = await createAPI.get('/settings/telegrambotconfigapi');
    return response
}
export const CreateTelegramBotConfig_API = async (data) => {
    const response = await createAPI.post('/settings/telegrambotconfigapi',data);
    return response
}
export const DeleteTelegramBotConfig_API = async (data) => {
    const response = await createAPI.put('/settings/telegrambotconfigapi', data);
    return response
}

// **********************************settings******************************************
// ------------------------------------END--------------------------------------------

// ------------------------------------START--------------------------------------------
// **********************************utilities******************************************

export const Backup_API = async (data) => {
    const response = await createAPI.get('/utilities/backupapi/' + data.type + '/' + data.date);
    return response
}

export const SettlementUpload_API = async (data) => {
    const response = await axios({ url: url + '/utilities/uploadfile', method: "POST", headers: { 'content-type': 'multipart/form-data' }, data: data });
    return response
}

export const ProfileUpload_API = async (data) => {
    const response = await axios({ url: url + '/utilities/uploadprofilepic', method: "POST", headers: { 'content-type': 'multipart/form-data' }, data: data });
    return response
}

export const TelegramSendpic_API = async (data) => {
    const response = await createAPI.post('/utilities/telegram_sendpic', data);
    return response
}

export const TroubleShoot_API = async (type) => {
    const response = await createAPI.get('/utilities/troubleshoot/' + type);
    return response
}
export const TradeSenderToggle_API = async (data) => {
    const response = await createAPI.get('/utilities/tradesender',{params : data});
    return response
}
// **********************************utilities******************************************
// ------------------------------------END--------------------------------------------


export const LedgerEntry_API = async (data) => {
    const response = await createAPI.post('/accounting/ledgerapi', data);
    return response
}
export const GetLedgerEntry_API = async (data) => {
    const response = await createAPI.get('/accounting/ledgerapi/' + data.type + '/' + data.date);
    return response
}

export const GetReport_API = async (data) => {
    const response = await createAPI.post('/report/client', data);
    return response
}

export const GetReportRowData_API = async () => {
    const response = await createAPI.get('/report/client');
    return response
}

export const TableHeaderData_API = async (data) => {
    const response = await createAPI.post('/');
    return response
}

export const UploadVerifyFile_API = async (data) => {
    const response = await axios({ url: url + '/utilities/uploadfile', method: "POST", headers: { 'content-type': 'multipart/form-data' }, data: data });
    return response
}


export const PreviousVerifiedData_API = async (data) => {
    const response = await createAPI.get('/report/verifyaccounts' ,{params : data});
    return response
}

import React, { memo, useState } from 'react'
import { Form, Row } from 'react-bootstrap'
import { SiGooglesheets } from 'react-icons/si';
import { DataTableComp } from '../../DataTable'
import { CusColumn } from '../../DataTable/CusColumn';
import { GetMarginSheetConfig_API } from '../../Redux/API';
import { Notification } from '../../Notification';
import profile from '../../ProfilePage/ProfilePage.module.scss'

// let date = new Date();
// let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date);

const MarginSheetConfHistory = () => {
    const [NotifyData, setNotifyData] = useState({
        successFlag: false,
        successMsg: 'success msg',
        errorFlag: false,
        errorMsg: 'error msg',
        loadingFlag: false,
        loadingMsg: 'loading msg',
        activesession: false
    })
    // const [errorMessage, setErrorMessage] = useState("Select Date");
    const [validated, setValidated] = useState(false);
    // const [dateValue, setDateValue] = useState(yesterday)
    // const [exchange, setExchange] = useState();

    const [data, setData] = useState([])
    const [columns, setColumns] = useState([])

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };


    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }
    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }


    const showMarginSheetHis = async (e) => {
        e.preventDefault()
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Retriving marginsheet configuration history data..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(GetMarginSheetConfig_API({ userid: 'all', exchange: 'all' }))
        })
        const rs = await Promise.all([ps1]).then((val) => {
            return val[0]['data'];
        }).catch((err) => {
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: err['message'] }))
            console.log("*********", err.response.status);
            (err.response.status === 401) && setTimeout(() => { window.location.assign(window.location.origin) }, 1000);
            return err["response"]["data"];
        })
        if (rs['type'] === 'success') {
            setNotifyData((data) => ({
                ...data,
                loadingFlag: false,
                //  successFlag: true, 
                //  successMsg: rs['message'] 
            }))
            setData(rs['data'])
            setColumns(CusColumn(rs['data'][0]))
            // dispatch(LoginAction(rs['data']));
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
        }
    }
    return (
        <div className={`basic-forminfo ${profile.basicInfo}`}>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className={`${profile.basicInfoSetting} ${profile.history}`}
            >
                <Row className={profile.historySection}>
                    <div className="col-md-11">
                        <h5 className={profile.basicHeading}>
                            <span className={profile.icons}>
                                <SiGooglesheets />
                            </span>
                            Margin Config
                        </h5>
                    </div>

                    <div className='col-md-1'>
                        <input
                            type="submit"
                            className={profile.basicInfoBtn}
                            value='Show'
                            onClick={showMarginSheetHis} />
                    </div>
                </Row>
            </Form>
            <div
            // className={`custom-table ${dash.customdatatable}`}
            >
                <DataTableComp
                    data={data ? data : null}
                    columns={columns}
                    id="marginsheetConfighistory"
                />
            </div>
            <Notification
                notify={NotifyData}
                CloseError={CloseError}
                CloseSuccess={CloseSuccess}
            />
        </div >
    )
}

export default memo(MarginSheetConfHistory)
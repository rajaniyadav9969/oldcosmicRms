import React, { memo, useState } from 'react'
import { Form, Row } from 'react-bootstrap'
import { BsCurrencyExchange } from 'react-icons/bs';
import { GetAddExchangeHis_API } from '../../Redux/API';
import { CusColumn } from '../../DataTable/CusColumn';
import { DataTableComp } from '../../DataTable'
import { Notification } from '../../Notification';
import profile from '../../ProfilePage/ProfilePage.module.scss'


const AddExchangeHistory = () => {
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState([])
    const [columns, setColumns] = useState([])
    const [NotifyData, setNotifyData] = useState({
        successFlag: false,
        successMsg: 'success msg',
        errorFlag: false,
        errorMsg: 'error msg',
        loadingFlag: false,
        loadingMsg: 'loading msg',
        activesession: false
    })

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }
    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    return (
        <div className={`basic-forminfo ${profile.basicInfo}`}>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className={`${profile.basicInfoSetting} ${profile.history}`}
            >
                <Row className={profile.historySection}>
                    <div className="col-md-7">
                        <h5 className={profile.basicHeading}>
                            <span className={profile.icons}>
                                <BsCurrencyExchange />
                            </span>
                            Exchange  History
                        </h5>
                    </div>
                    <div className="col-md-4"></div>
                    <div className='col-md-1'>
                        <input
                            type="submit"
                            className={profile.basicInfoBtn}
                            value='Show'
                            onClick={async (e) => {
                                e.preventDefault()
                                setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Retriving exchange history data..." }))

                                const ps1 = new Promise((resolve, reject) => {
                                    resolve(GetAddExchangeHis_API())
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
                                    setNotifyData((data) => ({ ...data, loadingFlag: false }))
                                    setData(rs['data'])
                                    setColumns(CusColumn(rs['data'][0]))
                                    // setNotifyData((data) => ({ ...data, successFlag: true, successMsg: rs['message'] }))

                                    // dispatch(LoginAction(rs['data']));
                                } else {
                                    setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
                                }
                            }} />

                    </div>
                </Row>
            </Form>
            <div
            // className={`custom-table ${dash.customdatatable}`}
            >
                <DataTableComp
                    data={data ? data : null}
                    columns={columns}
                    id="addexchangehistory"
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

export default memo(AddExchangeHistory)
import React, { memo, useState } from 'react'
import { MdGroup } from "react-icons/md";
import { Form, Row } from 'react-bootstrap'
import { GetGroupHistory_API, GroupnameUpdate_API } from '../../Redux/API';
import { DataTableComp } from '../../DataTable'
import { Notification } from '../../Notification';
import profile from '../../ProfilePage/ProfilePage.module.scss'

const GroupHistory = () => {
    const [validated, setValidated] = useState(false);
    const [NotifyData, setNotifyData] = useState({
        confirmFlag: false,
        confirmMsg: 'confirm msg',
        successFlag: false,
        successMsg: 'success msg',
        errorFlag: false,
        errorMsg: 'error msg',
        loadingFlag: false,
        loadingMsg: 'loading msg',
        activesession: false
    })

    const [data, setData] = useState([])
    const [columns, setColumns] = useState([])
    const [updatedData, setUpdatedData] = useState([])
    let ds = [];

    const CloseConfirm = () => {
        setNotifyData((data) => ({ ...data, confirmFlag: false }))
    }

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }
    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }

    const handleShow = async (event) => {
        event.preventDefault();
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Retriving group history data..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(GetGroupHistory_API())
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
            setColumns(CusColumnComp(rs['data']))
            // setNotifyData((data) => ({ ...data, successFlag: true, successMsg: rs['message'] }))
            // dispatch(LoginAction(rs['data']));
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
        }


    };

    const CusColumnComp = (coldata) => {
        return Object.keys(coldata[0]).map((key, i) => {
            if (key === "name") {
                return {
                    Header: key,
                    accessor: key,
                    show: true,
                    Cell: (cellInfo) => {
                        return (
                            <input
                                name="input"
                                type="text"
                                onChange={(event) => {
                                    let newState = [...coldata];
                                    let res = [];
                                    ds.push(cellInfo.original.id);
                                    newState[cellInfo.index][cellInfo.column.id] = event.target.value;
                                    for (let i = 0; i < [...new Set(ds)].length; i++) {
                                        for (let j = 0; j < newState.length; j++) {
                                            if (newState[j].id === [...new Set(ds)][i]) {
                                                res.push(newState[j])
                                            }
                                        }
                                    }
                                    console.log(res);
                                    setData(newState)
                                    setUpdatedData(res)
                                }}
                                value={cellInfo.value}
                            />
                        );
                    },

                }
            }
            else {
                return {
                    Header: key,
                    accessor: key,
                    show: true
                }
            }
        }
        )
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Updating Profile" }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(GroupnameUpdate_API(updatedData))
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
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, successFlag: true, successMsg: rs['message'] }))
            // dispatch(LoginAction(rs['data']));
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'], activesession: rs['session'] }))
        }
    }

    return (
        <div className={`basic-forminfo ${profile.basicInfo}`}>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleShow}
                className={`${profile.basicInfoSetting} ${profile.history}`}
            >
                <Row className={profile.historySection}>
                    <div className="col-md-7">
                        <h5 className={profile.basicHeading}>
                            <span className={profile.icons}>
                                <MdGroup />
                            </span>
                            Create Group History
                        </h5>
                    </div>
                    <div className="col-md-3"></div>
                    <div className={`col-md-1 ${profile.rmsBtnSection}`}>
                        <input
                            type="submit"
                            className={profile.basicInfoBtn}
                            value='Show'
                            onClick={handleShow} />
                    </div>
                    <div className={`col-md-1 ${profile.rmsBtnSection}`}>
                        <input
                            type="submit"
                            className={profile.updateHistoty}
                            value='Update'
                            // onClick={handleUpdate}
                            onClick={(e) => {
                                e.preventDefault();
                                setNotifyData((data) => ({
                                    ...data,
                                    confirmFlag: true,
                                    confirmMsg: "Are you sure, You want to update group history name?",
                                    confirmAction: (e) =>
                                        handleUpdate(e)
                                }))
                            }}
                        />
                    </div>
                </Row>
            </Form>
            <div
            // className={`custom-table ${dash.customdatatable}`}
            >
                <DataTableComp
                    data={data ? data : null}
                    columns={columns}
                    id="grouphistory"
                />
            </div>
            <Notification
                notify={NotifyData}
                CloseError={CloseError}
                CloseSuccess={CloseSuccess}
                CloseConfirm={CloseConfirm}
            />
        </div >
    )
}

export default memo(GroupHistory)
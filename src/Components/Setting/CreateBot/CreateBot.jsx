import React, { memo } from 'react'
import { useState } from 'react';
import { Notification } from '../../Notification';
import CreateBotCard from './CreateBotCard';
import profile from '../../ProfilePage/ProfilePage.module.scss'
import botdataStyle from './CreateBot.module.scss'

const CreateBot = () => {

    const [showBotForm, setShowBotForm] = useState(false);
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

    const CloseConfirm = () => {
        setNotifyData((data) => ({ ...data, confirmFlag: false }))
    }
    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }));
        // navigate("/login", { replace: true })
    };

    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }));
    };




    return (
        <div className={`basic-forminfo ${profile.basicInfo} `} >
            <div className={botdataStyle.createBotSection}>
                <div className={botdataStyle.createBotContent}>
                    <button
                        className={botdataStyle.createBotBtn}
                        onClick={() => setShowBotForm(true)}
                    >
                        Create Bot
                    </button>
                </div>
                <div>
                    {/* <DataTableComp
                        data={data ? data : null}
                        columns={columns}
                        id="createbot"
                    /> */}
                    <CreateBotCard showBotForm={showBotForm} setShowBotForm={setShowBotForm}/>
                </div>
            </div>
            {/* <Modal
                show={showBotForm}
                onHide={() => setShowBotForm(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title> New Bot Message Config</Modal.Title>
                </Modal.Header>
                <Modal.Body
                // className={parityStyle.parityModalBody}
                >
                    <CreateBotForm />
                </Modal.Body>
            </Modal> */}
            <Notification
                notify={NotifyData}
                CloseError={CloseError}
                CloseSuccess={CloseSuccess}
                CloseConfirm={CloseConfirm}
            />
        </div>
    )
}

export default memo(CreateBot)
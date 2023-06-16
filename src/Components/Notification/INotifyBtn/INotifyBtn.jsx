import React, { memo } from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { AiFillExclamationCircle } from 'react-icons/ai';
import iballBtn from './INotifyBtn.module.scss'

function INotifyBtn() {
    return (
        <>
            <OverlayTrigger
                placement="bottom"
                overlay={
                    <Popover
                        id={`popover-positioned`}
                    >
                        <Popover.Header className={iballBtn.graphNotification} as="h3">{`Notification `}</Popover.Header>
                        <Popover.Body>
                            Current year Profit Loss
                        </Popover.Body>
                    </Popover>
                }
            >
                <span className={iballBtn.iconStyle}><AiFillExclamationCircle /></span>
            </OverlayTrigger>
        </>
    );
}

export default memo(INotifyBtn);
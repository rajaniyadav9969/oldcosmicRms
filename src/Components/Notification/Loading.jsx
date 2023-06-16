import React, { memo } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import Loadingimg from '../../Assets/Gif/loading.gif'
import style from './Notification.module.scss';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Loading(props) {

    return (
        <React.Fragment>
            <Dialog
                open={props.data.loadingFlag}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                className={`poup-notification ${style.poupNotification}`}
            >
                <DialogContent>
                    <div className="d-flex align-items-center ">
                        <img className={style.notificationImg} src={Loadingimg} alt="loadingimg"/>
                        <DialogContentText id="alert-dialog-slide-description" className={`popup-notification-message ${style.message}`}><span>{props.data.loadingMsg}</span></DialogContentText>
                    </div>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

export default memo(Loading)
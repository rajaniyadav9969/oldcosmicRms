import React, { memo } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Confirmimg from '../../Assets/Gif/confirmation.gif';
import style from './Notification.module.scss';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ConfirmationBox(props) {

    // console.log("ConfirmationBox",props);

    return (
        <Dialog
            open={props.data.confirmFlag}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.Close}
            aria-describedby="alert-dialog-slide-description"
            className={`poup-notification ${style.poupNotification}`}
        >
            <DialogTitle className={style.notificationHeading}>
                {"CONFIRM"}
            </DialogTitle>
            <DialogContent>
                <div className="d-flex align-items-center ">
                    <img className={style.notificationImg} src={Confirmimg} alt="Confirmimg" />
                    <DialogContentText id="alert-dialog-slide-description" className={`popup-notification-message ${style.message}`}>
                        {props.data.confirmMsg}
                    </DialogContentText>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.data.confirmAction}>YES</Button>
                <Button onClick={props.close}>NO</Button>
            </DialogActions>
        </Dialog>
    )
}

export default memo(ConfirmationBox)
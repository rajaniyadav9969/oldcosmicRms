import React, { memo } from 'react'
import { Card } from 'react-bootstrap'
import notify from './NotificationPage.module.scss'
import { AiFillClockCircle } from 'react-icons/ai'
import { MdNotifications } from 'react-icons/md'
import { shallowEqual, useSelector } from 'react-redux'


const NotificationPage = () => {
    const GlobalNotification = useSelector(state => state && state.SocketData && state.SocketData.Notification, shallowEqual)
    return (
        <div className={`notification-page-section ${notify.notificationPage}`}>
            {
                GlobalNotification && (GlobalNotification.length > 0
                    ?
                    GlobalNotification.map((data, i) => {
                        return <Card key={i} className={`notification-card ${notify.notificationCard}`}
                            style={{
                                background:
                                    data.status === "success" ? "linear-gradient(310deg, rgb(23, 173, 55), rgb(152, 236, 45))" :
                                        data.status === "danger" ? "linear-gradient(310deg, rgb(234, 6, 6), rgb(255, 102, 124))" :
                                            "linear-gradient(310deg, rgb(245, 57, 57), rgb(251, 207, 51))"
                            }}
                        >
                            <Card.Body className={notify.notificationCardBody}>
                                <div className={notify.notificationCardText}  >
                                    <div className={notify.notificationContent}>
                                        <div className={notify.notificationTitle}>
                                            <h6 className={notify.notificationIcon}><MdNotifications /></h6>
                                            <h6>
                                                <strong>
                                                    {data.title}
                                                </strong>
                                            </h6>
                                        </div>
                                        <h6 className={notify.description}> {data.description}</h6>
                                        <span className={`notification-form-message ${notify.fromMessage}`}>
                                            <span>
                                                <AiFillClockCircle />
                                            </span>
                                            {data.timestamp}
                                        </span>
                                    </div>
                                </div>
                                {/* <Button variant="primary">Go somewhere</Button> */}
                            </Card.Body>
                        </Card>
                    })
                    :
                    <h2 className={notify.noDataNotify}>No Notification</h2>)
            }
            {/* <Outlet /> */}
        </div>
    )
}
export default memo(NotificationPage)
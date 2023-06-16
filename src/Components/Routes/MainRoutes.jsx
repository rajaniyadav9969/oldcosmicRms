import React, { memo, useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Setting } from '../Setting'
import { Dashboard, Navbar, TabularDashboard } from '../Dashboard'
import { Notification, Snackbar } from '../Notification'
import { Error404, Error500, SplashScreen } from '../Others'
import { Active2FA, Login, Register, ResetPwd, TwoFA } from '../Authentication'
import { isAuthenticated_API } from '../Redux/API'
import { LoginAction } from '../Redux/RMSAction'
import BottomNavbar from '../BottomNavbar/BottomNavbar'
import { UserManagement } from '../UserManagement'
import { NotificationPage } from '../NotificationPage'
import { DailyReport, ChartPage, Ledger, ChatBoxMainPage, VerifyData } from '../Pages'
import profileUser from '../../Assets/Img/profileuser.jpg'
import { WebsocketConnect } from '../../App'
import style from './Routes.module.scss'
import CheckRoutes from './CheckRoutes'
import { Decompressed } from '../Utilities/Utilities'

const MainRoutes = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const Globalprofile = useSelector(state => state && state.profile)

    const SnackbarType = {
        // message: "success",
        // fail: "fail",
        warning: "warning",
        // info:"info"
    };
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

    useEffect(() => {
        async function checkAuthenticated() {
            
            setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Checking Authentication..." }))
            const ps1 = new Promise((resolve, reject) => {
                resolve(isAuthenticated_API())
            })
            const rs = await Promise.all([ps1]).then((val) => {

                setNotifyData((data) => ({ ...data, loadingFlag: false }))
                let temp =Decompressed(val[0]['data']['data'])
                dispatch(LoginAction(temp));
                WebsocketConnect()
                let pathname=window.location.pathname ==undefined ? '/' : window.location.pathname
                navigate(pathname == '/' ? temp.settings && temp.settings.defaultlandingpage : pathname , { replace: true })
                return val[0]['data'];

            }).catch((err) => {
                console.log("errr*******************", err);
                setNotifyData((data) => ({ ...data, loadingFlag: false }))
                navigate("/", { replace: true })
                return err["response"]["data"];
            })

        }
        checkAuthenticated()
    }, [])


    const chatnotificationData = [
        { img: profileUser, title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', token: '1234567890', time: '13 minutes ago', caption: 'Lorem Ipsum is simply dummy text of the printing and typesetting' },
        { img: profileUser, title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', token: '1234567890', time: '13 minutes ago', caption: 'Lorem Ipsum is simply dummy text of the printing and typesetting' },
        { img: profileUser, title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', token: '1234567890', time: '13 minutes ago', caption: 'Lorem Ipsum is simply dummy text of the printing and typesetting' },
        { img: profileUser, title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', token: '1234567890', time: '13 minutes ago', caption: 'Lorem Ipsum is simply dummy text of the printing and typesetting' },
        { img: profileUser, title: 'New Report', token: '1234567890', time: '13 minutes ago', caption: 'Lorem Ipsum is simply dummy text of the printing and typesetting' },
        { img: profileUser, title: 'New Report', token: '1234567890', time: '13 minutes ago', caption: 'Lorem Ipsum is simply dummy text of the printing and typesetting' },
    ]

    return (
        <div>
            {Globalprofile && <Navbar chatnotificationData={chatnotificationData} />}
            < div className={Globalprofile && style.dashboardRoutes}>
                <Routes>
                    <Route path="/" element={<SplashScreen />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/signup" element={<Register />} />
                    {/* <Route path="/" element={<Login />} /> */}
                    <Route path="/reset" element={<ResetPwd />} />
                    {/* <Route path="/dashboard/*" element={<DashboardRoutes />} /> */}
                    {/* <Route path="/error404" element={<Error404 />} />
                    <Route path="/error500" element={<Error500 />} /> */}
                    <Route path="/2fa" element={<TwoFA />} />
                    {/* <Route path="/active2fa" element={<Active2FA />} /> */}
                    <Route path="/snackber" element={<Snackbar types={SnackbarType} />} />
                    <Route path="/notify" element={<CheckRoutes > <NotificationPage /> </CheckRoutes>} />
                    <Route path="/settings" element={<CheckRoutes> <Setting /> </CheckRoutes>} />
                    <Route path="/report" element={<CheckRoutes> <DailyReport /> </CheckRoutes>} />
                    <Route path="/usermanagement" element={<CheckRoutes> <UserManagement className='usermanange' /> </CheckRoutes>} />
                    <Route path="/chart" element={<CheckRoutes> <ChartPage /> </CheckRoutes>} />
                    <Route path="/support" element={<CheckRoutes> <ChatBoxMainPage chatnotificationData={chatnotificationData} /> </CheckRoutes>} />
                    <Route path="/accounting" element={<CheckRoutes> <VerifyData /> </CheckRoutes>} />
                    <Route path="/ledger" element={<CheckRoutes> <Ledger /> </CheckRoutes>} />
                    <Route path="/tabulardashboard" element={<CheckRoutes> <TabularDashboard /> </CheckRoutes>} />
                </Routes >
            </div>
            {Globalprofile && <BottomNavbar chatnotificationData={chatnotificationData} />}
            <Notification notify={NotifyData} CloseError={CloseError} CloseSuccess={CloseSuccess} />
        </div >

    )
}

export default MainRoutes
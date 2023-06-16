import React, { memo, useState } from 'react'
import setStyle from './Setting.module.scss'
import { Tab } from '@material-ui/core'
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import { BasicInfo, ChangePwd, ProfileQRCode, ProfileSetting, Session } from '../ProfilePage'
import { BsCurrencyExchange, BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { SiConvertio, SiProducthunt } from 'react-icons/si';
import { FaCloudUploadAlt, FaUserCog, FaUser } from 'react-icons/fa';
import { MdBackup, MdGroup, MdNoteAlt } from "react-icons/md";
import { AiFillAccountBook, AiFillCamera } from 'react-icons/ai';
import { IoKeySharp } from 'react-icons/io5';
import {
    AddExchange,
    AddExchangeHistory,
    ConversionConfig,
    ProductConfig,
    ProductConfigHistory,
    UserConfig,
    Group,
    GroupHistory,
    MarginSheetConfig,
    MarginSheetConfHistory,
    Settlement,
    SettlementHistory,
    NetpositionBackup,
    NetpositionBackupHistory,
    UserConfigHistory,
    ImportTrade,
    TradeHistory,
    Segment,
    SegmentHistory,
    UserIdExclude,
    UserIdExcludeHis
} from '.'
import { useDispatch, useSelector } from 'react-redux';
import { mediaURL, ProfileUpload_API } from '../Redux/API';
import { SetProfileImageAction } from '../Redux/RMSAction';
import { Notification } from '../Notification';
import CreateBot from './CreateBot/CreateBot';


const exchange = <h6 className={setStyle.setHeading}>
    <span className={setStyle.setHeadimgIcon}>
        <BsCurrencyExchange />
    </span>
    Exchange
</h6>;
const tConversion = <h6 className={setStyle.setHeading}>
    <span className={setStyle.setHeadimgIcon}>
        <SiConvertio />
    </span>
    Trade Conversion
</h6>;
const pConf = <h6 className={setStyle.setHeading}>
    <span className={setStyle.setHeadimgIcon}>
        <SiProducthunt />
    </span>
    Product Configuration
</h6>;
const userConf = <h6 className={setStyle.setHeading}>
    <span className={setStyle.setHeadimgIcon}>
        <FaUserCog />
    </span>
    User Configuration
</h6>;
const uploadSet = <h6 className={setStyle.setHeading}>
    <span className={setStyle.setHeadimgIcon}>
        <FaCloudUploadAlt />
    </span>
    Upload Settlement
</h6>;
const backup = <h6 className={setStyle.setHeading}>
    <span className={setStyle.setHeadimgIcon}>
        <MdBackup />
    </span>
    Backup
</h6>;

const tradeBook = <h6 className={setStyle.setHeading}>
    <span className={setStyle.setHeadimgIcon}>
        <AiFillAccountBook />
    </span>
    Trades
</h6>;

const profile = <h6 className={setStyle.setHeading}>
    <span className={setStyle.setHeadimgIcon}>
        <FaUser />
    </span>
    Profile
</h6>;
const changePwd = <h6 className={setStyle.setHeading}>
    <span className={setStyle.setHeadimgIcon}>
        <IoKeySharp />
    </span>
    Change Password
</h6>;
const group = <h6 className={setStyle.setHeading}>
    <span className={setStyle.setHeadimgIcon}>
        <MdGroup />
    </span>
    Group
</h6>;
const segment = <h6 className={setStyle.setHeading}>
    <span className={setStyle.setHeadimgIcon}>
        <MdNoteAlt />
    </span>
    Segment
</h6>;
const marginSheet = <h6 className={setStyle.setHeading}>
    <span className={setStyle.setHeadimgIcon}>
        <BsFillFileEarmarkSpreadsheetFill />
    </span>
    Margin Sheet Configuration
</h6>;
const excludeUserId = <h6 className={setStyle.setHeading}>
    <span className={setStyle.setHeadimgIcon}>
        <FaUser />
    </span>
    Exclude UserIds
</h6>;


const Setting = () => {
    const Globalprofile_pic = useSelector((state) => state && state.profile_pic);
    const Globalpermissions = useSelector(state => state && state.permissions)
    const Globalprofile = useSelector(state => state && state.profile)
    const Globalsettings = useSelector(state => state && state.settings)

    const dispatch = useDispatch()
    const [NotifyData, setNotifyData] = useState({
        successFlag: false,
        successMsg: 'success msg',
        errorFlag: false,
        errorMsg: 'error msg',
        loadingFlag: false,
        loadingMsg: 'loading msg',
        activesession: false
    })

    const [showSetHistory, setShowSetHistory] = useState(false); //hide show settlement history
    const [showNetBackup, setShowNetBackup] = useState(false); //hide show netposition history
    const [showUserConf, setShowUserConf] = useState(false); //hide show userConfig history
    const [showProdConf, setShowProdConf] = useState(false) //hide show Product Configuration history
    const [showGroupHis, setShowGroupHis] = useState(false) //hide show Group history
    const [showSegmentHis, setShowSegmentHis] = useState(false) //hide show Segment history
    const [showTradeHistory, setShowTradeHistory] = useState(false); //hide show Trade history
    const [showAddExchnage, setShowAddExchnage] = useState(false); //hide show AddExchnage history
    const [showMarginSheet, setShowMarginSheet] = useState(false); //hide show MarginSheet history
    const [showExcludeUserId, setShowExcludeUserId] = useState(false); //hide show ExcludeUserId history

    const [activeTab, setActiveTab] = useState('profile');
    const [activeIndex, setactiveIndex] = useState(0)
    const handleChange = (event, activeIndex) => {
        setactiveIndex(activeIndex);
    };

    const CloseError = () => {
        setNotifyData((data) => ({ ...data, errorFlag: false }))
    }
    const CloseSuccess = () => {
        setNotifyData((data) => ({ ...data, successFlag: false }))
    }

    const settlementHistory = () => {
        setShowSetHistory(!showSetHistory)
    }
    const netpositionHistory = () => {
        setShowNetBackup(!showNetBackup)
    }
    const userConfigHistory = () => {
        setShowUserConf(!showUserConf)
    }
    const productConfigHistory = () => {
        setShowProdConf(!showProdConf)
    }
    const handleGroupHis = () => {
        setShowGroupHis(!showGroupHis)
    }
    const handleSegmentHis = () => {
        setShowSegmentHis(!showSegmentHis)
    }
    const tradeHistory = () => {
        setShowTradeHistory(!showTradeHistory)
    }
    const handleAddExchangeHis = () => {
        setShowAddExchnage(!showAddExchnage)
    }
    const handleExcludeuserid = () => {
        setShowExcludeUserId(!showExcludeUserId)
    }
    const handleMargSheetHis = () => {
        setShowMarginSheet(!showMarginSheet)
    }

    async function uploadProfile(e) {
        e.preventDefault()
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Profile uploading..." }))
        const ps1 = new Promise((resolve, reject) => {
            resolve(ProfileUpload_API(formData))
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
            setNotifyData((data) => ({ ...data, loadingFlag: false, successFlag: true, successMsg: rs['message'] }))
            dispatch(SetProfileImageAction(rs['data']['profile_pic']))
        } else {
            setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
        }
    }

    return (
        <div className={`container-fluid ${setStyle.settingMainPage}`}>
            <div className={setStyle.settingPage}>
                <div className={setStyle.settingHeaderBanner}></div>
                <div className={setStyle.settingHeader}>
                    <div className={setStyle.settinguserIcon}>
                        <img src={Globalprofile_pic ? mediaURL + Globalprofile_pic : null} alt="usericon" />
                        <label
                            htmlFor="chooseProfilePic"
                            className={setStyle.cameraIcon}
                        >
                            <AiFillCamera />
                        </label>
                        <input
                            style={{ display: 'none' }}
                            type="file"
                            id="chooseProfilePic"
                            onChange={(e) => uploadProfile(e)}
                            required
                        />
                    </div>
                    <div className={setStyle.settinguserInfo}>
                        <h5 >
                            {Globalprofile ? Globalprofile.first_name : 'FirstName'} {Globalprofile ? Globalprofile.last_name : 'LastName'}
                        </h5>
                        <h6>
                            @{Globalsettings ? Globalsettings.username : 'username'}&nbsp;
                            <span>
                                {Globalsettings ? Globalsettings.rolename : 'rolename'}
                            </span>
                        </h6>

                    </div>
                </div>
            </div>
            <div className={`row ${setStyle.settingallContent}`}>
                <div className="col-md-3">
                    <div className={`setting-maintabs ${setStyle.settingTabs}`}>
                        <VerticalTabs value={activeIndex} onChange={handleChange}>
                            <MyTab
                                label={profile}
                                className={`setting-single-tabs ${setStyle.settingSingleTab}`}
                                onClick={() => setActiveTab('profile')}
                            />
                            {Globalpermissions && Globalpermissions.isaddexchange
                                &&
                                < MyTab
                                    label={exchange}
                                    className={`setting-single-tabs ${setStyle.settingSingleTab}`}
                                    onClick={() => { setActiveTab('exchange') }}
                                />
                            }
                            {Globalpermissions && Globalpermissions.isconversion
                                &&
                                <MyTab
                                    label={tConversion}
                                    className={`setting-single-tabs ${setStyle.settingSingleTab}`}
                                    onClick={() => setActiveTab('tradeConversion')}
                                />
                            }
                            {Globalpermissions && Globalpermissions.isproductdef
                                &&
                                <MyTab
                                    label={pConf}
                                    className={`setting-single-tabs ${setStyle.settingSingleTab}`}
                                    onClick={() => setActiveTab('productConfiguration')}
                                />
                            }
                            {Globalpermissions && Globalpermissions.isuserconfig
                                &&
                                <MyTab
                                    label={userConf}
                                    className={`setting-single-tabs ${setStyle.settingSingleTab}`}
                                    onClick={() => setActiveTab('userConfiguration')}
                                />
                            }
                            {Globalpermissions && Globalpermissions.issettlement
                                &&
                                <MyTab
                                    label={uploadSet}
                                    className={`setting-single-tabs ${setStyle.settingSingleTab}`}
                                    onClick={() => setActiveTab('uploadSettlement')}
                                />
                            }
                            {Globalpermissions && Globalpermissions.istradebackup
                                &&
                                <MyTab
                                    label={backup}
                                    className={`setting-single-tabs ${setStyle.settingSingleTab}`}
                                    onClick={() => setActiveTab('tradeBackup')}
                                />
                            }
                            {Globalpermissions && Globalpermissions.istradebook
                                &&
                                <MyTab
                                    label={tradeBook}
                                    className={`setting-single-tabs ${setStyle.settingSingleTab}`}
                                    onClick={() => setActiveTab('tradeBook')}
                                />
                            }
                            <MyTab
                                label={changePwd}
                                className={`setting-single-tabs ${setStyle.settingSingleTab}`}
                                onClick={() => setActiveTab('changePassword')}
                            />
                            {Globalpermissions && Globalpermissions.isgroupname
                                &&
                                <MyTab
                                    label={group}
                                    className={`setting-single-tabs ${setStyle.settingSingleTab}`}
                                    onClick={() => setActiveTab('group')}
                                />
                            }
                            {Globalpermissions && Globalpermissions.issegment && <MyTab
                                label={segment}
                                className={`setting-single-tabs ${setStyle.settingSingleTab}`}
                                onClick={() => setActiveTab('segment')}
                            />
                            }

                            {Globalpermissions && Globalpermissions.ismarginsheetconf
                                &&
                                <MyTab
                                    label={marginSheet}
                                    className={`setting-single-tabs ${setStyle.settingSingleTab}`}
                                    onClick={() => setActiveTab('marginSheetConfiguration')}
                                />
                            }
                            {Globalpermissions && Globalpermissions.isexcludeuserid
                                &&
                                <MyTab
                                    label={excludeUserId}
                                    className={`setting-single-tabs ${setStyle.settingSingleTab}`}
                                    onClick={() => setActiveTab('excludeuserId')}
                                />
                            }
                        </VerticalTabs>
                    </div>
                </div>
                <div
                    // className="col-md-9"
                    className={`col-md-9 ${setStyle.settingProfileTab}`}
                >
                    {/* <div
                        className={setStyle.settingTabContent1}
                    > */}
                    {activeTab === 'profile' &&
                        <TabContainer>
                            <div
                            //  className={setStyle.settingProfileTab}
                            >
                                {Globalprofile && <BasicInfo />}
                                <div className="row">
                                    <div className="col-md-6">
                                        {Globalsettings && <ProfileSetting
                                        // style={{ height: '21.4rem' }}
                                        />}
                                    </div>
                                    <div className="col-md-6">
                                        <ProfileQRCode />

                                    </div>
                                    {Globalpermissions && Globalpermissions.iscreatebot &&
                                        <div className="col-md-12">
                                            <CreateBot />
                                        </div>
                                    }
                                </div>
                                <Session />
                            </div>
                        </TabContainer>
                    }
                    {activeTab === 'exchange' &&
                        <TabContainer>
                            <AddExchange
                                visibility={showAddExchnage}
                                toggleVisibility={handleAddExchangeHis}
                            />
                            {showAddExchnage &&
                                <AddExchangeHistory />
                            }
                        </TabContainer>
                    }
                    {activeTab === 'tradeConversion' &&
                        <TabContainer>
                            <ConversionConfig />
                        </TabContainer>
                    }
                    {activeTab === 'productConfiguration' &&
                        <TabContainer>
                            <ProductConfig
                                visibility={showProdConf}
                                toggleVisibility={productConfigHistory}
                            />
                            {showProdConf &&
                                <ProductConfigHistory  />
                            }
                        </TabContainer>
                    }
                    {activeTab === 'userConfiguration' &&
                        <TabContainer>
                            <UserConfig
                                visibility={showUserConf}
                                toggleVisibility={userConfigHistory}
                            />

                            {showUserConf &&
                                <UserConfigHistory />
                            }
                        </TabContainer>
                    }
                    {activeTab === 'uploadSettlement' &&
                        <TabContainer>
                            <Settlement
                                hideShow={settlementHistory}
                                show={showSetHistory} 
                            />
                            {showSetHistory &&
                                <SettlementHistory  />
                            }
                        </TabContainer>
                    }
                    {activeTab === 'tradeBackup' &&
                        <TabContainer>
                            <NetpositionBackup
                                netshow={showNetBackup}
                                netHideShow={netpositionHistory}
                            />

                            {showNetBackup &&
                                <NetpositionBackupHistory />
                            }
                        </TabContainer>
                    }
                    {activeTab === 'tradeBook' &&
                        <TabContainer>
                            <ImportTrade
                                visibility={showTradeHistory}
                                toggleVisibility={tradeHistory}
                            />
                            {showTradeHistory &&
                                <TradeHistory />
                            }
                        </TabContainer>
                    }
                    {activeTab === 'changePassword' &&
                        <TabContainer>
                            <ChangePwd />
                        </TabContainer>
                    }
                    {activeTab === 'group' &&
                        <TabContainer>
                            <Group
                                visibility={showGroupHis}
                                toggleVisibility={handleGroupHis}
                            />
                            {showGroupHis &&
                                <GroupHistory />
                            }
                        </TabContainer>
                    }
                    {activeTab === 'segment' &&
                        <TabContainer>
                            <Segment
                                visibility={showSegmentHis}
                                toggleVisibility={handleSegmentHis}
                            />
                            {showSegmentHis &&
                                <SegmentHistory />
                            }
                        </TabContainer>
                    }
                    {activeTab === 'marginSheetConfiguration' &&
                        <TabContainer>
                            <MarginSheetConfig
                                // data={state ? state : null}
                                visibility={showMarginSheet}
                                toggleVisibility={handleMargSheetHis}
                            />
                            {showMarginSheet &&
                                <MarginSheetConfHistory />
                            }
                        </TabContainer>
                    }
                    {activeTab === 'excludeuserId' &&
                        <TabContainer>
                            <UserIdExclude
                                // data={state ? state : null}
                                visibility={showExcludeUserId}
                                toggleVisibility={handleExcludeuserid}
                            />
                            {showExcludeUserId &&
                                <UserIdExcludeHis />
                            }
                        </TabContainer>
                    }
                    {/* </div> */}
                </div>
            </div>

            <Notification notify={NotifyData} CloseError={CloseError} CloseSuccess={CloseSuccess} />
        </div>
    )
}
const VerticalTabs = withStyles(theme => ({
    flexContainer: {
        flexDirection: "column"
    },
    indicator: {
        display: "none"
    }
}))(Tabs);

const MyTab = withStyles(theme => ({
    // root: {
    //   backgroundColor: "#ccc",
    //   borderRadius: theme.shape.borderRadius
    // },
    // wrapper: {
    //   backgroundColor: "#ddd",
    //   padding: theme.spacing(2),
    //   borderRadius: theme.shape.borderRadius
    // },
    selected: {
        color: "tomato",
        borderBottom: "2px solid tomato"
    }
}))(Tab);

function TabContainer(props) {
    return (
        <Typography
            component="div"
        >
            {props.children}
        </Typography>
    );
}
export default memo(Setting)
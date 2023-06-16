import React, { memo, useState } from 'react'
import { Form } from 'react-bootstrap';
import { AiFillFile } from 'react-icons/ai';
import { FaToggleOn } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { Notification } from '../Notification';
import { UpdateUserBasicProfile_API } from '../Redux/API';
import { ChangeThemeAction } from '../Redux/RMSAction';
import profile from './ProfilePage.module.scss'


const ProfileSetting = () => {
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

  const Globalsettings = useSelector(state => state && state.settings)
  const GlobalMenuitem = useSelector(state => state && state.menuitem)

  const [toggle2fa, setToggle2fa] = useState(Globalsettings.is2fa);
  const [toggleNSound, setToggleNSound] = useState(Globalsettings.issoundnotification)
  const [toggleTeleNf, setToggleTeleNf] = useState(Globalsettings.istelnotification)
  const [toggleIsMask, setToggleIsMask] = useState(Globalsettings.ismask)

  const triggerToggleNSound = async (e) => {
    e.preventDefault()
    const ps1 = new Promise((resolve, reject) => {
      resolve(UpdateUserBasicProfile_API({ settings: { issoundnotification: toggleNSound ? false : true } }))
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
      toggleNSound ? setToggleNSound(false) : setToggleNSound(true);
    } else {
      setNotifyData((data) => ({ ...data, errorFlag: true, errorMsg: rs['message'], activesession: rs['session'] }))
    }
  }


  const triggerToggle2fa = async (e) => {
    e.preventDefault()
    const ps1 = new Promise((resolve, reject) => {
      resolve(UpdateUserBasicProfile_API({ settings: { is2fa: toggle2fa ? false : true } }))
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
      toggle2fa ? setToggle2fa(false) : setToggle2fa(true)
    } else {
      setNotifyData((data) => ({ ...data, errorFlag: true, errorMsg: rs['message'], activesession: rs['session'] }))
    }
  }


  const triggerToggleTeleNf = async (e) => {
    e.preventDefault()
    const ps1 = new Promise((resolve, reject) => {
      resolve(UpdateUserBasicProfile_API({ settings: { istelnotification: toggleTeleNf ? false : true } }))
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
      toggleTeleNf ? setToggleTeleNf(false) : setToggleTeleNf(true);
    } else {
      setNotifyData((data) => ({ ...data, errorFlag: true, errorMsg: rs['message'], activesession: rs['session'] }))
    }
  }
  const triggerToggleIsMask = async (e) => {
    e.preventDefault()
    const ps1 = new Promise((resolve, reject) => {
      resolve(UpdateUserBasicProfile_API({ settings: { ismask: toggleIsMask ? false : true } }))
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
      toggleIsMask ? setToggleIsMask(false) : setToggleIsMask(true);
    } else {
      setNotifyData((data) => ({ ...data, errorFlag: true, errorMsg: rs['message'], activesession: rs['session'] }))
    }
  }
  const saveDefaultLandingPage = async (e) => {
    e.preventDefault()
    const ps1 = new Promise((resolve, reject) => {
      resolve(UpdateUserBasicProfile_API({ settings: { defaultlandingpage: e.target.value } }))
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
      console.log("Default Landing Page change success");
    } else {
      setNotifyData((data) => ({ ...data, errorFlag: true, errorMsg: rs['message'], activesession: rs['session'] }))
    }
  }

  const saveDefaultTheme = async (e) => {
    e.preventDefault()
    const ps1 = new Promise((resolve, reject) => {
      resolve(UpdateUserBasicProfile_API({ settings: { defaulttheme: e.target.value } }))
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
      dispatch(ChangeThemeAction(e.target.value))
      console.log("Default Theme change success");
    } else {
      setNotifyData((data) => ({ ...data, errorFlag: true, errorMsg: rs['message'], activesession: rs['session'] }))
    }
  }


  const CloseError = () => {
    setNotifyData((data) => ({ ...data, errorFlag: false }))
  }
  const CloseSuccess = () => {
    setNotifyData((data) => ({ ...data, successFlag: false }))
  }
  // console.log(GlobalMenuitem)
  return (
    <div className={`basic-forminfo ${profile.basicInfo} ${profile.profileSetting}`}
    // style={{ height: '21.4rem' }}
    >
      <h5 className={profile.basicHeading}>
        <span className={profile.icons}>
          <IoSettings />
        </span>  Setting
      </h5>
      <div className={profile.basicInfoSetting}>
        <div className='row'>
          <Form.Group
            className={`col-md-6 ${profile.defaultLandingPage}`}
          >
            <Form.Label
              htmlFor="role"
              className="form-label"
            >
              <span className={`label-icon ${profile.labelIcon}`}>
                <AiFillFile />
              </span>
              Default Landing Page:
            </Form.Label>
            <Form.Select
              name='landingpage'
              // value={data.rolename}
              onChange={(e) => saveDefaultLandingPage(e)}
              className={profile.selectForm}
              required
              defaultValue={Globalsettings.defaultlandingpage}>
              <option value="Select Default Landing Page" hidden>Select Default Landing Page</option>
              {GlobalMenuitem && GlobalMenuitem.map((val) => { return val.show && <option key={val.id} value={val.href}>{val.title}</option> })}
            </Form.Select>
          </Form.Group>
          <Form.Group
            className={`col-md-6 ${profile.defaultLandingPage}`}
          >
            <Form.Label
              htmlFor="role"
              className="form-label"
            >
              <span className={`label-icon ${profile.labelIcon}`}>
                <FaToggleOn />
              </span>
              Default Theme:
            </Form.Label>
            <Form.Select
              name='theme'
              // value={data.rolename}
              onChange={(e) => saveDefaultTheme(e)}
              className={profile.selectForm}
              required
              defaultValue={Globalsettings.defaulttheme}
              >
              <option value="Select Default Landing Page" hidden>Select Default Theme</option>
              {/* {Globalsettings && Globalsettings.map((val) => { return <option key={val.id} value={val.id}>{val}</option> })} */}
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div >

        </div>
        <div className={profile.settingSignleItem} >
          <div className={profile.settingtoggleBtn}>
            <span className={profile.settingtoggleBox} onClick={(e) => { triggerToggleNSound(e) }}>
              <span className={`${toggleNSound ? profile.circle : profile.settingtoggleCircle}`}>
                <input
                  className={profile.switchtoggle}
                  type="checkbox"
                  checked={toggleNSound}
                />
                <span className={profile.toggleCircle}>
                </span>
              </span>
              <span className={`${toggleNSound ? profile.content2 : profile.content}`}>
              </span>
            </span>
          </div>
          <div className={profile.settingContent}>
            <span>notification sound</span>
          </div>
        </div>
        <div className={profile.settingSignleItem} >
          <div className={profile.settingtoggleBtn}>
            <span className={profile.settingtoggleBox} onClick={triggerToggle2fa}>
              <span className={`${toggle2fa ? profile.circle : profile.settingtoggleCircle}`}>
                <input
                  className={profile.switchtoggle}
                  type="checkbox"
                  checked={toggle2fa}
                />
                <span className={profile.toggleCircle}>
                </span>
              </span>
              <span className={`${toggle2fa ? profile.content2 : profile.content}`}>
              </span>
            </span>
          </div>
          <div className={profile.settingContent}>
            <span>2 Factor Authentication</span>
          </div>
        </div>
        <div className={profile.settingSignleItem} >
          <div className={profile.settingtoggleBtn}>
            <span className={profile.settingtoggleBox} onClick={triggerToggleTeleNf}>
              <span className={`${toggleTeleNf ? profile.circle : profile.settingtoggleCircle}`}>
                <input
                  className={profile.switchtoggle}
                  type="checkbox"
                  checked={toggleTeleNf}
                />
                <span className={profile.toggleCircle}>
                </span>
              </span>
              <span className={`${toggleTeleNf ? profile.content2 : profile.content}`}>
              </span>
            </span>
          </div>
          <div className={profile.settingContent}>
            <span>Telegram Notification</span>
          </div>
        </div>

        <div className={profile.settingSignleItem} >
          <div className={profile.settingtoggleBtn}>
            <span className={profile.settingtoggleBox} onClick={triggerToggleIsMask}>
              <span className={`${toggleIsMask ? profile.circle : profile.settingtoggleCircle}`}>
                <input
                  className={profile.switchtoggle}
                  type="checkbox"
                  checked={toggleIsMask}
                />
                <span className={profile.toggleCircle}>
                </span>
              </span>
              <span className={`${toggleIsMask ? profile.content2 : profile.content}`}>
              </span>
            </span>
          </div>
          <div className={profile.settingContent}>
            <span>Mask Balance</span>
          </div>
        </div>

      </div>
      <Notification notify={NotifyData} CloseError={CloseError} CloseSuccess={CloseSuccess} />
    </div >
  )
}

export default memo(ProfileSetting)
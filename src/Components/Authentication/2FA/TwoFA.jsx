import React, { memo, useRef, useState, useEffect } from 'react';
import varification from './TwoFA.module.scss';
import dot from '../../../Assets/Img/dot.png';
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Notification } from '../../Notification';
import { TwoFAVerifyOTP_API } from '../../Redux/API';
import { useDispatch } from 'react-redux';
import { LoginAction } from '../../Redux/RMSAction';
import { WebsocketConnect } from '../../../App';
import { Decompressed } from '../../Utilities/Utilities';

const TwoFA = () => {

  console.log("TwoFA callllll");

  const location = useLocation()
  let navigate = useNavigate();
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

  const [otpValues, setOtpValues] = useState({
    otp1: '',
    otp2: '',
    otp3: '',
    otp4: ''
  })

  const otp1Ref = useRef()
  const otp2Ref = useRef()
  const otp3Ref = useRef()
  const otp4Ref = useRef()
  const otpbtnRef = useRef()
  const [data, setData] = useState(location.state.data)

  useEffect(() => {
    setData({
      ...data,
      otp: otpValues.otp1 + otpValues.otp2 + otpValues.otp3 + otpValues.otp4
    })
  }, [otpValues])

  const CloseError = () => {
    setNotifyData((data) => ({ ...data, errorFlag: false }))
  }
  const CloseSuccess = () => {
    setNotifyData((data) => ({ ...data, successFlag: false }))
  }
  const verifyOTP = async (e) => {
    e.preventDefault()
    if (otpValues.otp1 && otpValues.otp2 && otpValues.otp3 && otpValues.otp4) {

      setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "Verifying OTP..." }))
      const ps1 = new Promise((resolve, reject) => {
        resolve(TwoFAVerifyOTP_API(data))
      })
      const rs = await Promise.all([ps1]).then((val) => {
        val[0]['data']['data']=Decompressed(val[0]['data']['data'])
        // console.log("tttttttttttttttt",val[0]['data']);
        return val[0]['data'];
      }).catch((err) => {
        setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: err['message'] }))
        console.log("*********", err.response.status);
        (err.response.status === 401) && setTimeout(() => { window.location.assign(window.location.origin) }, 1000);
        return err["response"]["data"];
      }
      )
      if (rs['type'] === 'success') {
        setNotifyData((data) => ({ ...data, loadingFlag: false, successFlag: true, successMsg: rs['message'] }))
        dispatch(LoginAction(rs['data']));
        WebsocketConnect()
        navigate("/Dashboard", { replace: true })
      } else {
        setNotifyData((data) => ({ ...data, loadingFlag: false, errorFlag: true, errorMsg: rs['message'] }))
      }
    }
    else {
      e.stopPropagation();
    }

  }
  const handleChange = (e) => {
    setOtpValues({
      ...otpValues,
      [e.target.name]: e.target.value
    })
  }
  return (
    <div className={`container-fluid ${varification.otpPage}`}>
      <div className={`row ${varification.otpverification}`}>
        <div className={`col-md-6 ${varification.inputContainer}`}>
          <div className={varification.otpComponent}>
            <div className={varification.titleContainer}>
              <div className={varification.titlebox}>
                <h2 className={varification.title}>2-Step Verification</h2>
              </div>
            </div>
            <div className={varification.inputFieldContainer}>
              <form className={varification.form}>
                <div className={varification.inputfields}>
                  <div className={varification.inputgroup}>
                    <div className={varification.inputbox}>
                      <div className={varification.inputholder}>
                        <input ref={otp1Ref} name='otp1' value={otpValues.otp1} onChange={handleChange} required type="text" className={varification.textbox} maxLength='1' onKeyUp={(e) => { if (e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Enter') otp2Ref.current.focus() }} />
                      </div>
                    </div>
                    <div className={varification.inputbox}>
                      <div className={varification.inputholder}>
                        <input ref={otp2Ref} name='otp2' value={otpValues.otp2} onChange={handleChange} required type="text" className={varification.textbox} maxLength='1' onKeyUp={(e) => { if (e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Enter') otp3Ref.current.focus() }} />
                      </div>
                    </div>
                    <div className={varification.inputbox}>
                      <div className={varification.inputholder}>
                        <input ref={otp3Ref} name='otp3' value={otpValues.otp3} onChange={handleChange} required type="text" className={varification.textbox} maxLength='1' onKeyUp={(e) => { if (e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Enter') otp4Ref.current.focus() }} />
                      </div>
                    </div>
                    <div className={varification.inputbox}>
                      <div className={varification.inputholder}>
                        <input ref={otp4Ref} name='otp4' value={otpValues.otp4} onChange={handleChange} required type="text" className={varification.textbox} maxLength='1' onKeyUp={(e) => { if (e.key !== 'Backspace' && e.key !== 'Delete') otpbtnRef.current.focus(); verifyOTP(e); }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={varification.buttoncontainer}>
                  <NavLink to='/' type="submit" ref={otpbtnRef} className={varification.btn} onClick={(e) => verifyOTP(e)}>SEND CODE</NavLink>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className={`col-md-6 ${varification.imageContainer}`}>
          <div className={varification.banner}>
            <img className={varification.dotsimg} src={dot} alt="dot" />
            <div className={varification.text}>
              <h4 className={varification.h4Tag}>"Attention is the new currency"</h4>
            </div>
          </div>
        </div>
      </div>
      <Notification notify={NotifyData} CloseError={CloseError} CloseSuccess={CloseSuccess} />
    </div>
  )
}

export default memo(TwoFA);
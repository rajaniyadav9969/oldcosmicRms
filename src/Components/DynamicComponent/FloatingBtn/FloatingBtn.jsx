import React, { memo, useState } from "react";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import { FaFileCsv } from "react-icons/fa";
import { MdDeleteSweep, MdOutlineWarning } from "react-icons/md";
import { RiFileSettingsFill } from "react-icons/ri";
import { Notification } from "../../Notification";
import { TroubleShoot_API } from "../../Redux/API";
import './FloatingBtn.scss'
import { useEffect } from "react";


const FloatingBtn = (props) => {
  const [open, setOpen] = useState(true);
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
    setNotifyData((data) => ({ ...data, errorFlag: false }))
  }
  const CloseSuccess = () => {
    setNotifyData((data) => ({ ...data, successFlag: false }))
  }


  const handleClose = () => {
    (window.innerWidth < 768) && setOpen(false);
  }
  const handleOpen = () => {
    (window.innerWidth < 768) && setOpen(true);
  };
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setOpen(false)
    }
    else if (window.innerWidth > 768) {
      setOpen(true)
    }
  }, [window.innerWidth])

  const handleTrubleShoot = async (type) => {
    setNotifyData((data) => ({ ...data, loadingFlag: true, loadingMsg: "TroubleShooting..." }))

    const ps1 = new Promise((resolve, reject) => {
      resolve(TroubleShoot_API(type))
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
    } else {
      setNotifyData((data) => ({ ...data, loadingFlag: false, confirmFlag: false, errorFlag: true, errorMsg: rs['message'] }))
    }
  }

  return (
    <div className="Floating-btn">
      <SpeedDial
        ariaLabel="SpeedDial example"
        icon={<h6 className="floatingbtn-section"><FaFileCsv /> <span>{props.TotalTrades}</span></h6>}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        className="muidial-direction"
        direction="right"
      >
        <SpeedDialAction
          key='Delete Duplication Trade'
          icon={<MdDeleteSweep />}
          tooltipTitle='Delete Duplication Trade'
          onClick={(e) => setNotifyData((data) => ({ ...data, confirmFlag: true, confirmMsg: "Confirm tradebook delete duplication...", confirmAction: (e) => handleTrubleShoot('tradebook') }))}
        />
        <SpeedDialAction
          key='TroubleShoot NetPosition'
          icon={<MdOutlineWarning />}
          tooltipTitle='TroubleShoot NetPosition'
          onClick={(e) => setNotifyData((data) => ({ ...data, confirmFlag: true, confirmMsg: "Confirm position TroubleShooting...", confirmAction: (e) => handleTrubleShoot('position') }))}
        />
        <SpeedDialAction
          key='TroubleShoot Spreadbook'
          icon={<RiFileSettingsFill />}
          tooltipTitle='TroubleShoot Spreadbook'
          onClick={(e) => setNotifyData((data) => ({ ...data, confirmFlag: true, confirmMsg: "Confirm spreadbook TroubleShooting...", confirmAction: (e) => handleTrubleShoot('spreadbook') }))}
        />
      </SpeedDial>
      <Notification notify={NotifyData} CloseError={CloseError} CloseSuccess={CloseSuccess} CloseConfirm={CloseConfirm} />
    </div>
  );
}
export default memo(FloatingBtn)
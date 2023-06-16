import React, { memo, useEffect, useState } from 'react';
import { AiFillClockCircle } from 'react-icons/ai';
import { IoMdNotifications, IoMdClose, IoIosWarning } from 'react-icons/io';
import { IoIosCheckbox } from 'react-icons/io';
import './Snackbar.scss';


const Snackbar = (props) => {
  const [showSnackbar, setShowSnackbar] = useState(true);
  useEffect(() => { setTimeout(() => { setShowSnackbar(false) }, 3000) }, [])

  return (
    <div className='snackbar' id= { showSnackbar ? "show" : "hide"}>
      <div className='snackbar-content'
        style={{
          background:
            props.types.status === "success" ? "linear-gradient(310deg, rgb(23, 173, 55), rgb(152, 236, 45))" :
              props.types.status === "danger" ? "linear-gradient(310deg, rgb(234, 6, 6), rgb(255, 102, 124))" :
                "linear-gradient(310deg, rgb(245, 57, 57), rgb(251, 207, 51))"
        }}
      >
        <div className='title-container'>
          <div className='title-content'>
            {props.types.status === "success" ? <IoIosCheckbox />
              :
              props.types.status === "fail" ? <IoIosWarning /> : <IoMdNotifications />}
            <span className='title'>{props.types.title}</span>
          </div>
          <span className='close' onClick={() => { setShowSnackbar(!showSnackbar) }}> <IoMdClose /></span>
        </div>
        <hr className='hr-tag' />
        <div className='message'>{props.types.description}</div>
        <span >
          <span className="clock-icon">
            <AiFillClockCircle />
          </span>
          {props.types.timestamp}
        </span>
      </div>
    </div>
  )
}

export default memo(Snackbar)

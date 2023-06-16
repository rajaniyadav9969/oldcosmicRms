import React, { memo, useState } from "react";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { BiRupee } from "react-icons/bi";
import { MdNotificationAdd } from "react-icons/md";
import { Modal } from "react-bootstrap";
import TodayForm from "./TodayForm";
import { Notification } from "../../Notification";
import { maskIt, numberWithCommas } from "../../Utilities/Utilities";
import cardStyle from "./Cards.module.scss";
import { shallowEqual, useSelector } from "react-redux";

function CreateCard(props) {
  const Globalsettings = useSelector(state => state && state.settings, shallowEqual)


  const [hideBalance, sethideBalance] = useState(Globalsettings.ismask)
  const [showAmountForm, setShowAmountForm] = useState(false);
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
  const CloseError = () => {
    setNotifyData((data) => ({ ...data, errorFlag: false }))
  }
  const CloseSuccess = () => {
    setNotifyData((data) => ({ ...data, successFlag: false }))
  }

  const checkAlert = (data) => {
    if (data.condition) {
      if (data.enablealert) {
        if (data.condition == 'greaterthan') {
          if (parseInt(data.today) >= parseInt(data.alertamount)) {
            // console.log("greaterthan alert hittttt");
            setNotifyData((data) => ({ ...data, loadingFlag: false, successFlag: true, successMsg: "greaterthan alert hittttt" }))
            props.handleStopAlert(false);
          }
        }
        else if (data.condition == 'lessthan') {
          if (parseInt(data.today) <= parseInt(data.alertamount)) {
            // console.log("lessthan alert hittttt");
            setNotifyData((data) => ({ ...data, loadingFlag: false, successFlag: true, successMsg: "lessthan alert hittttt" }))
            props.handleStopAlert(false);
          }
        }
      }

    }
  }
  // console.log("%%%%%%%%%%%%%%%%%%%%%",props.data[0].tilllyesterday)


  return (
    <div className={cardStyle.createCard}>
      {/* <h1 className="cardHeading">
        <span> Hey, </span>
        <span className="role-name">{props.rolename}</span>
      </h1> */}
      {/* <div className="cards "> */}
      {props.data && props.data.map((data, i) => {
        return (
          <div key={i} className={cardStyle.cards}>
            <div className={`singleCard ${cardStyle.singleCard}`}>
              <div className={cardStyle.cardDataContainer}>
                <div className={cardStyle.cardData}>
                  <span className={cardStyle.title}>Till Yesterday MTM</span>
                  <h5
                    className={cardStyle.amount}
                    onClick={() => { sethideBalance(!hideBalance) }}

                  >
                    <span style={{ color: (data.tilllyesterday > 0) ? "#00e396" : "rgb(255, 0, 0)" }}>
                      {(data.tilllyesterday != undefined) && hideBalance ? maskIt(data.tilllyesterday.toFixed()) : numberWithCommas(data.tilllyesterday.toFixed())}
                    </span>
                  </h5>
                </div>
                <div className={cardStyle.iconContainer}>
                  {data.currency === "INR" ? (
                    <BiRupee />
                  ) : (
                    <AiOutlineDollarCircle />
                  )}
                </div>
              </div>
            </div>
            <div className={`singleCard ${cardStyle.singleCard}`}>
              <div className={cardStyle.cardDataContainer}>
                <div className={cardStyle.cardData}>
                  <span className={cardStyle.title}>Today Position</span>
                  <h5
                    className={cardStyle.amount}
                    onClick={() => { sethideBalance(!hideBalance) }}
                  >
                    <span style={{ color: (data.todayposition > 0) ? "#00e396" : "rgb(255, 0, 0)" }}>
                      {hideBalance ? maskIt(data.todayposition.toFixed()) : numberWithCommas(data.todayposition.toFixed())}
                    </span>
                  </h5>
                </div>
                <div className={cardStyle.iconContainer}>
                  {data.currency === "INR" ? (
                    <BiRupee />
                  ) : (
                    <AiOutlineDollarCircle />
                  )}
                </div>
              </div>
            </div>
            <div className={`singleCard ${cardStyle.singleCard}`}>
              <div className={cardStyle.cardDataContainer}>
                <div className={cardStyle.cardData}>
                  <div>
                    <span className={cardStyle.title} >Today MTM</span>
                    <span className={cardStyle.todayNotifyIcon} onClick={() => setShowAmountForm(true)}>
                      <MdNotificationAdd />
                    </span>
                  </div>
                  {
                    checkAlert(data)
                  }
                  <h5 className={cardStyle.amount} onClick={() => { sethideBalance(!hideBalance) }}>
                    <span style={{ color: (data.today > 0) ? "#00e396" : "rgb(255, 0, 0)" }}>
                      {hideBalance ? maskIt(data.today.toFixed()) : numberWithCommas(data.today.toFixed())}
                    </span>
                  </h5>
                </div>
                <div className={cardStyle.iconContainer}>
                  {data.currency === "INR" ? (
                    <BiRupee />
                  ) : (
                    <AiOutlineDollarCircle />
                  )}
                </div>
              </div>
            </div>
            <div className={`singleCard ${cardStyle.singleCard}`}>
              <div className={cardStyle.cardDataContainer}>
                <div className={cardStyle.cardData}>
                  <span className={cardStyle.title}>Till Day MTM</span>
                  <h5 className={cardStyle.amount}
                    onClick={() => { sethideBalance(!hideBalance) }}
                  >
                    <span style={{ color: (data.current > 0) ? "#00e396" : "rgb(255, 0, 0)" }}>
                      {hideBalance ? maskIt(data.current.toFixed()) : numberWithCommas(data.current.toFixed())}
                    </span>
                    {/* {numberFormatter(data.current)} */}
                    <span
                      className={cardStyle.perchange}
                      style={{ color: (data.percentagechange > 0) ? "#00e396" : "rgb(255, 0, 0)" }}
                    >
                      {hideBalance ? maskIt(parseFloat(data.percentagechange).toFixed(1)) : parseFloat(data.percentagechange).toFixed(1)} %
                    </span>
                  </h5>
                </div>
                <div className={cardStyle.iconContainer}>
                  {data.currency === "INR" ? (
                    <BiRupee />
                  ) : (
                    <AiOutlineDollarCircle />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {/* </div> */}
      <Modal
        show={showAmountForm}
        onHide={() => setShowAmountForm(false)}
        // size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Alert</Modal.Title>
        </Modal.Header>
        <TodayForm data={props.data} onClose={setShowAmountForm} handleCreateAlert={props.handleCreateAlert} />
      </Modal>
      <Notification
        notify={NotifyData}
        CloseError={CloseError}
        CloseSuccess={CloseSuccess}
      />
    </div >
  );
}

export default memo(CreateCard);

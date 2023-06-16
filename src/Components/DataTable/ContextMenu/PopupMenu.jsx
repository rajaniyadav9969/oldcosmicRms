import React, { memo } from "react"
import { CSVLink } from 'react-csv';
import { BiColumns, BiExport } from "react-icons/bi";
import { FaFileCsv, FaHouseUser, FaFilter, FaMinus } from "react-icons/fa";
import { BiLastPage } from "react-icons/bi";
import { RiFilterOffFill } from "react-icons/ri";
import { CgMaximize } from "react-icons/cg";
import { AiFillCamera } from "react-icons/ai";
import style from './Popup.module.scss'

const PopupMenu = (props) => {
  const csvReports = {
    srno: 'Cosmin-trade.csv',
    data: props.data
  }

  return (
    <>
      {props.visible
        &&
        < ul
          className={`context-menu-popup ${style.popup}`}
          style={{
            left: `${props.x}px`,
            top: `${props.y}px`,
          }}
        >
          {/* <li className={style.list} onClick={(e)=>SubmitScreenShot(props.tableref)}>SnapShot</li> */}
          {/* <hr /> */}
          <div className={style.dropdown}>
            <li className={style.list}>
              <span className={`label-icon ${style.popuplabelIcon}`}>
                <BiExport />
              </span>
              Export
            </li>
            <div className={style.dropdownContent}>
              <li className={style.list}>

                <CSVLink {...csvReports}>
                  <button className={style.subContextmenu}>
                    <span className={`label-icon ${style.popuplabelIcon}`}>
                      <FaFileCsv />
                    </span>
                    CSV
                  </button>
                </CSVLink>
              </li>
              {/* <li className={style.list}>
                <button onClick={Downloadpdf} className={style.subContextmenu}>
                  PDF
                </button>
              </li> */}
            </div>
          </div>
          <hr />
          <div className={style.dropdown}>
            <li className={style.list} >
              <span className={`label-icon ${style.popuplabelIcon}`}>
                <FaHouseUser />
              </span>
              Property
            </li>
            <div className={style.dropdownContent}>
              <li className={style.list}>
                {(props.rowFilterVisiblity)
                  ?
                  <span onClick={props.filterBtn} className={style.subContextmenu}>
                    <span className={`label-icon ${style.popuplabelIcon}`}>
                      <RiFilterOffFill />
                    </span>
                    Hide Filter
                  </span>
                  :
                  <span onClick={props.filterBtn} className={style.subContextmenu}>
                    <span className={`label-icon ${style.popuplabelIcon}`}>
                      <FaFilter />
                    </span>
                    Show Filter
                  </span>
                }
              </li>
              <li className={style.list}>
                {(props.paginationVisiblity)
                  ?
                  <span onClick={props.paginationBtn} className={style.subContextmenu}>
                    <span className={`label-icon ${style.popuplabelIcon}`}>
                      <BiLastPage />
                    </span>
                    Hide Pagination
                  </span>
                  :
                  <span onClick={props.paginationBtn} className={style.subContextmenu}>
                    <span className={`label-icon ${style.popuplabelIcon}`}>
                      <BiLastPage />
                    </span>
                    Show Pagination
                  </span>
                }
              </li>
              <li className={style.list}>
                {(props.columnVisibilityBtn)
                  ?
                  <span onClick={props.visibilityBtn} className={style.subContextmenu}>
                    <span className={`label-icon ${style.popuplabelIcon}`}>
                      <BiColumns />
                    </span>
                    Hide Visibility Column
                  </span>
                  :
                  <span onClick={props.visibilityBtn} className={style.subContextmenu}>
                    <span className={`label-icon ${style.popuplabelIcon}`}>
                      <BiColumns />
                    </span>
                    Show Visibility Column
                  </span>
                }
              </li>
              <li className={style.list}>
                {(props.fullScreen)
                  ?
                  <span onClick={props.fullScreenHandle} className={style.subContextmenu}>
                    <span className={`label-icon ${style.popuplabelIcon}`}>
                      <FaMinus />
                    </span>
                    Minimize Screen
                  </span>
                  :
                  <span onClick={props.fullScreenHandle} className={style.subContextmenu}>
                    <span className={`label-icon ${style.popuplabelIcon}`}>
                      <CgMaximize />
                    </span>
                    Maxmize Screen
                  </span>
                }
              </li>
              <li className={style.list}>
                <span
                  onClick={() => props.SubmitScreenShot(props.tableref)}
                  className={style.subContextmenu}>
                  <span className={`label-icon ${style.popuplabelIcon}`}>
                    <AiFillCamera />
                  </span>
                  Screen short
                </span>
              </li>
            </div>
          </div>

        </ul >
      }
    </>
  )
}
export default memo(PopupMenu)
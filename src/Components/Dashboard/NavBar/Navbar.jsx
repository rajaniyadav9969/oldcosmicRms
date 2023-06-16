import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillSetting, AiFillFileText, AiOutlineAreaChart } from "react-icons/ai";
import { IoReceiptSharp, IoCard } from "react-icons/io5";
import { MdDashboard, MdOutlineNoAccounts } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import MenuBar from "./MenuBar/MenuBar";
import Header from './Header/Header'
import "react-pro-sidebar/dist/css/styles.css";
import "./Navbar.scss";
import { FaTable } from "react-icons/fa";
import { SetMenuItemAction } from "../../Redux/RMSAction";

const Navbar = (props) => {

  const Globalpermissions = useSelector(state => state && state.permissions)
  const dispatch = useDispatch()

  const [dataitems, setdataitems] = useState([])
  const [menuCollapse, setMenuCollapse] = useState(true);
  const menuIconClick = () => {
    menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
    // setMenuCollapse(!menuCollapse);
  };

  useEffect(() => {
    let temp=[
      {
        title: 'Dashboard',
        id: 'isdashboard',
        href: 'dashboard',
        show: Globalpermissions && Globalpermissions.isdashboard,
        cName: "navlinks",
        icon: <MdDashboard />,
      },
      {
        title: 'Tabular Dashboard',
        id: 'istabulardashboard',
        href: 'tabulardashboard',
        show: Globalpermissions && Globalpermissions.istabulardashboard,
        cName: "navlinks",
        // icon: <BiAccounting />,
        icon: <FaTable />,

      },
      {
        title: 'Ledger',
        id: 'isledger',
        href: 'ledger',
        show: Globalpermissions && Globalpermissions.isledger,
        cName: "navlinks",
        icon: <IoReceiptSharp />,
      },
      {
        title: 'Setting',
        id: 'issettings',
        href: 'settings',
        show: Globalpermissions && Globalpermissions.issettings,
        cName: "navlinks",
        icon: <AiFillSetting />,
      },
      {
        title: 'Report',
        id: 'isreport',
        href: 'report',
        show: Globalpermissions && Globalpermissions.isreport,
        cName: "navlinks",
        icon: <AiFillFileText />,
      },
      {
        title: 'User Management',
        id: 'isusermanagement',
        href: 'usermanagement',
        show: Globalpermissions && Globalpermissions.isusermanagement,
        cName: "navlinks",
        icon: <IoCard />,
      },
      {
        title: 'Chart',
        id: 'ischart',
        href: 'chart',
        show: Globalpermissions && Globalpermissions.ischart,
        cName: "navlinks",
        icon: <AiOutlineAreaChart />,
      },
      {
        title: 'Support',
        id: 'ischatbox',
        href: 'support',
        show: Globalpermissions && Globalpermissions.ischatbox,
        cName: "navlinks",
        icon: <BiSupport />,
      },

      {
        title: 'Accounting',
        id: 'isaccounting',
        href: 'accounting',
        show: Globalpermissions && Globalpermissions.isaccounting,
        cName: "navlinks",
        // icon: <BiAccounting />,
        icon: <MdOutlineNoAccounts />,

      },
    ]
    setdataitems(temp)
    dispatch(SetMenuItemAction(temp))
  }, [])

  
  return (
    <div className="mainheader">
      <MenuBar menuCollapse={menuCollapse} menuIconClick={menuIconClick} dataitems={dataitems} chatnotificationData={props.chatnotificationData} setMenuCollapse={setMenuCollapse} />
      <Header menuCollapse={menuCollapse} menuIconClick={menuIconClick} />
    </div>
  );
};

export default memo(Navbar);

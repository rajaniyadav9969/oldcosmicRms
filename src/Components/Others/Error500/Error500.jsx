import React, { memo } from 'react';
import ePage from '../ErrorPage.module.scss';
import error500 from '../../../Assets/Img/error-500.png';
import { NavLink } from 'react-router-dom';


const Error500 = () => {
    return (
        <div className={`container-fluid ${ePage.errorpage}`}>
            <div className={ePage.errorbanner}>
                <div className={ePage.errorcontainer}>
                    <div className={`row ${ePage.errorholder}`}>
                        <div className={`col-md-5 ${ePage.errortext}`}>
                            <div className={ePage.title}>
                                <p className={ePage.heading500}>Error 500</p>
                            </div>
                            <h2 className={ePage.message500}>Something went wrong.</h2>
                            <div className={ePage.buttonholder}>
                                <NavLink to='/' className={ePage.homeLink500} >GO TO HOMEPAGE</NavLink>
                            </div>
                        </div>
                        <div className='col-md-7'>
                            <img className={ePage.image }src={error500} alt="error500"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Error500)
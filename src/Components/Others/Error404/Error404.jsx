import React, { memo } from 'react';
import ePage from  '../ErrorPage.module.scss';
import error from '../../../Assets/Img/error-404.png';
import { NavLink } from 'react-router-dom';

const Error404 = () => {
    return (
        <>
            <div className={`container-fluid ${ePage.errorpage}`}>
                <div className={ePage.errorbanner}>
                    <div className={ePage.errorcontainer}>
                        <div className={`row ${ePage.errorholder}`}>
                            <div className={`col-md-5 ${ePage.errortext}`}>
                                <div className={ePage.title}>
                                    <p className={ePage.heading}>Error 404</p>
                                </div>
                                <h2 className={ePage.message}>Page not found.</h2>
                                <div className={ePage.buttonholder}>
                                    <NavLink className={ePage.homeLink} to='/'>GO TO HOMEPAGE</NavLink>
                                </div>
                            </div>
                            <div className="col-md-7">
                                <img className={ePage.image} src={error} alt="error"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default memo(Error404)
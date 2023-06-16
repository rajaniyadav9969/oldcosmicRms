import React, { memo, useEffect, useState } from 'react';
import logo from '../../../Assets/Img/favicon-new.png';
import { Login} from '../../Authentication';
import sStyle from './SplashScreen.module.scss';

const SplashScreen = () => {
    const [splashFlag, setSplashFlag] = useState(true)

    useEffect(() => {
        setTimeout(() => { setSplashFlag(false) }, 2000)
    }, [])    //NAVIGATE LOGIC HERE

    return (
        <>
            {splashFlag
                ?
                <div className={sStyle.splashscreen}>
                    <img className={sStyle.img_logo} src={logo} alt="logo"></img>
                    <h1>COSMIC TRADES</h1>
                </div>
                :
                <Login />
            }
        </>
    )
}

export default memo(SplashScreen)
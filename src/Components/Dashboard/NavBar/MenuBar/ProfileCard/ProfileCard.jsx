import React, { memo } from 'react'
import defaultimg from '../../../../../Assets/Img/favicon-new.png'
import { mediaURL } from '../../../../Redux/API';
import { useSelector } from 'react-redux';
import card from './ProfileCard.module.scss';

const ProfileCard = () => {

    // console.log("ProfileCard");

    const Globalprofile = useSelector(state => state && state.profile)
    const Globalprofile_pic = useSelector(state => state && state.profile_pic)
    const Globalsettings = useSelector(state => state && state.settings)

    return (
        <div className={card.profilecardcontainer}>
            <div className={card.profilemaincard}>
                <div className={card.profilecard}>
                    <div className={card.profilecardicon}>
                        <span className={card.profilecardiconmain}>
                            <img src={Globalprofile_pic ? mediaURL + Globalprofile_pic : defaultimg} alt="" />
                        </span>
                    </div>
                    <div className={card.profilecardcontents}>
                        <h6 className={card.profilecardheading}>{Globalprofile.username}</h6>
                        <h6 className={card.profilecardheading2}>{Globalsettings.rolename}</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default memo(ProfileCard)
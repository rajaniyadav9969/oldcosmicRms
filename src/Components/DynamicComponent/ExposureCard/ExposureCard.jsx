import React, { useState } from 'react'
import { DataTableComp } from '../../DataTable';
import './ExposureCard.scss'
const ExposureCard = (props) => {
    const [cardFlip, setCardFlip] = useState(false);

    function handleClick() {
        setCardFlip(!cardFlip);
    }
    // console.log("props.exposureData",props.exposureData)

    return (
        <div className="exposureCard">
                {/* <div className='exposureHeadingSection'>
                    <h4 className="exposureMainHeading">Exposure</h4>
                </div> */}
                <DataTableComp
                    id="exposuredata"
                    // userid={columnsToHide.length > 0 && columnsToHide[0]['id']}
                    data={props.exposureData && props.exposureData}
                    columns={props.exposureColumn && props.exposureColumn}
                    goupbyfilter={false}
                    handleColumnVisibility={props.handleColumnVisibility}
                />
        </div>
    )
}

export default ExposureCard
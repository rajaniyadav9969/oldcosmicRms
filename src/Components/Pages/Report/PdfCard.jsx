import React, { memo } from 'react'
import { FaFilePdf } from 'react-icons/fa'
import pdfc from './PdfCard.module.scss'

const PdfCard = () => {
    return (
        <div
            className={pdfc.cardSection}
        >
            <div className={`session-section ${pdfc.pdfCard}`}>
                {/* <div > */}
                <h3 className={pdfc.cardMessage}>
                    <span className={`label-icon ${pdfc.pdfIcon}`}>
                        <FaFilePdf />
                    </span>
                    Pdf Preview</h3>
                {/* </div> */}
            </div>

        </div>
    )
}

export default memo(PdfCard)
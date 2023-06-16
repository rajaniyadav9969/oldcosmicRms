import React, { memo } from 'react'

const Report = (props) => {
  return (
    <div>
      
      <iframe src={props.data}
        width="100%"
        height="800">

      </iframe>

    </div>
  );
}

export default memo(Report)
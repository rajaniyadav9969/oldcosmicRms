import React from 'react'
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import moment from "moment";
import profile from '../../ProfilePage/ProfilePage.module.scss';

function Datepicker(props) {
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
                format='yyyy/MM/dd'
                size="small"
                value={props.dateValue}
                allowKeyboardControl
                autoOk
                onChange={(date) => { date = moment(date).format('YYYY-MM-DD'); props.handleDate(date) }}
                maxDate={moment(new Date()).subtract(props.yesterday ? 1 : 0, 'days')}
                animateYearScrolling
                style={{ width: ' 100%' }}
                className={`date-section ${profile.dateSection}`}
            />
        </MuiPickersUtilsProvider>
    )
}

export default Datepicker;
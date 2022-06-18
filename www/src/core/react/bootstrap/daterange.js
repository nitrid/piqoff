import React from 'react';
import NbBase from './base.js';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

export default class NbDateRange extends NbBase
{
    constructor(props)
    {
        super(props)

        this.state = 
        {
            startDate : this.props.startDate,
            endDate : this.props.endDate
        }
    }
    get startDate()
    {
        return this.state.startDate
    }
    set startDate(e)
    {
        this.setState({startDate:e})
    }
    get endDate()
    {
        return this.state.endDate
    }
    set endDate(e)
    {
        this.setState({endDate:e})
    }
    render()
    {
        return(
            <DateRangePicker initialSettings={{ startDate: this.state.startDate, endDate: this.state.endDate, alwaysShowCalendars: true,             
            ranges:
            {
                'Bugün' : [moment(), moment()],
                'Dün': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Bu Hafta' : [moment().startOf('week'), moment().endOf('week')],
                'Geçen Hafta' : [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
                'Bu Ay' : [moment().startOf('month'), moment().endOf('month')],
                'Geçen Ay' : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'Bu Yıl' : [moment().startOf('year'), moment().endOf('year')],
                'Geçen Yıl' : [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
            }}}
            onCallback={(start, end, label)=>
            {
                this.setState({startDate:start,endDate:end})
            }}>
                <input type="text" className="form-control" />
            </DateRangePicker>
        )
    }
}
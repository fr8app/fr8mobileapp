import Moment from 'moment'

const toTime = (date) => { 
    
    return month = Moment(date).local().format('hh:mm A') }

const toDate = (date) => { 
    return month = Moment(date).local().format('L') 
}

const toDateTime = (date) => { 
    return month = Moment(date).local().format("hh:mm A L") }


module.exports = {
    toTime,
    toDate,
    toDateTime,
} 
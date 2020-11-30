import moment from 'moment'

export function getFomatTime() {
    return moment().format('YYYY-MM-DD HH:mm:ss')
}

export function formatDate(date) {
    return moment(date).format('YYYY-MM-DD')
}
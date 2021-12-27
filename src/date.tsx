import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export const parseUnix = (unix: number) => {
    return dayjs.unix(unix).fromNow()
}

export const parseDate = (date: string, isShort?: boolean) => {
    if (isShort) {
        return dayjs(date).format('MMM D, YYYY h:mm A')
    }
    return dayjs(date).format('MMM D, YYYY')
}
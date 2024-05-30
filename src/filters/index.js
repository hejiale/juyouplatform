import currency from '@/utils/currency'
import moneyCurrency from "./currency"
import dayjs from 'dayjs'

export default {
  formatYmd(val) {
    if (!val) return '--'
    return dayjs(val).format('YYYY-MM-DD')
  },
  formatBankCard(val) {
    if (!val) return '--'
    return val.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
  },
  fileFormat (val) {
    return val.substring(val.lastIndexOf('.'))
  },
  str2ymd (val) {
    if (!val) return '--'
    return val.substring(0, 10)
  },
  str2ym (val) {
    if (!val) return '--'
    return val.substring(0, 7)
  },
  str2ymdhm (val) {
    if (!val) return '--'
    return val.substring(0, 16)
  },
  aliyunThumb (val) {
    // TODO 404图片
    if (!val) return ''
    return val + '?x-oss-process=image/resize,m_fixed,h_100,w_100'
  },
  str2Dictionary (val) {
    if (!val) return '--'
    return '¥  ' + parseFloat(val/100).toFixed(2)
  },
  fileSize (val) {
    if (!val) return '--'
    return (val / 1024 / 1024).toFixed(2) + 'MB'
  },
  currency,
  moneyCurrency
  // ...enumsFilter
}

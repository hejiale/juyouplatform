const digitsRE = /(\d{3})(?=\d)/g

const currency = (value, currency, decimals) => {
  if (!value) return '未定'
  // TODO 分转元
  value = (value * 0.01).toFixed(2)
  // return value
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  currency = currency != null ? currency : '¥'
  decimals = decimals != null ? decimals : 2
  let stringified = Math.abs(value).toFixed(decimals)
  let _int = decimals
    ? stringified.slice(0, -1 - decimals)
    : stringified
  let i = _int.length % 3
  let head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
    : ''
  let _float = decimals
    ? stringified.slice(-1 - decimals)
    : ''
  let sign = value < 0 ? '-' : ''
  return sign + currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float
}

export default currency

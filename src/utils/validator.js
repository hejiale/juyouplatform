import {
  strongPassword,
  dateFormat,
  phone,
  email,
  idCard,
  creditCode,
  bank
} from './regex'

function notEmpty(label) {
  return {
    required: true,
    message: `请输入${label}`,
    trigger: ['blur', 'change']
  }
}
// 长度最大限制
function lengthMax(max) {
  const lengthMax = (value, rule, callback) => {
    if (value.length > max) {
      callback(new Error(`字段最大长度不能超过${max}`))
    } else {
      callback()
    }
  }
  return {
    validator: lengthMax,
    trigger: ['blur', 'change']
  }
}

export default {
  notEmpty,
  lengthMax,
  // 强壮的密码
  strongPassword: {
    pattern: strongPassword,
    message: '8位以上，必须包含大小写字母，数字和特殊符号',
    trigger: 'blur'
  },
  validatorPhone: {
    pattern: phone,
    message: '请输入正确手机号',
    trigger: 'blur'
  },
  validatorEmail: {
    pattern: email,
    message: '请输入正确邮箱',
    trigger: 'blur'
  },
  validatorIdCard: {
    pattern: idCard,
    message: '请输入正确身份证',
    trigger: 'blur'
  },
  validatorCreditCode: {
    pattern: creditCode,
    message: '请输入正确社会信用代码',
    trigger: 'blur'
  },
  validatorBank: {
    pattern: bank,
    message: '请输入正确的银行卡号',
    trigger: 'blur'
  }
}
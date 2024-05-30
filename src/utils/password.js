import CryptoJS from 'crypto-js/crypto-js'

export const pwd = async function (vm, api, form) {
  try {
    let _vm = vm
    let aesPublic = await vm.$api.securityGetAesKey({})
    let res
    let key = CryptoJS.enc.Base64.parse(aesPublic.aesKey)
    if (api === 'authLogin') {
      let { password, accountName } = form
      let aesPwd = CryptoJS.AES.encrypt(password, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })
      aesPwd = aesPwd.toString()
      res = await _vm.$api[api]({
        accountName,
        password: aesPwd,
        keyNo: aesPublic.keyNo
      })
    } else if (api === 'adminUpdatePassword') {
      let { oldPassword, newPassword } = form
      let aesOldPwd = CryptoJS.AES.encrypt(oldPassword, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })
      aesOldPwd = aesOldPwd.toString()
      let aesNewPwd = CryptoJS.AES.encrypt(newPassword, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })
      aesNewPwd = aesNewPwd.toString()
      res = await _vm.$api[api]({
        oldPassword: aesOldPwd,
        newPassword: aesNewPwd,
        keyNo: aesPublic.keyNo
      })
    }
    return res
  } catch (error) {
    return Promise.reject(error)
  }
}

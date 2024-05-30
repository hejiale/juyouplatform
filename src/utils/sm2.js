const sm2 = require('sm-crypto').sm2
const cipherMode = 0
import api from '../api'

//  获取密钥
async function getSm2Key() {
  const keyInfo = JSON.parse(sessionStorage.getItem('keyInfo'))
  if (keyInfo) return keyInfo
  let res = await api.securityGetSecretKey()
  sessionStorage.setItem('keyInfo', JSON.stringify(res))
  return res
}

// 加密方法
export async function doEncrypt(data) {
  // console.log(data)
  const { publicKey } = await getSm2Key() // 私钥
  const encryptData = sm2.doEncrypt(JSON.stringify(data), publicKey, cipherMode) // 加密结果
  // console.log('加密数据', encryptData)
  return encryptData
}

// 解密方法
export async function doDecrypt(data) {
  // console.log(data)
  const privateKey =
    '028984c7d39127fc32676925043975e2d6b4d2e0d9c6be92aa49963a7ceb8abd' // 私钥
  const decryptData = sm2.doDecrypt(data, privateKey, cipherMode)
  // console.log('解密数据', decryptData)
  return JSON.parse(decryptData)
}

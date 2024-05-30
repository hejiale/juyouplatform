export default {
  apiBaseUrl: '/api',
  // apiBaseUrl: process.env.NODE_ENV == 'development' ? '' : '/manage-api',
  componentPrefix: 'yc',
  uploadUrl() {
    return this.apiBaseUrl + '/file/upload'
  },
  //  剧本导入
  dramaImportUrl() {
    return this.apiBaseUrl + '/excelDrama/dramaImport'
  },
  //  店铺导入
  storeImportUrl() {
    return this.apiBaseUrl + '/excelStore/storeImport'
  },
  //  发行商导入
  publisherImportUrl() {
    return this.apiBaseUrl + '/excelPublisher/publisherImport'
  },
  exhibitioncodeImportUrl() {
    return this.apiBaseUrl + '/excelExhibitionCode/exhibitionCodeImport'
  },
  formLabelPosition: 'left',
  uploadImageAccept: 'image/jpg,image/jpeg, image/png',
  uploadDocumentAccept: 'application/pdf, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/pgp-keys',
  uploadFileAccept: 'audio/mp4, video/mp4, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation',
  textAreaRows: 10,
  datePickerFormat: 'yyyy-MM-dd',
  datePickerValueFormat: 'yyyy-MM-dd 00:00:00',
  regexp: {
    // 汉字
    chinese: /^[\u4e00-\u9fa5]+$/,
    // 非汉字
    notChinese: /[\u4e00-\u9fa5]+/,
    // 手机号码
    phone: /^((1[3,5,8][0-9])|(14[5,7])|166|(17[0,3,5-8])|(19[7-9]))\d{8}$/
  },
  fileAccept: {
    excel: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
  }
}
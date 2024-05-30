/**
 * 文件上传功能封装， 继承自 simple-uploader.js
 */

import SimpleUploader from 'simple-uploader.js'
import Api from '@/api/index'
import config from '@/config'

function isElementNode(el) {
  return el && el.nodeType === 1
}
const defaultOptions = {
  target: `${config.apiBaseUrl}/file/multipartUpload`,
  testChunks: false,
  // singleFile: true,
  allowDuplicateUploads: true, // 允许上传同名文件
  query: (file) => ({ uploadId: file.uploadId, relativePath: file.objectName })
}

class Upload extends SimpleUploader {
  constructor({ triggerEle, dropEle, options = {} }) {
    super({ ...defaultOptions, ...options })
    this.subscribeEvents()
    if (isElementNode(triggerEle)) {
      const browseOption = options.browseOption || {}
      this.assignBrowse(
        triggerEle,
        browseOption.isDirectory,
        browseOption.singleFile,
        browseOption.attributes
      )
    }

    if (isElementNode(dropEle)) {
      this.assignDrop(dropEle)
    }
  }
  // 订阅事件
  subscribeEvents() {
    this.on('filesSubmitted', this.filesSubmitted)
    this.on('fileSuccess', this.fileUploaded)

    // 监听上传进度方法
    // this.on('fileProgress', this.fileProgress)
  }

  // 文件选择完成，调用开始上传接口
  async filesSubmitted(files) {
    let that = this
    const promises = files.map((file) => {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        let totalChunks = Math.floor(file.size / that.opts.chunkSize) || 1
        //校验中文文件名
        if (that.opts.verifyChinese) {
          let reg = /^[^\u4e00-\u9fa5]+$/
          if (!reg.test(file.name)) {
            reject('不支持上传中文文件名文件', file)
            return
          }
        }
        //判断限制视频或音频大小
        if (that.opts.maxUploadSize < totalChunks) {
          reject(`文件上传大小不超过${that.opts.maxUploadSize}M`, file)
          return
        }
        try {
          const { uploadId, objectName } = await Api.fileUploadMultipartInit({
            fileName: file.name
            // totalChunks
            // fileSize: file.size
          })
          file.uploadId = uploadId
          file.relativePath = objectName
          resolve()
        } catch (error) {
          reject(error, file)
        }
      })
    })
    console.log(promises)

    await Promise.all(promises)
      .then(() => {
        this.uploader.upload()
      })
      .catch((e) => {
        files.forEach(this.removeFile.bind(this))
        this._trigger('fileError', e)
      })
  }

  // 上传完成, 调用文件上传完毕接口并发布完成事件
  async fileUploaded(rootFile, file) {
    const objectName = file.relativePath
    const uploadId = file.uploadId
    const { fileName, fileUrl } = await Api.fileUploadMultipartComplete({
      objectName,
      uploadId
    })
    file.name = fileName
    file.url = fileUrl
    file.uploadStatus = 'done'
    this._trigger('fileUploaded', file)
  }
}

export default Upload

import Vue from 'vue'

import config from './config'
import filters from './filters'
import _ from './utils/lodash'
import enums from './utils/enums'
import utils from './utils'
import api from './api'
import dayjs from 'dayjs'
import { Loading } from 'element-ui'
import ajaxInstance from 'axios'
// import './utils/echarts'
// 引入vue-amap
import VueAMap from 'vue-amap'
// 引入echarts
import * as echarts from 'echarts'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

// 视频插件
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'

Vue.use(VueVideoPlayer)

Vue.prototype.$xlsx = XLSX
Vue.prototype.$fileSaver = FileSaver
Vue.prototype.$echarts = echarts
Vue.prototype.$config = config
Vue.prototype.$enums = enums
Vue.prototype.$filters = filters
Vue.prototype.$api = api
Vue.prototype.$_ = _
Vue.prototype.$utils = utils
Vue.prototype.$dayjs = dayjs
Vue.prototype.$bus = new Vue()
Vue.use(VueAMap)

// vue key对应安全密钥
window._AMapSecurityConfig = {
  securityJsCode: '104a6f766f03a6d649600d5b1fc35003'
}
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: 'fc4b089073bc9a790137305b8f4961e5',
  // 插件集合
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor'
  ],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4',
  uiVersion: '1.1.1'
})

// 全局注册过滤器
for (let key in filters) {
  Vue.filter(key, filters[key])
}
function doWhile(obj) {
  if (obj instanceof Object) {
    Object.keys(obj).map((key) => {
      if (key === 'childrenNodes') {
        obj['children'] = obj['childrenNodes']
        delete obj['childrenNodes']
      }
    })
  }

  if (obj['children'] instanceof Array && obj['children'].length) {
    obj['children'].map((it) => {
      doWhile(it)
    })
  }
}
/**
 *
 * @param {*} table
 * @param {*} callBack 用来知晓自动加载列表首次是否加载完成，true 代表有数据
 */
Vue.prototype.$search = async (table, callBack) => {
  if (table && table.api) {
    let query = _.cloneDeep(table.query) || {}
    for (let key in query) {
      if (query[key] === '') query[key] = null
    }
    
    if (!table.hidePagination) {
      query.pageNo = table.pagination.pageNo
      query.pageSize = table.pagination.pageSize || 10
    }else{
      if(table.showMore){
        query.pageNo = 1
        query.pageSize = 100000
      }
    }
    table.loading = true
    try {
      let data = await table.api(query)
      //修改权限数据源key
      if (table.changePermission) {
        data.map((it) => {
          doWhile(it)
        })
      }

      if (data.cityLevelClassifyItems) {
        data.records = data.cityLevelClassifyItems
      }

      if (data instanceof Array) {
        table.data = data
      } else {
        if (table.changePermission) {
          table.data = data
        } else {
          table.data = data.records
        }
        table.pagination.total = data.total
      }
      if (table.relevantData) {
        let relevantData = await table.relevantApi()
        table.pagination.relevantData = relevantData
      }

      if (callBack) callBack(data.records.length > 0)
    } catch (e) {
      if (callBack) callBack(false)
    }
    table.loading = false
  }
}

Vue.prototype.$exportFileStream = (obj) => {
  let loading
  if (obj.el) {
    loading = Loading.service({
      target: obj.el,
      text: obj.noText ? null : obj.text || '拼命加载中...'
    })
  }

  return new Promise((resolve, reject) => {
    ajaxInstance
      .post(obj.url, (obj.query = obj.query || {}), {
        responseType: 'blob'
      })
      .then((res) => {
        obj.el && loading && loading.close()
        resolve(res)
      })
      .catch((err) => {
        loading && loading.close()
        reject(err)
      })
  })
}

Vue.prototype.$powers = (code) => {
  let { buttonList } = JSON.parse(sessionStorage.getItem('permission'))
  if (buttonList !== null && buttonList.length > 0) {
    for (let item of buttonList) {
      if (item.authCode === code) {
        return true
      }
    }
  }
}

/**
 * 从表生成工作簿对象
 * @param {*} tableName  表格名
 * @param {*} projectName  导出文件名
 * @returns
 */
Vue.prototype.$exportExcel = async (tableName, projectName) => {
  var fix = document.querySelector('.el-table__fixed')
  var wb
  if (fix) {
    wb = XLSX.utils.table_to_book(
      document.querySelector(`#${tableName}`).removeChild(fix)
    )
    document.querySelector(`#${tableName}`).appendChild(fix)
  } else {
    wb = XLSX.utils.table_to_book(document.querySelector(`#${tableName}`))
  }

  /* 获取二进制字符串作为输出 */
  var wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })
  try {
    FileSaver.saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      //设置导出文件名称
      `${projectName}.xlsx`
    )
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, wbout)
  }
  return wbout
}

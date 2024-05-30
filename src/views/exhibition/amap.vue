<template>
  <div id="app">
    <el-input
      v-model="searchKey"
      type="search"
      id="searchs"
      style="width: 375px"
      @input="onInputSearch"
      placeholder="请输入关键字进行搜索"
    />
    <div class="tip-box" id="searchTip"></div>
    <div class="amap-page-container" v-show="false">
      <div class="toolbar">当前坐标: {{ lng }}, {{ lat }}</div>
      <el-amap
        vid="amapDemo"
        :center="center"
        :zoom="zoom"
        class="amap-demo"
        :events="events"
        pitch-enable="false"
        :amap-manager="amapManager"
      >
        <!-- <el-amap-marker
          v-for="(marker, index) in markers"
          :key="index"
          :events="marker.events"
          :position="marker.position"
        /> -->
        <el-amap-info-window
          v-if="window"
          :position="window.position"
          :visible="window.visible"
          :content="window.content"
          :offset="window.offset"
          :close-when-click-map="true"
          :is-custom="true"
        >
          <div id="info-window">
            <p>{{ window.address }}</p>
          </div>
        </el-amap-info-window>
      </el-amap>
    </div>
  </div>
</template>

<script>
import VueAMap, { lazyAMapApiLoaderInstance } from 'vue-amap'

let amapManager = new VueAMap.AMapManager()
export default {
  name: 'AmapPage',
  props: {
    dateAddress: {
      type: Object,
      default: () => {}
    }
  },
  data: function () {
    const self = this
    return {
      amapManager,
      data: [],
      zoom: 10,
      center: [113.645422, 34.730936],
      markers: [],
      windows: [],
      window: '',
      events: {
        init () {
          lazyAMapApiLoaderInstance.load().then(() => {
            self.initSearch()
          })
        },
        click (e) {
          const { lng, lat } = e.lnglat
          self.lng = lng
          self.lat = lat
          self.$nextTick(() => {
            self.pointChange()
          })
        }
      },
      lng: 0,
      lat: 0,
      poiPicker: null,
      searchKey: null,
      /* 一些工具插件 */
      test: null,
      plugin: [
        {
          pName: 'DistrictSearch',
          events: {
            init (o) {
            }
          }
        },
        {
          // 定位
          pName: 'Geolocation',
          events: {
            init (o) {
              // o是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  // 设置经度
                  self.lng = result.position.lng
                  // 设置维度
                  self.lat = result.position.lat
                  // 设置坐标
                  self.center = [self.lng, self.lat]
                  self.markers.push([self.lng, self.lat])
                  // load
                  self.loaded = true
                  // 页面渲染好后
                  self.$nextTick()
                }
              })
            }
          }
        },
        {
          // 工具栏
          pName: 'ToolBar',
          events: {
            init (instance) {
            }
          }
        },
        {
          // 鹰眼（暂且没用到）
          pName: 'OverView',
          events: {
            init (instance) {
            }
          }
        },
        {
          // 地图类型
          pName: 'MapType',
          defaultType: 0,
          events: {
            init (instance) {
            }
          }
        },
        {
          // 搜索（暂且没用到）
          pName: 'PlaceSearch',
          events: {
            init (instance) {
            }
          }
        }
      ]
    }
  },
  mounted () {
    this.point()
  },
  methods: {
    onInputSearch(event){
      if(!event.length){
        this.$emit('update:dateAddress')
      }
    },
    point () {
      const markers = []
      const windows = []
      const that = this
      this.data.forEach((item, index) => {
        markers.push({
          position: item.position.split(','),
          // icon:item.url, //不设置默认蓝色水滴
          events: {
            click () {
              // 方法：鼠标移动到点标记上，显示相应窗体
              that.windows.forEach((window) => {
                window.visible = false // 关闭窗体
              })
              that.window = that.windows[index]
              that.$nextTick(() => {
                that.window.visible = true
              })
            }
          }
        })
        
        windows.push({
          position: item.position.split(','),
          isCustom: true,
          offset: [115, 55], // 窗体偏移
          showShadow: false,
          visible: false, // 初始是否显示
          address: item.address
        })
      })
      //  加点
      this.markers = markers
      // 加弹窗
      this.windows = windows
    },
    pointChange () {
      this.data = [
        {
          address: '',
          position: `${this.lng},${this.lat}`
        }
      ]
      this.point()
    },
    initSearch () {
      const vm = this
      const map = this.amapManager.getMap()
      AMapUI.loadUI(['misc/PoiPicker'], function (PoiPicker) {
        let poiPicker = new PoiPicker({
          input: 'searchs'
        })
        vm.poiPicker = poiPicker
        // 监听poi选中信息
        poiPicker.on('poiPicked', function (poiResult) {
          const source = poiResult.source
          const poi = poiResult.item

          if (source !== 'search') {
            poiPicker.searchByKeyword(poi.name)
          } else {
            poiPicker.clearSearchResults()
            vm.markers = []
            const lng = poi.location.lng
            const lat = poi.location.lat
            const address = poi.pname + poi.cityname + poi.adname + poi.address
            vm.center = [lng, lat]
            vm.lng = lng
            vm.lat = lat
            vm.address = address
            vm.searchKey = address
            vm.$emit('update:dateAddress', poi)
          }
        })
      })
    },
    searchByHand (query) {
      if (this.searchKey !== '') {
        this.poiPicker.searchByKeyword(this.searchKey)
      }
      if (query !== '') {
        this.poiPicker.searchByKeyword(this.searchKey)
      }
    },
    setsearchKey (query) {
      this.searchKey = query
    }
  }
}
</script>

<style scoped>
.amap-demo {
  height: 120vh;
}

.amap-page-container {
  position: relative;
}

#info-window {
  width: 211px;
  height: 146px;
  margin-left: 30px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.detail {
  width: 100%;
  height: 24px;
  color: #fff;
  background-color: #1a73e8;
  position: absolute;
  bottom: 0;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
}
</style>

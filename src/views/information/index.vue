<template>
  <div class="container">
    <div class="container-topBarBox">
      <div
        class="container-topBarBox-menu"
        :style="current === item.value ? 'color: #3978F7' : 'color: #999'"
        v-for="item in tabs"
        :key="item.value"
        @click="onChangeTab(item.value)"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="container-totalBox">总数据</div>
    <div class="container-openBox">开本数与收入</div>
    <div class="container-searchBox">
      <div class="container-searchBox-caledar">
        <div class="container-searchBox-caledar-box">
          <el-date-picker
            v-model="value"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            unlink-panels
            :picker-options="pickerOptions"
            @change="onChangePicker"
            :clearable="false"
          >
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="container-incomeBox">
      <div class="container-incomeBox-item">
        <img src="@/assets/images/total-income.png"/>
        <span>累计总收入：</span>
        <span>{{income/100}}元</span>
      </div>
      <div class="container-incomeBox-item">
        <img src="@/assets/images/total-openCount.png"/>
        <span>累计总场次：</span>
        <span>{{openCount}}场</span>
      </div>
    </div>
    <div class="container-chartsBox">
      <div class="container-chartsBox-charts" id="charts"></div>
    </div>
    <div style="color:#9E9E9E;padding-top: 50px">日：在所选日期范围内，累计到每日的总收入（包含票房本开本订单，票房本组局订单，票房本申领订单）（订单状态为已完成+已结算）</div>
  </div>
</template>
<script>
import mixinData from './mixin.js'
export default {
  components: {},
  mixins: [mixinData],
  data() {
    const vm = this
    return {
      value: null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 1 * 24 * 60 * 60 * 1000
        },
        shortcuts: [
          {
            text: '最近7天',
            onClick(picker) {
              const end = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近30天',
            onClick(picker) {
              const end = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近90天',
            onClick(picker) {
              const end = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近半年',
            onClick(picker) {
              const end = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      searchObj: {
        beginDate: '',
        endDate: ''
      },
      tabs: [
        { label: '票房本数据', value: 1 },
        { label: '店铺画像', value: 2 }
      ],
      current: 1
    }
  },
  created() {
    this.getDefaultDays()
  },
  mounted() {
    this.$nextTick(async (_) => {
      //预绘制
      this.drawLine('charts')
      //加载数据
      this.refreshData();
    })
  },
  methods: {
    //获取默认60天的日期
    getDefaultDays() {
      var sixty = new Date()
      var nowDate = new Date()
  
      nowDate.setDate(nowDate.getDate() - 1)
      sixty.setDate(sixty.getDate() - 7)

      this.searchObj.beginDate = this.$dayjs(sixty).format('YYYY-MM-DD')
      this.searchObj.endDate = this.$dayjs(nowDate).format('YYYY-MM-DD')
      this.value = [this.searchObj.beginDate, this.searchObj.endDate]
    },
    onChangePicker(e) {
      if(e){
        this.searchObj.beginDate = this.$dayjs(e[0]).format('YYYY-MM-DD')
        this.searchObj.endDate = this.$dayjs(e[1]).format(`YYYY-MM-DD`)
      }else{
        this.searchObj.beginDate = null;
        this.searchObj.endDate = null;
      }
      this.refreshData();
    },
    onChangeTab(v) {
      this.current = v
    },
    async refreshData(){
      await this.queryTicketData()
    }
  }
}
</script>
<style>
.el-date-editor {
  border: none !important;
}
.el-date-editor {
  padding: 0 !important;
  width: 220px !important;
}
</style>
<style lang="sass" scoped>
.container
  position: relative
  &-topBarBox
    width: 100%
    height: 44px
    border-radius: 8px
    box-shadow: 0px 0px 4px 0px rgba(191,191,191,0.5)
    @include hor
    align-items: center
    &-menu
      font-size: 14px
      margin-left: 30px
      font-weight: 500
      cursor: pointer
  &-totalBox
    width: 280px
    height: 36px
    background: #3978F7
    @include hor-center-center
    color: #fff
    margin-top: 10px
  &-openBox
    width: 147px
    height: 33px
    background: #3978F7
    border-radius: 20px
    @include hor-center-center
    color: #fff
    margin-top: 10px
  &-searchBox
    @include hor
    align-items: center
    &-caledar
      background: #fff
      width: 270px
      height: 40px
      font-size: 12px
      border-radius: 8px
      box-shadow: 0px 0px 4px 0px rgba(191,191,191,0.5)
      @include hor-center-center
      margin-top: 10px
      overflow: hidden
      cursor: pointer

      &-box
        width: 220px
      &-arrow
        width: 14px
        height: 14px
  &-incomeBox
    margin-top: 50px
    color: #3662EC
    @include hor
    align-items: center
    &-item
      @include hor
      align-items: center
      img
        width: 32px
        height: 32px
      span:nth-child(2)
        margin-left: 10px
        font-size: 14px
        font-family: PingFangSC-Regular, PingFang SC
        font-weight: 400
        color: #BBBBBB
        line-height: 20px
      span:nth-child(3)
        margin-left: 5px
        font-size: 14px
        font-family: PingFangSC-Regular, PingFang SC
        font-weight: 400
        color: #191919
        line-height: 20px
    &-item:nth-child(2)
      margin-left: 60px
  &-chartsBox
    background: #fff
    margin: 50px 20px 0 20px
    border-radius: 10px
    &-charts
      height: 300px
</style>
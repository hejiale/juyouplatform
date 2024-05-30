<template>
  <div class="search-box" v-if="!$_.isEmpty(searchData)">
    <div class="search-box-bar">
      <div
        class="form"
        v-for="(item, idx) in searchDataIsVisible"
        :key="idx"
        v-show="!item.isHide"
      >
        <span class="text">{{ item.title }}</span>
        <template v-if="item.type === 'select'">
          <el-select
            v-model="query[item.model]"
            :style="{ width: item.width }"
            clearable
            @change="doSearch()"
          >
            <el-option
              v-for="i in item.enumType
                ? $enums[item.enumType].list
                : item.option"
              :label="i.label"
              :value="i.value"
              :key="i.value"
            />
          </el-select>
        </template>
        <template v-if="item.type === 'selectBool'">
          <el-select
            v-model="query[item.model]"
            :style="{ width: item.width }"
            clearable
            @change="onChangeBool"
          >
            <el-option
              v-for="i in item.enumType
                ? $enums[item.enumType].list
                : item.option"
              :label="i.label"
              :value="i.value"
              :key="i.value"
            />
          </el-select>
        </template>
        <template v-if="item.type === 'selectPlayer'">
          <el-select
            v-model="gamePlayer"
            :style="{ width: item.width }"
            clearable
            @change="(value) => doChangePlayer(value, item)"
          >
            <el-option
              v-for="i in item.enumType
                ? $enums[item.enumType].list
                : item.option"
              :label="i.label"
              :value="i.value"
              :key="i.value"
            />
          </el-select>
        </template>
        <template v-if="item.type === 'selectMemberPackage'">
          <el-select
            v-model="query[item.model]"
            :style="{ width: item.width }"
            clearable
            :disabled="query[searchDataIsVisible[idx - 1].model]"
            @change="doSearch()"
          >
            <el-option
              v-for="i in item.option"
              :label="i.label"
              :value="i.value"
              :key="i.value"
            />
          </el-select>
        </template>
        <template v-else-if="item.type === 'selectNew'">
          <el-select
            v-model="query[item.model]"
            :style="{ width: item.width }"
            clearable
            @change="doSearch()"
          >
            <el-option
              v-for="i in item.enumType
                ? $newEnums[item.enumType].list
                : item.option"
              :label="i.label"
              :value="i.value"
              :key="i.value"
            />
          </el-select>
        </template>
        <template v-else-if="item.type === 'selectArr'">
          <el-select
            v-model="query[item.model]"
            :style="{ width: item.width }"
            multiple
            filterable
            remote
            clearable
            @change="doSearch()"
          >
            <el-option
              v-for="i in item.enumType
                ? $newEnums[item.enumType].list
                : item.option"
              :label="i.label"
              :value="i.value"
              :key="i.value"
            />
          </el-select>
        </template>
        <template v-else-if="item.type === 'customSelect'">
          <el-select
            v-model="query[item.model]"
            :style="{ width: item.width }"
            clearable
            @change="doSearch()"
          >
            <el-option
              v-for="i in item.options"
              :label="i.label"
              :value="i.value"
              :key="i.value"
            />
          </el-select>
        </template>
        <template v-else-if="item.type === 'input'">
          <el-input
            v-model="query[item.model]"
            v-show="!item.isHide"
            :type="item.typeStyle || 'text'"
            :placeholder="item.placeholder"
            @keyup.enter.native="doSearch()"
          />
        </template>
        <template v-else-if="item.type === 'inputRulesStore'">
          <el-input
            v-model="query[item.model]"
            v-show="!item.isHide"
            :type="item.typeStyle || 'text'"
            :placeholder="item.placeholder"
            @keyup.enter.native="doSearch()"
            :disabled="
              query[searchDataIsVisible[idx - 1].model] == 'STORE'
                ? false
                : true
            "
          />
        </template>
        <template v-else-if="item.type === 'inputRulesUser'">
          <el-input
            v-model="query[item.model]"
            v-show="!item.isHide"
            :type="item.typeStyle || 'text'"
            :placeholder="item.placeholder"
            @keyup.enter.native="doSearch()"
            :disabled="
              query[searchDataIsVisible[idx - 2].model] == 'USER' ? false : true
            "
          />
        </template>
        <template v-else-if="item.type === 'cascader'">
          <el-cascader
            v-model="areaId"
            @change="(value) => cascaderChange(value, item)"
            :options="item.option"
            :props="item.props"
            :placeholder="item.placeholder"
            :show-all-levels="!item.hideAllLevels"
            clearable
          ></el-cascader>
        </template>
        <template v-else-if="item.type === 'dateSection'">
          <el-date-picker
            v-model="date"
            type="daterange"
            unlink-panels
            @change="(value) => dateChange(value, item, 'daterange')"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </template>
        <template v-else-if="item.type === 'dateSectionTwo'">
          <el-date-picker
            v-model="dateTwo"
            type="daterange"
            unlink-panels
            @change="(value) => dateChange(value, item, 'daterange')"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </template>
        <template v-else-if="item.type === 'date'">
          <el-date-picker
            v-model="query[item.model]"
            type="date"
            unlink-panels
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd 00:00:00"
            @change="(value) => dateChange(value, item, 'date')"
          ></el-date-picker>
        </template>
      </div>
      <div class="form">
        <el-button
          type="primary"
          v-for="item in moreButton"
          :key="item.id"
          @click="doMoreMethod(item.id)"
          :disabled="disabled"
          >{{ item.name }}</el-button
        >
        <el-button type="primary" @click="doSearch()" :disabled="disabled"
          >查询</el-button
        >
        <el-button type="info" plain @click="doReset" :disabled="disabled"
          >重置</el-button
        >
        <slot name="ctrl-btn-after" />
      </div>
    </div>
    <!-- <span class="ctrl-form">
      <slot name="after" />
    </span> -->
    <!-- <span class="ctrl-btn">
      <el-button
        type="primary"
        v-for="item in moreButton"
        :key="item.id"
        @click="doMoreMethod(item.id)"
        :disabled="disabled"
        >{{ item.name }}</el-button
      >
      <el-button type="primary" @click="doSearch()" :disabled="disabled"
        >查询</el-button
      >
      <el-button type="info" plain @click="doReset" :disabled="disabled"
        >重置</el-button
      >
      <slot name="ctrl-btn-after" />
    </span> -->
  </div>
</template>

<script>
export default {
  props: {
    searchData: {
      type: Array,
      default() {
        return []
      }
    },
    query: {
      type: Object,
      default() {
        return {}
      }
    },
    moreButton: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    searchDataIsVisible() {
      return this.searchData.filter((t) => !t.hide)
    }
  },
  data() {
    return {
      // 多选日期
      date: [],
      dateTwo: [],
      areaId: [],
      params: this.$_.cloneDeep(this.query),
      gamePlayer: null
    }
  },
  methods: {
    doChangePlayer(event, item) {
      let minGame = 0;
      let maxGame = 0;

      if(event === 4){
        minGame = 4;
        maxGame = 0;
      }else if(event === 9){
        minGame = null;
        maxGame = 9;
      }else{
        minGame = event;
        maxGame = event;
      }
      this.query[item.modelName[0]] = minGame;
      this.query[item.modelName[1]] = maxGame;
      this.doSearch()
    },
    doSearch(params) {
      this.$emit('on-search-change', params)
    },
    onChangeBool(val){
      this.query['lpMembershipPackageId'] = null;
      this.doSearch()
    },
    doReset() {
      this.date = []
      this.dateTwo = []
      this.areaId = []
      this.doSearch(this.params)
    },
    // cascader 值改变的时候
    cascaderChange(val, item) {
      console.log(this.query)
      if (val.length) {
        this.query[item.modelName[0]] = val[0]
        if (item.modelName.length === 2) {
          this.query[item.modelName[1]] = val[1]
        }
      } else {
        this.query[item.modelName[0]] = null
        if (item.modelName.length === 2) {
          this.query[item.modelName[1]] = null
        }
      }
      this.doSearch()
    },
    // 日期选择控件切换的回调
    dateChange(val, item, type) {
      if (type === 'daterange') {
        if (val === null) {
          this.query[item.modelName[0]] = this.query[item.modelName[1]] = null
        } else {
          this.query[item.modelName[0]] = this.$dayjs(val[0]).format(
            'YYYY-MM-DD 00:00:00'
          )
          this.query[item.modelName[1]] = this.$dayjs(val[1]).format(
            'YYYY-MM-DD 23:59:59'
          )
        }
      } else if (type === 'date') {
        if (val === null) {
          this.query[item.model] = null
        } else {
          this.query[item.model] = this.$dayjs(val).format(
            'YYYY-MM-DD 00:00:00'
          )
        }
      }
      this.doSearch()
    },
    // 日期单选控件切换的回调
    dateSingeChange(val, item) {
      this.query[item.model] = val
        ? this.$dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        : null
    },
    doMoreMethod(id) {
      this.$emit('on-more-method', id)
    }
  },
  mounted() {
    for (let i = 0; i < this.searchData.length; i++) {
      if (this.searchData[i].type === 'dateSection') {
        this.date = [this.searchData[i].startDate, this.searchData[i].endDate]
      } else if (this.searchData[i].type === 'dateSectionTwo') {
        this.dateTwo = [
          this.searchData[i].startDate,
          this.searchData[i].endDate
        ]
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.search-box
  margin-bottom: 20px
  background-color: #fff
  border-radius: 8px
  box-shadow: 4px 4px 10px 0 rgba(231,231,231, 0.14)
  padding-left: $primaryGap
  @include clearfix
  position: relative
  &-bar
    // width: 85%
.text
  display: inline-block
  margin-right: 16px
  font-size: 14px
  font-family: PingFang SC-Regular, PingFang SC
  font-weight: 400
  color: rgba(0,0,0,0.9)
.form
  display: inline-block
  margin: 0 $primaryGap $primaryGap 0
  vertical-align: top
  .el-input,.el-select,.el-input__inner
    width: 240px
.ctrl-btn
  // position: absolute
  // right: 0
  // top: 16px
</style>

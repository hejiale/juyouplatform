<template>
  <div>
    <search-bar
      :query="table.query"
      :search-data="table.searchData"
      :moreButton="table.moreButton"
      :disabled="table.disabled"
      @on-search-change="searchChange"
      @on-more-method="onMoreMethod"
    >
      <span slot="after">
        <slot name="ctrl-special"></slot>
      </span>
      <template slot="ctrl-btn-after">
        <slot name="ctrl-after"></slot>
      </template>
    </search-bar>
    <slot name="middle-element"></slot>
    <div class="my-table">
      <div class="my-table__header">
        <slot name="table-content__header"></slot>
      </div>
      <div
        class="my-table_span"
        v-if="table.showSpan"
        style="display: flex; padding-bottom: 10px"
      >
        <span class="text">{{ table.title }}</span>
      </div>
      <div class="my-table__top" v-if="!table.hidenTitle">
        <span class="text">{{!hideTableTitle ? '数据列表':''}}</span>
        <span class="customText" v-if="table.customTopTitle">{{
          topTitle
        }}</span>
        <div class="my-table__top_right">
          <slot name="buttons"></slot>
        </div>
        <!-- <div class="my-table__tr">
          <div v-if="table.apply && table.pagination.relevantData">
            <span style="color: #8c9aa3; margin-left: 40px">全部：</span
            >{{ table.pagination.total || tableTotal }}
          </div>
          <div v-if="table.apply && table.pagination.relevantData">
            <span style="color: #8c9aa3; margin-left: 40px">已上架：</span
            >{{ table.pagination.relevantData.isPutOnCount || 0 }}
          </div>
          <div v-if="table.apply && table.pagination.relevantData">
            <span style="color: #8c9aa3; margin-left: 40px">可申领：</span
            >{{ table.pagination.relevantData.startStatusCount || 0 }}
          </div>
          <div v-if="table.isDeliverStatus && table.pagination.relevantData">
            <span style="color: #8c9aa3; margin-left: 40px">待发货：</span
            >{{ table.pagination.relevantData.waitDeliveredCount || 0 }}
          </div>
          <div v-if="table.isDeliverStatus && table.pagination.relevantData">
            <span style="color: #8c9aa3; margin-left: 40px">已发货：</span
            >{{ table.pagination.relevantData.deliveredCount || 0 }}
          </div>

          <slot name="ctrl-trBtn"></slot>
        </div> -->
      </div>
      <el-table
        :id="table.id"
        ref="multipleTable"
        style="width: 100%"
        :data="table.data"
        v-loading="table.loading"
        :element-loading-text="table.loadingText || '数据加载中...'"
        @selection-change="handleSelectionChange"
        @select="selectionDate"
        :default-expand-all="table.defaultExpandAll"
        :tree-props="{
          children: table.childrenName || 'children',
          hasChildren: 'hasChildren'
        }"
        :row-class-name="({ row }) => row.id"
        :row-key="table.hasKeys ? table.hasKeys : 'id'"
        @expand-change="expandChange"
        highlight-current-row
        @current-change="handleCurrentChange"
        :default-sort="{ prop: defaultSort }"
        @sort-change="changeSort"
        :border="table.border"
      >
        <el-table-column
          type="index"
          width="50"
          :align="'center'"
          v-if="table.columns && table.columns.some((t) => t.type === 'index')"
        >
        </el-table-column>
        <el-table-column
          type="selection"
          width="50"
          v-if="
            table.columns && table.columns.some((t) => t.type === 'selection')
          "
          reserve-selection
        >
        </el-table-column>
        <el-table-column
          type="expand"
          v-if="table.isExpand"
          :key="Math.random()"
        >
          <template slot-scope="scope">
            <slot name="table-expand" :scope="scope.row"></slot>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(column, idx) in table.columns.filter(
            (t) => t.type !== 'selection' && t.type !== 'index' && !t.isHide
          )"
          :prop="defaultSort"
          :key="idx"
          :type="column.type"
          :label="column.title"
          :width="column.width"
          :fixed="column.fixed"
          :align="column.align || 'center'"
          :show-overflow-tooltip="column.showTooltip"
          :sortable="column.isSortable"
        >
          <template
            v-if="column.type !== 'selection' && column.type !== 'index'"
            slot-scope="scope"
          >
            <cell
              v-if="column.render"
              :column="column"
              :row="scope.row"
              :index="scope.$index"
              :render="column.render"
            >
            </cell>
            <template v-else-if="column.renderChildren">
              <span>{{ scope.row.data[column.key] }}</span>
            </template>
            <span v-else-if="column.isImage">
              <div
                v-if="
                  typeof scope.row[column.key] === 'string' &&
                  scope.row[column.key]
                "
              >
                <el-image
                  :src="scope.row[column.key]"
                  class="table-img"
                  fit="scale-down"
                  @click="viewAdImg(scope.row[column.key])"
                ></el-image>
              </div>
              <div
                v-else-if="scope.row[column.key] && scope.row[column.key][0]"
              >
                <div>
                  <el-image
                    :src="scope.row[column.key][0]"
                    class="table-img"
                    fit="scale-down"
                    @click="viewAdImg(scope.row[column.key])"
                  >
                  </el-image>
                  <div
                    class="table-img__maskinglayer"
                    v-if="scope.row[column.key].length > 1"
                    @click="viewAdImg(scope.row[column.key])"
                  >
                    <span class="table-img__maskinglayer--num">{{
                      '+' + scope.row[column.key].length
                    }}</span>
                  </div>
                </div>
              </div>
              <div v-else>暂无</div>
            </span>
            <span
              v-else-if="column.isHtml"
              v-html="scope.row[column.key]"
            ></span>
            <span v-else>
              <span v-if="column.filter" class="my-table-text">{{
                $filters[column.filter](scope.row[column.key])
              }}</span>
              <span v-if="column.enumType" class="my-table-text" :style="column.isPointer ? 'cursor: pointer;':''">{{
                $enums[column.enumType].getName(scope.row[column.key]) || '—'
              }}</span>
              <span
                v-if="!column.filter && !column.enumType"
                class="my-table-text"
                >{{
                  scope.row[column.key]
                    ? scope.row[column.key]
                    : scope.row[column.key] === 0
                    ? '0'
                    : '—'
                }}</span
              >
            </span>
          </template>
          <cell
            v-else
            :column="column"
            :row="scope.row"
            :index="scope.$index"
            :render="column.render"
          ></cell>
        </el-table-column>
      </el-table>
      <div
        class="my-table-bottomBox"
        v-if="table.pagination && isShowPagination"
      >
        <div v-if="!table.showNum">
          <span style="color: #d9d9d9"></span>共
          {{ table.pagination.total || 0 }} 项数据
        </div>
        <el-pagination
          class="pagination"
          background
          layout="sizes, prev, pager, next, jumper"
          :page-size="table.pagination.pageSize || 10"
          :page-sizes="[10, 20, 50, 100]"
          :current-page.sync="table.pagination.pageNo"
          :total="table.pagination.total"
          @current-change="currentChange"
          @size-change="handleSizeChange"
          v-if="showPageSize"
        ></el-pagination>
        <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          :current-page.sync="table.pagination.pageNo"
          :total="table.pagination.total"
          @current-change="currentChange"
          v-else
        ></el-pagination>
      </div>
      <image-dialog
        :show.sync="dialogImageVisible"
        :dialogImageUrl="dialogImageUrl"
        :dialogImageUrlList="dialogImageUrlList"
      />
    </div>
  </div>
</template>

<script>
import cell from './cell'
import SearchBar from './search-bar'
import ImageDialog from '@partial/image-dialog'

export default {
  components: {
    cell,
    SearchBar,
    ImageDialog
  },
  props: {
    table: {
      type: Object,
      required: true
    },
    isAutoLoad: {
      type: Boolean,
      default: true
    },
    isShowPagination: {
      type: Boolean,
      default: true
    },
    hideTableTitle: {
      type: Boolean,
      default: false
    },
    topTitle: {
      type: String,
      default: ''
    },
    stripe: {
      type: Boolean,
      default: true
    },
    defaultSort: {
      type: String,
      default: ''
    },
    showPageSize: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      params: {},
      dialogImageVisible: false,
      dialogImageUrl: null,
      dialogImageUrlList: [],
      tableTotal: null,
      relevantData: null
    }
  },
  created() {
    this.$set(this.table, 'loading', false)
    if (!this.table.hidePagination) {
      this.$set(this.table, 'pagination', {
        pageNo: 1,
        total: 0
      })
    }
  },
  activated() {
    let that = this
    this.$refs.multipleTable.setCurrentRow()
  
    this.params = this.$_.cloneDeep(this.table.query)
    if (this.isAutoLoad) {
      this.$search(this.table, function (hasList) {
        that.$emit('on-complete-load', hasList)
      })
    }
  },
  watch: {
    table: {
      handler(newData) {
        if (this.table.tableTotal && newData && newData.data) {
          this.tableTotal = newData.data.length
        }
      },
      deep: true
    }
  },
  methods: {
    // async getRelevantData() {
    //   if (this.table.relevantData) {
    //     this.relevantData =
    //       await this.$api.boxDramaDeliverQueryBoxDramaApplyBiCount()
    //   }
    // },
    update() {
      this.$nextTick((_) => {
        this.$forceUpdate()
      })
    },
    viewAdImg(url) {
      if (typeof url === 'string') {
        this.dialogImageUrl = url
        this.dialogImageUrlList = []
      } else {
        this.dialogImageUrl = null
        this.dialogImageUrlList = url
      }
      this.dialogImageVisible = true
    },
    currentChange() {
      this.$search(this.table)
    },
    expandChange(row, expandedRows) {
      if (expandedRows && expandedRows.length > 1) {
        this.$refs.multipleTable.toggleRowExpansion(expandedRows[0], [
          expandedRows[0]
        ])
      }
      this.$emit('expandChange', row)
    },
    setExpand(row, expanded) {
      this.$refs['multipleTable'].toggleRowExpansion(row, expanded)
    },
    handleSelectionChange(val) {
      this.$emit('on-selection-change', val)
    },
    handleCurrentChange(val) {
      this.$emit('selectCurrentRow', val)
    },
    selectionDate(selection, row) {
      this.$emit('select', selection, row)
    },
    refresh() {
      // this.table.query = this.$_.cloneDeep(this.params)
      // this.getRelevantData()
      let that = this;
      that.table.data = [];
      that.$set(this.table, 'pagination', {
        pageNo: 1,
        total: 0
      })
      that.$search(that.table, function (hasList) {
        that.$emit('on-complete-load', hasList)
      })
    },
    handleSizeChange(val) {
      this.table.pagination.pageSize = val
      this.$search(this.table)
    },
    searchChange(params) {
      if (params && !this.table.unReset) {
        this.table.query = this.$_.cloneDeep(params)
      } else if (this.table.unReset && params) {
        let unResetorparams = this.$_.cloneDeep(params)
        unResetorparams[this.table.unReset] =
          this.table.query[this.table.unReset]
        this.table.query = unResetorparams
      }
      this.table.pagination.pageNo = 1
      // this.getRelevantData()
      this.$search(this.table)
      this.$emit('on-enter-search')
    },
    onMoreMethod(id) {
      this.$emit('moreMethod', id)
    },
    changeSort(val) {
      // if (val.prop == 'score') {
      if (val.order == 'ascending') {
      } else if (val.order == 'descending') {
      } else {
      }
      // }
    }
  }
}
</script>
<style>
.el-table__empty-block{
  width: auto !important;
}
</style>
<style lang="sass">
.my-table
  padding: $primaryGap
  background-color: #fff
  &-text
    color: rgba(0, 0, 0, 0.9)
    font-size: 14px
  &-bottomBox
    @include hor-between-center
  &__tr
    @include hor-start-center
    .el-button
      margin-left: $primaryGap
  &__top
    @include hor-between-center
    padding-bottom: $primaryGap
    .text
      font-size: $font-large
      font-weight: bold
      // padding-left: 12px
      position: relative
      // &:before
      //   content: ''
      //   display: block
      //   width: 4px
      //   height: 18px
      //   background-color: $primaryColor
      //   position: absolute
      //   left: 0
      //   top: 3px
      //   border-radius: 20px
    .customText
      font-size: 14px
      font-family: OPPOSans-Regular, OPPOSans
      font-weight: 400
      color: #727272
      line-height: 23px
    &_right

  .el-table__header .el-table__cell
    // background-color: #ECEEF2
    font-size: 14px
    color: rgba(0, 0, 0, 0.4)
  .pagination
    text-align: center
    padding: 32px 0
.table-img__maskinglayer
  position: absolute
  // width: 70%
  // height: 80%
  // left: 15%
  // top: 10%
  width: 65px
  height: 65px
  top: 50%
  left: 50%
  transform: translateX(-50%) translateY(-50%)
  background: rgba(0,0 ,0 ,0.3 )
  z-index: 999
  cursor: pointer
  &--num
    font-size: 20px
    color: #fff
    position: absolute
    top: 50%
    left: 50%
    transform: translateX(-50%) translateY(-50%)
</style>

<template>
  <div>
    <yc-table :table="table" ref="myTable">
      <template
        slot="buttons"
        v-if="$powers('/publish/addPublisher')"
      >
        <div class="base-topBtn">
          <el-button type="primary" @click="doAdd">添加发行</el-button>
        </div>
      </template>
      <template slot-scope="props" slot="copyCodetext">
        <button
          @click="copyCode"
          :data-clipboard-text="props"
          id="copyCodetext"
          class="copyButton textTable"
          ref="copy"
        >
          {{ props }}
        </button>
      </template>
      <template slot="city" slot-scope="props">
        <span>{{ props.provinceName }}-{{ props.cityName }}</span>
      </template>
      <template slot="status" slot-scope="props">
        <span
          :class="
            props === 'ENABLED'
              ? 'table-row-status-enable'
              : 'table-row-status-disable'
          "
          >{{ $enums.EnableStatus.getName(props) }}</span
        >
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="doDetail(props.id, 'base')" v-if="$powers('/publish/updatePublisher')"
          >编辑</el-button
        >
        <el-button
          type="text"
          @click="doDetail(props.id, 'team')"
          v-if="$powers('/publish/getPublisherTeam')"
          >团队管理</el-button
        >
        <el-button
          type="text"
          @click="doOperate(props.id, 'DISABLED')"
          v-if="
            props.publisherStatus === 'ENABLED' &&
            $powers('/publish/updatePublisherStatus')
          "
          >停用</el-button
        >
        <el-button
          v-if="
            props.publisherStatus === 'DISABLED' &&
            $powers('/publish/updatePublisherStatus')
          "
          type="text"
          @click="doOperate(props.id, 'ENABLED')"
          >启用</el-button
        >
      </template>
    </yc-table>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
export default {
  components: {},
  data(vm) {
    return {
      table: {
        api: this.$api.publisherQueryPublisherPage,
        query: {},
        searchData: [
          {
            title: '对外编号',
            type: 'input',
            model: 'publisherNumber',
            placeholder: '请输入'
          },
          {
            title: '发行工作室',
            type: 'input',
            model: 'publisherNameKeyword',
            placeholder: '请输入'
          },
          {
            title: '所在城市',
            type: 'cascader',
            modelName: ['cityId'],
            option: [],
            props: {
              checkStrictly: true,
              label: 'regionName',
              value: 'id',
              children: 'subRegionList'
            },
            placeholder: '请选择'
          },
          {
            title: '状态',
            type: 'select',
            model: 'publisherStatus',
            enumType: 'EnableStatus',
            placeholder: '请选择'
          },
          {
            title: '企业名称',
            type: 'input',
            model: 'businessName',
            placeholder: '请输入'
          },
          {
            title: '统一社会信用代码',
            type: 'input',
            model: 'enterpriseCreditCode',
            placeholder: '请输入'
          }
        ],
        columns: [
          {
            title: '对外编号',
            key: 'publisherNumber'
          },
          {
            title: '发行工作室',
            key: 'publisherName'
          },
          {
            title: '发行Logo',
            key: 'publisherLogo',
            width: '140',
            isImage: true
          },
          {
            title: '所在城市',
            key: 'cityName',
            showTooltip: true
          },
          {
            title: '详细地址',
            key: 'address',
            showTooltip: true
          },
          {
            title: '联系电话',
            key: 'telephone'
          },
          {
            title: '发行微信',
            key: 'wxNumber',
            showTooltip: true
          },
          {
            title: '企业名称',
            key: 'businessName',
            showTooltip: true
          },
          {
            title: '统一社会信用代码',
            key: 'enterpriseCreditCode',
            showTooltip: true,
            width: 150
          },
          {
            title: '营业执照',
            key: 'businessLicense',
            width: 100,
            isImage: true
          },
          {
            title: '状态',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.status(ctx.row.publisherStatus)
              )
            }
          },
          {
            title: '操作',
            width: '200px',
            fixed: 'right',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      showImportVisible: false
    }
  },
  mounted() {
    this.initAreaData()
  },
  methods: {
    copyCode() {
      let _this = this
      let clipboard = new Clipboard('#copyCodetext')
      clipboard.on('success', (e) => {
        this.$message.success('复制成功')
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', (e) => {
        // 不支持复制
        Message({
          message: '该浏览器不支持自动复制',
          type: 'warning'
        })
        // 释放内存
        clipboard.destroy()
      })
    },
    //  获取地区集联数据
    async initAreaData() {
      this.table.searchData[2].option =
        await this.$api.regionQueryRegionCascadeList({})
    },
    //  添加发行
    doAdd() {
      this.$router.push({
        name: 'issuedInfoAdd'
      })
    },
    doDetail(id, type) {
      this.$router.push({
        name: 'issuedInfoDetails',
        query: {
          id,
          type
        }
      })
    },
    //  禁用/启用/删除
    doOperate(id, publisherStatus) {
      this.$confirm(
        `此操作将${this.operateTxt(publisherStatus)}该数据, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          await this.$api.publisherEnablePublisher({ id, publisherStatus })

          this.$message({
            type: 'success',
            message: `${this.operateTxt(publisherStatus)}成功!`
          })
          this.$refs.myTable.refresh()
        })
        .catch(() => {})
    },
    operateTxt(val) {
      switch (val) {
        case 'DISABLED':
          return '禁用'
        case 'ENABLED':
          return '启用'
        default:
          return val
      }
    }
  }
}
</script>

<style scoped></style>

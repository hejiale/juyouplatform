<template>
  <div>
    <yc-table :table="table" ref="myTable">
      <template slot="buttons">
        <div class="base-topBtn">
          <el-button type="primary" @click="doAdd" v-if="$powers('/author/addAuthor')">添加作者</el-button>
        </div>
      </template>
      <template slot="city" slot-scope="props">
        <div class="table-row-status">
          <span>
            {{
              (props.provinceName ? props.provinceName : '') +
              (props.cityName == props.provinceName
                ? ''
                : props.cityName
                ? props.cityName
                : '') +
              (props.districtName ? props.districtName : '')
            }}
          </span>
        </div>
      </template>
      <template slot="status" slot-scope="props">
        <div class="table-row-status">
          <span
            :class="
              props === 'ENABLED'
                ? 'table-row-status-enable'
                : 'table-row-status-disable'
            "
          >
            {{ $enums.AuthorStatus.getName(props) }}
          </span>
        </div>
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="doEdit(props)" v-if="$powers('/author/updateAuthorDetail')">编辑</el-button>
        <el-button
          v-if="props.authorStatus === 'ENABLED' && $powers('/author/updateAuthorStatus')"
          type="text"
          @click="doOperate(props, 'DISABLED')"
          >禁用</el-button
        >
        <el-button
          v-if="props.authorStatus === 'DISABLED' && $powers('/author/updateAuthorStatus')"
          type="text"
          @click="doOperate(props, 'ENABLED')"
          >启用</el-button
        >
      </template>
    </yc-table>
  </div>
</template>

<script>
const PEOPLES = [
  {
    label: '小于等于4人',
    value: 4
  },
  {
    label: '5人',
    value: 5
  },
  {
    label: '6人',
    value: 6
  },
  {
    label: '7人',
    value: 7
  },
  {
    label: '8人',
    value: 8
  },
  {
    label: '大于等于9人',
    value: 9
  }
]
export default {
  data(vm) {
    return {
      table: {
        api: this.$api.authorQueryAuthorPage,
        query: {
          publisherId: null,
          gamerNum: null
        },
        searchData: [
          {
            title: '对外编号',
            type: 'input',
            model: 'dramaNameKeyword',
            placeholder: '请输入'
          },
          {
            title: '作者名称',
            type: 'input',
            model: 'authorNameKeyword',
            placeholder: '请输入'
          },
          {
            title: '所在城市',
            type: 'cascader',
            modelName: ['provinceId', 'cityId', 'districtId'],
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
            model: 'authorStatus',
            enumType: 'EnableStatus',
            placeholder: '请选择'
          }
        ],
        columns: [
          {
            title: '对外编号',
            key: 'authorNumber'
          },
          {
            title: '作者名称',
            key: 'authorName'
          },
          {
            title: '真实姓名',
            key: 'realName'
          },
          {
            title: '身份证号',
            key: 'identityNumber'
          },
          {
            title: '所在城市',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.city(ctx.row))
            }
          },
          {
            title: '详细地址',
            key: 'address',
            showTooltip: true
          },
          {
            title: '联系电话',
            key: 'phone',
            showTooltip: true
          },
          {
            title: '微信',
            key: 'wechatNumber',
            showTooltip: true
          },
          {
            title: '状态',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.status(ctx.row.authorStatus)
              )
            }
          },
          {
            title: '操作',
            width: '200px',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      publisherList: [],
      publisherLoading: false,
      peopleList: this.$_.cloneDeep(PEOPLES),
      currentDramaId: null,
      showImportVisible: false
    }
  },
  mounted() {
    this.initAreaData()
  },
  methods: {
    //  核心题材数据
    async initAreaData() {
      this.table.searchData[2].option =
        await this.$api.regionQueryRegionCascadeList({
          regionType: 'AREA'
        })
    },
    //  添加作者
    doAdd() {
      this.$router.push({
        name: 'AuthorInfoAdd'
      })
    },
    doEdit(prop) {
      this.$router.push({
        name: 'AuthorInfoEdit',
        query: {
          id: prop.id,
          name: prop.authorName
        }
      })
    },
    doDetail(id) {
      this.$router.push({
        name: 'scriptInfoDetail',
        query: {
          id
        }
      })
    },
    //  禁用/启用
    async doOperate(props, status) {
      await this.$api.authorUpdateAuthorStatus({
        id: props.id,
        authorStatus: status
      })
      this.$message({
        type: 'success',
        message: `操作成功!`
      })
      this.$refs.myTable.refresh()
    },
    async remoteMethod(query) {
      if (query !== '') {
        this.publisherLoading = true
        try {
          let res = await this.$api.publisherQueryPublisherPage({
            keywords: query,
            pageNo: 1,
            pageSize: 999
          })
          this.publisherList = res.list
        } finally {
          this.publisherLoading = false
        }
      } else {
        this.publisherList = []
      }
    },
    changePeople(val) {
      if (!val) {
        this.$nextTick(() => {
          this.table.query.logicOperator = ''
        })
      }
      if (val === 4) {
        this.table.query.logicOperator = 'LITTLE_EQUAL'
      } else if (val === 9) {
        this.table.query.logicOperator = 'GRATER_EQUAL'
      } else {
        this.table.query.logicOperator = 'EQUAL'
      }
    }
  }
}
</script>

<style scoped></style>

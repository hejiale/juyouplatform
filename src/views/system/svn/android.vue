<template>
  <div>
    <yc-table
      :table="table"
      ref="myTable"
      defaultSort="version"
    >
      <template slot="buttons" v-if="$powers('/versionControl/addVersionControl')">
        <div class="base-topBtn">
          <el-button type="primary" @click="doAdd" v-if="$powers('/versionControl/addVersionControl')">添加</el-button>
        </div>
      </template>
      <template slot="status" slot-scope="props">
        <div class="table-row-status">
          <span :class="props.statusType === 'ENABLE' ? 'table-row-status-enable':'table-row-status-reject'" :enableJudgment="enableJudgment(props.statusType)">
            {{ isStatusType }}
          </span>
        </div>
      </template>
      <template slot="force" slot-scope="props">
        <span>{{ props.isForce == false ? '否' : '是' }}</span>
      </template>
      <template slot="actions" slot-scope="props">
        <el-button
          type="text"
          @click="onForce(props.id)"
          v-if="props.statusType == 'NOT_ENABLE' && $powers('/versionControl/enableVersionControl')"
          >启用</el-button
        >
        <el-button
          type="text"
          @click="goEdit(props)"
          v-if="props.statusType != 'DISCARD' && $powers('/versionControl/editVersionControl')"
          >编辑</el-button
        >
        <el-button type="text" class="reject" v-if="$powers('/versionControl/deleteVersionControl')" @click="goDel(props.id)">删除</el-button>
        <!-- <el-button type="text" @click="isEnable(props)">{{
          props.isEnable == 'ENABLE' ? '禁用' : '启用'
        }}</el-button> -->
      </template>
      <template slot="apk" slot-scope="props">
        <a :href="props.url" class="apk-url">{{ props.url }}</a>
      </template>
    </yc-table>
    <el-dialog width="500px" :visible.sync="dialogVisible" center  title="新增版本信息">
      <dialogContent @on-cancel="dialogVisible = false" @on-sure="onSuccessInsert">
        <template slot="content">
          <addVersionInfo
            :nowVersion="nowVersion"
            :qq="qq"
            ref="addVersionInfo"
          ></addVersionInfo>
        </template>
      </dialogContent>
    </el-dialog>
    <el-dialog width="500px" :visible.sync="dialogVisibleEdit" center title="编辑版本信息">
      <dialogContent @on-cancel="dialogVisibleEdit = false" @on-sure="onSuccessEdit">
        <template slot="content">
          <editVersionInfo
            :nowVersion="nowVersion"
            :currentVersion="currentVersion"
            :updateContent="updateContent"
            :updateApk="currentApk"
            :statusType="statusType"
            :nowId="nowId"
            :isForce="isForce"
            ref="editVersionInfo"
          ></editVersionInfo>
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>

<script>
const formDetail = {
  sku: [],
  version: null, //版本号
  updateContent: null, //更新内容
  isForce: false, //是否强制更新
  statusType: null, //状态
  isStatusType: null,
  updateTime: null, //创建时间
  url: null, //apk链接
  publisherNames: []
}
import addVersionInfo from './addVersionInfo.vue'
import editVersionInfo from './editVersionInfo.vue'
import { devServer } from '../../../../vue.config'
import dialogContent from '@global/dialog'
export default {
  components: {
    addVersionInfo,
    editVersionInfo,
    devServer,
    dialogContent
  },
  data() {
    const vm = this
    return {
      arr: [],
      nowId: null, //当前id
      nowVersion: null, //当前版本号
      dialogVisible: false,
      dialogVisibleEdit: false,
      title: '',
      form: vm.$_.clone(formDetail),
      publisherLoading: false,
      publisherList: [],
      disable: false,
      currentVersion: null,
      updateContent: null,
      statusType: false,
      currentApk: null,
      qq: '',
      isForce: false,
      table: {
        api: this.$api.versionControlQueryVersionControlPage,
        query: {
          appType: 'ANDROID'
        },
        searchData: [
          {
            title: '版本号',
            type: 'input',
            model: 'version',
            placeholder: '请输入'
          },
          {
            title: '创建时间',
            type: 'dateSection',
            modelName: ['startTime', 'endTime']
          }
        ],
        columns: [
          {
            title: '版本号',
            key: 'version',
            sortable: false
            // render(h, ctx) {
            //   return h('span', vm.$refs.myTable.$scopedSlots.version(ctx.row))
            // }
          },
          {
            title: '更新内容',
            key: 'updateContent'
          },
          {
            title: '是否强制更新',
            key: 'isForce',
            render(h, ctx) {
              return h('span', vm.$refs.myTable.$scopedSlots.force(ctx.row))
            }
          },
          {
            title: '创建时间',
            key: 'updateTime'
          },
          {
            title: '状态',
            key: 'statusType',
            enumType: 'updateTime',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.status(ctx.row))
            }
          },
          {
            title: '安装包',
            key: 'url',
            render(h, ctx) {
              return h('a', vm.$refs.myTable.$scopedSlots.apk(ctx.row))
            }
          },
          {
            title: '操作',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.actions(ctx.row))
            }
          }
        ]
      }
    }
  },
  created() {
    this.getNowVersion()
  },
  methods: {
    //  添加剧本
    doAdd() {
      // let qq = ''

      let ww = this.arr.find((v) => {
        return v.statusType == 'ENABLE'
      })
      let ee = this.arr.find((v) => {
        return v.statusType == 'NOT_ENABLE'
      })
      // console.log(ww)
      // console.log(ee)
      // console.log(this.compareVersion(this.nowVersion, ww.version))
      if (ww != undefined) {
        if (this.compareVersion(this.nowVersion, ww.version) > 0) {
          this.qq = 1
        } else {
          this.qq = 0
        }
      } else if (ee != undefined) {
        this.qq = 1
      } else {
        this.qq = 0
      }

      // v.version
      // console.log(ww.version)
      // console.log(this.nowVersion)
      // console.log(this.qq)
      if (this.qq) {
        this.$message.warning('需启用或删除最新版本')
        // setTimeout(() => {
        //   this.dialogVisible = true
        // }, 500)
      } else {
        this.dialogVisible = true
      }
    },
    //新增剧本成功
    onSuccessInsert() {
      this.$refs.addVersionInfo.doSubmit(()=>{
        this.dialogVisible = false
        this.$refs.myTable.refresh()
      })
    },
    //打开编辑框
    goEdit(props) {
      this.nowId = props.id
      this.statusType = props.statusType
      this.updateContent = props.updateContent
      this.currentVersion = props.version
      this.currentApk = props.url
      this.isForce = props.isForce
      console.log(props)
      this.dialogVisibleEdit = true
    },
    //编辑剧本成功
    onSuccessEdit() {
      this.$refs.editVersionInfo.doSubmit(()=>{
        this.dialogVisibleEdit = false
        this.$refs.myTable.refresh()
      })
    },
    goDetail(id) {
      this.$router.push({
        path: 'JOYO/detail/' + id,
        params: { id }
      })
    },
    // async isEnable(props) {
    //   if (props.isEnable == 'ENABLE') {
    //     props.isEnable = 'DISABLE'
    //     await this.$api.joyoAppointmentUserInfoDisable({
    //       id: props.userId
    //     })
    //   } else {
    //     props.isEnable = 'ENABLE'
    //     await this.$api.joyoAppointmentUserInfoEnable({
    //       id: props.userId
    //     })
    //   }
    // },
    // goMagt(id) {
    //   this.$router.push({
    //     path: 'JOYO/amend/' + id,
    //     params: { id }
    //   })
    // },
    // doSubmit() {},
    handleClose() {
      this.dialogVisible = false
    },
    newClone() {
      this.form = this.$_.clone(formDetail)
      this.$search(this.table)
    },
    goDel(id) {
      let txt = '删除该数据'
      this.$confirm(`此操作将${txt}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$api.versionControlDeleteVersionControl({
            id
          })
          this.$message.success('删除成功')
          this.$refs.myTable.refresh()
        } catch (e) {
          this.$message.warning(e)
        }
      })
    },
    //启用
    onForce(id) {
      this.$confirm(`启用后app内版本更新将使用此版本，当前版本将弃用`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$api
            .versionControlEnableVersionControl({
              id
            })
            .then(() => {
              this.$router.go(0)
            })
        } catch (e) {
          this.$message.warning(e)
        }
      })
    },
    //获取当前版本
    async getNowVersion() {
      await this.$api
        .versionControlQueryVersionControlPage({
          pageNo: 1,
          pageSize: 100,
          appType: 'ANDROID'
        })
        .then((res) => {
          this.arr.push(...res.list)
          // console.log(res.list)
          // console.log(this.arr)
          let bb = this.arr.map((v) => {
            return v.version
          })
          this.nowVersion = bb[bb.length - 1]
          // console.log(this.nowVersion)
          const isEnable = res.list.find((v) => v.statusType == 'ENABLE')
          // this.nowId = isEnable.id
        })
    },
    //启用状态
    enableJudgment(statusType) {
      if (statusType == 'ENABLE') {
        this.isStatusType = '已启用'
      } else if (statusType == 'NOT_ENABLE') {
        this.isStatusType = '未启用'
      } else if (statusType == 'DISCARD') {
        this.isStatusType = '已弃用'
      }
    },
    compareVersion(version1, version2) {
      let newVersion1 = ''
      let newVersion2 = ''
      if (devServer.proxy == 'https://www.juyyds.com') {
        newVersion1 =
          `${version1}`.split('.').length < 3
            ? `${version1}`.concat('.0')
            : `${version1}`
        newVersion2 =
          `${version2}`.split('.').length < 3
            ? `${version2}`.concat('.0')
            : `${version2}`
      } else {
        newVersion1 =
          `${version1}`.split('.').length < 4
            ? `${version1}`.concat('.0')
            : `${version1}`
        newVersion2 =
          `${version2}`.split('.').length < 4
            ? `${version2}`.concat('.0')
            : `${version2}`
      }
      //计算版本号大小,转化大小
      function toNum(a) {
        const c = a.toString().split('.')
        const num_place = ['', '0', '00', '000', '0000'],
          r = num_place.reverse()
        for (let i = 0; i < c.length; i++) {
          const len = c[i].length
          c[i] = r[len] + c[i]
        }
        return c.join('')
      }

      //检测版本号是否需要更新
      function checkPlugin(a, b) {
        const numA = toNum(a)
        const numB = toNum(b)
        return numA > numB ? 1 : numA < numB ? -1 : 0
      }
      return checkPlugin(newVersion1, newVersion2)
    }
  }
}
</script>

<style>
.apk-url {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

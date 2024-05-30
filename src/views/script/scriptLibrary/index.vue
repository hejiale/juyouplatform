<template>
  <div>
    <yc-table :table="table" ref="myTable">
      <template slot="buttons">
        <div class="base-topBtn">
          <el-button type="primary" @click="doAdd" v-if="$powers('/drama/addDramDetail')">+新增剧本</el-button>
        </div>
      </template>
      <template slot="dicts" slot-scope="props">
        <span v-for="(item, idx) in props" :key="idx" class="textTable">
          <template v-if="idx === props.length - 1">{{
            item.dictValue
          }}</template>
          <template v-else>{{ item.dictValue }}、</template>
        </span>
      </template>
      <template slot="publisher" slot-scope="props">
        <div v-for="(item, idx) in props" :key="idx" class="textTable">
          <template v-if="idx === props.length - 1">{{
            item.publisherName
          }}</template>
          <template v-else>{{ item.publisherName }}、</template>
        </div>
      </template>
      <template slot="gamer" slot-scope="props">
        {{
          props.minGamerNum === props.maxGamerNum
            ? `${props.minGamerNum}`
            : `${props.minGamerNum}~${props.maxGamerNum}`
        }}人({{ props.maleGamerNum }}男{{ props.femaleGamerNum }}女)
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
        <el-button type="text" @click="doEdit(props)" v-if="$powers('/drama/updateDramDetail')">编辑</el-button>
        <el-button
          v-if="props.dramaStatus === 'ENABLED' && $powers('/drama/updateDramStatus')"
          type="text"
          @click="doOperate(props.id, 'DISABLED')"
          >禁用</el-button
        >
        <el-button v-if="props.dramaStatus === 'DISABLED' && $powers('/drama/updateDramStatus')" type="text" @click="doOperate(props.id, 'ENABLED')"
          >启用</el-button
        >
        <el-button v-if="$powers('/backend/drama/editPopularPosition') && props.dramaStatus === 'ENABLED'" type="text" @click="doRecommd(props)"
          >{{props.popularRecommendPosition === 'ENABLE' ? '取消推荐':'推荐'}}</el-button
        >
      </template>
    </yc-table>
  </div>
</template>

<script>
export default {
  data(vm) {
    return {
      table: {
        api: this.$api.dramaQueryDramaPage,
        query: {},
        searchData: [
          {
            title: '剧本名称',
            type: 'input',
            model: 'dramaNameKeyword',
            placeholder: '请输入'
          },
          {
            title: '发售方式',
            type: 'select',
            model: 'sellType',
            enumType: 'SellType',
            placeholder: '请选择'
          },
          {
            title: '发行工作室',
            type: 'input',
            model: 'publisherNameKeyword',
            placeholder: '请输入'
          },
          {
            title: '剧本题材',
            type: 'selectArr',
            model: 'dictIds',
            placeholder: '请选择',
            option: []
          },
          {
            title: '状态',
            type: 'select',
            model: 'dramaStatus',
            enumType: 'EnableStatus',
            placeholder: '请选择'
          },
          {
            title: '游戏人数',
            type: 'selectPlayer',
            modelName: ['minGamerNum','maxGamerNum'],
            enumType: 'GamePlayer',
            placeholder: '请选择'
          },
          {
            title: '有无著作权',
            type: 'select',
            model: 'isCopyright',
            enumType: 'Bool',
            placeholder: '请选择'
          },
          {
            title: '是否备案',
            type: 'select',
            model: 'isRecord',
            enumType: 'Bool',
            placeholder: '请选择'
          },
          {
            title: '是否票房本',
            type: 'select',
            model: 'isBoxOffice',
            enumType: 'Bool',
            placeholder: '请选择'
          },
        ],
        columns: [
          {
            title: '剧本名称',
            key: 'dramaName',
            showTooltip: true
          },
          {
            title: '剧本封面',
            width: 140,
            key: 'dramaCover',
            isImage: true
          },
          {
            title: '发行工作室',
            showTooltip: true,
            width: 120,
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.publisher(ctx.row.publishers)
              )
            }
          },
          {
            title: '发售方式',
            key: 'sellType',
            enumType: 'SellType'
          },
          {
            title: '是否有著作权',
            key: 'isCopyright',
            enumType: 'Bool'
          },
          {
            title: '核心题材',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.dicts(ctx.row.dicts)
              )
            }
          },
          {
            title: '游戏人数',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.gamer(ctx.row))
            },
            width: 120
          },
          {
            title: '剧本难度',
            key: 'dramaDifficulty',
            enumType: 'DramaDifficulty'
          },
          {
            title: '发售价格',
            key: 'sellPrice',
            filter: 'currency',
            showTooltip: true
          },
          {
            title: '热度',
            key: 'aggPopularScore',
            showTooltip: true
          },
          {
            title: '剧本状态',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.status(ctx.row.dramaStatus)
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
      currentDramaId: null,
      dialogFileVisible: false,
      fileList: [],
      fileLoading: false,
      showImportVisible: false
    }
  },
  mounted() {
    this.initTheme()
  },
  methods: {
    async doRecommd(v){
      try{
        await this.$api.editPopularPosition({dramaId: v.id, popularRecommendPosition: v.popularRecommendPosition === 'ENABLE' ? 'DISABLE':'ENABLE'})
        this.$refs.myTable.refresh()
      }catch(e){}
    },
    //  核心题材数据
    async initTheme() {
      let res = await this.$api.dictQueryDictList({
        dictType: 'DRAMA'
      })
      this.table.searchData[3].option = res[0].dictList.map((m) => {
        return {
          label: m.dictValue,
          value: m.id
        }
      })
    },
    async doSubmitFile() {
      if (this.fileList.length === 0) {
        return this.$message.warning('请先导入文件')
      }
      if (!this.fileList[this.fileList.length - 1].url) {
        return this.$message.warning('文件正在上传，请稍后再试')
      }
      this.fileLoading = true
      try {
        let attachmentList = this.fileList.map((m) => {
          return {
            fileUrl: m.url,
            fileSize: m.size
          }
        })
        await this.$api.dramaAttachmentAddDramaAttachment({
          dramaId: this.currentDramaId,
          attachmentList
        })
        this.$message.success('上传成功')
        this.fileList = []
        this.dialogFileVisible = false
      } finally {
        this.fileLoading = false
      }
    },
    doUpload(id) {
      this.currentDramaId = id
      this.dialogFileVisible = true
    },
    //  添加剧本
    doAdd() {
      this.$router.push({
        name: 'scriptInfoAdd'
      })
    },
    doEdit(prop) {
      this.$router.push({
        name: 'scriptInfoEdit',
        query: {
          id: prop.id,
          isBoxOffice: prop.isBoxOffice
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
    doCancel() {
      this.fileList = []
      this.dialogFileVisible = false
    },
    handleClose(done) {
      this.fileList = []
      done()
    },
    //  禁用/启用/删除
    doOperate(id, type) {
      this.$confirm(
        `此操作将${this.operateTxt(type)}该剧本, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          await this.$api.dramaDisableDrama({ id, dramaStatus: type })
          this.$message({
            type: 'success',
            message: `${this.operateTxt(type)}成功!`
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
    }
  }
}
</script>

<style scoped></style>

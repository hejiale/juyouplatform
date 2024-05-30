<template>
  <div>
    <title-info v-if="!hideTitle" title="基础信息" :heavyLoad="true" />
    <div class="base-form" v-loading="loading">
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-position="left"
        label-width="200px"
      >
        <el-form-item label="是否票房本：" prop="isBoxOffice" v-if="!isStore">
          <el-select
            v-model="form.isBoxOffice"
            placeholder="请选择"
            :disabled="$route.name == 'scriptInfoEdit' ? true : false"
          >
            <el-option
              v-for="i in $enums.Bool.list"
              :label="i.label"
              :value="i.value"
              :key="i.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否已申领著作权："
          prop="isCopyright"
          v-if="!isStore"
        >
          <el-select v-model="form.isCopyright" placeholder="请选择">
            <el-option
              v-for="i in $enums.Bool.list"
              :label="i.label"
              :value="i.value"
              :key="i.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否备案：" prop="isRecord" v-if="!isStore">
          <el-select v-model="form.isRecord" placeholder="请选择">
            <el-option
              v-for="i in $enums.Bool.list"
              :label="i.label"
              :value="i.value"
              :key="i.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="剧本名称：" prop="dramaName">
          <el-input
            v-model="form.dramaName"
            placeholder="请输入"
            :disabled="isStore == 1"
          />
        </el-form-item>
        <el-form-item label="发行工作室：" prop="publisherIds">
          <el-select
            v-model="form.publisherIds"
            multiple
            filterable
            remote
            :remote-method="remoteMethod"
            :loading="publisherLoading"
            :placeholder="isStore ? '' : '请输入发行关键字'"
            :disabled="isStore == 1"
          >
            <el-option
              v-for="i in publisherList"
              :label="i.publisherName"
              :value="i.id"
              :key="i.id"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="出品方：">
          <el-select
            v-model="form.producerIdList"
            multiple
            filterable
            remote
            clearable
            :remote-method="remoteMethodProducer"
            :loading="publisherLoading"
            placeholder="请输入出品方关键字"
          >
            <el-option
              v-for="i in producerList"
              :label="i.publisherName"
              :value="i.id"
              :key="i.id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="监制名称：" v-if="!isStore">
          <el-input v-model="form.monitorName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="作者名称：" prop="authorIds">
          <el-select
            v-model="form.authorIds"
            multiple
            filterable
            remote
            :remote-method="remoteMethodAuthor"
            :loading="publisherLoading"
            :placeholder="isStore ? '' : '请输入作者关键字'"
            :disabled="isStore == 1"
          >
            <el-option
              v-for="i in authorList"
              :label="i.authorName"
              :value="i.id"
              :key="i.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发售方式：" prop="sellType">
          <el-radio-group v-model="form.sellType" :disabled="isStore == 1">
            <el-radio
              :label="item.value"
              v-for="item in $enums.SellType.list"
              :key="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="isStore ? '剧本价格：' : '发售价格：'"
          prop="sellPrice"
        >
          <el-input
            class="mr24"
            type="number"
            v-model="form.sellPrice"
            :placeholder="isStore ? '' : '请输入'"
            :disabled="isStore == 1"
          />
        </el-form-item>
        <el-form-item label="发行时间：" prop="publishDate" v-if="!isStore">
          <el-date-picker
            v-model="form.publishDate"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="请选择"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="玩家人数：" prop="minGamerNum" v-if="!isStore">
          <div class="gamerNum-type">
            <el-radio-group
              v-model="peopleType"
              class="script-radio-btn mb24"
              @change="changeGamerType"
            >
              <el-radio-button
                :label="item.value"
                v-for="item in peopleTypeList"
                :key="item.value"
                >{{ item.label }}</el-radio-button
              >
            </el-radio-group>
          </div>
          <div class="gamerNum-input">
            <div class="gamerNum-input__lf">
              <template v-if="peopleType === 'Fixed'">
                <el-input
                  type="number"
                  v-model="form.minGamerNum"
                  @input="changeGamer"
                />
              </template>
              <template v-else>
                <el-input type="number" v-model="form.minGamerNum" />
                <span style="padding: 0 7px">~</span>
                <el-input type="number" v-model="form.maxGamerNum" />
              </template>
              <span style="margin-left: 7px">人</span>
            </div>
            <div class="gamerNum-input__rt ml24">
              <div class="gamerNum-input__item ml24">
                <span>男性最少人数：</span>
                <el-input type="number" v-model="form.maleGamerNum" />
              </div>
              <div class="gamerNum-input__item ml24">
                <span>女性最少人数：</span>
                <el-input type="number" v-model="form.femaleGamerNum" />
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="阅读体量：" prop="readingQuantity" v-if="!isStore">
          <el-input
            type="number"
            v-model="form.readingQuantity"
            placeholder="请输入"
          />
          <span class="ml24">千字</span>
        </el-form-item>
        <el-form-item
          label="适合年龄："
          prop="dramaAgeAppropriate"
          v-if="!isStore"
        >
          <el-radio-group
            v-model="form.dramaAgeAppropriate"
            class="script-radio-btn"
          >
            <el-radio-button
              :label="item.value"
              v-for="item in $enums.DramaAgeAppropriate.list"
              :key="item.value"
              >{{ item.label }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="可否反串：" v-if="!isStore">
          <el-radio-group v-model="form.isOpposite">
            <el-radio
              :label="item.value"
              v-for="item in $enums.Bool.list"
              :key="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有无道具：" v-if="!isStore">
          <el-radio-group v-model="form.isProp">
            <el-radio
              :label="item.value"
              v-for="item in $enums.Bool.list"
              :key="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有无演绎：" v-if="!isStore">
          <el-radio-group v-model="form.isDeduce">
            <el-radio
              :label="item.value"
              v-for="item in $enums.Bool.list"
              :key="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有无全息：" v-if="!isStore">
          <el-radio-group v-model="form.isHolographic">
            <el-radio
              :label="item.value"
              v-for="item in $enums.Bool.list"
              :key="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="剧本难度：" prop="dramaDifficulty" v-if="!isStore">
          <el-radio-group
            v-model="form.dramaDifficulty"
            class="script-radio-btn"
          >
            <el-radio-button
              :label="item.value"
              v-for="item in $enums.DramaDifficulty.list"
              :key="item.value"
              >{{ item.label }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="剧本题材：" prop="dictIds">
          <el-select
            v-model="form.dictIds"
            multiple
            filterable
            :placeholder="isStore ? '' : '请输入剧本题材关键字'"
            :disabled="isStore == 1"
          >
            <el-option
              v-for="i in dictIdList"
              :label="i.dictValue"
              :value="i.id"
              :key="i.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="平均游戏时长：" prop="gameTime" v-if="!isStore">
          <el-select v-model="form.gameTime">
            <el-option
              v-for="item in timeType"
              :key="'time_' + item"
              :label="item"
              :value="item"
              >{{ item }}</el-option
            >
          </el-select>
          <span class="ml24">小时</span>
        </el-form-item>
        <el-form-item label="主持难度：" prop="dmDifficulty" v-if="!isStore">
          <el-rate
            v-model="form.dmDifficulty"
            @change="onChangeRate"
            show-text
            :texts="showTexts"
            style="margin-top: 10px"
          >
          </el-rate>
        </el-form-item>
        <el-form-item label="剧本封面：" prop="dramaCover">
          <yc-image-uploader
            ref="drama-cover"
            v-model="form.dramaCover"
            showTips
            :disabled="isStore == 1"
          ></yc-image-uploader>
        </el-form-item>
        <el-form-item label="剧本背景图片：" prop="dramaBackgroundList">
          <yc-image-uploader
            ref="background-cover"
            v-model="form.dramaBackgroundList"
            showTips
            uploadMultiple
            :disabled="isStore == 1"
            :uploadSize="5"
            tips="只支持上传图片或视频文件"
            accept="image/png,image/jpg,image/jpeg,.gif,video/mp4,video/ogg,video/flv,video/avi,video/wmv,video/rmvb,video/mov"
          ></yc-image-uploader>
        </el-form-item>
        <el-form-item
          label="人物海报（用于宣传展示，票房本游戏配置请至“票房本配置”"
        >
          <div class="assignment">
            <div
              class="box"
              v-for="(item, idx) in form.dramaRoleList"
              :key="idx"
            >
              <el-form-item
                :prop="'dramaRoleList.' + idx"
                :rules="rules.dramaRoleList"
              >
                <div>
                  <el-input
                    v-model="item.roleName"
                    :placeholder="isStore ? '' : '请输入人物名称'"
                    maxlength="20"
                    show-word-limit
                    :disabled="isStore == 1"
                  />
                </div>
              </el-form-item>
              <el-form-item
                style="margin-top: 30px"
                :prop="'dramaRoleList.' + idx"
                :rules="rules.dramaRoleImgList"
              >
                <yc-image-uploader
                  :ref="'imgUploadFileList' + idx"
                  v-model="item.roleUrl"
                  :disabled="isStore == 1"
                  :uploadSize="0.5"
                  tips="只能上传jpg,png,jpeg,gif格式文件，单文件大小不超过500k,图片压缩工具建议使用：https://tinify.cn/"
                ></yc-image-uploader>
              </el-form-item>
              <div
                class="delBtn"
                @click="delAssignment(idx)"
                v-if="idx > 0 && !isStore"
              >
                删除
              </div>
            </div>
            <div class="insertBtn" @click="addAssignment" v-if="!isStore">
              +添加人物海报
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="剧本其他图片（用于宣传展示，票房本游戏配置请至“票房本配置”"
          v-if="!isStore"
        >
          <yc-image-uploader
            ref="other-list"
            v-model="form.imageOtherList"
            uploadMultiple
            showTips
            :uploadSize="0.5"
            tips="只能上传jpg,png,jpeg,gif格式文件，单文件大小不超过500k,图片压缩工具建议使用：https://tinify.cn/"
          ></yc-image-uploader>
        </el-form-item>
        <el-form-item label="剧本电子资料：" prop="electronContent">
          <el-input
            v-model="form.electronContent"
            :placeholder="isStore ? '' : '请输入链接'"
            :disabled="isStore == 1"
          />
        </el-form-item>
        <el-form-item label="文字简介：" prop="content">
          <tinymce ref="editor" v-model="form.content" />
        </el-form-item>
        <div class="content-submit">
          <el-button type="primary" @click="doSubmit" v-loading="subLoading"
            >提交</el-button
          >
          <el-button type="primary" plain @click="backRouter">返回</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import titleInfo from '@partial/title-info'
import tinymce from '@partial/tinymce'
import enumRadio from '@partial/enum-radio'
import fileUpload from '@partial/file-upload'

const FORM = {
  dictIds: [],
  authorIds: [],
  publisherIds: [],
  producerIdList: [],
  // imageList: [],
  dramaRoleList: [],
  imageOtherList: [],
  isOpposite: false,
  isCopyright: false,
  isProp: false,
  isElectron: false,
  isDeduce: false,
  isHolographic: false,
  minGamerNum: null,
  maxGamerNum: null,
  maleGamerNum: null,
  femaleGamerNum: null,
  dramaStatus: 'DISABLED',
  dramaAgeAppropriate: null,
  electronContent: null,
  isBoxOffice: false,
  isRecord: false,
  content: '',
  dramaBackgroundList: []
}
export default {
  props: {
    hideTitle: {
      type: Boolean,
      default: false
    },
    isDetail: {
      type: Boolean,
      default: false
    }
  },
  components: {
    titleInfo,
    tinymce,
    enumRadio,
    fileUpload
  },
  data() {
    const validateGamerNum = (rule, value, callback) => {
      if (this.isStore) return callback()

      let reg = /^[1-9]\d*$/
      let reg1 = /^0?$|^([1-9][0-9]*)?$/
      if (!value) {
        return callback(new Error('最小人数不能为空'))
      } else if (this.peopleType !== 'Fixed' && !this.form.maxGamerNum) {
        return callback(new Error('最大人数不能为空'))
      } else if (
        !reg.test(value) ||
        (this.peopleType !== 'Fixed' && !reg.test(this.form.maxGamerNum))
      ) {
        return callback(new Error('人数必须是正整数且最小为1'))
      } else if (Number(value) > Number(this.form.maxGamerNum)) {
        return callback(new Error('最小人数不能大于最大人数'))
      } else if (
        Number(this.form.maleGamerNum) + Number(this.form.femaleGamerNum) !==
        Number(value)
      ) {
        return callback(new Error('男性人数加上女性人数必须等于最小人数'))
      } else if (
        !reg1.test(this.form.maleGamerNum) ||
        !reg1.test(this.form.femaleGamerNum)
      ) {
        return callback(new Error('人数必须是正整数'))
      }
      callback()
    }
    const validatePrice = (rule, value, callback) => {
      if (this.isStore) return callback()

      if (!value || value == 0) {
        callback()
      } else {
        if (value < 0.01) {
          return callback(new Error('金额最多保留两位小数'))
        }
        callback()
      }
    }
    const validateRead = (rule, value, callback) => {
      if (this.isStore) return callback()

      let reg = /^[1-9]\d*$/
      if (!value) {
        callback()
      } else {
        if (!reg.test(value)) {
          return callback(new Error('阅读体量必须是正整数'))
        }
        callback()
      }
    }
    const valiNumMax = (num, rule, value, callback) => {
      if (value && value.length > num) {
        callback(new Error(`该选项最多只能选取${num}个`))
      }
      callback()
    }
    var requiredTitle = (rule, value, callback) => {
      if (this.isStore) return callback()

      if (value.roleUrl && !value.roleName) {
        callback(new Error('请输入人物海报标题'))
      } else {
        callback()
      }
    }
    var requiredImg = (rule, value, callback) => {
      if (this.isStore) return callback()

      if (value.roleName && !value.roleUrl) {
        callback(new Error('请上传人物海报'))
      } else {
        callback()
      }
    }
    var validateDmDifficulty = (rule, value, callback) => {
      if (this.isStore) return callback()

      if (value > 0) {
        callback()
      } else {
        callback(new Error('请选择主持难度'))
      }
    }
    return {
      form: this.$_.cloneDeep(FORM),
      publisherList: [],
      producerList: [],
      authorList: [],
      dictIdList: [],
      rules: {
        isBoxOffice: {
          required: true,
          message: '请选择票房本类型',
          trigger: 'change'
        },
        isCopyright: {
          required: true,
          message: '请选择是否有著作权',
          trigger: 'change'
        },
        isRecord: {
          required: true,
          message: '请选择是否备案',
          trigger: 'change'
        },
        dramaName: {
          required: true,
          message: '请输入剧本名称',
          trigger: 'blur'
        },
        publisherIds: {
          required: true,
          message: '请选择发行工作室',
          trigger: 'change'
        },
        authorIds: {
          required: true,
          message: '请选择作者名称',
          trigger: 'change'
        },
        sellType: {
          required: true,
          message: '请选择发售方式',
          trigger: 'change'
        },
        publishDate: {
          required: true,
          message: '请选择发行时间',
          trigger: 'change'
        },
        minGamerNum: {
          required: true,
          validator: validateGamerNum,
          trigger: ['blur', 'change']
        },
        gameTime: {
          required: true,
          message: '请选择平均游戏时长',
          trigger: 'change'
        },
        dramaAgeAppropriate: {
          required: true,
          message: '请选择适合年龄',
          trigger: 'change'
        },
        dramaDifficulty: {
          required: true,
          message: '请选择剧本难度',
          trigger: 'change'
        },
        dictIds: {
          required: true,
          message: '请选择剧本题材',
          trigger: 'change'
        },
        dmDifficulty: {
          required: true,
          validator: validateDmDifficulty,
          trigger: ['blur', 'change']
        },
        dramaCover: {
          required: true,
          message: '请选择剧本封面',
          trigger: 'change'
        },
        content: { required: true, message: '请输入剧本简介', trigger: 'blur' },
        sellPrice: { validator: validatePrice, trigger: 'blur' },
        readingQuantity: { validator: validateRead, trigger: 'blur' },
        dramaRoleList: [
          { required: true, validator: requiredTitle, trigger: 'blur' }
        ],
        dramaRoleImgList: [
          { required: true, validator: requiredImg, trigger: 'change' }
        ]
      },
      showTexts: ['极简', '简单', '一般', '较难', '困难'],
      subLoading: false,
      publisherLoading: false,
      peopleType: 'Fixed',
      peopleTypeList: [
        {
          label: '固定',
          value: 'Fixed'
        },
        {
          label: '范围',
          value: 'Scope'
        }
      ],
      coreThemeList: [],
      isStore: this.$route.query.isStore,
      timeType: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      loading: false
    }
  },
  computed: {
    isEdit() {
      return this.$route.name === 'scriptInfoEdit'
    }
  },
  activated() {
    this.clear()
    this.$refs.form.clearValidate()

    this.remoteMethodDict()
    if (this.$route.query.isEdit && this.$route.query.isEdit === 'none') {
      this.isDetail = true
    }
    if (this.$route.name === 'scriptInfoEdit' || this.isStore) {
      this.loading = true;
      this.initDetailData()
    } else {
      this.$nextTick((_) => {
        this.$refs['drama-cover'].setFileList()
        this.$refs['other-list'].setFileList()
        this.form.dramaRoleList.map((v, i) => {
          this.$refs[`imgUploadFileList${i}`][0].setFileList()
        })
      })
    }
    if (this.isStore) sessionStorage.setItem('storeActive', 'script')
  },
  methods: {
    onBack() {
      this.$router.push({
        name: 'ScriptInfo'
      })
    },
    addAssignment() {
      let item = {
        roleName: '',
        roleUrl: ''
      }
      this.form.dramaRoleList.push(item)
    },
    delAssignment(idx) {
      this.form.dramaRoleList.splice(idx, 1)
    },
    async changeGamerType() {
      await this.$nextTick()
      this.form.minGamerNum = null
      this.form.maxGamerNum = null
      this.form.maleGamerNum = null
      this.form.femaleGamerNum = null
    },
    changeGamer(val) {
      this.form.maxGamerNum = val
    },
    onChangeRate() {},
    //  发行商选择校验
    changePublisher(list) {
      this.form.producerIdList.forEach((m) => {
        list.forEach((t, idx) => {
          if (m === t) {
            this.form.publisherIds.splice(idx, 1)
            return this.$message.warning('发行商跟出品方数据不能重复')
          }
        })
      })
    },
    //  出品方选择校验
    changeProducer(list) {
      this.form.publisherIds.forEach((m) => {
        list.forEach((t, idx) => {
          if (m === t) {
            this.form.producerIdList.splice(idx, 1)
            return this.$message.warning('出品方跟发行商数据不能重复')
          }
        })
      })
    },
    async initDetailData(id) {
      // if (this.$route.query.storeId) {
      //   this.form = await this.$api.storeDramaQueryStoreDramaDetail({
      //     dramaId: this.$route.query.id,
      //     storeId: this.$route.query.storeId
      //   })
      // } else {
      let res = await this.$api.dramaGetDrama({
        id: this.$route.query.id
      })
      res['authorIds'] = res.authorItems.map((v) => v.id)
      res['dictIds'] = res.dicts.map((v) => v.id)
      res['publisherIds'] = res.publishers.map((v) => v.id)
      this.form = res
      console.log(this.form)
      // }
      //  获取发行商/剧本回显数据
      this.publisherList = this.form.publishers
      this.authorList = this.form.authorItems

      if (this.form.sellPrice) {
        this.form.sellPrice = this.form.sellPrice / 100
      }

      this.$nextTick((_) => {
        if (!this.$_.isEmpty(this.form.dramaCover)) {
          this.$refs['drama-cover'].setFileList(this.form.dramaCover)
        }

        if (!this.isStore && !this.$_.isEmpty(this.form.dramaBackgroundList)) {
          this.$refs['background-cover'].setFileList(this.form.dramaBackgroundList)
        }
        
        if (!this.$_.isEmpty(this.form.dramaRoleList)) {
          this.form.dramaRoleList.map((v, i) => {
            this.$refs[`imgUploadFileList${i}`][0].setFileList(v.roleUrl)
          })
        }

        if (!this.$_.isEmpty(this.form.dramaRoleList)) {
          this.form.dramaRoleList.map((v, i) => {
            this.$refs[`imgUploadFileList${i}`][0].setFileList(v.roleUrl)
          })
        }

        if (!this.isStore && !this.$_.isEmpty(this.form.imageOtherList)) {
          this.$refs['other-list'].setFileList(this.form.imageOtherList)
        }
      })

      if (
        this.form.minGamerNum &&
        this.form.minGamerNum === this.form.maxGamerNum
      ) {
        this.peopleType = 'Fixed'
      } else {
        this.peopleType = 'Scope'
      }
      if (!this.form.dictIds) this.form.dictIds = []
      this.$emit('getPower', this.form.isBoxOffice)
      this.loading = false;
    },
    //  发行工作室下拉筛选
    async remoteMethod(query) {
      if (!this.$_.isEmpty(query)) {
        this.publisherLoading = true
        try {
          let res = await this.$api.publisherQueryPublisherPage({
            publisherNameKeyword: query,
            pageNo: 1,
            pageSize: 999,
            publisherStatus: 'ENABLED'
          })
          console.log(res)
          this.publisherList = res.records
        } finally {
          this.publisherLoading = false
        }
      }
    },
    //  出品方下拉筛选
    async remoteMethodProducer(query) {
      if (query !== '') {
        this.publisherLoading = true
        try {
          let res = await this.$api.publisherQueryPublisherPage({
            publisherNameKeyword: query,
            pageNo: 1,
            pageSize: 999
          })
          this.producerList = res.records
        } finally {
          this.publisherLoading = false
        }
      }
    },
    //  作者下拉筛选
    async remoteMethodAuthor(query) {
      let res = await this.$api.authorQueryAuthorPage({
        authorNameKeyword: query,
        pageNo: 1,
        pageSize: 999,
        authorStatus: 'ENABLED'
      })
      this.authorList = res.records
    },
    //字典下拉筛选
    async remoteMethodDict() {
      try {
        let res = await this.$api.dictQueryDictList({
          dictType: 'DRAMA'
        })
        this.dictIdList = res[0].dictList
      } finally {
        this.publisherLoading = false
      }
    },
    backRouter() {
      try {
        this.$router.push({
          name: 'ScriptInfo'
        })
      } catch (e) {
        console.log(e)
      }
    },
    doSubmit() {
      if (!this.subLoading) {
        this.$refs.form.validate(async (valid) => {
          if (!valid) return
          if (this.form.gameTime < 1) {
            return this.$message.warning('游戏时长不能小于1')
          }
          let arr = []
          this.form.dramaRoleList.map((it) => {
            if (it.roleName && it.roleUrl) {
              arr.push(it)
            }
          })
          this.form.dramaRoleList = arr

          this.subLoading = true
          this.form.sellPrice = this.$_.cloneDeep(this.form.sellPrice * 100)
          try {
            let api = null
            if (this.isEdit) {
              api = 'dramaUpdateDrama'
            } else {
              api = 'dramaAddDrama'
            }
            await this.$api[api](this.form)
            this.$message.success(this.isEdit ? '编辑成功' : '新增成功')
            if (this.isEdit) {
              this.initDetailData()
            } else {
              this.$refs.form.clearValidate()
              this.form = this.$_.cloneDeep(FORM)
              this.$utils.routeBack('/script/info')
            }
          } catch (e) {
            this.form.sellPrice = this.$_.cloneDeep(this.form.sellPrice / 100)
          } finally {
            this.subLoading = false
          }
        })
      }
    },
    clear() {
      this.publisherList = []
      this.form = {
        dictIds: [],
        authorIds: [],
        publisherIds: [],
        producerIdList: [],
        // imageList: [],
        dramaRoleList: [],
        imageOtherList: [],
        isOpposite: false,
        isCopyright: false,
        isProp: false,
        isElectron: false,
        isDeduce: false,
        isHolographic: false,
        minGamerNum: null,
        maxGamerNum: null,
        maleGamerNum: null,
        femaleGamerNum: null,
        dramaStatus: 'DISABLED',
        dramaAgeAppropriate: null,
        electronContent: null,
        isBoxOffice: false,
        isRecord: false,
        content: ''
      }
      this.$refs['drama-cover'].setFileList()
      this.$refs['other-list'].setFileList()
    }
  }
}
</script>

<style lang="sass">

.shortlittle
  width: 176px !important
.gamerNum-input
  @include hor-start-center
  .el-input
    width: 60px
  &__rt
    @include hor-start-center
  &__item
    span:before
      content: '*'
      color: #F56C6C
      margin-right: 4px
.script-radio-btn
  .el-radio-button
    margin-right: 24px
  .el-radio-button__inner
    border-radius: 4px !important
    border: 1px solid #DCDFE6
.assignment
  width: 100%
  padding: 16px
  background-color: #F2F2F2
  .box
    background-color: #fff
    padding: 20px
    position: relative
    margin-bottom: 10px
    .delBtn
      display: inline-block
      padding: 8px 20px
      line-height: 14px
      text-align: center
      border: 1px dashed #9F9F9F
      border-radius: 4px
      color: #9F9F9F
      position: absolute
      top: 10px
      right: 20px
      cursor: pointer
  .insertBtn
    display: inline-block
    padding: 12px 16px
    line-height: 14px
    text-align: center
    border: 1px dashed #88aefa
    border-radius: 4px
    color: #88aefa
    background-color: #fff
    cursor: pointer
</style>

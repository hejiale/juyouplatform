<template>
  <div>
    <el-button type="primary" @click="addPs">新增备注</el-button>
    <!-- <el-button type="primary" @click="onRecommndToOther"
      >推荐给其他用户</el-button
    > -->

    <el-dialog title="新增备注" :visible.sync="dialogVisible" width="40%">
      <el-form>
        <el-form-item
          style="margin-top: 40px"
          prop="ps"
          label="备注"
          label-width="150px"
        >
          <el-input
            style="width: 500px"
            v-model="ps"
            placeholder="请输入备注"
            maxLength="100"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <!--按钮-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="submitPs">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogRecommd">
      <div class="recommendPop">
        <div class="recommendPop-title">输入对方名字 </div>
        <div class="recommendPop-searchBox">
          <el-select
            v-model="form.authorIds"
            filterable
            remote
            :remote-method="remoteMethodUser"
            :loading="userLoading"
            style="width: 35vw"
            placeholder="请输入推荐人关键字"
          >
            <el-option
              v-for="i in userList"
              :label="i.authorName"
              :value="i.id"
              :key="i.id"
            >
              <span>{{ i.authorName }}</span>
            </el-option>
          </el-select>
          <el-button type="primary" class="ml10">发送</el-button>
        </div>
        <div class="recommendPop-subTitle">历史推荐记录</div>
        <yc-table :table='table' ref='myTable' :hideTableTitle="true"></yc-table>
      </div>
    </el-dialog>

    <el-timeline style="margin-top: 20px; margin-left: 20px">
      <el-timeline-item
        v-for="(ps, index) in psList"
        :key="index"
        :timestamp="ps.createdTime"
      >
        {{ ps.text }} ( {{ ps.optUserName }} )
      </el-timeline-item>
    </el-timeline>

    <el-form :model="form" :inline="true" label-position="left">
      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="name"
        label="姓名"
        label-width="60px"
      >
        <el-input
          style="width: 100px"
          v-model="form.name"
          placeholder="请输入姓名"
          maxLength="10"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        label="性别"
        style="margin-top: 20px; margin-left: 20px"
        prop="sex"
        label-width="60px"
      >
        <el-select style="width: 100px" v-model="form.sex" placeholder="请选择">
          <el-option
            v-for="item in sexList"
            :key="item.value"
            :label="item.key"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="phone"
        label="手机号"
        label-width="60px"
      >
        <el-input
          style="width: 150px"
          v-model="form.phone"
          placeholder="请输入手机号"
          maxLength="11"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="age"
        label="年龄"
        label-width="60px"
      >
        <el-input-number v-model="form.age" :min="1" :max="100" />
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="occupation"
        label="职业"
        label-width="60px"
      >
        <el-select
          style="width: 150px"
          v-model="form.occupation"
          placeholder="请选择"
        >
          <el-option
            v-for="item in $enums.LP_OCCUPATION.list"
            :key="item.text"
            :label="item.text"
            :value="item.text"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="education"
        label="学历"
        label-width="60px"
      >
        <el-select
          style="width: 150px"
          v-model="form.education"
          placeholder="请选择"
        >
          <el-option
            v-for="item in $enums.LP_EDUCATION.list"
            :key="item.text"
            :label="item.text"
            :value="item.text"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="politicalStatus"
        label="政治面貌"
        label-width="70px"
      >
        <el-select
          style="width: 150px"
          v-model="form.politicalStatus"
          placeholder="请选择"
        >
          <el-option
            v-for="item in $enums.LP_POLITICS.list"
            :key="item.text"
            :label="item.text"
            :value="item.text"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="height"
        label="身高"
        label-width="60px"
      >
        <el-select
          style="width: 150px"
          v-model="form.height"
          placeholder="请选择"
        >
          <el-option
            v-for="item in heights"
            :key="item.text"
            :label="item.text"
            :value="item.text"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="weight"
        label="体重"
        label-width="60px"
      >
        <el-select
          style="width: 150px"
          v-model="form.weight"
          placeholder="请选择"
        >
          <el-option
            v-for="item in weights"
            :key="item.text"
            :label="item.text"
            :value="item.text"
          />
        </el-select>
      </el-form-item>

      <!--   籍贯   -->
      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="weight"
        label="籍贯国内/籍贯国外"
        label-width="160px"
      >
        <el-select
          style="width: 150px"
          v-model="form.isOverSea"
          placeholder="请选择"
        >
          <el-option
            v-for="item in $enums.NationBool.list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="weight"
        label="籍贯"
        label-width="60px"
        v-if="form.isOverSea"
      >
        <el-select
          style="width: 150px"
          v-model="form.overSeaNativePlace"
          placeholder="请选择"
        >
          <el-option
            v-for="item in CountryList"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        label="籍贯"
        label-width="60px"
        v-else
      >
        <el-cascader
          v-model="form.areaId"
          :options="areaList"
          :props="{
            label: 'regionName',
            value: 'id',
            children: 'subRegionList'
          }"
          placeholder="请选择"
          clearable
        ></el-cascader>
      </el-form-item>

      <!-- 常住地 -->
      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="weight"
        label="常住地国内/常住地国外"
        label-width="160px"
      >
        <el-select
          style="width: 150px"
          v-model="form.permanentResidenceType"
          placeholder="请选择"
        >
          <el-option
            v-for="item in $enums.ResidenceType.list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="weight"
        label="常住地"
        label-width="60px"
        v-if="form.permanentResidenceType === 'OVERSEAS'"
      >
        <el-select
          style="width: 150px"
          v-model="form.permanentResidenceOverSeas"
          placeholder="请选择"
        >
          <el-option
            v-for="item in CountryList"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        label="常住地"
        label-width="60px"
        v-if="form.permanentResidenceType === 'DOMESTIC'"
      >
        <el-cascader
          v-model="form.residenceAreaId"
          :options="areaList"
          :props="{
            label: 'regionName',
            value: 'id',
            children: 'subRegionList'
          }"
          placeholder="请选择"
          clearable
        ></el-cascader>
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="lpMembershipPackageName"
        label="套餐"
        label-width="60px"
      >
        <el-input
          style="width: 100px"
          v-model="form.lpMembershipPackageName"
          placeholder="无服务"
          maxLength="15"
          show-word-limit
          :disabled="true"
        />
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="payPrice"
        label="会员支付金额"
        label-width="100px"
      >
        <el-input
          style="width: 100px"
          v-model="form.payPrice"
          placeholder="无服务"
          maxLength="15"
          show-word-limit
          :disabled="true"
        />
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="entryTime"
        label="会员入驻时间"
        label-width="100px"
      >
        <el-input
          style="width: 170px"
          v-model="form.entryTime"
          placeholder="请输入会员入驻时间"
          maxLength="15"
          show-word-limit
          :disabled="true"
        />
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="effectiveTime"
        label="会员生效时间"
        label-width="100px"
      >
        <el-input
          style="width: 170px"
          v-model="form.effectiveTime"
          placeholder="无服务"
          maxLength="15"
          show-word-limit
          :disabled="true"
        />
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="leisureHobbies"
        label="休闲爱好"
        label-width="70px"
      >
        <el-select
          style="width: 300px"
          v-model="form.leisureHobbies"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="item in hobbyList"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="sportsHobbies"
        label="运动爱好"
        label-width="70px"
      >
        <el-select
          style="width: 300px"
          v-model="form.sportsHobbies"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="item in motionList"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="dietaryPreferences"
        label="饮食偏好"
        label-width="70px"
      >
        <el-select
          style="width: 300px"
          v-model="form.dietaryPreferences"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="item in dietList"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="favoriteAnimal"
        label="最喜欢的动物"
        label-width="100px"
      >
        <el-input
          style="width: 300px"
          v-model="form.favoriteAnimal"
          placeholder="请输入最喜欢的动物"
          maxLength="10"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="wantToGo"
        label="近期想去的地方"
        label-width="150px"
      >
        <el-cascader
          v-model="place"
          :props="props"
          :options="options"
          :show-all-levels="false"
        >
        </el-cascader>
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="favoriteMusic"
        label="喜欢的音乐类型"
        label-width="150px"
      >
        <el-select
          style="width: 300px"
          v-model="form.favoriteMusicGenres"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="item in musicTypeList"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="favoriteMusic"
        label="最喜欢的音乐"
        label-width="100px"
      >
        <el-input
          style="width: 300px"
          v-model="form.favoriteMusic"
          placeholder="请输入最喜欢的音乐"
          maxLength="10"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="favoriteMusic"
        label="喜欢的电影类型"
        label-width="150px"
      >
        <el-select
          style="width: 300px"
          v-model="form.favoriteMovieGenres"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="item in movieTypeList"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="favoriteMovie"
        label="最喜欢的电影"
        label-width="100px"
      >
        <el-input
          style="width: 300px"
          v-model="form.favoriteMovie"
          placeholder="请输入最喜欢的电影"
          maxLength="10"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        prop="favoriteBook"
        label="最喜欢的书籍"
        label-width="100px"
      >
        <el-input
          style="width: 300px"
          v-model="form.favoriteBook"
          placeholder="请输入最喜欢的书籍"
          maxLength="10"
          show-word-limit
        />
      </el-form-item>

      <p />

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        label="相册"
        prop="albumUrls"
        label-width="60px"
      >
        <yc-image-uploader
          ref="albumUrls"
          v-model="form.albumUrls"
          showTips
          :uploadSize="3"
          uploadMultiple
        />
      </el-form-item>
      <p />

      <el-form-item
        style="margin-top: 20px; margin-left: 20px"
        label="头像"
        prop="avatar"
        label-width="60px"
      >
        <yc-image-uploader
          ref="avatar"
          v-model="form.avatar"
          showTips
          :uploadSize="3"
        />
      </el-form-item>
      <p />

      <el-button type="primary" @click="editData">确 定</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  components: {},
  data(vm) {
    return {
      ps: '',
      /*弹出框显隐形*/
      dialogVisible: false,
      psList: [],
      props: { multiple: true, checkStrictly: true, expandTrigger: 'hover' },
      hobbyList: [
        { value: '聚会' },
        { value: '电子游戏' },
        { value: '桌游' },
        { value: '棋牌游戏' },
        { value: '美食' },
        { value: '绘画' },
        { value: '写作' },
        { value: '摄影' },
        { value: '听音乐' },
        { value: '乐器演出' },
        { value: '社交' },
        { value: '手工艺' },
        { value: '购物' },
        { value: '学习新技能' },
        { value: '养生' }
      ],
      motionList: [
        { value: '篮球' },
        { value: '足球' },
        { value: '跑步' },
        { value: '游泳' },
        { value: '徒步' },
        { value: '瑜伽' },
        { value: '健身操' },
        { value: '羽毛球' },
        { value: '乒乓球' },
        { value: '登山' },
        { value: '骑行' },
        { value: '滑板' },
        { value: '桨板' },
        { value: '攀岩' }
      ],
      dietList: [
        { value: '面食为主' },
        { value: '香辣' },
        { value: '麻辣' },
        { value: '原汁原味' },
        { value: '粤菜' },
        { value: '顺德菜' },
        { value: '点心' },
        { value: '茶餐厅' },
        { value: '东南亚菜' },
        { value: '偏向清淡' },
        { value: '海鲜' },
        { value: '淮扬菜' },
        { value: '苏式' },
        { value: '杭帮菜' },
        { value: '徽菜' },
        { value: '鲁菜' },
        { value: '川菜' },
        { value: '闽菜' },
        { value: '浙菜' },
        { value: '湘菜' },
        { value: '潮汕菜' },
        { value: '客家菜' },
        { value: '西餐' },
        { value: '德式' },
        { value: '美式' },
        { value: '法式' },
        { value: '土耳其菜' }
      ],
      dietList: [
        { value: '面食为主' },
        { value: '香辣' },
        { value: '麻辣' },
        { value: '原汁原味' },
        { value: '粤菜' },
        { value: '顺德菜' },
        { value: '点心' },
        { value: '茶餐厅' },
        { value: '东南亚菜' },
        { value: '偏向清淡' },
        { value: '海鲜' },
        { value: '淮扬菜' },
        { value: '苏式' },
        { value: '杭帮菜' },
        { value: '徽菜' },
        { value: '鲁菜' },
        { value: '川菜' },
        { value: '闽菜' },
        { value: '浙菜' },
        { value: '湘菜' },
        { value: '潮汕菜' },
        { value: '客家菜' },
        { value: '西餐' },
        { value: '德式' },
        { value: '美式' },
        { value: '法式' },
        { value: '土耳其菜' }
      ],
      movieTypeList: [
        { value: '动作' },
        { value: '冒险' },
        { value: '喜剧' },
        { value: '剧情' },
        { value: '悬疑' },
        { value: '恐怖' },
        { value: '科幻' },
        { value: '奇幻' },
        { value: '浪漫' },
        { value: '战争' },
        { value: '历史' },
        { value: '文艺' },
        { value: '家庭' },
        { value: '动画' },
        { value: '纪录片' },
        { value: '音乐/歌舞' },
        { value: '其他' }
      ],
      musicTypeList: [
        { value: '流行音乐' },
        { value: '摇滚' },
        { value: '爵士乐' },
        { value: '古典音乐' },
        { value: '乡村音乐' },
        { value: '电子音乐' },
        { value: 'R&B/灵魂音乐' },
        { value: '嘻哈' },
        { value: '蓝调' },
        { value: '雷鬼' },
        { value: '重金属' },
        { value: '朋克' },
        { value: '蓝草' },
        { value: '福音音乐' },
        { value: '拉丁音乐' },
        { value: '民谣' },
        { value: '中国传统音乐' }
      ],
      CountryList: [
        { name: '安道尔' },
        { name: '阿联酋' },
        { name: '阿富汗' },
        { name: '安提瓜和巴布达' },
        { name: '安圭拉' },
        { name: '阿尔巴尼亚' },
        { name: '亚美尼亚' },
        { name: '安哥拉' },
        { name: '南极洲' },
        { name: '阿根廷' },
        { name: '美属萨摩亚' },
        { name: '奥地利' },
        { name: '澳大利亚' },
        { name: '阿鲁巴' },
        { name: '奥兰' },
        { name: '阿塞拜疆' },
        { name: '波黑' },
        { name: '巴巴多斯' },
        { name: '孟加拉国' },
        { name: '比利时' },
        { name: '布基纳法索' },
        { name: '保加利亚' },
        { name: '巴林' },
        { name: '布隆迪' },
        { name: '贝宁' },
        { name: '圣巴泰勒米' },
        { name: '百慕大' },
        { name: '文莱' },
        { name: '玻利维亚' },
        { name: '荷兰加勒比区' },
        { name: '巴西' },
        { name: '巴哈马' },
        { name: '不丹' },
        { name: '布韦岛' },
        { name: '博茨瓦纳' },
        { name: '白俄罗斯' },
        { name: '伯利兹' },
        { name: '加拿大' },
        { name: '科科斯（基林）群岛' },
        { name: '刚果民主共和国' },
        { name: '中非' },
        { name: '刚果共和国' },
        { name: '瑞士' },
        { name: '科特迪瓦' },
        { name: '库克群岛' },
        { name: '智利' },
        { name: '喀麦隆' },
        { name: '哥伦比亚' },
        { name: '哥斯达黎加' },
        { name: '古巴' },
        { name: '佛得角' },
        { name: '库拉索' },
        { name: '圣诞岛' },
        { name: '塞浦路斯' },
        { name: '捷克' },
        { name: '德国' },
        { name: '吉布提' },
        { name: '丹麦' },
        { name: '多米尼克' },
        { name: '多米尼加' },
        { name: '阿尔及利亚' },
        { name: '厄瓜多尔' },
        { name: '爱沙尼亚' },
        { name: '埃及' },
        { name: '西撒哈拉' },
        { name: '厄立特里亚' },
        { name: '西班牙' },
        { name: '埃塞俄比亚' },
        { name: '芬兰' },
        { name: '斐济' },
        { name: '福克兰群岛' },
        { name: '密克罗尼西亚联邦' },
        { name: '法罗群岛' },
        { name: '法国' },
        { name: '加蓬' },
        { name: '英国' },
        { name: '格林纳达' },
        { name: '格鲁吉亚' },
        { name: '法属圭亚那' },
        { name: '根西' },
        { name: '加纳' },
        { name: '直布罗陀' },
        { name: '格陵兰' },
        { name: '冈比亚' },
        { name: '几内亚' },
        { name: '瓜德罗普' },
        { name: '赤道几内亚' },
        { name: '希腊' },
        { name: '南乔治亚和南桑威奇群岛' },
        { name: '危地马拉' },
        { name: '关岛' },
        { name: '几内亚比绍' },
        { name: '圭亚那' },
        { name: '赫德岛和麦克唐纳群岛' },
        { name: '洪都拉斯' },
        { name: '克罗地亚' },
        { name: '海地' },
        { name: '匈牙利' },
        { name: '印度尼西亚' },
        { name: '爱尔兰' },
        { name: '以色列' },
        { name: '马恩岛' },
        { name: '印度' },
        { name: '英属印度洋领地' },
        { name: '伊拉克' },
        { name: '伊朗' },
        { name: '冰岛' },
        { name: '意大利' },
        { name: '泽西' },
        { name: '牙买加' },
        { name: '约旦' },
        { name: '日本' },
        { name: '肯尼亚' },
        { name: '吉尔吉斯斯坦' },
        { name: '柬埔寨' },
        { name: '基里巴斯' },
        { name: '科摩罗' },
        { name: '圣基茨和尼维斯' },
        { name: '朝鲜' },
        { name: '韩国' },
        { name: '科威特' },
        { name: '开曼群岛' },
        { name: '哈萨克斯坦' },
        { name: '老挝' },
        { name: '黎巴嫩' },
        { name: '圣卢西亚' },
        { name: '列支敦士登' },
        { name: '斯里兰卡' },
        { name: '利比里亚' },
        { name: '莱索托' },
        { name: '立陶宛' },
        { name: '卢森堡' },
        { name: '拉脱维亚' },
        { name: '利比亚' },
        { name: '摩洛哥' },
        { name: '摩纳哥' },
        { name: '摩尔多瓦' },
        { name: '黑山' },
        { name: '法属圣马丁' },
        { name: '马达加斯加' },
        { name: '马绍尔群岛' },
        { name: '北马其顿' },
        { name: '马里' },
        { name: '缅甸' },
        { name: '蒙古' },
        { name: '澳门' },
        { name: '北马里亚纳群岛' },
        { name: '马提尼克' },
        { name: '毛里塔尼亚' },
        { name: '蒙特塞拉特' },
        { name: '马耳他' },
        { name: '毛里求斯' },
        { name: '马尔代夫' },
        { name: '马拉维' },
        { name: '墨西哥' },
        { name: '马来西亚' },
        { name: '莫桑比克' },
        { name: '纳米比亚' },
        { name: '新喀里多尼亚' },
        { name: '尼日尔' },
        { name: '诺福克岛' },
        { name: '尼日利亚' },
        { name: '尼加拉瓜' },
        { name: '荷兰' },
        { name: '挪威' },
        { name: '尼泊尔' },
        { name: '瑙鲁' },
        { name: '纽埃' },
        { name: '新西兰' },
        { name: '阿曼' },
        { name: '巴拿马' },
        { name: '秘鲁' },
        { name: '法属波利尼西亚' },
        { name: '巴布亚新几内亚' },
        { name: '菲律宾' },
        { name: '巴基斯坦' },
        { name: '波兰' },
        { name: '圣皮埃尔和密克隆' },
        { name: '皮特凯恩群岛' },
        { name: '波多黎各' },
        { name: '巴勒斯坦' },
        { name: '葡萄牙' },
        { name: '帕劳' },
        { name: '巴拉圭' },
        { name: '卡塔尔' },
        { name: '留尼汪' },
        { name: '罗马尼亚' },
        { name: '塞尔维亚' },
        { name: '俄罗斯' },
        { name: '卢旺达' },
        { name: '沙特阿拉伯' },
        { name: '所罗门群岛' },
        { name: '塞舌尔' },
        { name: '苏丹' },
        { name: '瑞典' },
        { name: '新加坡' },
        { name: '圣赫勒拿、阿森松和特里斯坦-达库尼亚' },
        { name: '斯洛文尼亚' },
        { name: '斯瓦尔巴和扬马延' },
        { name: '斯洛伐克' },
        { name: '塞拉利昂' },
        { name: '圣马力诺' },
        { name: '塞内加尔' },
        { name: '索马里' },
        { name: '苏里南' },
        { name: '南苏丹' },
        { name: '圣多美和普林西比' },
        { name: '萨尔瓦多' },
        { name: '荷属圣马丁' },
        { name: '叙利亚' },
        { name: '斯威士兰' },
        { name: '特克斯和凯科斯群岛' },
        { name: '乍得' },
        { name: '法属南部和南极领地' },
        { name: '多哥' },
        { name: '泰国' },
        { name: '塔吉克斯坦' },
        { name: '托克劳' },
        { name: '东帝汶' },
        { name: '土库曼斯坦' },
        { name: '突尼斯' },
        { name: '汤加' },
        { name: '土耳其' },
        { name: '特立尼达和多巴哥' },
        { name: '图瓦卢' },
        { name: '坦桑尼亚' },
        { name: '乌克兰' },
        { name: '乌干达' },
        { name: '美国本土外小岛屿' },
        { name: '美国' },
        { name: '乌拉圭' },
        { name: '乌兹别克斯坦' },
        { name: '梵蒂冈' },
        { name: '圣文森特和格林纳丁斯' },
        { name: '委内瑞拉' },
        { name: '英属维尔京群岛' },
        { name: '美属维尔京群岛' },
        { name: '越南' },
        { name: '瓦努阿图' },
        { name: '瓦利斯和富图纳' },
        { name: '萨摩亚' },
        { name: '也门' },
        { name: '马约特' },
        { name: '南非' },
        { name: '赞比亚' },
        { name: '津巴布韦' }
      ],
      sexList: [
        {
          key: '男',
          value: 'MALE'
        },
        {
          key: '女',
          value: 'FEMALE'
        },
        {
          key: '未知',
          value: 'UNKNOWN'
        }
      ],
      heights: [],
      weights: [],
      form: {},
      areaList: [],
      areaId: [],
      place: [],
      placeType: 0,
      dialogRecommd: false,
      userList: [],
      userLoading: false,
      options: [
        {
          value: 0,
          label: '国内',
          children: [...this.$enums.LP_HOT_PLACE.list]
        },
        {
          value: 1,
          label: '国际',
          children: [...this.$enums.LP_HOT_NATIONAL_PLACE.list]
        }
      ],
      /*表单*/
      table: {
        api: this.$api.LpUserMessageList,
        query: {},
        searchData: [],
        columns: [
          {
            title: '序号',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.seq(ctx))
            },
            width: 100
          },
          {
            title: '姓名',
            key: 'name',
            width: 100
          },
          {
            title: '相册',
            key: 'albumUrls',
            isImage: true,
            width: 100
          },
          {
            title: '性别',
            key: 'sex',
            enumType: 'Sex',
            width: 100
          },
          {
            title: '手机号',
            key: 'phone',
            width: 110
          },
          {
            title: '年龄',
            key: 'age',
            width: 100
          },
          {
            title: '职业',
            key: 'occupation',
            width: 100
          },
          {
            title: '学历',
            key: 'education',
            width: 100
          },
          {
            title: '身高',
            key: 'height',
            width: 100
          },
          {
            title: '体重',
            key: 'weight',
            width: 100
          },
          {
            title: '籍贯',
            key: 'cityName',
            width: 100
          },
          {
            title: '政治面貌',
            key: 'politicalStatus',
            width: 100
          },
          {
            title: '套餐',
            key: 'lpMembershipPackageName',
            width: 100
          }
        ]
      }
    }
  },
  activated() {
    this.initAreaData()
    this.getHeight()
    this.getWeight()
    /*this.clearData();*/
    this.queryLpUserMessage()
    this.queryPsList()
  },
  methods: {
    //  获取地区集联数据
    async initAreaData() {
      this.areaList = await this.$api.regionQueryRegionCascadeList({})
    },
    async queryPsList() {
      this.psList = await this.$api.LpUserMessagePsList({
        userId: this.$route.query.id
      })
      console.log(this.psList)
    },
    onRecommndToOther() {
      this.dialogRecommd = true
    },
    async remoteMethodUser(query) {
      let res = await this.$api.authorQueryAuthorPage({
        keyWord: query,
        pageNo: 1,
        pageSize: 20
      })
      this.userList = res.records
    },
    async queryLpUserMessage() {
      let res = await this.$api.queryLpUserMessage(this.$route.query.id)
      res['areaId'] = [res.provinceId, res.cityId]
      res['height'] = res.height ? `${res.height}cm` : ''
      res['weight'] = res.weight ? `${res.weight}kg` : ''
      this.getId(res)

      if (!res.isOverSea) {
        res['isOverSea'] = false
      }

      let place = []

      if (res.placesToVisitDomestic && res.placesToVisitDomestic.length) {
        res.placesToVisitDomestic.map((v) => {
          place.push([0, this.$enums.LP_HOT_PLACE.getId(v)])
        })
      }
      if (res.placesToVisitOversea && res.placesToVisitOversea.length) {
        res.placesToVisitOversea.map((v) => {
          place.push([1, this.$enums.LP_HOT_NATIONAL_PLACE.getId(v)])
        })
      }
      this.$nextTick((_) => {
        this.place = place
        this.form = res
        this.form.payPrice = this.form.payPrice / 100
      })

      this.$nextTick(() => {
        this.$refs['albumUrls'].setFileList(this.form.albumUrls)
        this.$refs['avatar'].setFileList(this.form.avatar)
      })
    },
    clearData() {
      this.form = {}
      this.$refs['albumUrls'].setFileList()
    },
    editData() {
      let form = JSON.parse(JSON.stringify(this.form))

      form.provinceId = form.areaId[0]
      form.cityId = form.areaId[1]
      this.getName(form.residenceAreaId[0], form.residenceAreaId[1])
      
      if(form.avatar === ''){
        form.avatar = null;
      }

      if (this.place.length) {
        let oversea = []
        let domestic = []

        this.place.map((v) => {
          if (v[0] === 0) {
            domestic.push(this.$enums.LP_HOT_PLACE.getName(v[1]))
          } else if (v[0] === 1) {
            oversea.push(this.$enums.LP_HOT_NATIONAL_PLACE.getName(v[1]))
          }
        })
        form.placesToVisitDomestic = domestic
        form.placesToVisitOversea = oversea
      }

      if (form.height) {
        form.height = Number(form.height.replace('cm', ''))
      }
      if (form.weight) {
        form.weight = Number(form.weight.replace('kg', ''))
      }
      this.$api.lpUserMessageSave(form)
      this.$message.success('编辑成功')
    },
    addPs() {
      this.dialogVisible = true
      this.ps = ''
    },
    /*清空数据*/
    dialogClose() {
      this.dialogVisible = false
      this.ps = ''
    },
    async submitPs() {
      const optUserId = JSON.parse(sessionStorage.getItem('user')).loginId
      await this.$api.LpUserMessagePsAdd({
        lpUserId: this.form.id,
        optUserId: optUserId,
        text: this.ps
      })
      await this.queryPsList()
      await this.dialogClose()
    },
    //获取体重列表
    getHeight() {
      let count = 120
      for (let i = 0; i < 101; i++) {
        this.heights.push({ text: `${count++}cm` })
      }
    },
    //获取体重列表
    getWeight() {
      let count = 35
      for (let i = 0; i < 146; i++) {
        this.weights.push({ text: `${count++}kg` })
      }
    },
    getName(proId, cityId) {
      this.areaList.map((v) => {
        if (v.id === proId) {
          this.form.permanentResidenceProvince = v.regionName
          v.subRegionList.map((city) => {
            if (city.id === cityId) {
              this.form.permanentResidenceCity = city.regionName
            }
          })
        }
      })
    },
    getId(res) {
      res['residenceAreaId'] = []

      this.areaList.map((v) => {
        if (v.regionName === res.permanentResidenceProvince) {
          res['residenceAreaId'].push(v.id)
          v.subRegionList.map((city) => {
            if (city.regionName === res.permanentResidenceCity) {
              res['residenceAreaId'].push(city.id)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="sass" scoped>
.recommendPop
  padding: 40px
  &-searchBox
    @include hor
    align-items: center
    width: 100%
    padding-bottom: 60px
    border-bottom: 1px solid #EEEEEE
  &-title
    font-weight: 600
    font-size: 20px
    padding-bottom: 20px
  &-subTitle
    font-weight: 600
    font-size: 20px
    padding-top: 40px
.avatar
  width: 20px
  height: 20px
  border-radius: 20px
</style>

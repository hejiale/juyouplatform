// 枚举合集
export default {
  // ---------------- 布尔枚举  开始 -------------------
  ActivityType: {
    // 枚举列表
    list: [
      { label: '直接发券', value: 'DIRECT_RELEASE' },
      { label: '完成活动自动发券', value: 'ACTIVITY_GET_COUPON' },
      { label: '用户领券', value: 'LINK_GET_COUPON' },
      { label: '普通发券', value: 'NORMAL_RELEASE' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'DIRECT_RELEASE':
          return '直接发券'
        case 'ACTIVITY_GET_COUPON':
          return '完成活动自动发券'
        case 'LINK_GET_COUPON':
          return '用户领券'
        case 'NORMAL_RELEASE':
          return '普通发券'
        default:
          return val
      }
    }
  },
  // ---------------- AppTypeList枚举  结束 -------------------

  // ---------------- 布尔枚举  开始 -------------------
  AppTypeList: {
    // 枚举列表
    list: [
      { label: '邮件搜证', value: 'EMAIL' },
      { label: '支付宝App搜证', value: 'ALIPAY' },
      { label: '微信App搜证', value: 'WE_CHAT' },
      { label: '小红书App搜证', value: 'LITTLE_RED_BOOK' },
      { label: '本回合背景音乐', value: 'ROUNDAUDIO' },
      { label: '配置', value: 'SETTING' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'EMAIL':
          return '邮件搜证'
        case 'ALIPAY':
          return '支付宝App搜证'
        case 'WE_CHAT':
          return '微信App搜证'
        case 'LITTLE_RED_BOOK':
          return '小红书App搜证'
        case 'ROUNDAUDIO':
          return '本回合背景音乐'
        case 'SETTING':
          return '配置'
        default:
          return val
      }
    }
  },
  // ---------------- AppTypeList枚举  结束 -------------------

  // ---------------- 布尔枚举  开始 -------------------
  Bool: {
    // 枚举列表
    list: [
      { label: '是', value: true },
      { label: '否', value: false }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case true:
          return '是'
        case false:
          return '否'
        default:
          return val
      }
    }
  },
  // ---------------- 布尔枚举  结束 -------------------

  // ---------------- 布尔枚举  开始 -------------------
  NationBool: {
    // 枚举列表
    list: [
      { label: '国内', value: false },
      { label: '国外', value: true }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case false:
          return '国内'
        case true:
          return '国外'
        default:
          return val
      }
    }
  },
  // ---------------- 布尔枚举  结束 -------------------

  // ---------------- 常住地枚举  开始 -------------------
  ResidenceType: {
    // 枚举列表
    list: [
      { label: '国内', value: 'DOMESTIC' },
      { label: '国外', value: 'OVERSEAS' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'DOMESTIC':
          return '国内'
        case 'OVERSEAS':
          return '国外'
        default:
          return val
      }
    }
  },
  // ---------------- 布尔枚举  结束 -------------------

  // ---------------- StatusEnum 枚举  开始 -------------------
  StatusEnum: {
    // 枚举列表
    list: [
      { label: '有效', value: "ENABLE" },
      { label: '失效', value: "DISABLE" }
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "ENABLE":
          return '有效'
        case "DISABLE":
          return '失效'
        default:
          return val
      }
    }
  },
  // ---------------- StatusEnum 枚举  结束 -------------------

  // ---------------- ActivityStatus枚举  开始 -------------------
  ActivityStatus: {
    // 枚举列表
    list: [
      { label: '未开始', value: 'CREATED' },
      { label: '进行中', value: 'IN_PROGRESS' },
      { label: '已完成', value: 'FINISHED' },
      { label: '已撤回', value: 'WITHDRAW_BACK' },
      { label: '已过期', value: 'EXPIRED' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'CREATED':
          return '未开始'
        case 'IN_PROGRESS':
          return '进行中'
        case 'FINISHED':
          return '已完成'
        case 'WITHDRAW_BACK':
          return '已撤回'
        case 'EXPIRED':
          return '已过期'
        default:
          return val
      }
    }
  },
  // ---------------- ActivityStatus枚举  结束 -------------------

  // ---------------- CustomActivityStatus枚举  开始 -------------------
  CustomActivityStatus: {
    // 枚举列表
    list: [
      { label: '已完成', value: 'FINISHED' },
      { label: '已撤回', value: 'WITHDRAW_BACK' }
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'FINISHED':
          return '已完成'
        case 'WITHDRAW_BACK':
          return '已撤回'
        default:
          return val
      }
    }
  },
  // ---------------- CustomActivityStatus枚举  结束 -------------------

  // ---------------- AdminStatus枚举  开始 -------------------
  AdminStatus: {
    // 枚举列表
    list: [
      { label: '启用', value: 'ENABLE' },
      { label: '禁用', value: 'DISABLE' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'ENABLE':
          return '启用'
        case 'DISABLE':
          return '禁用'
        default:
          return val
      }
    }
  },
  // ---------------- AdminStatus枚举  结束 -------------------

  // ---------------- AdminStatus枚举  开始 -------------------
  AuthorStatus: {
    // 枚举列表
    list: [
      { label: '启用', value: 'ENABLED' },
      { label: '禁用', value: 'DISABLED' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'ENABLED':
          return '启用'
        case 'DISABLED':
          return '禁用'
        default:
          return val
      }
    }
  },
  // ---------------- AdminStatus枚举  结束 -------------------

  // ---------------- AnswerApplyStatus枚举  开始 -------------------
  AnswerApplyStatus: {
    // 枚举列表
    list: [
      { label: '待审核', value: 'WAIT' },
      { label: '通过', value: 'PASS' },
      { label: '不通过', value: 'UN_PASS' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'WAIT':
          return '待审核'
        case 'PASS':
          return '通过'
        case 'UN_PASS':
          return '不通过'
        default:
          return val
      }
    }
  },
  // ---------------- AnswerApplyStatus枚举  结束 -------------------

  // ---------------- AnswerType枚举  开始 -------------------
  AnswerType: {
    // 枚举列表
    list: [
      { label: '文字', value: 'WORD' },
      { label: '图片', value: 'PICTURE' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'WORD':
          return '文字'
        case 'PICTURE':
          return '图片'
        default:
          return val
      }
    }
  },
  // ---------------- AnswerType枚举  结束 -------------------

  // ---------------- BoxDramaApplyStatus枚举  开始 -------------------
  BoxDramaApplyStatus: {
    // 枚举列表
    list: [
      { label: '未开始', value: 'UN_START' },
      { label: '授权中', value: 'START' },
      { label: '已结束', value: 'END' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'UN_START':
          return '未开始'
        case 'START':
          return '授权中'
        case 'END':
          return '已结束'
        default:
          return ''
      }
    }
  },
  // ---------------- BoxDramaApplyStatus枚举  结束 -------------------

  // ---------------- CountType枚举  开始 -------------------
  CountType: {
    // 枚举列表
    list: [
      { label: '累计', value: 'ACCUMULATE' },
      { label: '重复', value: 'REPEAT' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'ACCUMULATE':
          return '累计'
        case 'REPEAT':
          return '重复'
        default:
          return val
      }
    }
  },
  // ---------------- CountType枚举  结束 -------------------

  // ---------------- ClueType枚举  开始 -------------------
  ClueType: {
    // 枚举列表
    list: [
      { label: '文字', value: 'TEXT' },
      { label: '图片', value: 'IMAGE' },
      { label: '视频', value: 'VIDEO' },
      { label: '音频', value: 'AUDIO' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'TEXT':
          return '文字'
        case 'IMAGE':
          return '图片'
        case 'VIDEO':
          return '视频'
        case 'AUDIO':
          return '音频'
        default:
          return val
      }
    }
  },
  // ---------------- ClueType枚举  结束 -------------------

  // ---------------- CouponTicketType枚举  开始 -------------------
  CouponTicketType: {
    // 枚举列表
    list: [
      { label: '减免券', value: 'FEE_CUT' },
      { label: '抵扣场次券', value: 'DEDUCTION_ONCE' },
      { label: '其他券', value: 'OTHER' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'FEE_CUT':
          return '减免券'
        case 'DEDUCTION_ONCE':
          return '抵扣场次券'
        case 'OTHER':
          return '其他券'
        default:
          return val
      }
    }
  },
  // ---------------- CouponTicketType枚举  结束 -------------------

  // ---------------- CouponType枚举  开始 -------------------
  CouponType: {
    // 枚举列表
    list: [
      { label: '减免券', value: 'FEE_CUT' },
      { label: '抵扣场次券', value: 'DEDUCTION_ONCE' },
      { label: '其他券', value: 'OTHER' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'FEE_CUT':
          return '减免券'
        case 'DEDUCTION_ONCE':
          return '抵扣场次券'
        case 'OTHER':
          return '其他券'
        default:
          return val
      }
    }
  },
  // ---------------- CouponType枚举  结束 -------------------

  // ---------------- DistributeType枚举  开始 -------------------
  DistributeType: {
    // 枚举列表
    list: [
      { label: '回合开始自动发给玩家', value: 'PLAYER' },
      { label: '回合开始发到公开池', value: 'PUBLIC' },
      { label: '由DM控制分发', value: 'DM' },
      { label: '本回合背景音乐', value: 'AUDIO' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'PLAYER':
          return '回合开始自动发给玩家'
        case 'PUBLIC':
          return '回合开始发到公开池'
        case 'DM':
          return '由DM控制分发'
        case 'AUDIO':
          return '本回合背景音乐'
        default:
          return val
      }
    }
  },
  // ---------------- DistributeType枚举  结束 -------------------

  // ---------------- DramaAgeAppropriate枚举  开始 -------------------
  DramaAgeAppropriate: {
    // 枚举列表
    list: [
      { label: '8+', value: 'EXCEED_8' },
      { label: '12+', value: 'EXCEED_12' },
      { label: '16+', value: 'EXCEED_16' },
      { label: '18+', value: 'EXCEED_18' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'EXCEED_8':
          return '8+'
        case 'EXCEED_12':
          return '12+'
        case 'EXCEED_16':
          return '16+'
        case 'EXCEED_18':
          return '18+'
        default:
          return val
      }
    }
  },
  // ---------------- DramaAgeAppropriate枚举  结束 -------------------

  // ---------------- DramaDifficulty枚举  开始 -------------------
  DramaDifficulty: {
    // 枚举列表
    list: [
      { label: '新手', value: 'NOVICE' },
      { label: '进阶', value: 'ADVANCE' },
      { label: '烧脑', value: 'BURNING_BRAIN' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'NOVICE':
          return '新手'
        case 'ADVANCE':
          return '进阶'
        case 'BURNING_BRAIN':
          return '烧脑'
        default:
          return val
      }
    }
  },
  // ---------------- DramaDifficulty枚举  结束 -------------------

  // ---------------- EnableStatus枚举  开始 -------------------
  EnableStatus: {
    // 枚举列表
    list: [
      { label: '启用', value: 'ENABLED' },
      { label: '停用', value: 'DISABLED' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'ENABLED':
          return '启用'
        case 'DISABLED':
          return '停用'
        default:
          return val
      }
    }
  },
  // ---------------- EnableStatus枚举  结束 ------------------

  // ---------------- ShippingFee枚举  开始 -------------------
  ShippingFee: {
    // 枚举列表
    list: [
      { label: '待揽收', value: 'AWAITING_COLLECTION' },
      { label: '已揽收', value: 'COLLECTED' },
      { label: '运输中', value: 'IN_TRANSIT' },
      { label: '派件中', value: 'OUT_FOR_DELIVERY' },
      { label: '已代签收', value: 'SIGNED_BY_PROXY' },
      { label: '已签收', value: 'DELIVERED' },
      { label: '包裹异常', value: 'PACKAGE_EXCEPTION' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'AWAITING_COLLECTION':
          return '待揽收'
        case 'COLLECTED':
          return '已揽收'
        case 'IN_TRANSIT':
          return '运输中'
        case 'OUT_FOR_DELIVERY':
          return '派件中'
        case 'SIGNED_BY_PROXY':
          return '已代签收'
        case 'DELIVERED':
          return '已签收'
        case 'PACKAGE_EXCEPTION':
          return '包裹异常'
        default:
          return val
      }
    }
  },
  // ---------------- ShippingFee枚举  结束 -------------------

  // ---------------- MarketType枚举  开始 -------------------
  MarketType: {
    // 枚举列表
    list: [{ label: 'BAR', value: 'FOO' }],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'FOO':
          return 'BAR'
        default:
          return val
      }
    }
  },
  // ---------------- MarketType枚举  结束 -------------------

  // ---------------- OrderStatus枚举  开始 -------------------
  OrderStatus: {
    // 枚举列表
    list: [
      { label: '未付款', value: 'NOT_PAY' },
      { label: '已支付', value: 'PAYED' },
      { label: '已完成', value: 'USED' },
      { label: '已退款', value: 'REVERSE' },
      { label: '已关闭', value: 'CLOSE' },
      { label: '已结算', value: 'SETTLEMENT' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'NOT_PAY':
          return '未付款'
        case 'PAYED':
          return '已支付'
        case 'USED':
          return '已完成'
        case 'REVERSE':
          return '已退款'
        case 'CLOSE':
          return '已关闭'
        case 'SETTLEMENT':
          return '已结算'
        default:
          return val
      }
    }
  },
  // ---------------- OrderStatus枚举  结束 -------------------

  // ---------------- PayChannel枚举  开始 -------------------
  PayChannel: {
    // 枚举列表
    list: [
      { label: '支付宝支付', value: 'ALIPAY' },
      { label: '微信支付', value: 'WX_PAY' },
      { label: '微信扫码支付', value: 'WX_SCAN_PAY' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'ALIPAY':
          return '支付宝支付'
        case 'WX_PAY':
          return '微信支付'
        case 'WX_SCAN_PAY':
          return '微信扫码支付'
        default:
          return val
      }
    }
  },
  // ---------------- PayChannel枚举  结束 -------------------

  // ---------------- PayType枚举  开始 -------------------
  PayType: {
    // 枚举列表
    list: [
      { label: '账户余额', value: 'BALANCE' },
      { label: '微信', value: 'WECHAT_WXA' },
      { label: '支付宝', value: 'ALIPAY_APP' },
      { label: '优惠券', value: 'COUPON' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'BALANCE':
          return '账户余额'
        case 'WECHAT_WXA':
          return '微信'
        case 'ALIPAY_APP':
          return '支付宝'
        case 'COUPON':
          return '优惠券'
        default:
          return val
      }
    }
  },
  // ---------------- PayType枚举  结束 -------------------

  // ---------------- PlayType枚举  开始 -------------------
  PlayType: {
    // 枚举列表
    list: [
      { label: '单次', value: 'ONCE' },
      { label: '循环', value: 'LOOP' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'ONCE':
          return '单次'
        case 'LOOP':
          return '循环'
        default:
          return val
      }
    }
  },
  // ---------------- PlayType枚举  结束 -------------------

  // ---------------- ProductType枚举  开始 -------------------
  ProductType: {
    // 枚举列表
    list: [
      { label: '申领剧本商品', value: 'APPLY_DRAMA_PRODUCT' },
      { label: '票房本开本商品', value: 'BOX_OFFICE_PRODUCT' },
      { label: '组局商品', value: 'GATHERING_PRODUCT' },
      { label: 'LP活动商品', value: 'LP_ACTIVITY_PRODUCT' },
      { label: 'LP会员套餐商品', value: 'LP_MEMBERSHIP_PRODUCT' },
      { label: 'LP付费匹配次数商品', value: 'LP_MATCH_COUNT_FEE_PRODUCT' },
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'APPLY_DRAMA_PRODUCT':
          return '申领剧本商品'
        case 'BOX_OFFICE_PRODUCT':
          return '票房本开本商品'
        case 'GATHERING_PRODUCT':
          return '组局商品'
        case 'LP_ACTIVITY_PRODUCT':
          return 'LP活动商品'
        case 'LP_MEMBERSHIP_PRODUCT':
          return 'LP会员套餐商品'
        case 'LP_MATCH_COUNT_FEE_PRODUCT':
          return 'LP付费匹配次数商品'
        default:
          return val
      }
    }
  },
  // ---------------- ProductType枚举  结束 -------------------

  // ---------------- PublisherApplyStatus枚举  开始 -------------------
  PublisherApplyStatus: {
    // 枚举列表
    list: [
      { label: '待处理', value: 'WAIT_AUDIT' },
      { label: '已通过', value: 'PASS' },
      { label: '未通过', value: 'NO_PASS' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'WAIT_AUDIT':
          return '待处理'
        case 'PASS':
          return '已通过'
        case 'NO_PASS':
          return '未通过'
        default:
          return val
      }
    }
  },
  // ---------------- PublisherApplyStatus枚举  结束 -------------------

  // ---------------- RoleStatus枚举  开始 -------------------
  RoleStatus: {
    // 枚举列表
    list: [
      { label: '启用', value: 'ENABLE' },
      { label: '禁用', value: 'DISABLE' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'ENABLE':
          return '启用'
        case 'DISABLE':
          return '禁用'
        default:
          return val
      }
    }
  },
  // ---------------- RoleStatus枚举  结束 -------------------

  // ---------------- RoundType枚举  开始 -------------------
  RoundType: {
    // 枚举列表
    list: [
      { label: '发线索回合', value: 'DISTRIBUTE_CLUE' },
      // { label: '场景搜证回合（如房间搜证）', value: 'SCENE_INVESTIGATION' },
      {
        label: '实物搜证回合（如手机搜证）',
        value: 'PHYSICAL_EVIDENCE_INVESTIGATION'
      },
      {
        label: '密码解密回合',
        value: 'PASSWORD_DECRYPTION'
      }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'DISTRIBUTE_CLUE':
          return '发线索回合'
        case 'SCENE_INVESTIGATION':
          return '场景搜证回合（如房间搜证）'
        case 'PHYSICAL_EVIDENCE_INVESTIGATION':
          return '实物搜证回合（如手机搜证）'
        case 'PASSWORD_DECRYPTION':
          return '密码解密回合'
        default:
          return val
      }
    }
  },
  // ---------------- RoundType枚举  结束 -------------------

  // ---------------- SendTimeType枚举  开始 -------------------
  SendTimeType: {
    // 枚举列表
    list: [
      { label: '固定时间', value: 'TIME_BETWEEN' },
      { label: '领取后', value: 'NEXT_DAYS' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'TIME_BETWEEN':
          return '固定时间'
        case 'NEXT_DAYS':
          return '领取后'
        default:
          return val
      }
    }
  },
  // ---------------- SendTimeType枚举  结束 -------------------

  // ---------------- SellType枚举  开始 -------------------
  SellType: {
    // 枚举列表
    list: [
      { label: '盒装', value: 'BOXED' },
      { label: '限定', value: 'LIMITED' },
      { label: '独家', value: 'EXCLUSIVE' },
      { label: '实景', value: 'REAL_SCENE' },
      { label: '待定', value: 'UNDETERMINED' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'BOXED':
          return '盒装'
        case 'LIMITED':
          return '限定'
        case 'EXCLUSIVE':
          return '独家'
        case 'REAL_SCENE':
          return '实景'
        case 'UNDETERMINED':
          return '待定'
        default:
          return val
      }
    }
  },
  // ---------------- SellType枚举  结束 -------------------

  // ---------------- SettleStatus枚举  开始 -------------------
  SettleStatus: {
    // 枚举列表
    list: [
      { label: '未结算', value: 'UNSETTLED' },
      { label: '正在结算', value: 'SETTLEMENT' },
      { label: '已结算', value: 'SETTLED' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'UNSETTLED':
          return '未结算'
        case 'SETTLEMENT':
          return '正在结算'
        case 'SETTLED':
          return '已结算'
        default:
          return val
      }
    }
  },
  // ---------------- SettleStatus枚举  结束 -------------------

  // ---------------- Sex枚举  开始 -------------------
  Sex: {
    // 枚举列表
    list: [
      { label: '男性', value: 'MALE' },
      { label: '女性', value: 'FEMALE' },
      { label: '未知', value: 'UNKNOWN' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'MALE':
          return '男性'
        case 'FEMALE':
          return '女性'
        case 'UNKNOWN':
          return '未知'
        default:
          return val
      }
    }
  },
  // ---------------- Sex枚举  结束 ------------------

  // ---------------- UserStatus枚举  开始 -------------------
  UserStatus: {
    // 枚举列表
    list: [
      { label: '启用', value: 'ENABLED' },
      { label: '停用', value: 'DISABLED' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'ENABLED':
          return '启用'
        case 'DISABLED':
          return '停用'
        default:
          return val
      }
    }
  },
  // ---------------- UserStatus枚举  结束 -------------------

  // ---------------- UserStatus枚举  开始 -------------------
  UseStatus: {
    // 枚举列表
    list: [
      { label: '已过期', value: 'EXPIRED' },
      { label: '已锁定', value: 'LOCKED' },
      { label: '未使用', value: 'NOT_USED' },
      { label: '已使用', value: 'USED' },
      { label: '已撤回', value: 'WITHDRAW_BACK' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'EXPIRED':
          return '已过期'
        case 'LOCKED':
          return '已锁定'
        case 'NOT_USED':
          return '未使用'
        case 'USED':
          return '已使用'
        case 'WITHDRAW_BACK':
          return '已撤回'
        default:
          return val
      }
    }
  },
  // ---------------- UserStatus枚举  结束 -------------------

  // ---------------- CommonApplyStatus枚举  开始 -------------------
  CommonApplyStatus: {
    // 枚举列表
    list: [
      { label: '审核未通过', value: 'REJECTED' },
      { label: '平台待审核', value: 'PLATFORM_PENDING' },
      { label: '待连连审核', value: 'LIANLIAN_PENDING' },
      { label: '待设置提现密码', value: 'LIANLIAN_PASS' },
      { label: '已完成', value: 'ACTIVATE' }
    ],

    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'REJECTED':
          return '审核未通过'
        case 'PLATFORM_PENDING':
          return '平台待审核'
        case 'LIANLIAN_PENDING':
          return '待连连审核'
        case 'LIANLIAN_PASS':
          return '待设置提现密码'
        case 'ACTIVATE':
          return '已完成'
        default:
          return val
      }
    }
  },
  // ---------------- CommonApplyStatus枚举  结束 -------------------

  // ---------------- ApplyActivate枚举  开始 -------------------
  ApplyActivate: {
    // 枚举列表
    list: [
      { label: '已激活', value: true },
      { label: '未激活', value: false }
    ],

    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case true:
          return '已激活'
        case false:
          return '未激活'
        default:
          return '未激活'
      }
    }
  },
  // ---------------- ApplyActivate枚举  结束 -------------------

  // ---------------- BoxStoreApplyChannel枚举  开始 -------------------
  BoxStoreApplyChannel: {
    // 枚举列表
    list: [
      { label: '小黑探', value: 'XIAOHEITAN' },
      { label: '团购代理', value: 'TUANGOU' },
      { label: '千岛', value: 'QIANDAO' },
      { label: '线下展会', value: 'ZHANHUI' },
      { label: '买本本', value: 'MAIBENBEN' },
      { label: '其他', value: 'OTHER' },
      { label: '剧游宇宙', value: 'JUYOU' }
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'XIAOHEITAN':
          return '小黑探'
        case 'TUANGOU':
          return '团购代理'
        case 'QIANDAO':
          return '千岛'
        case 'ZHANHUI':
          return '线下展会'
        case 'MAIBENBEN':
          return '买本本'
        case 'OTHER':
          return '其他'
        case 'JUYOU':
          return '剧游宇宙'
        default:
          return ''
      }
    }
  },
  // ---------------- BoxStoreApplyChannel枚举  结束 -------------------

  // ---------------- LogisticsStatus枚举  开始 -------------------
  LogisticsStatus: {
    // 枚举列表
    list: [
      { label: '待揽收', value: 'AWAITING_COLLECTION' },
      { label: '已揽收', value: 'COLLECTED' },
      { label: '运输中', value: 'IN_TRANSIT' },
      { label: '派件中', value: 'OUT_FOR_DELIVERY' },
      { label: '已代签收', value: 'SIGNED_BY_PROXY' },
      { label: '已签收', value: 'DELIVERED' },
      { label: '包裹异常', value: 'PACKAGE_EXCEPTION' }
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'AWAITING_COLLECTION':
          return '待揽收'
        case 'COLLECTED':
          return '已揽收'
        case 'IN_TRANSIT':
          return '运输中'
        case 'OUT_FOR_DELIVERY':
          return '派件中'
        case 'SIGNED_BY_PROXY':
          return '已代签收'
        case 'DELIVERED':
          return '已签收'
        case 'PACKAGE_EXCEPTION':
          return '包裹异常'
        default:
          return ''
      }
    }
  },
  // ---------------- LogisticsStatus枚举  结束 -------------------

  // ---------------- GamePlayer枚举  开始 -------------------
  GamePlayer: {
    // 枚举列表
    list: [
      { label: '小于等于4人', value: 4 },
      { label: '5人', value: 5 },
      { label: '6人', value: 6 },
      { label: '7人', value: 7 },
      { label: '8人', value: 8 },
      { label: '大于等于9人', value: 9 }
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 4:
          return '小于等于4人'
        case 5:
          return '5人'
        case 6:
          return '6人'
        case 7:
          return '7人'
        case 8:
          return '8人'
        case 9:
          return '大于等于9人'
        default:
          return ''
      }
    }
  },
  // ---------------- GamePlayer枚举  结束 -------------------

  // ---------------- VoteType枚举  开始 -------------------
  VoteType: {
    // 枚举列表
    list: [
      { label: '单选', value: 'SINGLE' },
      { label: '多选', value: 'MULTIPLE' }
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'SINGLE':
          return '单选'
        case 'MULTIPLE':
          return '多选'
        default:
          return ''
      }
    }
  },
  // ---------------- VoteType枚举  结束 -------------------

  // ---------------- StoreApplyStatus枚举  开始 -------------------
  StoreApplyStatus: {
    // 枚举列表
    list: [
      { label: '待审核', value: 'WAIT_AUDIT' },
      { label: '已通过', value: 'PASS' },
      { label: '未通过', value: 'REJECT' }
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'WAIT_AUDIT':
          return '待审核'
        case 'PASS':
          return '已通过'
        case 'REJECT':
          return '未通过'
        default:
          return ''
      }
    }
  },
  // ---------------- StoreApplyStatus枚举  结束 -------------------

  // ---------------- QuestionType枚举  开始 -------------------
  QuestionType: {
    // 枚举列表
    list: [
      { label: '单次', value: 'ONCE' },
      { label: '多选', value: 'MULTIPLE' }
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'ONCE':
          return '单选'
        case 'MULTIPLE':
          return '多选'
        default:
          return ''
      }
    }
  },
  // ---------------- QuestionType枚举  结束 -------------------

  // ---------------- ReceiveType枚举  开始 -------------------
  ReceiveType: {
    // 枚举列表
    list: [
      { label: '公开', value: 'PUBLIC' },
      { label: '角色', value: 'ROLE' }
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'PUBLIC':
          return '公开'
        case 'ROLE':
          return '角色'
        default:
          return ''
      }
    }
  },
  // ---------------- ReceiveType枚举  结束 -------------------

  // ---------------- DataSource枚举  开始 -------------------
  DataSource: {
    // 枚举列表
    list: [
      { label: '剧游宝小程序', value: 'SAAS_MP' },
      { label: '系统', value: 'SYSTEM' },
      { label: '剧游圈小程序', value: 'EXHIBITION_MP' },
      { label: '剧游APP', value: 'APP' },
      { label: '安卓', value: 'ANDROID' },
      { label: '苹果', value: 'IOS' },
      { label: '支付宝nft小程序', value: 'ZFB_NFT' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'SAAS_MP':
          return '剧游宝小程序'
        case 'SYSTEM':
          return '系统'
        case 'EXHIBITION_MP':
          return '剧游圈小程序'
        case 'APP':
          return '剧游APP'
        case 'ANDROID':
          return '安卓'
        case 'IOS':
          return '苹果'
        case 'ZFB_NFT':
          return '支付宝nft小程序'
        default:
          return val
      }
    }
  },
  // ---------------- DataSource枚举  结束 -------------------

  // ---------------- StoreUserType枚举  开始 -------------------
  StoreUserType: {
    // 枚举列表
    list: [
      { label: '店主', value: 'OWNER' },
      { label: '店长', value: 'SHOP_DIRECTOR' },
      { label: '员工', value: 'EMPLOYEE' },
      { label: 'DM', value: 'DM' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'OWNER':
          return '店主'
        case 'SHOP_DIRECTOR':
          return '店长'
        case 'EMPLOYEE':
          return '员工'
        case 'DM':
          return 'DM'
        default:
          return val
      }
    }
  },
  // ---------------- StoreUserType枚举  结束 -------------------

  // ---------------- NewStoreUserType枚举  开始 -------------------
  NewStoreUserType: {
    // 枚举列表
    list: [
      { label: '店长', value: 'SHOP_DIRECTOR' },
      { label: '员工', value: 'EMPLOYEE' },
      { label: 'DM', value: 'DM' }
    ]
  },
  // ---------------- NewStoreUserType枚举  结束 -------------------

  // ---------------- StoreType枚举  开始 -------------------
  StoreType: {
    // 枚举列表
    list: [
      { label: '官方店铺', value: 'AUTHORITY' },
      { label: '私人店铺', value: 'INDIVIDUAL' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'AUTHORITY':
          return '官方店铺'
        case 'INDIVIDUAL':
          return '私人店铺'
        default:
          return val
      }
    }
  },
  // ---------------- StoreType枚举  结束 -------------------

  // ---------------- TargetType枚举  开始 -------------------
  TargetType: {
    // 枚举列表
    list: [
      { label: '商家', value: 'STORE' },
      { label: '用户', value: 'USER' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'STORE':
          return '商家'
        case 'USER':
          return '用户'
        default:
          return val
      }
    }
  },
  // ---------------- TargetType枚举  结束 -------------------

  // ---------------- NewMerchantStatus枚举  开始 -------------------
  NewMerchantStatus: {
    // 枚举列表
    list: [
      { label: '待审核', value: 'PENDING' },
      { label: '启用', value: 'ENABLED' },
      { label: '禁用', value: 'DISABLED' }
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'ENABLED':
          return '启用'
        case 'DISABLED':
          return '禁用'
        default:
          return '待审核'
      }
    }
  },
  // ---------------- NewMerchantStatus枚举  结束 -------------------

  // ---------------- DictType枚举  开始 -------------------
  DictType: {
    // 枚举列表
    list: [{ label: '剧本题材', value: 'DRAMA' }, { label: '店铺标签', value: 'STORE_TAG' }],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'DRAMA':
          return '剧本题材'
        case 'STORE_TAG':
          return '店铺标签'
        default:
          return val
      }
    }
  },
  // ---------------- DictType枚举  结束 -------------------

  // ---------------- BoxStoreApplyStatus枚举  开始 -------------------
  BoxStoreApplyStatus: {
    // 枚举列表
    list: [
      { label: '待付款', value: 'WAIT_PAY' },
      { label: '待授权', value: 'WAIT_AUTHORIZE' },
      { label: '终止授权', value: 'REJECT_AUTHORIZE' },
      { label: '已授权', value: ' PASS_AUTHORIZE' }
    ],
    // 查询条件列表
    allList: function () {
      return [{ label: '全部', value: null }].concat(this.list)
    },
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 'WAIT_PAY':
          return '待付款'
        case 'WAIT_AUTHORIZE':
          return '待授权'
        case 'REJECT_AUTHORIZE':
          return '终止授权'
        case 'PASS_AUTHORIZE':
          return '已授权'
        default:
          return ''
      }
    }
  },
  // ---------------- BoxStoreApplyStatus枚举  结束 -------------------

  // ---------------- GatherStatusType枚举  开始 -------------------
  GatherStatusType: {
    // 枚举列表
    list: [
      { label: "创建中", value: "CREATING" },
      { label: "拼场中", value: "GATHERING" },
      { label: "拼场成功", value: "SUCCESS" },
      { label: "拼场失败", value: "FAIL" },
      { label: "已取消", value: "DISMISS" }
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "CREATING":
          return "创建中";
        case "GATHERING":
          return "拼场中";
        case "SUCCESS":
          return "拼场成功";
        case "FAIL":
          return "拼场失败";
        case "DISMISS":
          return "已取消";
        default:
          return val;
      }
    },
  },
  // ---------------- GatherStatusType枚举  结束 ------------------

  // ---------------- GatherLockStatus枚举  开始 -------------------
  GatherLockStatus: {
    // 枚举列表
    list: [
      { label: "未锁车", value: "UNLOCKED" },
      { label: "已锁车", value: "LOCKED" },
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "UNLOCKED":
          return "未锁车";
        case "LOCKED":
          return "已锁车";
        default:
          return val;
      }
    },
  },
  // ---------------- GatherLockStatus枚举  结束 ------------------

  // ---------------- OrganizerType枚举  开始 -------------------
  OrganizerType: {
    // 枚举列表
    list: [],
    // 根据枚举值获取名称
    getName: function (val) {
      let name;
      this.list.map(v => {
        if (v.value === val) {
          name = v.label;
        }
      })
      return name;
    },
  },
  // ---------------- OrganizerType枚举  结束 ------------------

  // ---------------- JumpType枚举  开始 -------------------
  JumpType: {
    // 枚举列表
    list: [
      { label: "官方资讯详情页", value: "CONSULATION_DETAIL" },
      { label: "站外链接", value: "OUTSIDE_LINK" },
      { label: "剧本详情页", value: "DRAMA_DETAIL" },
      { label: "店铺详情页", value: "STORE_DETAIL" },
      { label: "LOVE_POTION页面", value: "LOVE_POTION" }
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case "CONSULATION_DETAIL":
          return "官方资讯详情页";
        case "OUTSIDE_LINK":
          return "站外链接";
        case "DRAMA_DETAIL":
          return "剧本详情页";
        case "STORE_DETAIL":
          return "店铺详情页";
        case "LOVE_POTION":
          return "LOVE_POTION页面";
        default:
          return val;
      }
    },
  },
  // ---------------- JumpType枚举  结束 ------------------

  // ---------------- ActivityJumpType枚举  开始 -------------------
  ActivityJumpType: {
    // 枚举列表
    list: [
      { label: "动态详情", value: 1 },
      { label: "官方资讯", value: 2 },
      { label: "剧评详情", value: 3 }
    ],
    // 根据枚举值获取名称
    getName: function (val) {
      switch (val) {
        case 1:
          return "动态详情";
        case 2:
          return "官方资讯";
        case 3:
          return "剧评详情";
        default:
          return val;
      }
    },
  },
  // ---------------- ActivityJumpType枚举  结束 ------------------

  // ---------------- RankType枚举  开始 -------------------
  RankType: {
    // 枚举列表
    list: [
      { label: "30天内最多人玩", value: 'HOT_RANK' },
      { label: "人气总榜", value: 'GATHER_SUM_RANK' },
      { label: "口碑榜", value: 'PRAISE_RANK' },
      { label: "期待榜", value: 'FOCUS_RANK' }
    ],
    // 根据枚举值获取名称
    getValue: function (name) {
      switch (name) {
        case '30天内最多人玩':
          return "HOT_RANK";
        case '人气总榜':
          return "GATHER_SUM_RANK";
        case '口碑榜':
          return "PRAISE_RANK";
        case '期待榜':
          return "FOCUS_RANK";
        default:
          return '';
      }
    },
  },
  // ---------------- RankType枚举  结束 ------------------

  // ---------------- EvaluateType枚举  开始 -------------------
  EvaluateType: {
    // 根据枚举值获取名称
    getName: function (name) {
      switch (name) {
        case 'RECOMMEND':
          return "推荐";
        case 'SO_SO':
          return "一般";
        case 'NOT_GOOD':
          return "不行";
        case 'SAMECITY':
          return "同城";
        default:
          return '';
      }
    },
  },
  // ---------------- EvaluateType枚举  结束 ------------------

  // ---------------- EvaluateSourceType枚举  开始 -------------------
  EvaluateSourceType: {
    // 根据枚举值获取名称
    getName: function (name) {
      switch (name) {
        case 'DETAIL_EVALUATE':
          return "对应详情页评价";
        case 'DRAMA_ASSOCIATION_EVALUATE':
          return "剧评评价关联评价";
        default:
          return '';
      }
    },
  },
  // ---------------- EvaluateSourceType枚举  结束 ------------------

  // ---------------- LpActivityStatus枚举  开始 -------------------
  LpActivityStatus: {
    // 根据枚举值获取名称
    getName: function (name) {
      switch (name) {
        case 'REGISTRATION_OPEN':
          return "火热报名中";
        case 'REGISTRATION_CLOSED':
          return "报名已截止";
        case 'EVENT_ENDED':
          return "活动已结束";
        case 'EVENT_STARTED':
          return "活动已开始";
        default:
          return '';
      }
    },
  },
  // ---------------- LpActivityStatus枚举  结束 ------------------

  // ---------------- lpActivityUserType枚举  开始 -------------------
  LpActivityUserType: {
    // 枚举列表
    list: [
      { label: "会员报名", value: 'MEMBER_REGISTRATION' },
      { label: "非会员报名", value: 'NON_MEMBER_REGISTRATION' }
    ],
    // 根据枚举值获取名称
    getName: function (name) {
      switch (name) {
        case 'MEMBER_REGISTRATION':
          return "会员报名";
        case 'NON_MEMBER_REGISTRATION':
          return "非会员报名";
        default:
          return '';
      }
    },
  },
  // ---------------- lpActivityUserType枚举  结束 ------------------

  //LP学历
  LP_EDUCATION:{
    list: [
      { text: "高中及以下", value: "高中及以下"},
      { text: "大专", value: "大专" },
      { text: "本科", value: "本科" },
      { text: "硕士", value: "硕士" },
      { text: "博士及以上", value: "博士及以上" }
    ]
  },

  //政治面貌
  LP_POLITICS:{
    list: [
      { text: "群众", value: "群众" },
      { text: "共产党员", value: "共产党员" }
    ]
  },

  //职业
  LP_OCCUPATION: {
    list: [
      { text: "软件工程师", value: 1 },
      { text: "医生", value: 0 },
      { text: "教育工作者", value: 0 },
      { text: "金融专业人士", value: 0 },
      { text: "律师", value: 0 },
      { text: "艺术家/设计师", value: 0 },
      { text: "商业分析师", value: 0 },
      { text: "建筑师/工程师", value: 0 },
      { text: "酒店餐饮服务行业", value: 0 },
      { text: "销售/市场/公关营销专员", value: 0 },
      { text: "电商从业者", value: 0 },
      { text: "农业专业人士", value: 0 },
      { text: "心理医生/咨询师", value: 0 },
      { text: "媒体/编辑", value: 0 },
      { text: "运动员/体育从业者", value: 0 },
      { text: "电子商务专员", value: 0 },
      { text: "旅游业从业者", value: 0 },
      { text: "社会工作者", value: 0 },
      { text: "政府公务员", value: 0 },
      { text: "制药专业人士", value: 0 },
      { text: "个体工商户", value: 0 },
      { text: "企业主", value: 0 },
      { text: "企业高管", value: 0 },
      { text: "互联网产品/运营", value: 0 },
      { text: "制造业管理人员", value: 0 },
      { text: "制造业从业人员", value: 0 },
      { text: "客服", value: 0 },
      { text: "人力/行政/财务", value: 0 },
      { text: "物流/仓储/司机", value: 0 },
      { text: "咨询/翻译", value: 0 },
      { text: "能源/环保", value: 0 },
      { text: "护士", value: 0 },
      { text: "其他", value: 0 }
    ]
  },

  //热门目的地
  LP_HOT_PLACE: {
    list: [
      { label: "北京", value: 10 },
      { label: "张家界", value: 11 },
      { label: "舟山", value: 12 },
      { label: "九寨沟", value: 13 },
      { label: "上海", value: 14 },
      { label: "杭州", value: 15 },
      { label: "苏州", value: 16 },
      { label: "桂林", value: 17 },
      { label: "成都", value: 18 },
      { label: "三亚", value: 19 },
      { label: "西安", value: 20 },
      { label: "丽江", value: 21 },
      { label: "新疆", value: 22 },
      { label: "青岛", value: 23 },
      { label: "贵阳", value: 24 },
      { label: "云南/贵州", value: 25 },
      { label: "西藏", value: 26 },
      { label: "川渝", value: 27 },
      { label: "大西北", value: 28 },
      { label: "广东/广西", value: 29 },
      { label: "湖南/湖北", value: 30 },
      { label: "天津", value: 31 },
      { label: "海南/福建", value: 32 },
      { label: "江浙沪", value: 33 },
      { label: "山东/山西", value: 34 },
      { label: "港澳台", value: 35 },
      { label: "东北", value: 36 },
      { label: "安徽/江西", value: 37 },
      { label: "河南/河北", value: 38 },
    ],
    getId: function (val){
      let index = this.list.findIndex(v=>v.label === val);
      if(index !== -1){
        return this.list[index].value;
      }
      return null;
    },
    getName: function (val){
      let index = this.list.findIndex(v=>v.value === val);
      if(index !== -1){
        return this.list[index].label;
      }
      return "";
    }
  },

  //国际热门目的地
  LP_HOT_NATIONAL_PLACE: {
    list: [
      { label: "新加坡", value: 39 },
      { label: "日本", value: 40 },
      { label: "泰国", value: 41 },
      { label: "马尔代夫", value: 42 },
      { label: "香港", value: 43 },
      { label: "马来西亚", value: 44 },
      { label: "巴厘岛", value: 45 },
      { label: "瑞士", value: 46 },
      { label: "普吉岛", value: 47 },
      { label: "法国", value: 48 },
      { label: "埃及", value: 49 },
      { label: "新西兰", value: 50 },
      { label: "斯里兰卡", value: 51 },
      { label: "仙本那", value: 52 },
      { label: "斐济", value: 53 },
      { label: "芽庄", value: 54 },
      { label: "越南", value: 55 },
      { label: "毛里求斯", value: 56 },
      { label: "长滩岛", value: 57 },
      { label: "苏梅岛", value: 58 },
      { label: "菲律宾", value: 59 },
      { label: "东南亚", value: 60 },
      { label: "日本/韩国", value: 61 },
      { label: "中国港澳台", value: 62 },
      { label: "中东", value: 63 },
      { label: "欧洲", value: 64 },
      { label: "大洋洲", value: 65 },
      { label: "美洲", value: 66 },
      { label: "非洲", value: 67 },
      { label: "其他", value: 68 }
    ],
    getId: function (val){
      let index = this.list.findIndex(v=>v.label === val);
      if(index !== -1){
        return this.list[index].value;
      }
      return null;
    },
    getName: function (val){
      let index = this.list.findIndex(v=>v.value === val);
      if(index !== -1){
        return this.list[index].label;
      }
      return "";
    }
  }
}

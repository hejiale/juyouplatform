import Axios from 'axios'

export default {
  /**
   * 票房本相关信息新增
   */
  async murderMysteryInfoAddMurderMysteryInfo(query) {
    return await Axios.post('/murderMysteryInfo/addMurderMysteryInfo', query)
  },

  /**
   * 票房本相关信息查询
   */
  async murderMysteryInfoQueryMurderMysteryInfo(query) {
    return await Axios.post('/murderMysteryInfo/queryMurderMysteryInfo', query)
  },
  /**
   * 票房本相关信息更新
   */
  async murderMysteryInfoUpdateMurderMysteryInfo(query) {
    return await Axios.post('/murderMysteryInfo/updateMurderMysteryInfo', query)
  },
  /**
   * 票房管理-线索-新增
   */
  async murderMysteryClueAddMurderMysteryClue(query) {
    return await Axios.post('/murderMysteryClue/addMurderMysteryClue', query)
  },
  /**
   * 票房管理-线索-更新
   */
  async murderMysteryClueUpdateMurderMysteryClue(query) {
    return await Axios.post('/murderMysteryClue/updateMurderMysteryClue', query)
  },
  /**
   * 票房管理-线索-删除
   */
  async murderMysteryClueDeleteMurderMysteryClue(query) {
    return await Axios.post('/murderMysteryClue/deleteMurderMysteryClue', query)
  },
  /**
   * 票房管理-线索-查询表单
   */
  async murderMysteryClueQueryMurderMysteryCluePage(query) {
    return await Axios.post(
      '/murderMysteryClue/queryMurderMysteryCluePage',
      query
    )
  },
  /**
   * 票房管理-回合音频-查询列表
   */
  async murderMysteryRoundAudioQueryMurderMysteryRoundAudioList(query) {
    return await Axios.post(
      '/murderMysteryRoundAudio/queryMurderMysteryRoundAudioList',
      query
    )
  },
  /**
   * 票房管理-回合音频-新增
   */
  async murderMysteryRoundAudioAddMurderMysteryRoundAudio(query) {
    return await Axios.post(
      '/murderMysteryRoundAudio/addMurderMysteryRoundAudio',
      query
    )
  },
  /**
   * 票房管理-回合音频-删除
   */
  async murderMysteryRoundAudioDeleteMurderMysteryRoundAudio(query) {
    return await Axios.post(
      '/murderMysteryRoundAudio/deleteMurderMysteryRoundAudio',
      query
    )
  },
  /**
   * 回合音频拖动排序
   */
  async murderMysteryRoundAudioSortMurderMysteryRoundAudio(query) {
    return await Axios.post(
      '/murderMysteryRoundAudio/sortMurderMysteryRoundAudio',
      query
    )
  },
  /**
   * 票房管理-回合音频-修改
   */
  async murderMysteryRoundAudioUpdateMurderMysteryRoundAudio(query) {
    return await Axios.post(
      '/murderMysteryRoundAudio/updateMurderMysteryRoundAudio',
      query
    )
  },
  /**
   * 票房管理-回合-发线索-批量新增
   */
  async murderMysteryRoundClueAddMurderMysteryRoundClue(query) {
    return await Axios.post(
      '/murderMysteryRoundClue/addMurderMysteryRoundClue',
      query
    )
  },
  /**
   * 票房管理-回合-发线索-线索删除
   */
  async murderMysteryRoundClueDeleteMurderMysteryRoundClue(query) {
    return await Axios.post(
      '/murderMysteryRoundClue/deleteMurderMysteryRoundClue',
      query
    )
  },
  /**
   * 票房管理-回合-线索管理双表单
   */
  async murderMysteryRoundClueQueryMurderMysteryRoundClueDoubleTable(query) {
    return await Axios.post(
      '/murderMysteryRoundClue/queryMurderMysteryRoundClueDoubleTable',
      query
    )
  },
  /**
   * 票房管理-回合-发线索表单
   */
  async murderMysteryRoundClueQueryMurderMysteryRoundClueTable(query) {
    return await Axios.post(
      '/murderMysteryRoundClue/queryMurderMysteryRoundClueTable',
      query
    )
  },
  /**
   * 剧本票房-查询该局的用户-角色信息
   */
  async murderMysteryOnlineUserQueryOnlinePlayers(query) {
    return await Axios.post(
      '/murderMysteryOnlineUser/queryOnlinePlayers',
      query
    )
  },
  /**
   * 票房-回合 新增
   */
  async murderMysteryRoundAddMurderMysteryRound(query) {
    return await Axios.post('/murderMysteryRound/addMurderMysteryRound', query)
  },
  /**
   * 票房-回合 更新
   */
  async murderMysteryRoundUpdateMurderMysteryRound(query) {
    return await Axios.post(
      '/murderMysteryRound/updateMurderMysteryRound',
      query
    )
  },
  /**
   * 票房-回合 删除
   */
  async murderMysteryRoundDeleteMurderMysteryRound(query) {
    return await Axios.post(
      '/murderMysteryRound/deleteMurderMysteryRound',
      query
    )
  },
  /**
   * 票房-回合  列表分页
   */
  async murderMysteryRoundQueryMurderMysteryRoundPage(query) {
    return await Axios.post(
      '/murderMysteryRound/queryMurderMysteryRoundPage',
      query
    )
  },
  /**
   * 票房回合查询列表
   */
  async murderMysteryRoundQueryMurderMysteryRoundList(query) {
    return await Axios.post(
      '/murderMysteryRound/queryMurderMysteryRoundList',
      query
    )
  },
  /**
   * 票房-回合顺序调换
   */
  async murderMysteryRoundChangeMurderMysteryRoundOrder(query) {
    return await Axios.post(
      '/murderMysteryRound/changeMurderMysteryRoundOrder',
      query
    )
  },
  /**
   * 新增邮件
   */
  async emailInvestigationAddEmail(query) {
    return await Axios.post('/emailInvestigation/addEmail', query)
  },
  /**
   * 删除邮件
   */
  async emailInvestigationDeleteEmail(query) {
    return await Axios.post('/emailInvestigation/deleteEmail', query)
  },
  /**
   * 当前手机搜证回合新增需要的app类型
   */
  async AppInvestigationAddAppTypeInvestigation(query) {
    return await Axios.post('/AppInvestigation/addAppTypeInvestigation', query)
  },
  /**
   * 获取当前手机搜证回合的app列表
   */
  async AppInvestigationGetAppTypeInvestigationList(query) {
    return await Axios.post(
      '/AppInvestigation/getAppTypeInvestigationList',
      query
    )
  },
  /**
   * 邮件关联线索详情页（通过邮件id）
   */
  async emailInvestigationGetEmailClueDetail(query) {
    return await Axios.post('/emailInvestigation/getEmailClueDetail', query)
  },
  /**
   * 获取邮件详情（通过邮件id）
   */
  async emailInvestigationGetEmailDetail(query) {
    return await Axios.post('/emailInvestigation/getEmailDetail', query)
  },
  /**
   * 获取邮件列表（通过appid）
   */
  async emailInvestigationGetEmailList(query) {
    return await Axios.post('/emailInvestigation/getEmailList', query)
  },
  /**
   * 修改邮件
   */
  async emailInvestigationUpdateEmail(query) {
    return await Axios.post('/emailInvestigation/updateEmail', query)
  },
  /**
   * 获取回合座位列表
   */
  async roundRoleSeatGetRoundRoleSeatList(query) {
    return await Axios.post('/roundRoleSeat/getRoundRoleSeatList', query)
  },
  /**
   * 新增-更新回合座位
   */
  async roundRoleSeatAddOrUpdateRoundRoleSeat(query) {
    return await Axios.post('/roundRoleSeat/addOrUpdateRoundRoleSeat', query)
  },
  /**
   * 票房剧本-剧本概览
   */
  async murderMysteryOnlineRecordScriptOverview(query) {
    return await Axios.post('/murderMysteryOnlineRecord/scriptOverview', query)
  },
  /**
   * 开局-开场记录 分页列表查询
   */
  async murderMysteryOnlineRecordGetMurderMysteryOnlineRecord(query) {
    return await Axios.post(
      '/murderMysteryOnlineRecord/getMurderMysteryOnlineRecord',
      query
    )
  },
  /**
   * 票房管理-音乐-新增
   */
  async murderMysteryAudioAddMurderMysteryAudio(query) {
    return await Axios.post('/murderMysteryAudio/addMurderMysteryAudio', query)
  },
  /**
   * 票房管理-音乐-编辑
   */
  async murderMysteryAudioUpdateMurderMysteryAudio(query) {
    return await Axios.post(
      '/murderMysteryAudio/updateMurderMysteryAudio',
      query
    )
  },
  /**
   * 票房管理-音乐-删除
   */
  async murderMysteryAudioDeleteMurderMysteryAudio(query) {
    return await Axios.post(
      '/murderMysteryAudio/deleteMurderMysteryAudio',
      query
    )
  },
  /**
   * 票房管理-音乐-查询表单
   */
  async murderMysteryAudioQueryMurderMysteryAudioPage(query) {
    return await Axios.post(
      '/murderMysteryAudio/queryMurderMysteryAudioPage',
      query
    )
  },
  /**
   * 票房管理-音乐-查询表单
   */
  async murderMysteryAudioQueryMurderMysteryAudioList(query) {
    return await Axios.post(
      '/murderMysteryAudio/queryMurderMysteryAudioList',
      query
    )
  },
  /**
   * 票房管理-音乐-修改排序
   */
  async murderMysteryAudioUpdateAudioSort(query) {
    return await Axios.post('/murderMysteryAudio/updateAudioSort', query)
  },
  /**
   * 票房-票房管理 新增
   */
  async murderMysteryAddMurderMystery(query) {
    return await Axios.post('/murderMystery/addMurderMystery', query)
  },
  /**
   * 票房-票房管理更新
   */
  async murderMysteryUpdateMurderMystery(query) {
    return await Axios.post('/murderMystery/updateMurderMystery', query)
  },
  /**
   * 票房-票房管理 删除
   */
  async murderMysteryDeleteMurderMystery(query) {
    return await Axios.post('/murderMystery/deleteMurderMystery', query)
  },
  /**
   * 票房-票房管理  列表分页
   */
  async murderMysteryQueryMurderMystery(query) {
    return await Axios.post('/murderMystery/queryMurderMystery', query)
  },
  /**
   * 票房-票房管理  上架
   */
  async murderMysteryPutOnMurderMystery(query) {
    return await Axios.post('/murderMystery/putOnMurderMystery', query)
  },
  /**
   * 票房-票房管理  下架
   */
  async murderMysteryPutOffMurderMystery(query) {
    return await Axios.post('/murderMystery/putOffMurderMystery', query)
  },
  /**
   * 票房-角色 新增
   */
  async murderMysteryRoleAddMurderMysteryRole(query) {
    return await Axios.post('/murderMysteryRole/addMurderMysteryRole', query)
  },
  /**
   * 票房-角色 修改
   */
  async murderMysteryRoleUpdateMurderMysteryRole(query) {
    return await Axios.post('/murderMysteryRole/updateMurderMysteryRole', query)
  },
  /**
   * 票房-角色 删除
   */
  async murderMysteryRoleDeleteMurderMysteryRole(query) {
    return await Axios.post('/murderMysteryRole/deleteMurderMysteryRole', query)
  },
  /**
   * 票房-角色  列表
   */
  async murderMysteryRoleQueryMurderMysteryRole(query) {
    return await Axios.post('/murderMysteryRole/queryMurderMysteryRole', query)
  },
  /**
   * 票房-角色  详情查询
   */
  async murderMysteryRoleGetMurderMysteryRole(query) {
    return await Axios.post('/murderMysteryRole/getMurderMysteryRole', query)
  },
  /**
   * 票房-角色  拖动
   */
  async murderMysteryRoleSortMurderMysteryRole(query) {
    return await Axios.post('/murderMysteryRole/sortMurderMysteryRole', query)
  },
  /**
   * 票房系统协议-分页列表查询
   */
  async sysStoreBoxAgreementQuerySysStoreBoxAgreement(query) {
    return await Axios.post(
      '/sysStoreBoxAgreement/querySysStoreBoxAgreement',
      query
    )
  },
  /**
   * 创建商品
   */
  async productCreate(query) {
    return await Axios.post('/product/create', query)
  },
  /**
   * 删除商品
   */
  async productDelete(query) {
    return await Axios.post('/product/delete', query)
  },
  /**
   * 商品详情
   */
  async productDetail(query) {
    return await Axios.post('/product/detail', query)
  },
  /**
   * 商品列表
   */
  async productGetList(query) {
    return await Axios.post('/product/getList', query)
  },
  /**
   * 商品上下架
   */
  async productPutOnOff(query) {
    return await Axios.post('/product/putOnOff', query)
  },
  /**
   * 修改商品
   */
  async productUpdate(query) {
    return await Axios.post('/product/update', query)
  },
  /**
   * 配置商品-店铺可见性
   */
  async productConfigVisibility(query) {
    return await Axios.post('/product/configVisibility', query)
  },
  /**
   * 获取商品-店铺可见性
   */
  async productGetVisibility(query) {
    return await Axios.post('/product/getVisibility', query)
  },
  /**
   * 安全-AES密钥查询
   */
  async securityGetAesKey(query) {
    return await Axios.post('/security/getAesKey', query)
  },
  /**
   * 安全-获取SM2密钥
   */
  async securityGetSecretKey(query) {
    return await Axios.get('/security/getSecretKey', query)
  },
  /**
   * 店铺剧本-剧本列表分页查询
   */
  async storeDramaQueryDramaPageWithStore(query) {
    return await Axios.post('storeDrama/queryDramaPageWithStore', query)
  },
  /**
   * 店铺剧本-查看店铺剧本详情
   */
  async storeDramaQueryStoreDramaDetail(query) {
    return await Axios.post('/storeDrama/queryStoreDramaDetail', query)
  },
  /**
   * 店铺剧本-删除剧本
   */
  async storeDramaDeleteStoreDrama(query) {
    return await Axios.post('/storeDrama/deleteStoreDrama', query)
  },
  /**
   * 店铺申请-店铺申请列表分页查询
   */
  async storeApplyQueryStoreApplyPage(query) {
    return await Axios.post('/storeApply/queryStoreApplyPage', query)
  },
  /**
   * 店铺申请-店铺申请详情查询
   */
  async storeApplyGetStoreApply(query) {
    return await Axios.post('/storeApply/queryStoreApplyDetail', query)
  },
  /**
   * 店铺申请-店铺入驻申请通过
   */
  async storeApplyPassStoreApply(query) {
    return await Axios.post('/storeApply/passStoreApply', query)
  },
  /**
   * 店铺申请-店铺入驻申请拒绝
   */
  async storeApplyRejectStoreApply(query) {
    return await Axios.post('/storeApply/rejectStoreApply', query)
  },
  /**
   * 店铺-店铺新增
   */
  async storeAddStore(query) {
    return await Axios.post('/store/addStore', query)
  },
  /**
   * 店铺-店铺更新
   */
  async storeUpdateStore(query) {
    return await Axios.post('/store/updateStoreDetail', query)
  },
  /**
   * 店铺-店铺列表分页查询
   */
  async storeQueryStorePage(query) {
    return await Axios.post('/store/queryStorePage', query)
  },
  /**
   * 店铺-店铺详情查询
   */
  async storeGetStore(query) {
    return await Axios.post('/store/queryStoreDetail', query)
  },
  /**
   * 店铺-店铺系统推荐
   */
  async storeSystemRecommendStore(query) {
    return await Axios.post('/store/systemRecommendStore', query)
  },
  /**
   * 店铺-店铺系统推荐取消
   */
  async storeCancelSystemRecommendStore(query) {
    return await Axios.post('/store/cancelSystemRecommendStore', query)
  },
  /**
   * 店铺-店铺启用
   */
  async storeEnableStore(query) {
    return await Axios.post('/store/enableStore', query)
  },
  /**
   * 店铺-店铺停用
   */
  async storeDisableStore(query) {
    return await Axios.post('/store/disableStore', query)
  },
  /**
   * 店铺-店铺删除
   */
  async storeDeleteStore(query) {
    return await Axios.post('/store/deleteStore', query)
  },
  /**
   * 店铺用户-待分配用户列表分页查询
   */
  async storeUserQueryStoreUserDistributePage(query) {
    return await Axios.post('/storeUser/queryStoreUsersWithoutMembers', query)
  },
  /**
   * 店铺用户-店铺用户新增
   */
  async storeUserAddStoreUser(query) {
    return await Axios.post('/storeUser/addStoreUsers', query)
  },
  /**
   * 店铺用户-设置店铺店主
   */
  async storeUserAddStoreKeeper(query) {
    return await Axios.post('/storeUser/editStoreUser', query)
  },
  /**
   * 店铺用户-获取店铺是否有店主
   */
  async storeUserGetIfStoreKeeper(query) {
    return await Axios.post('/storeUser/getIfStoreKeeper', query)
  },
  /**
   * 店铺用户-店铺用户列表分页查询
   */
  async storeUserQueryUserPageWithStore(query) {
    return await Axios.post('/storeUser/queryStoreUserPage', query)
  },
  /**
   * 店铺用户-成员移除
   */
  async storeUserRemoveStoreUserWithStore(query) {
    return await Axios.post('/storeUser/deleteStoreUser', query)
  },
  /**
   * 订单-后台管理通用退款
   */
  async orderMRefund(query) {
    return await Axios.post('/order/m-refund', query)
  },
  /**
   * 订单管理-数据列表
   */
  async orderMList(query) {
    return await Axios.post('/order/m-list', query)
  },
  /**
   * 订单管理-更新物流单号
   */
  async orderInfoUpdateLogisticsNum(query) {
    return await Axios.post('/orderInfo/updateLogisticsNum', query)
  },
  /**
   * 订单-根据Id查询订单详情
   */
  async orderMDetail(query) {
    return await Axios.post('/order/m-detail', query)
  },
  /**
   * 文件-文件上传-文件
   */
  async fileUploadUpload(query) {
    return await Axios.post('/file/upload', query)
  },
  /**
   * 文件-批量文件上传-文件
   */
  async fileUploadUploadFiles(query) {
    return await Axios.post('/fileUpload/uploadFiles', query)
  },
  /**
   * 文件-分片上传初始化
   */
  async fileUploadMultipartInit(query) {
    return await Axios.post('/file/multipartUploadInit', query)
  },
  /**
   * 文件-分片上传
   */
  async fileUploadMultipartUpload(query) {
    return await Axios.post('/file/multipartUpload', query)
  },
  /**
   * 文件-分片上传合并
   */
  async fileUploadMultipartComplete(query) {
    return await Axios.post('/file/completeMultipartUpload', query)
  },
  /**
   * 文件-分片上传文件列表查询
   */
  async fileUploadQueryMultipartUploadList(query) {
    return await Axios.post('/fileUpload/queryMultipartUploadList', query)
  },
  /**
   * 文件-分片上传取消
   */
  async fileUploadMultipartCancel(query) {
    return await Axios.post('/fileUpload/multipartCancel', query)
  },
  /**
   * 管理员-新增管理员
   */
  async adminAddAdmin(query) {
    return await Axios.post('/admin/addAdmin', query)
  },
  /**
   * 管理员-修改管理员
   */
  async adminUpdateAdmin(query) {
    return await Axios.post('/admin/updateAdmin', query)
  },
  /**
   * 管理员-查询管理员列表-分页
   */
  async adminQueryAdminPage(query) {
    return await Axios.post('/admin/queryAdminPage', query)
  },
  /**
   * 管理员-删除管理员
   */
  async adminDeleteAdmin(query) {
    return await Axios.post('/admin/deleteAdmin', query)
  },
  /**
   * 管理员-解冻管理员
   */
  async adminEnableAdmin(query) {
    return await Axios.post('/admin/enableAdmin', query)
  },
  /**
   * 管理员-冻结管理员
   */
  async adminDisableAdmin(query) {
    return await Axios.post('/admin/disableAdmin', query)
  },
  /**
   * 管理员-重置密码
   */
  async adminResetPassword(query) {
    return await Axios.post('/admin/resetPassword', query)
  },
  /**
   * 管理员-修改密码
   */
  async adminUpdatePassword(query) {
    return await Axios.post('/admin/updatePassword', query)
  },
  /**
   * 角色-查询角色列表-分页
   */
  async roleQueryRolePage(query) {
    return await Axios.post('/role/queryRolePage', query)
  },
  /**
   * 角色-新增角色
   */
  async roleAddRole(query) {
    return await Axios.post('/role/addRole', query)
  },
  /**
   * 角色-查询已授权用户
   */
  async roleQueryAuthorizedAdmins(query) {
    return await Axios.post('/role/queryAuthorizedAdmins', query)
  },
  /**
   * 角色-授权用户
   */
  async roleToGrantAuthorized(query) {
    return await Axios.post('/role/toGrantAuthorized', query)
  },
  /**
   * 角色-取消授权用户
   */
  async roleToCancelAuthorized(query) {
    return await Axios.post('/role/toCancelAuthorized', query)
  },
  /**
   * 角色-编辑角色
   */
  async roleUpdateRole(query) {
    return await Axios.post('/role/updateRole', query)
  },
  /**
   * 角色-查看角色详情
   */
  async roleQueryRoleDetail(query) {
    return await Axios.post('/role/queryRoleDetail', query)
  },
  /**
   * 角色-根据页面权限获取操作项权限
   */
  async roleQueryButtonsByPage(query) {
    return await Axios.post('/role/queryButtonsByPage', query)
  },
  /**
   * 角色-获取权限菜单树
   */
  async roleQueryPermissionTree(query) {
    return await Axios.post('/role/queryPermissionTree', query)
  },
  /**
   * 权限树查询
   */
  async permissionQueryPermissionTree(query) {
    return await Axios.post('/permission/queryPermissionTree', query)
  },
  /**
   * 删除菜单
   */
  async permissionDeleteMenu(query) {
    return await Axios.post('/permission/delete', query)
  },
  /**
   * 新增菜单
   */
  async permissionAddMenu(query) {
    return await Axios.post('/permission/add', query)
  },
  /**
   * 修改菜单
   */
  async permissionUpdateMenu(query) {
    return await Axios.post('/permission/update', query)
  },
  /**
   * 角色-删除角色
   */
  async roleDeleteRole(query) {
    return await Axios.post('/role/deleteRole', query)
  },
  /**
   * 角色-启用角色
   */
  async roleEnableRole(query) {
    return await Axios.post('/role/enableRole', query)
  },
  /**
   * 角色-停用角色
   */
  async roleDisableRole(query) {
    return await Axios.post('/role/disableRole', query)
  },
  /**
   * 剧本申领-新增
   */
  async boxDramaApplyAddBoxDramaApply(query) {
    return await Axios.post('/boxDramaApply/addOneBoxDramaApply', query)
  },
  /**
   * 剧本申领-修改
   */
  async boxDramaApplyUpdateBoxDramaApplyById(query) {
    return await Axios.post('/boxDramaApply/updateBoxDramaApplyById', query)
  },
  /**
   * 剧本申领-分页列表查询
   */
  async boxDramaApplyQueryBoxDramaApply(query) {
    return await Axios.post(
      '/boxDramaApply/queryBoxDramaApplyByCondition',
      query
    )
  },
  /**
   * 用户-用户列表分页查询
   */
  async userQueryUserPage(query) {
    return await Axios.post('/user/queryUserList', query)
  },
  /**
   * 用户-用户更新
   */
  async userUpdateUser(query) {
    return await Axios.post('/user/updateUser', query)
  },
  /**
   * 用户-用户查询
   */
  async userGetUser(query) {
    return await Axios.post('/user/getUser', query)
  },
  /**
   * 用户-用户启用
   */
  async userEnableUser(query) {
    return await Axios.post('/user/enableUser', query)
  },
  /**
   * 用户-用户禁用
   */
  async userDisableUser(query) {
    return await Axios.post('/user/disableUser', query)
  },
  /**
   * 营销--手动发券--新增
   */
  async couponActivityAddCouponMarketActivity(query) {
    return await Axios.post('/couponActivity/addCouponMarketActivity', query)
  },
  /**
   * 营销--手动发券--补偿发券[预留]
   */
  async couponActivityCompensateTicket(query) {
    return await Axios.post('/couponActivity/compensateTicket', query)
  },
  /**
   * 营销--手动发券--查看活动发放详情
   */
  async couponActivityGetCouponMarketingActivity(query) {
    return await Axios.post('/couponActivity/getCouponMarketingActivity', query)
  },
  /**
   * 营销--手动发券--撤回活动
   */
  async couponActivityCouponActivityCompensateTicket(query) {
    return await Axios.post(
      '/couponActivity/deleteCouponMarketingActivity',
      query
    )
  },
  /**
   * 营销--手动发券--活动列表
   */
  async couponActivityList(query) {
    return await Axios.post('/couponActivity/list', query)
  },
  /**
   * 自动发券-新增自动发券发券活动
   */
  async couponAutoSendAdd(query) {
    return await Axios.post('/couponAutoSend/add', query)
  },
  /**
   * 自动发券-结束活动
   */
  async couponAutoSendEnd(query) {
    return await Axios.post('/couponAutoSend/end', query)
  },
  /**
   * 自动发券-详情
   */
  async couponAutoSendGetCouponAutoSendConditionDetail(query) {
    return await Axios.post(
      '/couponAutoSend/getCouponAutoSendConditionDetail',
      query
    )
  },
  /**
   * 自动发券-按id查询发放记录
   */
  async couponAutoSendGetSendRecord(query) {
    return await Axios.post('/couponAutoSend/getSendRecord', query)
  },
  /**
   * 自动发券-列表查询
   */
  async couponAutoSendList(query) {
    return await Axios.post('/couponAutoSend/list', query)
  },
  /**
   * 自动发券-开始活动
   */
  async couponAutoSendStart(query) {
    return await Axios.post('/couponAutoSend/start', query)
  },
  /**
   * 自动发券-编辑
   */
  async couponAutoSendUpdate(query) {
    return await Axios.post('/couponAutoSend/update', query)
  },
  /**
   * 自动发券-删除活动
   */
  async couponAutoSendDelete(query) {
    return await Axios.post('/couponAutoSend/delete', query)
  },
  /**
   * 营销活动--发放记录
   */
  async couponActivityGetMarketingActivitySendDetail(query) {
    return await Axios.post(
      '/couponActivity/getMarketingActivitySendDetail',
      query
    )
  },
  /**
   * 作废券
   */
  async couponTicketInvalidTicket(query) {
    return await Axios.post('/couponTicket/invalidTicket', query)
  },
  /**
   * 卡券中心-优惠券-分页
   */
  async couponQueryCouponPageByPage(query) {
    return await Axios.post('/coupon/queryCouponPageByPage', query)
  },
  /**
   * 卡券中心-优惠券-不分页
   */
  async couponQueryCoupon(query) {
    return await Axios.post('/coupon/queryCoupon', query)
  },
  /**
   * 卡券中心-优惠券-add
   */
  async couponAddCoupon(query) {
    return await Axios.post('/coupon/addCoupon', query)
  },
  /**
   * 卡券中心-优惠券-update
   */
  async couponUpdateCoupon(query) {
    return await Axios.post('/coupon/updateCoupon', query)
  },
  /**
   * 卡券中心-优惠券-note备注
   */
  async couponRemarkCoupon(query) {
    return await Axios.post('/coupon/remarkCoupon', query)
  },
  /**
   * 卡券中心-优惠券-delete
   */
  async couponDeleteCoupon(query) {
    return await Axios.post('/coupon/deleteCoupon', query)
  },
  /**
   * 卡券中心-优惠券-enable
   */
  async couponEnableCoupon(query) {
    return await Axios.post('/coupon/enableCoupon', query)
  },
  /**
   * 卡券中心-优惠券-disable
   */
  async couponDisableCoupon(query) {
    return await Axios.post('/coupon/disableCoupon', query)
  },
  /**
   * 卡券中心-优惠券-详情
   */
  async couponDetail(query) {
    return await Axios.post('/coupon/detail', query)
  },
  /**
   * 营销活动--参与的店铺列表(分页)
   */
  async couponActivityStoreQueryPage(query) {
    return await Axios.post('/couponActivityStore/queryPage', query)
  },
  /**
   * 新增拼图工具
   */
  async murderMysteryToolAddToolForJigsaw(query) {
    return await Axios.post('/murderMysteryTool/addToolForJigsaw', query)
  },
  /**
   * 新增手机工具
   */
  async murderMysteryToolAddToolForPhone(query) {
    return await Axios.post('/murderMysteryTool/addToolForPhone', query)
  },
  /**
   * 新增问答工具
   */
  async murderMysteryToolAddToolForQuestion(query) {
    return await Axios.post('/murderMysteryTool/addToolForQuestion', query)
  },
  /**
   * 新增随机工具
   */
  async murderMysteryToolAddToolForRoll(query) {
    return await Axios.post('/murderMysteryTool/addToolForRoll', query)
  },
  /**
   * 新增投票工具
   */
  async murderMysteryToolAddToolForVote(query) {
    return await Axios.post('/murderMysteryTool/addToolForVote', query)
  },
  /**
   * 问答工具清空回合奖励
   */
  async murderMysteryToolCleanQuestionReward(query) {
    return await Axios.post('/murderMysteryTool/cleanQuestionReward', query)
  },
  /**
   * 问答工具配置回合奖励
   */
  async murderMysteryToolConfigQuestionReward(query) {
    return await Axios.post('/murderMysteryTool/configQuestionReward', query)
  },
  /**
   * 删除拼图工具
   */
  async murderMysteryToolDeleteToolForJigsaw(query) {
    return await Axios.post('/murderMysteryTool/deleteToolForJigsaw', query)
  },
  /**
   * 删除手机工具
   */
  async murderMysteryToolDeleteToolForPhone(query) {
    return await Axios.post('/murderMysteryTool/deleteToolForPhone', query)
  },
  /**
   * 删除问答工具
   */
  async murderMysteryToolDeleteToolForQuestion(query) {
    return await Axios.post('/murderMysteryTool/deleteToolForQuestion', query)
  },
  /**
   * 删除随机工具
   */
  async murderMysteryToolDeleteToolForRoll(query) {
    return await Axios.post('/murderMysteryTool/deleteToolForRoll', query)
  },
  /**
   * 删除投票工具
   */
  async murderMysteryToolDeleteToolForVote(query) {
    return await Axios.post('/murderMysteryTool/deleteToolForVote', query)
  },
  /**
   * 拼图工具详情
   */
  async murderMysteryToolToolForJigsawDetail(query) {
    return await Axios.post('/murderMysteryTool/toolForJigsawDetail', query)
  },
  /**
   * 拼图工具列表
   */
  async murderMysteryToolToolForJigsawList(query) {
    return await Axios.post('/murderMysteryTool/toolForJigsawList', query)
  },
  /**
   * 手机工具列表
   */
  async murderMysteryToolToolForPhoneList(query) {
    return await Axios.post('/murderMysteryTool/toolForPhoneList', query)
  },
  /**
   * 答案工具详情
   */
  async murderMysteryToolToolForQuestionDetail(query) {
    return await Axios.post('/murderMysteryTool/toolForQuestionDetail', query)
  },
  /**
   * 问答工具列表(详细)
   */
  async murderMysteryToolToolForQuestionItemList(query) {
    return await Axios.post('/murderMysteryTool/toolForQuestionItemList', query)
  },
  /**
   * 问答工具列表
   */
  async murderMysteryToolToolForQuestionList(query) {
    return await Axios.post('/murderMysteryTool/toolForQuestionList', query)
  },
  /**
   * 答案配置奖励详情
   */
  async murderMysteryToolToolForQuestionRewardDetail(query) {
    return await Axios.post(
      '/murderMysteryTool/toolForQuestionRewardDetail',
      query
    )
  },
  /**
   * 随机工具列表
   */
  async murderMysteryToolToolForRollList(query) {
    return await Axios.post('/murderMysteryTool/toolForRollList', query)
  },
  /**
   * 投票工具列表
   */
  async murderMysteryToolToolForVoteList(query) {
    return await Axios.post('/murderMysteryTool/toolForVoteList', query)
  },
  /**
   * 更新拼图工具
   */
  async murderMysteryToolUpdateToolForJigsaw(query) {
    return await Axios.post('/murderMysteryTool/updateToolForJigsaw', query)
  },
  /**
   * 更新手机工具
   */
  async murderMysteryToolUpdateToolForPhone(query) {
    return await Axios.post('/murderMysteryTool/updateToolForPhone', query)
  },
  /**
   * 更新问答工具
   */
  async murderMysteryToolUpdateToolForQuestion(query) {
    return await Axios.post('/murderMysteryTool/updateToolForQuestion', query)
  },
  /**
   * 更新随机工具
   */
  async murderMysteryToolUpdateToolForRoll(query) {
    return await Axios.post('/murderMysteryTool/updateToolForRoll', query)
  },
  /**
   * 更新投票工具
   */
  async murderMysteryToolUpdateToolForVote(query) {
    return await Axios.post('/murderMysteryTool/updateToolForVote', query)
  },
  /**
   * 系统-登录
   */
  async authLogin(query) {
    return await Axios.post('/auth/login', query)
  },
  /**
   * 系统-模拟登录
   */
  async authSimpleLogin(query) {
    return await Axios.post('/auth/simpleLogin', query)
  },
  /**
   * 系统-登出
   */
  async authLogout(query) {
    return await Axios.post('/auth/logout', query)
  },
  /**
   * APP版本控制 新增
   */
  async versionControlAddVersionControl(query) {
    return await Axios.post('/versionControl/addVersionControl', query)
  },
  /**
   * APP版本控制 更新
   */
  async versionControlEditVersionControl(query) {
    return await Axios.post('/versionControl/editVersionControl', query)
  },
  /**
   * APP版本控制 删除
   */
  async versionControlDeleteVersionControl(query) {
    return await Axios.post('/versionControl/deleteVersionControl', query)
  },
  /**
   * APP版本控制 分页查询
   */
  async versionControlQueryVersionControlPage(query) {
    return await Axios.post('/versionControl/queryVersionControlPage', query)
  },
  /**
   * APP版本控制 启用
   */
  async versionControlEnableVersionControl(query) {
    return await Axios.post('/versionControl/enableVersionControl', query)
  },
  /**
   * 字典-字典新增
   */
  async dictAddDict(query) {
    return await Axios.post('/dict/addDict', query)
  },
  /**
   * 字典-字典更新
   */
  async dictUpdateDict(query) {
    return await Axios.post('/dict/updateDict', query)
  },
  /**
   * 字典-字典更新-批量
   */
  async dictUpdateDictList(query) {
    return await Axios.post('/dict/updateDictList', query)
  },
  /**
   * 字典-字典排序
   */
  async dictSortDict(query) {
    return await Axios.post('/dict/sortDict', query)
  },
  /**
   * 字典-字典删除
   */
  async dictDeleteDict(query) {
    return await Axios.post('/dict/deleteDict', query)
  },
  /**
   * 字典-字典类型列表查询
   */
  async dictQueryDictTypeList(query) {
    return await Axios.post('/dict/queryDictTypeList', query)
  },
  /**
   * 字典-字典列表查询
   */
  async dictQueryDictList(query) {
    return await Axios.post('/dict/queryDicts', query)
  },
  /**
   * 地区-地区列表查询-级联
   */
  async regionQueryRegionCascadeList(query) {
    return await Axios.post('/region/getRegion', query)
  },
  /**
   * 发行商-发行商新增
   */
  async publisherAddPublisher(query) {
    return await Axios.post('/publish/addPublisher', query)
  },
  /**
   * 发行商-发行商更新
   */
  async publisherUpdatePublisher(query) {
    return await Axios.post('/publish/updatePublisher', query)
  },
  /**
   * 发行商-发行商列表分页查询
   */
  async publisherQueryPublisherPage(query) {
    return await Axios.post('/publish/queryPublisherPage', query)
  },
  /**
   * 发行商-发行商-发行商列表查询-有效的简易的
   */
  async publisherQueryPublisherAvailableSimpleList(query) {
    return await Axios.post(
      '/publisher/queryPublisherAvailableSimpleList',
      query
    )
  },
  /**
   * 发行商-发行商详情查询
   */
  async publisherGetPublisher(query) {
    return await Axios.post('/publish/getPublisher', query)
  },
  /**
   * 发行商-发行商启用
   */
  async publisherEnablePublisher(query) {
    return await Axios.post('/publish/updatePublisherStatus', query)
  },
  /**
   * 发行商-发行商停用
   */
  async publisherDisablePublisher(query) {
    return await Axios.post('/publisher/disablePublisher', query)
  },
  /**
   * 发行商-发行商删除
   */
  async publisherDeletePublisher(query) {
    return await Axios.post('/publisher/deletePublisher', query)
  },
  /**
   * 发行申请-发行申请请列表分页查询
   */
  async publisherApplyQueryPublisherApplyPage(query) {
    return await Axios.post('/publishApply/queryPublisherApplyPage', query)
  },
  /**
   * 发行申请-管理端查询发行申请信息详情
   */
  async publisherApplyGetPublisherApplyWithPc(query) {
    return await Axios.post('/publishApply/getPublisherApplyWithPc', query)
  },
  /**
   * 发行申请-审核
   */
  async publisherApplyHandlePublisherApply(query) {
    return await Axios.post('/publishApply/handlePublisherApply', query)
  },
  /**
   * 发行-用户分页查询
   */
  async publisherUserQueryPublisherUserPage(query) {
    return await Axios.post('/publish/getPublisherTeam', query)
  },
  /**
   * 剧本-剧本新增
   */
  async dramaAddDrama(query) {
    return await Axios.post('/drama/addDramDetail', query)
  },
  /**
   * 剧本-剧本更新
   */
  async dramaUpdateDrama(query) {
    return await Axios.post('/drama/updateDramDetail', query)
  },
  /**
   * 剧本-剧本列表分页查询
   */
  async dramaQueryDramaPage(query) {
    return await Axios.post('/drama/queryDramaPage', query)
  },
  /**
   * 剧本-剧本启用
   */
  async dramaEnableDrama(query) {
    return await Axios.post('/drama/enableDrama', query)
  },
  /**
   * 剧本-剧本启用禁用
   */
  async dramaDisableDrama(query) {
    return await Axios.post('/drama/updateDramStatus', query)
  },
  /**
   * 剧本-剧本删除
   */
  async dramaDeleteDrama(query) {
    return await Axios.post('/drama/deleteDrama', query)
  },
  /**
   * 剧本-剧本详情查询
   */
  async dramaGetDrama(query) {
    return await Axios.post('/drama/queryDramDetail', query)
  },
  /**
   * 剧本附件-剧本附件新增
   */
  async dramaAttachmentAddDramaAttachment(query) {
    return await Axios.post('/dramaAttachment/addDramaAttachment', query)
  },
  /**
   * 剧本附件-剧本附件删除
   */
  async dramaAttachmentDeleteDramaAttachment(query) {
    return await Axios.post('/dramaAttachment/deleteDramaAttachment', query)
  },
  /**
   * 剧本附件-剧本附件列表分页查询
   */
  async dramaAttachmentQueryDramaAttachmentPage(query) {
    return await Axios.post('/dramaAttachment/queryDramaAttachmentPage', query)
  },
  /**
   * 发行剧本审核-审核剧本列表分页查询
   */
  async dramaApplyQueryDramaApplyPage(query) {
    return await Axios.post('/dramaApply/queryDramaApplyPage', query)
  },
  /**
   * 发行剧本审核-审核剧本通过处理
   */
  async dramaApplyPassDramaApply(query) {
    return await Axios.post('/dramaApply/passDramaApply', query)
  },
  /**
   * 发行剧本审核-审核剧本驳回处理
   */
  async dramaApplyRejectDramaApply(query) {
    return await Axios.post('/dramaApply/rejectDramaApply', query)
  },
  /**
   * 发行剧本审核-审核详情
   */
  async dramaApplyGetDramaApply(query) {
    return await Axios.post('/dramaApply/getDramaApply', query)
  },
  /**
   * 剧本-发行分页查询
   */
  async dramaPublisherQueryDramaPublisherPage(query) {
    return await Axios.post('/dramaPublisher/queryDramaPublisherPage', query)
  },
  /**
   * 获取当前会话的菜单和按钮权限列表
   */
  async authGetRolesAndPermissions(query) {
    return await Axios.post('/auth/getRolesAndPermissions', query)
  },
  /**
   * 保存角色权限配置
   */
  async roleSavePermissionTree(query) {
    return await Axios.post('/role/savePermissionTree', query)
  },
  /**
   * 坐标解析行政区划
   */
  async regionRegionResolver(query) {
    return await Axios.post('/region/regionResolver', query)
  },
  /**
   * 作者列表查询
   */
  async authorQueryAuthorPage(query) {
    return await Axios.post('/author/queryAuthorPage', query)
  },
  /**
   * 作者新增
   */
  async authorAddAuthor(query) {
    return await Axios.post('/author/addAuthor', query)
  },
  /**
   * 作者更新
   */
  async authorUpdateAuthorDetail(query) {
    return await Axios.post('/author/updateAuthorDetail', query)
  },
  /**
   * 作者删除
   */
  async authorDeleteAuthorDetail(query) {
    return await Axios.post('/author/deleteAuthorDetail', query)
  },
  /**
   * 作者详情查询
   */
  async authorQueryAuthorDetail(query) {
    return await Axios.post('/author/queryAuthorDetail', query)
  },
  /**
   * 作者启用禁用
   */
  async authorUpdateAuthorStatus(query) {
    return await Axios.post('/author/updateAuthorStatus', query)
  },
  /**
   * 店铺权限树查询
   */
  async storePermissionTree(query) {
    return await Axios.post('/store/permission/tree', query)
  },
  /**
   * 新增店铺权限
   */
  async storePermissionAdd(query) {
    return await Axios.post('/store/permission/add', query)
  },
  /**
   * 修改编辑店铺权限
   */
  async storePermissionUpdate(query) {
    return await Axios.post('/store/permission/update', query)
  },
  /**
   * 删除店铺权限
   */
  async storePermissionDelete(query) {
    return await Axios.post('/store/permission/delete', query)
  },
  /**
   * 获取所有店铺角色
   */
  async rolePermissionGetStoreRoleList(query) {
    return await Axios.post('/store/rolePermission/getStoreRoleList', query)
  },
  /**
   * 根据角色id查询角色权限
   */
  async storeRolePermissionGetRolePermissionByRoleId(query) {
    return await Axios.post(
      '/store/rolePermission/getRolePermissionByRoleId',
      query
    )
  },
  /**
   * 保存权限配置-4个角色
   */
  async storeRolePermissionEditRolePermission(query) {
    return await Axios.post('/store/rolePermission/editRolePermission', query)
  },
  /**
   * 商户申请列表
   */
  async merchantApplyList(query) {
    return await Axios.post('/merchant/getMerchantApplyList', query)
  },
  /**
   * 商户管理列表
   */
  async merchantList(query) {
    return await Axios.post('/merchant/getMerchantList', query)
  },
  /**
   * 平台审核商户
   */
  async platformReview(query) {
    return await Axios.post('/merchant/platformReview', query)
  },
  /**
   * 商户禁用启用
   */
  async updateMerchantStatus(query) {
    return await Axios.post('/merchant/updateMerchantStatus', query)
  },
  /**
   * 新增第三方授权
   */
  async boxStoreApplyAddThreeBoxStoreApply(query) {
    return await Axios.post('/boxStoreApply/addThreeBoxStoreApply', query)
  },
  /**
   * 审核打分页面
   */
  async boxStoreApplyQueryBoxStoreAnswer(query) {
    return await Axios.post('/boxStoreApply/queryBoxStoreAnswer', query)
  },
  /**
   * 申领订单信息
   */
  async boxStoreApplyQueryBoxStoreApplyDetail(query) {
    return await Axios.post('/boxStoreApply/queryBoxStoreApplyDetail', query)
  },
  /**
   * 店铺申领审核列表分页查询
   */
  async boxStoreApplyQueryBoxStoreApplyPage(query) {
    return await Axios.post('/boxStoreApply/queryBoxStoreApplyPage', query)
  },
  /**
   * 授权
   */
  async boxStoreApplyPassBoxStoreApply(query) {
    return await Axios.post('/boxStoreApply/passBoxStoreApply', query)
  },
  /**
   * 终止授权
   */
  async boxStoreApplyStopBoxStoreApply(query) {
    return await Axios.post('/boxStoreApply/stopBoxStoreApply', query)
  },
  /**
   * 未申领店铺下拉框
   */
  async boxStoreApplyNoApplyStoreList(query) {
    return await Axios.post('/boxStoreApply/noApplyStoreList', query)
  },
  /**
   * 查看编辑申领详情
   */
  async boxDramaApplyQueryBoxDramaApplyDetail(query) {
    return await Axios.post('/boxDramaApply/queryBoxDramaApplyDetail', query)
  },
  /**
   * 审核申领任务
   */
  async boxDramaApplyAuditBoxStoreApply(query) {
    return await Axios.post('/boxStoreApply/auditBoxStoreApply', query)
  },
  /**
   * 发货管理列表分页查询
   */
  async queryOrderLogisticsPage(query) {
    return await Axios.post('/orderLogistics/queryOrderLogisticsPage', query)
  },
  /**
   * 发货
   */
  async deliverGoods(query) {
    return await Axios.post('/orderLogistics/deliverGoods', query)
  },
  /**
   * 修改发货
   */
  async updateLogistics(query) {
    return await Axios.post('/orderLogistics/updateLogistics', query)
  },
  /**
   * 物流订单详情
   */
  async queryOrderLogisticsDetail(query) {
    return await Axios.post('/orderLogistics/queryOrderLogisticsDetail', query)
  },
  /**
   * 查询没有绑定申领的商品
   */
  async queryNoApplyProduct(query) {
    return await Axios.post('/boxDramaApply/queryNoApplyProduct', query)
  },
  /**
   * 校验申领任务是否可以删除 true:可以删除 false:不可以删除
   */
  async checkBoxDramaQuestionCanDelete(query) {
    return await Axios.post(
      '/boxdramaquestion/checkBoxDramaQuestionCanDelete',
      query
    )
  },
  /**
   * 回合音频-自动播放
   */
  async roundAudioAutoPlay(query) {
    return await Axios.post(
      '/murderMysteryRoundAudio/roundAudioAutoPlay',
      query
    )
  },
  /**
   * 剧本未被使用的线索
   */
  async queryUnusedClue(query) {
    return await Axios.post('/murderMysteryClue/queryUnusedClue', query)
  },
  /**
   * 剧本未被使用的线索
   */
  async getApplyProductList(query) {
    return await Axios.post('/product/getApplyProductList', query)
  },
  /**
   * 剧本未被使用的线索
   */
  async biStoreUvBiBoxIncomeData(query) {
    return await Axios.post('/onlineDrama/getOnlineGameBIInformation', query)
  },
  /**
   * 新增密码解谜信息
   */
  async addPasswordDecryption(query) {
    return await Axios.post('/roundPasswordDecryption/addPasswordDecryption', query)
  },
  /**
   * 更新密码解谜信息
   */
  async updatePasswordDecryption(query) {
    return await Axios.post('/roundPasswordDecryption/updatePasswordDecryption', query)
  },
  /**
   * 回合ID获取密码解谜信息
   */
  async getPasswordDecryptionByRoundId(query) {
    return await Axios.post('/roundPasswordDecryption/getPasswordDecryptionByRoundId', query)
  },
  /**
   * M端订单导出
   */
  async orderExport(query) {
    return await Axios.post('/order/export', query)
  },
  /**
   * -管理--组局列表
   */
  async queryGatheringListPage(query) {
    return await Axios.post('/gathering/queryGatheringListPage', query)
  },
  /**
   * 提交高德
   */
  async commitGaoDe(query) {
    return await Axios.post('/store/commitGaoDe', query)
  },
  /**
   * 展会列表
   */
  async exhibitionList(query) {
    return await Axios.post('/exhibition/exhibitionList', query)
  },
  /**
   * 展会剧本列表
   */
  async exhibitionDramaPage(query) {
    return await Axios.post('/exhibition/exhibitionDramaPage', query)
  },
  /**
   * 新增展会剧本
   */
  async saveExhibitionDrama(query) {
    return await Axios.post('/exhibition/saveExhibitionDrama', query)
  },
  /**
   * 展会主办方查询
   */
  async exhibitionOrganizerMap(query) {
    return await Axios.post('/exhibition/exhibitionOrganizerMap', query)
  },
  /**
   * 删除展会剧本
   */
  async deleteExhibitionDrama(query) {
    return await Axios.post('/exhibition/deleteExhibitionDrama', query)
  },
  /**
   * 排序展会剧本
   */
  async sortExhibitionDrama(query) {
    return await Axios.post('/exhibition/sortExhibitionDrama', query)
  },
  /**
   * 展会详情
   */
  async exhibitionDetail(query) {
    return await Axios.post('/exhibition/exhibitionDetail', query)
  },
  /**
   * 展会轮播图列表
   */
  async exhibitionRotationChartList(query) {
    return await Axios.post('/exhibition/exhibitionRotationChartList', query)
  },
  /**
   * 更新展会轮播图
   */
  async updateExhibitionRotationChart(query) {
    return await Axios.post('/exhibition/updateExhibitionRotationChart', query)
  },
  /**
   * 更新展会
   */
  async updateExhibition(query) {
    return await Axios.post('/exhibition/updateExhibition', query)
  },
  /**
   * 更新展会剧本
   */
  async updateExhibitionDrama(query) {
    return await Axios.post('/exhibition/updateExhibitionDrama', query)
  },
  /**
    * 
    * 展会剧本字典查询
    */
  exhibitionTypeList(data) {
    return Axios.post("/exhibition/exhibitionTypeList", data);
  },
  /**
    * 
    * 店家--解散组局,所有人退款
    */
  cancelGathering(data) {
    return Axios.post("/gathering/cancelGathering", data);
  },
  /**
    * 
    * 分页查询活动信息
    */
  activityPageList(data) {
    return Axios.post("/backend/activity/pageList", data);
  },
  /**
    * 
    * 编辑活动信息
    */
  activityEdit(data) {
    return Axios.post("/backend/activity/edit", data);
  },
  /**
    * 
    * 置顶活动信息
    */
  dynamicTopEdit(data) {
    return Axios.post("/backend/activity/dynamicTopEdit", data);
  },
  /**
    * 
    * 批量编辑活动排序值
    */
  batchEditSort(data) {
    return Axios.post("/backend/activity/batchEditSort", data);
  },
  /**
    * 
    * 分页查询前端展示的剧圈动态
    */
  showDynamicList(data) {
    return Axios.post("/backend/activity/showDynamicList", data);
  },
  /**
    * 
    * 获取官方咨询动态详情
    */
  activityDetail(data) {
    return Axios.post("/activity/detail", data);
  },
  /**
    * 
    * 热本推荐剧本
    */
  popularList(data) {
    return Axios.post("/v2/drama/popularList", data);
  },
  /**
    * 
    * 聚合计算分数剧本库
    */
  editPopularPosition(data) {
    return Axios.post("/backend/drama/editPopularPosition", data);
  },
  /**
    * 
    * 过滤热门推荐位剧本
    */
  aggregationDramaPage(data) {
    return Axios.post("/backend/drama/aggregationDramaPage", data);
  },
  /**
    * 
    * 查询相关组局信息
    */
  gatherJoinSearchPage(data) {
    return Axios.post("/backend/gathering/joinSearchPage", data);
  },
  /**
    * 
    * 相关店铺信息分页查询
    */
  storeJoinSearchPage(data) {
    return Axios.post("/backend/store/joinSearchPage", data);
  },
  /**
    * 
    * 获取下架热门推荐剧本列表
    */
  removeShelvesDramaPage(data) {
    return Axios.post("/backend/drama/removeShelvesDramaPage", data);
  },
  /**
    * 
    * 获取排行榜剧本列表
    */
  aggregationRankPage(data) {
    return Axios.post("/backend/drama/aggregationRankPage", data);
  },
  /**
    * 
    * 编辑剧本业务基础数值
    */
  editServiceScore(data) {
    return Axios.post("/backend/drama/editServiceScore", data);
  },
  /**
    * 
    * 门店评价列表
    */
  evaluatePageList(data) {
    return Axios.post("/backend/store/evaluate/pageList", data);
  },
  /**
    * 
    * 编辑门店评价信息
    */
  evaluateEdit(data) {
    return Axios.post("/backend/store/evaluate/edit", data);
  },
  /**
    * 
    * 平台操作：商户数据更新并提交
    */
  merchantBaseUpdateAndCommit(data) {
    return Axios.post("/merchant/merchantBaseUpdateAndCommit", data);
  },
  /**
    * 
    * 内容-动态管理（分页）
    */
  queryManageDynamicPage(data) {
    return Axios.post("/userDynamicCircle/queryManageDynamicPage", data);
  },
  /**
    * 
    * 内容-动态管理-审核状态修改
    */
  updateDynamicApplyStatus(data) {
    return Axios.post("/userDynamicCircle/updateDynamicApplyStatus", data);
  },
  /**
    * 
    * 查询svg图标列表
    */
  queryIconSvg(data) {
    return Axios.post("/iconSvg/queryPage", data);
  },
  /**
    * 
    * 新增svg图标
    */
  saveNewIconSvg(data) {
    return Axios.post("/iconSvg/save", data);
  },
  /**
    * 
    * 修改svg图标
    */
  updateIconSvg(data) {
    return Axios.post("/iconSvg/update", data);
  },
  /**
    * 删除svg图标
    */
  deleteIconSvg(data) {
    return Axios.post("/iconSvg/delete", data);
  },
  /**
   * LP-轮播图列表
   */
  lpBannerList(data) {
    return Axios.post("/lpBanner/list", data);
  },
  /**
   * 新增LP-轮播图
   */
  lpBannerAdd(data) {
    return Axios.post("/lpBanner/add", data);
  },
  /**
   * 删除LP-轮播图
   */
  lpBannerDelete(data) {
    return Axios.post("/lpBanner/delete", data);
  },
  /**
   * 更新LP-轮播图
   */
  lpBannerUpdate(data) {
    return Axios.post("/lpBanner/update", data);
  },
  /**
   * LP-客服
   */
  lpCustomerList(data) {
    return Axios.post("/lpCustomer/list", data);
  },
  /**
   * LP-客服
   */
  lpCustomerUpdate(data) {
    return Axios.post("/lpCustomer/update", data);
  },
  /**
   * LP-会员套餐列表
   */
  lpMembershipPackageList(data) {
    return Axios.post("/lpMembershipPackage/list", data);
  },
  /**
   * LP-会员套餐新增
   */
  lpMembershipPackageAdd(data) {
    return Axios.post("/lpMembershipPackage/add", data);
  },
  /**
   * LP-会员套餐更新
   */
  lpMembershipPackageUpdate(data) {
    return Axios.post("/lpMembershipPackage/update", data);
  },
  /**
   * LP-用户列表
   */
  LpUserMessageList(data) {
    return Axios.post("/LpUserMessage/list", data);
  },
  /**
   * LP-用户查询
   */
  queryLpUserMessage(data) {
    return Axios.post("/LpUserMessage/queryLpUserMessage", data);
  },
  /**
   * LP-用户保存
   */
  lpUserMessageSave(data) {
    return Axios.post("/LpUserMessage/save", data);
  },
  /**
   * LP-活动列表
   */
  LpActivityList(data) {
    return Axios.post("/LpActivity/list", data);
  },
  /**
   * 新增LP-活动
   */
  addLpActivity(data) {
    return Axios.post("/LpActivity/add", data);
  },
  /**
   * 修改LP-活动
   */
  updateLpActivity(data) {
    return Axios.post("/LpActivity/update", data);
  },
  /**
   * LP-活动详情
   */
  detailLpActivity(data) {
    return Axios.post("/LpActivity/detail", data);
  },
  /**
   * 修改LP-活动状态
   */
  updateLpActivityStatus(data) {
    return Axios.post("/LpActivity/status", data);
  },
  /**
   * LP-活动会员列表
   */
  LpActivityUserList(data) {
    return Axios.post("/LpActivityUser/list", data);
  },
  /**
   * LP-活动会员删除
   */
  deleteLpActivityUser(data) {
    return Axios.post("/LpActivityUser/delete", data);
  },
  /**
   * LP-赋予用户会员
   */
  LpUserMessageSubscribe(data) {
    return Axios.post("/LpUserMessage/subscribe", data);
  },
  /**
   * 新增LP-人员信息备注
   */
  LpUserMessagePsAdd(data) {
    return Axios.post("/LpUserMessagePs/add", data);
  },
  /**
   * LP-人员信息备注列表
   */
  LpUserMessagePsList(data) {
    return Axios.post("/LpUserMessagePs/list", data);
  },
  /**
   * LP-获取套餐详情
   */
  LpGetPackageDetail(data) {
    return Axios.post("/lpMembershipPackage/getPackageDetail", data);
  },
  /**
   * LP-保存LP套餐选项
   */
  LpSavePackageItem(data) {
    return Axios.post("/lpMembershipPackage/savePackageItem", data);
  },
  /**
   * LP-LP-活动会员删除
   */
  LpActivityUserDelete(data) {
    return Axios.post("/LpUserMessage/deleteLp", data);
  },
  /**
   * LP-LP-活动会员删除
   */
  LpActivityUserDelete(data) {
    return Axios.post("/LpUserMessage/deleteLp", data);
  },
  /**
   * LP-会员资料审核列表
   */
  lpUserMatchAuditList(data) {
    return Axios.post("/lpUserMatchAudit/list", data);
  },
  /**
   * LP-对该会员资料审核
   */
  lpUserMatchAuditAudit(data) {
    return Axios.post("/lpUserMatchAudit/audit", data);
  },
}

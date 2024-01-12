<!--
/**
* @author: TurboC
* @date: 2020-12-17 08:31:08
* @description: 智能管理表单模板文件
* 工作流流程初始化配置说明：
* 1、默认配置：query: {===》》》需要在配置页面配置全量流程相关信息
    sf_bpmStatus: 参数值为表单配置里全局属性下的 流程环节名称key（bpmStatus）的值；
    sf_defId：工作流定义Id；
    sf_instanceId：工作流实例Id，为主要参数，【启动（草稿状态）、处理、预览环节需要】；
    sf_taskId：工作流流程任务Id，【处理、预览环节需要】；
    说明：sf_defId、sf_instanceId、sf_taskId 三者传其中一个即可
  }
* 2、支持简单化方式配置：query：{===》》可只需开启全局配置开关引入工作流，和开启展示流程处理按钮的按钮组开关即可；
    sf_bpmFlowKey：流程图流程Key-flowKey;
    sf_bpmFlowStatus：流程环节key（启动-startBpm，处理-dealBpm，预览-detailBpm）；
    sf_instanceId：流程实例Id, 【处理、预览环节需要】
    defaultFlow:true  此参数必传，且一定为true否则不能生效
  }
  上述为支持query取值，也支持通过数据绑定传值接收参数为：bpmParam： {参数}
*/
-->
<template>
  <div>
    <asp-smart-form
      ref="aspSmartForm"
      v-model="model"
      :form-json="formJson"
      :old-model="oldModel"
      :status="status"
      :before-http-pro="beforeHttpPro"
      :after-http-pro="afterHttpPro"
      :before-loading-http-pro="beforeLoadingHttpPro"
      :after-loading-http-pro="afterLoadingHttpPro"
      :after-bpm-do-button-action-pro="afterBpmDoButtonActionPro"
      :before-bpm-http-pro="beforeBpmHttpPro"
      :after-bpm-http-pro="afterBpmHttpPro"
      :comp-data-change-pro="compDataChangePro"
      :comp-data-active-change-pro="compDataActiveChangePro"
      :before-button-pro="beforeButtonPro"
      :after-button-pro="afterButtonPro"
      :before-auth-pro="beforeAuthPro"
      :before-router-pro="beforeRouterPro"
      :before-column-validate-pro="beforeColumnValidatePro"
      :before-draw-table-row-pro="beforeDrawTableRowPro"
      :dialog-config="dialogConfig"
      :asp-node-page-this="pageThis"
      :notify-event="notifyEvent"
      @on="onbind"
    >
    </asp-smart-form>
    <flow
      :curPageThis="pageThis"
      v-if="flowDialog"
      :flowInfo="flowInfo"
      :formModel="formModel"
      :flowTitle="flowTitle"
      :flowDialogFlag.sync="flowDialog"
      :echoForm="echoForm"
      :flowAlias="alias"
      :key="new Date().getTime()"
    />
  </div>
</template>

<script>
import { throttle } from '@/utils'
import Flow from '@/views/secp/components/flow/commonFlow'
export default {
  name: '@@@',
  components: {
    Flow
  },
  data () {
    return {
      pageThis: this, // 修复升级后原型链指向异常问题
      formJson: null,
      model: {},
      oldModel: {}, // 对比详情才需要此属性(测试代码，非模板代码)
      dialogConfig: {
        form: {
          _this: this, // 获取当前弹窗所在的表单页面的this对象；使用方式this._this
          name: 'form',
          mounted: async () => { // 弹窗流程启动初始化，bpmParam：{bpmStatus,defId,instanceId,taskId}；支持简单化配置bpmParam：{sf_bpmFlowStatus,sf_bpmFlowKey,defId,instanceId,taskId,defaultFlow:true}
            const modelHtml = JSON.parse(JSON.stringify(require('./index.json'))) // 修改模板名称
            const modelData = modelHtml.model
            const oldModel = {}
            return {
              modelHtml, modelData, oldModel, status: 'create'
            }
          },
          setup (data) { }, // 数据安装后执行函数
          onbind ({ item, parent, type, index, model, row, fileData, subFormSelectData, jsonName }) { },
          beforeHttpPro ({ item, parent, index, model }, httpObject, callback) { callback(httpObject) },
          afterHttpPro ({ item, parent, index, model }, responseBody, callback) { callback(responseBody) },
          beforeLoadingHttpPro ({ item, parent, index, model }, httpObject, callback) { callback(httpObject) },
          afterLoadingHttpPro ({ item, parent, index, model }, responseBody, callback) { callback(responseBody) },
          afterBpmDoButtonActionPro ({ btItem, bpmModel, msgData }, callback) { const isContinue = true; callback(isContinue, btItem, bpmModel) },
          beforeBpmHttpPro ({ item, parent, index, model }, httpObject, callback) { callback(httpObject) },
          afterBpmHttpPro ({ item, parent, index, model }, responseBody, callback) { callback(responseBody) },
          compDataChangePro ({ item, parent, index, isTable, model, oldValue, newValue, changeDirtect, changeValue }, callback) { callback(true) },
          compDataActiveChangePro ({ item, parent, index, isTable, model, oldValue, newValue, changeDirtect, changeValue }, callback) { callback(true) },
          beforeButtonPro ({ item, parent, index, isTable, model, rowData }, callback) { const isContinue = true; callback(isContinue, rowData) },
          afterButtonPro ({ item, parent, index, isTable, model, rowData }, callback) { const isContinue = true; callback(isContinue, rowData) },
          beforeAuthPro ({ item, parent, index, isTable, model, rowData }, callback) { const isHasAuth = true; const isContinue = true; callback(isHasAuth, isContinue) },
          beforeRouterPro ({ item, row, routerObj, model, next }) { next(routerObj) },
          beforeColumnValidatePro ({ tableItem, model, value, type }, callback) { const isContinueValidate = true; const isValidateFail = false; callback(isContinueValidate, isValidateFail, undefined) },
          beforeDrawTableRowPro ({ item, model, row, rowClassName }, callback) { callback(rowClassName) },
          notifyEvent (data, event, callback) { callback(event) },
          beforeDialogClose (data) { data.next() },
          afterDialogClose (data) { }
        },
        table: {
          _this: this, // 获取当前弹窗所在的表单页面的this对象；使用方式this._this
          name: 'good',
          mounted: async (data) => {
            const tableJson = JSON.parse(JSON.stringify(require('./index.json'))) // 修改模板名称
            const model = tableJson.model
            return {
              tableJson, model, status: 'create'
            }
          },
          setup (data) { }, // 数据安装后执行函数
          destroyed (item) { },
          onbind (item) { },
          beforeHttp ({ tableItem, params, httpMethod, row }) { },
          afterHttp ({ tableItem, responseBody }) { },
          beforeButton ({ item, rowObj, next }) { next(item, rowObj) },
          beforeRouter ({ item, row, routerObj, next }) { next(routerObj) },
          beforeTableRender ({ tableName, tableData, columnItem, scope }, callBack) { },
          beforeTableRowRender ({ item, tableData, row, rowClassName }) { return rowClassName },
          beforeClickTableCell ({ item, row, tableData }) { },
          sizeChange ({ tableItem, pageSize, next }) { next(true) },
          currentChange ({ tableItem, currentPage, next }) { next(true) },
          beforeDialogClose (data) { data.next() },
          afterDialogClose (data) { }
        }
      },
      status: 'create',
      instanceId: '',
      sf_bpmStatus: '',
      flowKey: '',
      taskId: '',
      flowDialog: false,
      // 审批流程接口返回的信息
      flowInfo: {},
      // 弹窗标题
      flowTitle: '处理任务',
      // 回填审批模板数据
      echoForm: {}
    }
  },
  computed: {
    formModel () {
      const model = this.deepCopy(this.model)
      delete model.tableFlow
      return model
    }
  },
  watch: {},
  async mounted () {
    this.formJson = JSON.parse(JSON.stringify(require('./index.json')))
    this.model = this.formJson.model
    this.getUrlParams()
    this.initTask()
    this.saveDraftThrottleFn = throttle(this.saveDraft, 3000)
    if (this.status === 'create') {
      this.$refs.aspSmartForm.asp_setHidden('flowTable', true)
    }
  },
  methods: {
    // 获取url参数
    getUrlParams () {
      const { instanceId, taskId, status, flowKey, sf_bpmStatus } = this.$route.query
      this.status = status || this.status
      this.instanceId = instanceId || ''
      this.taskId = taskId || ''
      this.flowKey = flowKey || ''
      this.sf_bpmStatus = sf_bpmStatus || ''
    },

    // 初始化任务流程
    initTask() {
      if (this.instanceId && this.taskId) {
        this.getTaskData()
        return
      }
      if (this.sf_bpmStatus && this.sf_bpmStatus.split('_')[0] === 'startBpm') {
        // 获取流程初始信息
        this.getTaskInitData()
      }
    },

    // 获取流程信息接口
    async getTaskData () {
      const res = await this.$aspHttps.asp_Post('/web/c/pc/partner/v1/bpm/task/getTaskData', { instanceId: this.instanceId, taskId: this.taskId, readonly: false })
      if (res.status === '200') {
        // 接口成功之后处理按钮取消禁用
        this.$refs.aspSmartForm.asp_setHidden('handle', false)
        this.flowInfo = res.data
        this.defId = res.data.defId
        this.alias = this.flowInfo.buttonList[0].alias
      }
    },

    // 审批过程中获取流程信息
    getTaskInitData () {
      if (!this.flowKey && !this.instanceId) return // 无流程必要数据，无法启动流程
      this.$aspHttps.asp_Post('/web/c/pc/partner/v1/bpm/instance/getInstanceData', { flowKey: this.flowKey, readonly: false, instanceId: this.instanceId }).then((res) => {
        if (res.status === '200') {
          // 新增启动流程才展示保存按钮
          this.defId = res.data.defId
          this.flowInfo = res.data
          this.alias = this.flowInfo.buttonList[0].alias
        }
      })
    },

    // 打开办理弹窗
    async goHandle () {
      const submitFlag = await this.$refs.aspSmartForm.asp_validate()
      if (!submitFlag) {
        return
      }
      this.flowDialog = true
      this.echoForm = this.formModel
    },

    // 保存草稿
    async saveDraft () {
      try {
        const params = {
          defId: this.defId,
          formType: this.formType,
          flowKey: this.flowKey,
          data: this.model,
          instanceId: this.instanceId,
          action: 'draft'
        }
        const res = await this.$aspHttps.asp_Post('/web/c/pc/partner/v1/bpm/instance/doAction/draft', params)
        if (res && res.status === '200') {
          this.$message.success('保存成功！')
          setTimeout(() => {
            this.$router.back()
          }, 500)
        }
      } catch (e) { }
    },

    deepCopy(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    /**
     * 智能表单监听所有组件的交互事件操作：监听、捕捉事件响应
     * @param item 组件对象属性集（类型、组件Id，控件内元数属性），columnName每个组件单元的唯一码（组件单元Id）
     * @param parent 当组件是嵌套在子表单组件内时，是组件父组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param type 事件类型（click/blur/onblur等）
     * @param index 当组件是嵌套在子表单组件内时，，返回组件在子表单组件的行号
     * @param model 表单数据模型
     * @param row 当组件是嵌套在子表单组件内时，返回组件所在行的数据，否则返回undefined
     * @param fileData 当组件是上传附件时，返回附件数据，否则返回undefined
     * @param subFormSelectData 当组件子表单时，返回选中记录集，包括单选与多选
     * @param jsonName 模板模板文件名
    */
    onbind ({ item, parent, type, index, model, row, fileData, subFormSelectData, jsonName }) {
      switch (item.columnName) {
        case 'handle':
          this.goHandle()
          break
        case 'draft':
          this.saveDraftThrottleFn()
          break
        default:
      }
    },
    /**
     * 智能表单页面所有请求的前置回调操作
     * 例如：修改请求上行参数、请求方式、请求地址URL、或者请求条件不满足不给发送请求
     * @param item 组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param parent 当组件是嵌套在子表单组件内时，是组件父组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param index 当组件是嵌套在子表单组件内时，，返回组件在子表单组件的行号
     * @param model 表单数据模型
     * @param httpObject.httpUrl 请求地址URL
     * @param httpObject.httpMethod 请求方式，目前主要六种：'post+json', 'post+form', 'get'，'put+json'，'delete+json'，'patch+json'
     * @param httpObject.httpBody 请求上传数据, 数据包格式(字段格式不一致的需要自行转换)如下：
     *                                         {
     *                                             page：1， // 分页属性(当前页号)，数字类型 （不是分页接口，没有这个字段）
     *                                             rows: 10，// 分页属性(页大小)，数字类型 （不是分页接口，没有这个字段）
     *                                             .......   // 业务属性字段
     *                                          }
     * @param callback: 回调api，参数为httpObject
    */
    beforeHttpPro ({ item, parent, index, model }, httpObject, callback) {
      callback(httpObject) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /**
     * 智能表单页面所有请求的后置回调操作
     * 例如：修改请求上行参数、请求方式、请求地址URL、或者请求条件不满足不给发送请求
     * @param item 组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param parent 当组件是嵌套在子表单组件内时，是组件父组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param index 当组件是嵌套在子表单组件内时，，返回组件在子表单组件的行号
     * @param model 表单数据模型
     * @param responseBody 响应数据包,, 数据包格式(字段格式不一致的需要自行转换)如下：
     *                                           {
     *                                                status: "200", // 业务状态码，字符串类型，成功返回"200"，失败返回其它数据
     *                                                message: "",   // 业务提示语，字符串类型，给业务的提示语属性
     *                                                page：1，      // 分页属性(当前页号)，数字类型 （不是分页接口，没有这个字段）
     *                                                total: 53，    // 分页属性(总记录大小)，数字类型 （不是分页接口，没有这个字段）
     *                                                data: {}或者[] // 业务数据区，对象或数组类型，用于各业务逻辑处理
     *                                            }
     * @param callback: 回调api，参数为responseBody(可以是您定制修改后的responseBody)
     */
    afterHttpPro ({ item, parent, index, model }, responseBody, callback) {
      callback(responseBody) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /*
     * 智能表单页面预加载请求的前置回调操作
     * 例如：修改请求上行参数、请求方式、请求地址URL、或者请求条件不满足不给发送请求
     * @param item 组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param parent 当组件是嵌套在子表单组件内时，是组件父组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param index 当组件是嵌套在子表单组件内时，，返回组件在子表单组件的行号
     * @param model 表单数据模型
     * @param responseBody 响应数据包,, 数据包格式(字段格式不一致的需要自行转换)如下：
     *                                           {
     *                                                status: "200", // 业务状态码，字符串类型，成功返回"200"，失败返回其它数据
     *                                                message: "",   // 业务提示语，字符串类型，给业务的提示语属性
     *                                                page：1，      // 分页属性(当前页号)，数字类型 （不是分页接口，没有这个字段）
     *                                                total: 53，    // 分页属性(总记录大小)，数字类型 （不是分页接口，没有这个字段）
     *                                                data: {}或者[] // 业务数据区，对象或数组类型，用于各业务逻辑处理
     *                                            }
     * @param callback: 回调api，参数为responseBody(可以是您定制修改后的responseBody)
    */
    beforeLoadingHttpPro ({ item, parent, index, model }, httpObject, callback) {
      callback(httpObject) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /**
     * 智能表单页面预加载请求的后置回调操作
     * 例如：修改请求上行参数、请求方式、请求地址URL、或者请求条件不满足不给发送请求
     * @param item 组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param parent 当组件是嵌套在子表单组件内时，是组件父组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param index 当组件是嵌套在子表单组件内时，，返回组件在子表单组件的行号
     * @param model 表单数据模型
     * @param responseBody 响应数据包,, 数据包格式(字段格式不一致的需要自行转换)如下：
     *                                           {
     *                                                status: "200", // 业务状态码，字符串类型，成功返回"200"，失败返回其它数据
     *                                                message: "",   // 业务提示语，字符串类型，给业务的提示语属性
     *                                                page：1，      // 分页属性(当前页号)，数字类型 （不是分页接口，没有这个字段）
     *                                                total: 53，    // 分页属性(总记录大小)，数字类型 （不是分页接口，没有这个字段）
     *                                                data: {}或者[] // 业务数据区，对象或数组类型，用于各业务逻辑处理
     *                                            }
     * @param callback: 回调api，参数为responseBody(可以是您定制修改后的responseBody)
    */
    afterLoadingHttpPro ({ item, parent, index, model }, responseBody, callback) {
      callback(responseBody) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /**
     * 智能表单页面bpm所以非内置请求操作方法的二次回调操作，为项目侧提供个性化接口请求操作；
     * 例如：修改请求上行参数、请求方式、请求地址URL、或者请求条件不满足不给发送请求
     * @param btItem 组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param bpmModel 表单数据模型
     * @param msgData 当前操作模型数据
     * @param model 表单数据模型
     * @param callback: 回调api，true：是继续；btItem,bpmModel；按需要设置是否继续，默认为false
     * callback（isContinue, btItem, bpmModel, dialogForm）
     * isContinue：是否继续；true：是继续；默认是：false
     * btItem: 当前操作按钮信息（不一定是点击的按钮）；
     * bpmModel： 当前响应的表单数据（已经封装过了弹窗表单的数据）格式保持工作流弹窗审批提交参数格式；
     * dialogForm：需要二次封装的参数（工作流认定弹窗表单的数据），一般不需要，可不用传递；
     * const {extendOpinion} = bpmModel;const {dialogModelData} = btItem; 这两处均可获得弹窗表单的数据（基于当前表单页面的弹窗表单）
     */
    afterBpmDoButtonActionPro ({ btItem, bpmModel, msgData }, callback) {
      const isContinue = false
      callback(isContinue) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
      // callback(true, btItem, bpmModel) // 当为true时，参数
    },
    /**
     * 智能表单页面bpm所有请求的前置回调操作 --TODO--待改进-- add by yuxuan
     * 例如：修改请求上行参数、请求方式、请求地址URL、或者请求条件不满足不给发送请求
     * @param item 组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param parent 当组件是嵌套在子表单组件内时，是组件父组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param index 当组件是嵌套在子表单组件内时，，返回组件在子表单组件的行号
     * @param model 表单数据模型
     * @param httpObject 为当前操作按钮columnName信息
     * @param callback: 回调api，参数为httpObject（为初始化bpmParams） 主要提供是初始化的bpm对象可进行实时修改
     */
    beforeBpmHttpPro ({ item, parent, index, model }, httpObject, callback) {
      callback(httpObject) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /**
     * 智能表单页面bpm所有请求的后置回调操作 --TODO--待改进-- add by yuxuan
     * 例如：修改请求上行参数、请求方式、请求地址URL、或者请求条件不满足不给发送请求
     * @param item 组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param parent 当组件是嵌套在子表单组件内时，是组件父组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param index 当组件是嵌套在子表单组件内时，，返回组件在子表单组件的行号
     * @param model 表单数据模型
     * @param responseBody 响应数据包,, 数据包格式(字段格式不一致的需要自行转换)如下：
     *                                           {
     *                                                status: "200", // 业务状态码，字符串类型，成功返回"200"，失败返回其它数据
     *                                                message: "",   // 业务提示语，字符串类型，给业务的提示语属性
     *                                                page：1，      // 分页属性(当前页号)，数字类型 （不是分页接口，没有这个字段）
     *                                                total: 53，    // 分页属性(总记录大小)，数字类型 （不是分页接口，没有这个字段）
     *                                                data: {}或者[] // 业务数据区，对象或数组类型，用于各业务逻辑处理
     *                                            }
     * @param callback: 回调api，参数为responseBody(可以是您定制修改后的responseBody) , 辅助参数showMessage (boolean)是否展示接口响应信息，默认为true，可不传
     */
    afterBpmHttpPro ({ item, parent, index, model }, responseBody, callback) {
      callback(responseBody) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /**
     * 智能表单监听所有组件的值发生变化的回调响应
     * @param item 组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param parent 当组件是嵌套在子表单组件内时，是组件父组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param index 当组件是嵌套在子表单组件内时，，返回组件在子表单组件的行号
     * @param isTable 当组件是嵌套在子表单组件内时，返回true, 否则返回false
     * @param model 表单数据模型
     * @param oldValue: 组件老数据
     * @param newValue: 组件新数据
     * @param changeDirtect 1: 新增选项选中， 2：取消选项选中, 3: 改变组件值
     * @param changeValue: 组件变化的选项值(当组件是checkbox组件, 或者是支持多选的select组件，其它组件无此属性)
     * @param callback: 回调api
     * @param           callback回调api参数: isContinue，false: 撤回数据改变， true: 继续数据改变后继操作
     * 继续数据改变后继操作
    */
    compDataChangePro ({ item, parent, index, isTable, model, oldValue, newValue, changeDirtect, changeValue }, callback) {
      const isContinue = true
      callback(isContinue) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /**
     * 智能表单监听所有组件的值发生变化并且是由用户交互生成的回调响应
     * @param item 组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param parent 当组件是嵌套在子表单组件内时，是组件父组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param index 当组件是嵌套在子表单组件内时，，返回组件在子表单组件的行号
     * @param isTable 当组件是嵌套在子表单组件内时，返回true, 否则返回false
     * @param model 表单数据模型
     * @param oldValue: 组件老数据
     * @param newValue: 组件新数据
     * @param changeDirtect 1: 新增选项选中， 2：取消选项选中, 3: 改变组件值
     * @param changeValue: 组件变化的选项值(当组件是checkbox组件, 或者是支持多选的select组件，其它组件无此属性)
     * @param callback: 回调api
     * @param           callback回调api参数: isContinue，false: 撤回数据改变， true: 继续数据改变后继操作
     * 继续数据改变后继操作
    */
    compDataActiveChangePro ({ item, parent, index, isTable, model, oldValue, newValue, changeDirtect, changeValue }, callback) {
      const isContinue = true
      callback(isContinue) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /**
     * 智能表单监听所有按钮组件点击事件的前置回调响应
     * @param item 组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param parent 当组件是嵌套在子表单组件内时，是组件父组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param index 当组件是嵌套在子表单组件内时，，返回组件在子表单组件的行号
     * @param isTable 当组件是嵌套在子表单组件内时，返回true, 否则返回false
     * @param model 表单数据模型
     * @param rowData:  当组件是嵌套在子表单组件内时，返回按钮所在行的数据，否则返回undefined
     * @param callback: 回调api
     * @param           callback回调api参数: isContinue，false: 不继续后继操作， true: 继续后继操作
     * @param           callback回调api参数: rowData, 当组件是嵌套在子表单组件内时，传入按钮所在行的数据
    */
    beforeButtonPro ({ item, parent, index, isTable, model, rowData }, callback) {
      const isContinue = true
      callback(isContinue, rowData) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /**
     * 智能表单监听所有按钮组件点击事件的后置回调响应
     * @param item 组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param parent 当组件是嵌套在子表单组件内时，是组件父组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param index 当组件是嵌套在子表单组件内时，，返回组件在子表单组件的行号
     * @param isTable 当组件是嵌套在子表单组件内时，返回true, 否则返回false
     * @param model 表单数据模型
     * @param rowData:  当组件是嵌套在子表单组件内时，返回按钮所在行的数据，否则返回undefined
     * @param row:  当组件是嵌套在子表单组件内时，返回按钮所在行的数据，否则返回undefined
     * @param callback: 回调api
     * @param           callback回调api参数: isContinue，false: 不继续后继操作， true: 继续后继操作
     * @param           callback回调api参数: rowData, 当组件是嵌套在子表单组件内时，传入按钮所在行的数据
     * @param           callback回调api参数: row, 当组件是嵌套在子表单组件内时，传入按钮所在行的数据
    */
    afterButtonPro ({ item, parent, index, isTable, model, rowData }, callback) {
      const isContinue = true
      callback(isContinue, rowData) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /**
     * 智能表单监听所有组件权限事件的前置回调响应
     * @param item 组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param parent 当组件是嵌套在子表单组件内时，是组件父组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param index 当组件是嵌套在子表单组件内时，，返回组件在子表单组件的行号
     * @param isTable 当组件是嵌套在子表单组件内时，返回true, 否则返回false
     * @param model 表单数据模型
     * @param rowData:  当组件是嵌套在子表单组件内时，返回按钮所在行的数据，否则返回undefined
     * @param callback: 回调api
     * @param           callback回调api参数: isHasAuth，false: 个性化权限校验失败隐藏组件， true: 个性化权限校验成功显示组件
     * @param           callback回调api参数：isContinue, false: 不执行内部的权限校验逻辑，true: 继续执行内部的权限校验逻辑（只有isHasAuth返回true时，isContinue才起作用）
    */
    beforeAuthPro ({ item, parent, index, isTable, model, rowData }, callback) {
      const isHasAuth = true
      const isContinue = true
      callback(isHasAuth, isContinue) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /**
     * 智能表单页面路由跳转的前置操作
     * 注意：本函数有next()回调函数需要执行，调取next()函数才能继续后面的业务逻辑，否则操作将中止
     * @param item 响应组件对象属性集
     * @param row 当响应组件为表格操作列中的按钮时，此参数返回表格行数据，其它返回undefined
     * @param model 当前主表单模型
     * @param routerObj.routerType: 路由类型
     * @param routerObj.routerParamType 路由参数类型
     * @param routerObj.routerUrl 路由地址或名称
     * @param routerObj.routerParamValue 路由参数
     * @param next 回调函数
    */
    beforeRouterPro ({ item, row, routerObj, model, next }) {
      next(routerObj) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /**
     * 智能表单监听所有子表单列校验事件的前置回调响应
     * @param tableItem 组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param model 表单数据模型
     * @param value: 子表单发起校验单元格的内容值
     * @param type:  1：单列校验，2：组合校验
     * @param callback: 回调api
     * @param           callback回调api参数: isValidateFail，false: 列校验成功(不出现校验错误语)， true: 列校验不成功(出现校验错误语)
     * @param           callback回调api参数: isContinueValidate，false: 不继续组件内部的校验逻辑， true: 继续组件内部的校验逻辑
     * @param           callback回调api参数: failShowTip：列校验不成功的错误提示语
    */
    beforeColumnValidatePro ({ tableItem, model, value, type }, callback) {
      const isValidateFail = false
      const isContinueValidate = true
      callback(isContinueValidate, isValidateFail, undefined) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /**
     * 智能表单监听所有子表单行绘制的前置回调响应
     * @param item 组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param model 表单数据模型
     * @param row:  子表单组件当前绘制的行数据
     * @param rowClassName: 子表单组件当前行绘制class name
     * @param callback: 回调api
     * @param           callback回调api参数: rowClassName: 子表单组件当前行绘制class name
    */
    beforeDrawTableRowPro ({ item, model, row, rowClassName }, callback) {
      callback(rowClassName) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },

    /**
     * 智能表单监听所有事件通知
     * @param item 组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param event 事件对象，对象格式(字段格式不一致的需要自行转换)如下：
     *                                {
     *                                    status: true,             // 通知状态，Boolean
     *                                    type: "view_init",        // 事件类型
     *                                    message: 'init success',  // 事件信息
     *                                    .......                   // 事件其他属性
     *                                }
     * @param callback: 回调方法，参数为event
    */
    notifyEvent ({ item }, event, callback) {
      callback(event) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    }
  }
}
</script>
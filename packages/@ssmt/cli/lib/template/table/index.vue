<!--
/**
* @author: __TurboC__
* @date: __2020-12-17 08:25:15__
* @description: __智能管理表格模板文件__
*/
-->
<template>
  <div style="height: 100%;">
    <asp-smart-table
      ref="aspSmartTable"
      v-model="model"
      :table-json="tableJson"
      :size-change="sizeChange"
      :current-change="currentChange"
      :before-http="beforeHttp"
      :after-http="afterHttp"
      :before-button="beforeButton"
      :before-router="beforeRouter"
      :before-table-row-render="beforeTableRowRender"
      :before-table-render="beforeTableRender"
      :before-click-table-cell="beforeClickTableCell"
      :dialog-config="dialogConfig"
      :render-table="renderTable"
      @on="onbind"
    >
      <template
        slot="tableSlotname"
        slot-scope="scope"
      >
        <span
          style="color: red; background: #f2dede;"
          @click="console.log(scope.data)"
        >{scope.data.name}</span>
      </template>
    </asp-smart-table>
  </div>
</template>

<script>
export default {
  name: '@@@',
  data () {
    return {
      tableJson: null,
      model: {},
      testData: [],
      renderTable: {
        xxdy: (h, item, scope, tableData) => { // xxdy是列名columnName, 请根据实际情况修改
          return (<span style="color: red; background: #f2dede;">{scope.row[item.columnName]}</span>)
        }
      },
      dialogConfig: {
        form: {
          _this: this, // 获取当前弹窗所在的表格页面的this对象；使用方式this._this
          name: 'form',
          mounted: async () => {
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
          beforeBpmHttpPro ({ item, parent, index, model }, httpObject, callback) { callback(httpObject) },
          afterBpmHttpPro ({ item, parent, index, model }, responseBody, callback) { callback(responseBody) },
          compDataChangePro ({ item, parent, index, isTable, model, oldValue, newValue, changeDirtect, changeValue }, callback) { callback(true) },
          compDataActiveChangePro ({ item, parent, index, isTable, model, oldValue, newValue, changeDirtect, changeValue }, callback) { callback(true) },
          beforeButtonPro ({ item, parent, index, isTable, model, rowData }, callback) { callback(true, rowData) },
          afterButtonPro ({ item, parent, index, isTable, model, rowData }, callback) { callback(true, rowData) },
          beforeAuthPro ({ item, parent, index, isTable, model, rowData }, callback) { callback(true, true) },
          beforeRouterPro ({ item, row, routerObj, next }) { next(routerObj) },
          beforeColumnValidatePro ({ tableItem, model, value, type }, callback) { callback(true, false, undefined) },
          beforeDrawTableRowPro ({ item, model, row, rowClassName }, callback) { callback(rowClassName) },
          beforeDialogClose (data) { data.next() },
          afterDialogClose (data) { }
        },
        table: {
          _this: this, // 获取当前弹窗所在的表格页面的this对象；使用方式this._this
          name: 'table',
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
      }
    }
  },
  async mounted () {
    this.tableJson = JSON.parse(JSON.stringify(require('./index.json')))
    this.model = this.tableJson.model
  },
  methods: {
    /**
     * 智能表格监听所有组件的交互事件操作：监听、捕捉事件响应
     * @param item 响应组件对象属性集（类型、组件Id，控件内元数属性），columnName每个组件单元的唯一码（组件单元Id）
     * @param type 事件类型（click/blur/onblur等）
     * @param index 当是表格组件时，返回组件的行号
     * @param model 查询区域表单数据模型
     * @param tableModel 表格组件数据模型
     * @param row 表格行数据
     * @param subFormSelectData 表格多选数据（当出现列表复选时才有，包括跨页数据，整行数据）type为：multipleSelection,tableSelectAll
     * @param sortProps 排序属性
     * @returns {Promise<void>}
     */
    async onbind ({ item, type, index, model, tableModel, row, subFormSelectData, sortProps }) { },
    /**
     * 智能表格页面所有请求前的前置操作
     * 例如：修改请求参数、修改请求方式、修改请求URL、或者请求条件不满足不给发送请求
     * @param tableItem 组件对象属性集
     * @param params 请求参数body，数据格式如下(字段格式不一致的需要自行转换)如下:
     *                                         {
     *                                             page：1， // 分页属性(当前页号)，数字类型 （不是分页接口，没有这个字段）
     *                                             rows: 10，// 分页属性(页大小)，数字类型 （不是分页接口，没有这个字段）
     *                                             .......   // 业务属性字段
     *                                          }
     * @param httpMethod.url 请求地址URL
     * @param httpMethod.type 请求方式，目前主要六种：'post+json', 'post+form', 'get'，'put+json'，'delete+json'，'patch+json'
     * @param row 当组件为表格并且是表格操作列触发的请求，此参数返回表格行数据，其它返回undefined
     */
    beforeHttp ({ tableItem, params, httpMethod, row }) { },
    /**
     * 智能表格页面所有请求后置操作
     * 例如：请求后的数据包体需要做二次处理
     * @param tableItem 组件对象属性集
     * @param responseBody 响应数据body, 数据包格式(字段格式不一致的需要自行转换)如下：
     *                                              {
     *                                                status: "200", // 业务状态码，字符串类型，成功返回"200"，失败返回其它数据
     *                                                message: "",   // 业务提示语，字符串类型，给业务的提示语属性
     *                                                page：1，      // 分页属性(当前页号)，数字类型 （不是分页接口，没有这个字段）
     *                                                total: 53，    // 分页属性(总记录大小)，数字类型 （不是分页接口，没有这个字段）
     *                                                data: {}或者[] // 业务数据区，对象或数组类型，用于各业务逻辑处理
     *                                               }
     */
    afterHttp ({ tableItem, responseBody }) { },
    /**
     * 智能表格页面上的按钮的前置操作：包括不限于查询区域，表格顶部、表格操作列
     * 例如：对操作按钮进行处理的数据进行预处理，或者对按钮请求进行个性胡逻辑判断等
     * 注意：本函数有next()回调函数需要执行，调取next()函数才能继续后面的业务逻辑，否则操作将中止
     * @param item 组件对象属性集
     * @param rowObj 当组件为表格操作列中的按钮，此参数返回表格行数据，其它返回undefined
     * @param next 回调函数
     */
    beforeButton ({ item, rowObj, next }) {
      next(item, rowObj) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /**
     * 智能表格页面路由跳转的前置操作
     * 注意：本函数有next()回调函数需要执行，调取next()函数才能继续后面的业务逻辑，否则操作将中止
     * @param item 响应组件对象属性集
     * @param row 当响应组件为表格操作列中的按钮时，此参数返回表格行数据，其它返回undefined
     * @param routerObj.routerType: 路由类型
     * @param routerObj.routerParamType 路由参数类型
     * @param routerObj.routerUrl 路由地址或名称
     * @param routerObj.routerParamValue 路由参数
     * @param next 回调函数
     */
    beforeRouter ({ item, row, routerObj, next }) {
      next(routerObj) // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /**
     * 表格内容渲染之前的前置动作，
     * @param tableName 当前表格名称
     * @param tableData 表格当页的数据
     * @param columnItem 表格当前列的信息
     * @param scope 表格行信息包含属性 $index row等
     * @param callback 回调事件，用于改变指定列的显示内容
     * @param callback 参数说明如下
     * 参数一：指定修改的表格名称 tableName
     * 参数二：指定修改的列名 columnName
     * 参数三：指定索引集合，整列生效则传空数组[],指定某几行生效则传索引集合[1,3] indexList
     * 参数四：显示内容{ content: 可以是文本也可以是html代码片段}
     * 示例：callBack('aspSmartTable', 'name', [], { content: `【附加标题】<a @click="detial(${scope.row})">${scope.row.name}</a>` })
     */
    beforeTableRender ({ tableName, tableData, columnItem, scope }, callBack) { },
    /**
     * 智能表格监听所有行绘制的前置回调响应
     * @param item 组件对象属性集(类型、组件columnName，组件内元数属性)，columnName是每个组件的唯一标识码
     * @param tableData 表格数据模型
     * @param row:  表格组件当前绘制的行数据
     * @param rowClassName: 子表单组件当前行绘制class name
     * @param callback: 回调api
     * @param           callback回调api参数: rowClassName: 子表单组件当前行绘制class name
     */
    beforeTableRowRender ({ item, tableData, row, rowClassName }) {
      return rowClassName // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /**
     * 智能表格单元格点击的前置操作
     * @param item 响应组件对象属性集
     * @param row 此参数返回表格行数据
     * @param tableData: 表格数据模型
     */
    beforeClickTableCell ({ item, row, tableData }) { },
    /**
     * 表格页码大小发生变化时触发的前置事件
     * 注意：本函数有next()回调函数需要执行，调取next()函数才能继续后面的业务逻辑，否则操作将中止
     * @param tableItem 表格对象属性集
     * @param pageSize 表格页码大小
     * @param next 回调函数
     */
    sizeChange ({ tableItem, pageSize, next }) {
      next(true) // 允许继续运行传true, 否则传false  // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    },
    /**
     * 表格当前页发生变化时触发的前置事件，包括点翻页、上一页、下一页、刷新页、重置页
     * 注意：本函数有next()回调函数需要执行，调取next()函数才能继续后面的业务逻辑，否则操作将中止
     * @param tableItem 表格对象属性集
     * @param currentPage 当前页码号
     * @param next 回调函数
     */
    currentChange ({ tableItem, currentPage, next }) {
      next(true) // 允许继续运行传true, 否则传false // !!!注意!!!此行不许删除，否则无法继续！！！(该注释也不能删除)
    }
  }
}
</script>
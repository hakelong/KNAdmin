<style scoped>
.page-title {
  margin: 10px 0 25px 0;
  font-size: 24px;
  letter-spacing: -1px;
}

h1 {
  line-height: 1.1em;
  font-family: 'Open Sans', sans-serif;
  font-weight: 300;
}

.note {
  background-color: #f5f8fd;
  color: #010407;
  margin: 0 0 20px 0;
  padding: 15px 30px 15px 15px;
  border-left: 5px solid #8bb4e7;
  border-radius: 0 4px 4px 0;
}

.note p {
  margin: 0;
  font-size: 13px;
}

.portlet {
  border: 1px solid #e7ecf1;
  border-radius: 4px;
  padding: 5px;
}

.portlet .portlet-title {
  border-bottom: 1px solid #eef1f5;
  min-height: 48px;
  padding: 0;
}

.portlet .portlet-title .caption {
  font-size: 18px;
  line-height: 18px;
  float: left;
  padding: 10px 0;
  color: #e7505a;
  font-family: 'Open Sans', sans-serif;
}

.portlet-body {
  font-size: 14px;
  color: #000;
}

.breadClass {
  padding-bottom: 10px;
  border-bottom: 1px solid #e7ecf1;
}

.search-bar {
  padding: 15px 0;
  overflow: hidden;
}
.search-bar span {
  font-size: 12px;
  color: #495060;
}
.prosbox{
  max-height: 200px;
  overflow-y: auto;
}

.prochild:last-child{
  border-bottom: none;
}
.prochild{
  display:flex;padding:5px 0;border-bottom:1px solid gray;
}
.detail-content p{
  margin:15px 0;
  overflow: hidden;
}
.detail-content .left-title{
  display:block;
  width: 100px;
  float:left;
  text-align: right;
  margin-right:10px
}
.detail-content .right-content{
  overflow: hidden;
}
</style>
<template>
  <div class="menu">

    <!-- 页面标题部分 -->
    <h1 class="page-title"> 订单 </h1>

    <!-- 页面content部分 -->
    <div class="portlet">

      <!-- content的title部分 -->
      <div class="portlet-title">
        <div class="caption">
          <Icon type="ios-gear-outline"></Icon>  订单
        </div>
        <!-- <div align='right'>
          <Button icon='plus-round' type='primary' style="margin-top:5px;" @click="addProduct">添加产品</Button>
        </div> -->
      </div>
      <!-- 主体内容 -->
      <div class="portlet-body">
        <div class='search-bar'>
          <span>发货状态:</span>
          <Select v-model="table.shipStatus" style="width:120px;" @on-change='typeChange'>
              <Option :value="-1" >全部</Option>
              <Option :value="0" >未发货</Option>
              <Option :value="1" >已发货</Option>
          </Select>
          <span>订单状态:</span>
          <Select v-model="table.orderStatus" style="width:120px;" @on-change='typeChange'>
              <Option :value="-1" >全部</Option>
              <Option :value="0" >未确认 </Option>
              <Option :value="1" >已确认</Option>
              <Option :value="2" >已取消 </Option>
              <Option :value="3" >已完成 </Option>
              <Option :value="4" >已退货 </Option>
          </Select>
        </div>
        <!--表格部分-->
        <Table ref='mainTable' :loading='isLoading' :data="tableData1" :columns="tableColumns" stripe highlight-row border></Table>
        <!-- 分页部分 -->
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="total" :current="table.page" @on-change="onPageChanged" @on-page-size-change="onPageSizeChanged" show-total show-sizer :page-size='table.perPage'></Page>
          </div>
          <div style='float:left;line-height:32px;'>显示第
            <span v-text='from'></span> 到
            <span v-text='to'></span> 条记录</div>
        </div>
      </div>
    </div>
    <!-- 添加指导奖励 -->
  <Modal 
    title='发货' 
    v-model='modal1'
    @on-cancel='addCancel'
    >
    <Form ref='addForm' :label-width='100' :model='addReward.param' :rules='addReward.ruleValidate'>   
      <FormItem label='发货备注' prop='shipRemark'>
        <Input v-model='addReward.param.shipRemark	' style='width:200px'></Input>
      </FormItem>
    </Form>
    <div slot='footer'>
      <Button type='primary' @click='addSubmit' :loading='loading'>保存</Button>
      <Button @click='addCancel'>取消</Button>
    </div>
  </Modal>

  <Modal 
    title='详细' 
    v-model='modal2'
    @on-cancel='editCancel'
    >
    <Form ref='editForm' :label-width='100' :model='editReward' :rules='editReward.ruleValidate'>
      <div class='detail-content'>
        <p>
          <span class='left-title'>订单类型:</span>
          <span>{{editReward.orderType==='1'?'积分产品':'抽奖产品'}}</span>
        </p>

        <p>
          <span class='left-title'>订单序列号:</span>
          <span>{{editReward.orderSn}}</span>
        </p>

        <p>
          <span class='left-title'>用户昵称:</span>
          <span>{{editReward.nickName}}</span>
        </p>

        <p>
          <span class='left-title'>订单状态:</span>
          <span>{{editReward.orderStatus==='0'?'未确认' : editReward.orderStatus==='1'?'已确认':editReward.orderStatus==='2'?'已取消':editReward.orderStatus==='3'?'已完成':'已退货'}}</span>
        </p>

        <p>
          <span class='left-title'>付款状态:</span>
          <span>{{editReward.payStatus==='1'?'已付款':'未付款'}}</span>
        </p>

        <p>
          <span class='left-title'>发货状态:</span>
          <span>{{editReward.shipStatus==='1'?'已发货':'未发货'}}</span>
        </p>

        <p>
          <span class='left-title'>运单信息:</span>
          <span>{{editReward.shipRemark}}</span>
        </p>

        <p>
          <span class='left-title'>发货时间:</span>
          <span>{{editReward.deliveryTime}}</span>
        </p>

        <p>
          <span class='left-title'>积分:</span>
          <span>{{editReward.score}}</span>
        </p>

        <div>
          <span class='left-title'>收货人信息:</span>
          <p class='right-content'>
            <span>联系人:{{editReward.consignee.shippingContact}}</span><br>
            <span>收货地址:{{editReward.consignee.shippingAddress}}</span><br>
            <span>邮政编码:{{editReward.consignee.shippingZip}}</span><br>
            <span>手机号:{{editReward.consignee.shippingMobile}}</span>
          </p>
          
        </div>

        <FormItem label='订单产品' >
          <div class='prosbox'>
            <div v-for='item in editReward.orderProducts' class='prochild' >
              <template v-if="item.orderType==='1'">
                <div style='margin-right:5px'>
                  <img :src="item.scoreProductImage" style='display:block;width:80px;height:80px;'>
                </div>
                <div>
                  <span style='color:#000'>积分产品名称:{{item.scoreProductName}}</span><br>
                  <span>产品类型:{{item.orderType==='1'?'积分产品':'抽奖产品'}}</span> -
                  <span>积分:{{item.exchangeScore}}</span> -
                  <span>数量: {{item.number}}</span>
                </div>
              </template>
              <template v-else>
                <div>
                  <p style='color:#000'>抽奖产品名称:{{item.prizeName}}</p>
                  <span >产品类型:{{item.orderType==='1'?'积分产品':'抽奖产品'}}</span> -    
                  <span>数量: {{item.number}}</span>
                </div>
              </template>
              
              
            </div>
          </div>
        </FormItem>
      </div>
    </Form>
  </Modal>
  
  <Modal title='生成产品码' v-model='modal3' @on-cancel='modal3=false'  >
    <Form ref='createForm' :label-width='100' :model='create.param'>
      <FormItem label='生成数量' prop='createNumber'>
        <Input v-model='create.param.createNumber'></Input>
      </FormItem>
      <FormItem label='批次' prop='batch'>
        <Input v-model='create.param.batch'></Input>
      </FormItem>
    </Form>
    <div slot='footer'>
      <Button type='primary' @click='createSubmit'>保存</Button>
      <Button @click='modal3=false'>取消</Button>
    </div>
  </Modal>
  </div>
</template>
<script>
import util from '@/libs/util'
import upload from '@/views/baseComponents/upload'

export default {
  components: {
    myUpload:upload
  },
  data() {
    return {
      loading: false,
      modal1: false,
      modal2: false,
      modal3: false,
      editPicShow:false,
      editDefImgs:[],
      //编辑
      create:{
        param:{
          productId:'',
          createNumber:'',
          batch:''
        }
      },
      //编辑
      editReward: {
          "orderType": "",
          "orderSn": "",
          "nickName": "",
          "orderStatus": "",
          "payStatus": "",
          "shipStatus": "",
          "shipRemark": "",
          "deliveryTime": "",
          "score": "",
          "consignee": {
              "shippingContact": "",
              "shippingAddress": "",
              "shippingZip": "",
              "shippingMobile": ""
          },
          "orderProducts": [
              {
                  "orderProductId": "1",
                  "orderType": "1",
                  "scoreProductId": "",
                  "scoreProductName": "",
                  "scoreProductImage": "",
                  "exchangeScore": "",
                  "number": "",
                  "prizeId": "",
                  "prizeName": ""
              },
              {
                "orderProductId": "1",
                "orderType": "1",
                "scoreProductId": "",
                "scoreProductName": "",
                "scoreProductImage": "",
                "exchangeScore": "150",
                "number": "1",
                "prizeId": "0",
                "prizeName": ""
              },
              {
                "orderProductId": "1",
                "orderType": "1",
                "scoreProductId": "",
                "scoreProductName": "",
                "scoreProductImage": "",
                "exchangeScore": "150",
                "number": "1",
                "prizeId": "0",
                "prizeName": ""
              }
              
          ],
          "updatedAt": "",
          "createdAt": ""
      },
      restObj:{
          "orderType": "",
          "orderSn": "",
          "nickName": "",
          "orderStatus": "",
          "payStatus": "",
          "shipStatus": "",
          "shipRemark": "",
          "deliveryTime": "",
          "score": "",
          "consignee": {
              "shippingContact": "",
              "shippingAddress": "",
              "shippingZip": "",
              "shippingMobile": ""
          },
          "orderProducts": [
              {
                  "orderProductId": "",
                  "orderType": "",
                  "scoreProductId": "",
                  "scoreProductName": "",
                  "scoreProductImage": "",
                  "exchangeScore": "",
                  "number": "",
                  "prizeId": "",
                  "prizeName": ""
              },
          ],
          "updatedAt": "",
          "createdAt": ""
      },
      //添加指导奖励
      addReward: {
        param: {
          shipRemark:'',
          orderId:''	
        },
        ruleValidate: {
          
        }
      },
      //
      table: {
        page: 1,
        perPage: 10,
        shipStatus: -1,//发货状态 -1.全部 0.未发货 1.已发货
        orderStatus	:-1//订单状态 -1.全部 0.未确认 1:已确认 2:已取消 3:已完成 4：已退货
      },

      //
      isLoading: false,
      // 表格
      from: 1,
      to: 1,
      total: 1,
      tableData1: [],
      tableColumns: [
        {
          title: '产品类型',
          key: 'orderType',
          render: (h, params) => {
            let str = params.row.orderType === '1' ? '积分' : '实物'
            return h('div', {}, str)
          }
        },
        {
          title: '订单号',
          key: 'orderSn',
          width:'200'
        },
        {
          title: '用户昵称',
          key: 'nickName'
        },
        {
          title: '订单状态',
          key: 'orderStatus',
          render: (h, params) => {
            let status=params.row.orderStatus
            let str =  status=== '0' ? '未确认' : status==='1'?'已确认':status==='2'?'已取消':status==='3'?'已完成':'已退货'
            let color=status=== '3'?'green':status==='2'?'red':'#495060'
            return h('div', {
              style:{
                color
              }
            }, str)
          }
        },
        {
          title: '付款状态',
          key: 'payStatus',
          render: (h, params) => {
            let str = params.row.payStatus === '0' ? '未付款' : '已付款'
            let color=params.row.payStatus=== '0'?'red':'green'
            return h('div', {
              style:{
                color
              }
            }, str)
          }
        },
        {
          title: '发货状态',
          key: 'shipStatus',
          render: (h, params) => {
            let str = params.row.shipStatus === '0' ? '未发货' : '已发货'
            let color=params.row.shipStatus=== '0'?'red':'green'
            return h('div', {
               style:{
                color
              }
            }, str)
          }
        },
        {
          title: '积分',
          key: 'score',
        },
        {
          title: '订单生成时间时间',
          key: 'createdAt',
          width:'15%'
        },
        {
          title: '操作',
          width:'250',
          render: (h, params) => {
            let id = params.row.orderId
            let flag;
            let flag2;
            if(params.row.shipStatus==='0'&&(params.row.orderStatus==='0'||params.row.orderStatus==='1')){
              flag=false
            }else{
              flag=true
            }

            if(flag){
              flag2=true
            }else{
              flag2=params.row.orderStatus==='2'?true:false
            }
            
            return h('ButtonGroup', [
              h(
                'Button',
                {
                  props: {
                    type: 'info'
                  },
                  on: {
                    click: () => {
                      this.editReward=util.cloneObj(this.restObj)
                      this.getDetail(id)
                      this.modal2=true;
                    }
                  }
                },
                '详细'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    disabled:flag
                  },
                  on: {
                    click: () => {
                      this.$refs.addForm.resetFields();
                      this.addReward.param.orderId=id
                      this.modal1=true;
                    }
                  }
                },
                '发货'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    disabled:flag2
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '确认取消',
                        content: '<p>确认取消吗！？</p>',
                        loading: true,
                        onOk: () => {
                          this.del(id)
                        }
                      })
                    }
                  }
                },
                '取消'
              )
            ])
          }
        }
      ]
    }
  },
  computed: {
    contentSize() {
      return this.$store.state.contentSize
    }
  },
  watch: {
    contentSize(val) {
      this.changeTableColumnConfig()
    }
  },
  methods: {
    addpic(flag,urls){
      if(flag===1){
        if(urls[0]){
          this.addReward.param.image=urls[0]
        }else{
          this.addReward.param.image=''
        }
      }else if(flag===2){
        if(urls[0]){
          this.editReward.param.image=urls[0]
        }else{
          this.editReward.param.image=''
        }
      }
      
    },
    createSubmit() {
      let param =this.create.param
      let url = 'api/product_code/create'
      util.ajax.post(url, param).then(
        res => {
          if (res.data.state === 1) {
            this.$Message.success('成功')
            this.getData()
          } else {
            this.$Message.error('失败')
          }
        },
        err => {
          this.$Message.error('失败')
        }
      )
    },


    editCancel() {
      this.modal2 = false
    },
    editSubmit() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.editGuideReward(
            () => {
              this.loading = false
              this.modal2 = false
              this.editPicShow=false;
              this.getData()
            },
            () => {
              this.loading = false
            }
          )
        } else {
          this.$Message.error('表单验证有错误')
        }
      })
    },
    editGuideReward(callback, callback2) {
      let param = this.editReward.param
      let url = 'api/score_product/edit'
      util.ajax
        .post(url, param)
        .then(res => {
          if (res.data.state) {
            this.$Message.success('编辑成功！')
            if (callback) {
              callback()
            }
          } else {
            this.$Message.error('编辑失败！')
            callback2()
          }
        })
        .catch(err => {
          this.$Message.error('编辑失败！')
          callback2()
          console.log(err)
        })
    },
    del(id) {
      let param = { orderId: id }
      let url = 'api/order/cancel'
      util.ajax.post(url, param).then(
        res => {
          if (res.data.state === 1) {
            this.$Modal.remove()
            this.$Message.success('取消成功')
            this.getData()
          } else {
            this.$Modal.remove()
            this.$Message.error(res.data.error)
          }
        },
        err => {
          this.$Modal.remove()
          this.$Message.error('取消失败')
        }
      )
    },
    delivery(id) {
      let param = { orderId: id }
      let url = 'api/order/delivery'
      util.ajax.post(url, param).then(
        res => {
          if (res.data.state === 1) {
            this.$Modal.remove()
            this.$Message.success('取消成功')
            this.getData()
          } else {
            this.$Modal.remove()
            this.$Message.error(res.data.error)
          }
        },
        err => {
          this.$Modal.remove()
          this.$Message.error('取消失败')
        }
      )
    },
    typeChange() {
      this.getData()
    },
    addCancel() {
      this.modal1 = false
      this.$refs['addForm'].resetFields()
    },
    addSubmit() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.addGuideReward(
            () => {
              this.loading = false
              this.modal1 = false
              this.$refs['addForm'].resetFields()
              this.getData()
            },
            () => {
              this.loading = false
            }
          )
        } else {
          this.$Message.error('表单验证有错误')
        }
      })
    },

    addProduct() {
      this.modal1 = true
    },

    //添加奖励
    addGuideReward(callback, callback2) {
      let param = this.addReward.param
      let url = 'api/order/delivery'
      util.ajax
        .post(url, param)
        .then(res => {
          if (res.data.state) {
            this.$Message.success('发货成功！')
            if (callback) {
              callback()
            }
          } else {
            this.$Message.error('发货失败！')
            callback2()
          }
        })
        .catch(err => {
          this.$Message.error('发货失败！')
          callback2()
          console.log(err)
        })
    },

    changeTableColumnConfig() {
      let mainTable = this.$refs['mainTable']
      let config = util.changeTableColumnConfig(
        mainTable,
        this.tableColumnsConfig
      )
      this.tableColumns = config
    },

    getData() {
      this.isLoading = true
      let param = this.table
      util.ajax
        .post('api/order/index', param)
        .then(response => {
          var data = response.data

          this.tableData1 = data.items
          this.from = data.from
          this.to = data.to
          this.total = data.total
          this.isLoading = false
        })
        .catch(err => {
          this.tableData1 = []
          this.from = 0
          this.to = 0
          this.total = 0
          this.isLoading = false
        })
    },
    getDetail(id) {
      let param ={orderId:id}
      util.ajax
        .post('api/order/show', param)
        .then(response => {
          var data = response.data
          this.editReward=data;
        })
        .catch(err => {

        })
    },


    onPageSizeChanged(pageSize) {
      this.table.perPage = pageSize
      this.getData()
    },

    onPageChanged(num) {
      this.table.page = num
      this.getData()
    }
  },
  mounted() {
    // this.changeTableColumnConfig()
    this.getData()
  }
}
</script>
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
</style>
<template>
  <div class="menu">

    <!-- 页面标题部分 -->
    <h1 class="page-title"> 产品列表 </h1>

    <!-- 页面content部分 -->
    <div class="portlet">

      <!-- content的title部分 -->
      <div class="portlet-title">
        <div class="caption">
          <Icon type="ios-gear-outline"></Icon>  产品列表
        </div>
        <div align='right'>
          <Button icon='plus-round' type='primary' style="margin-top:5px;" @click="addProduct">添加产品</Button>
        </div>
      </div>
      <!-- 主体内容 -->
      <div class="portlet-body">
        <div class='search-bar'>
          <Select v-model="table.productType" style="width:120px;float:right" @on-change='typeChange'>
              <Option :value="0" >全部</Option>
              <Option :value="1" >佑元茶</Option>
              <Option :value="2" >绿麒麟</Option>
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
    title='添加产品' 
    v-model='modal1'
    @on-cancel='addCancel'
    >
    <Form ref='addForm' :label-width='100' :model='addReward.param' :rules='addReward.ruleValidate'>
      <FormItem label='产品类型' prop='productType'>
        <Select v-model="addReward.param.productType" style="width:120px" >
            <Option :value="1" >佑元茶</Option>
            <Option :value="2" >绿麒麟</Option>
        </Select>
      </FormItem>
      <FormItem label='产品名称' prop='productName'>
        <Input v-model='addReward.param.productName' style='width:200px'></Input>
      </FormItem>
      <FormItem label='扫码获得积分' prop='scanScore'>
        <Input v-model='addReward.param.scanScore' style='width:200px'></Input>
      </FormItem>
      <FormItem label='扫码获得金额' prop='scanMoney'>
        <Input v-model='addReward.param.scanMoney' style='width:200px'></Input>
      </FormItem>
      <FormItem label='活动页面url地址' prop='activityUrl'>
        <Input v-model='addReward.param.activityUrl' style='width:200px'></Input>
      </FormItem>
    </Form>
    <div slot='footer'>
      <Button type='primary' @click='addSubmit' :loading='loading'>保存</Button>
      <Button @click='addCancel'>取消</Button>
    </div>
  </Modal>

  <!-- 编辑 -->
  <Modal 
    title='编辑产品' 
    v-model='modal2'
    @on-cancel='editCancel'
    >
    <Form ref='editForm' :label-width='100' :model='editReward.param' :rules='editReward.ruleValidate'>
      <FormItem label='产品类型' prop='productType'>
        <Select v-model="editReward.param.productType" style="width:120px" >
            <Option value="1" >佑元茶</Option>
            <Option value="2" >绿麒麟</Option>
        </Select>
      </FormItem>
      <FormItem label='产品名称' prop='productName'>
        <Input v-model='editReward.param.productName' style='width:200px'></Input>
      </FormItem>
      <FormItem label='扫码获得积分' prop='scanScore'>
        <Input v-model='editReward.param.scanScore' style='width:200px'></Input>
      </FormItem>
      <FormItem label='扫码获得金额' prop='scanMoney'>
        <Input v-model='editReward.param.scanMoney' style='width:200px'></Input>
      </FormItem>
      <FormItem label='活动页面url地址' prop='activityUrl'>
        <Input v-model='editReward.param.activityUrl' style='width:200px'></Input>
      </FormItem>
    </Form>
    <div slot='footer'>
      <Button type='primary' @click='editSubmit' :loading='loading'>保存</Button>
      <Button @click='editCancel'>取消</Button>
    </div>
  </Modal>
  
  
  </div>
</template>
<script>
import util from '@/libs/util'

export default {
  components: {},
  data() {
    return {
      loading: false,
      modal1: false,
      modal2: false,
      modal3: false,
      create:{
        param:{
          productId:'',
          createNumber:'',
          batch:''
        }
      },
      //编辑
      editReward: {
        param: {
          productId:'',
          productType: '',
          productName: '',
          scanScore: '',
          scanMoney: '',
          activityUrl: ''
        },
        ruleValidate: {
          
        }
      },
      //添加指导奖励
      addReward: {
        param: {
          productType: '',
          productName: '',
          scanScore: '',
          scanMoney: '',
          activityUrl: ''
        },
        ruleValidate: {
          
        }
      },
      //
      table: {
        page: 1,
        perPage: 10,
        productType: 0
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
          title: '产品名称',
          key: 'productName'
        },
        {
          title: '类型',
          key: 'productType',
          render: (h, params) => {
            let str = params.row.productType === '1' ? '佑元茶' : '绿麒麟'
            return h('div', {}, str)
          }
        },
        {
          title: '扫码获得积分',
          key: 'scanScore'
        },
        {
          title: '扫码获得金额',
          key: 'scanMoney'
        },
        {
          title: '创建时间',
          key: 'createdAt'
        },
        {
          title: '操作',
          width:'250',
          render: (h, params) => {
            let id = params.row.productId
            return h('ButtonGroup', [
              h(
                'Button',
                {
                  props: {
                    type: 'info'
                  },
                  on: {
                    click: () => {
                      this.$refs.editForm.resetFields();
                      this.editReward.param=util.cloneObj(params.row)
                      this.modal2=true;
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary'
                  },
                  on: {
                    click: () => {
                      this.$router.push({name:'products_code',params:{id}})
                    }
                  }
                },
                '产品码列表'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error'
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '确认删除',
                        content: '<p>确认删除吗！？</p>',
                        loading: true,
                        onOk: () => {
                          this.del(id)
                        }
                      })
                    }
                  }
                },
                '删除'
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
      this.$refs['editForm'].resetFields()
    },
    editSubmit() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.loading = true
          this.editGuideReward(
            () => {
              this.loading = false
              this.modal2 = false
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
      let url = 'api/product/edit'
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
      let param = { productId: id }
      let url = 'api/product/del'
      util.ajax.post(url, param).then(
        res => {
          if (res.data.state === 1) {
            this.$Modal.remove()
            this.$Message.success('删除成功')
            this.getData()
          } else {
            this.$Modal.remove()
            this.$Message.error('删除失败')
          }
        },
        err => {
          this.$Modal.remove()
          this.$Message.error('删除失败')
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
      let url = 'api/product/add'
      util.ajax
        .post(url, param)
        .then(res => {
          if (res.data.state) {
            this.$Message.success('添加成功！')
            if (callback) {
              callback()
            }
          } else {
            this.$Message.error('添加失败！')
            callback2()
          }
        })
        .catch(err => {
          this.$Message.error('添加失败！')
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
        .post('api/product/index', param)
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
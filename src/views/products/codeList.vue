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
          <Button icon='plus-round' type='primary' style="margin-top:5px;" @click="createCode">生成产品码</Button>
        </div>
      </div>
      <!-- 主体内容 -->
      <div class="portlet-body">
        <div class='search-bar'>
          <div style='float:right'>
            <span>是否使用:</span>
            <Select v-model="table.isUsed" style="width:120px;" @on-change='typeChange'>
                <Option :value="-1" >全部</Option>
                <Option :value="0" >未使用</Option>
                <Option :value="1" >已使用</Option>
            </Select>
          </div>
          <div style='float:right'>
            <span>是否抽奖:</span>
            <Select v-model="table.isPlay" style="width:120px;" @on-change='typeChange'>
                <Option :value="-1" >全部</Option>
                <Option :value="0" >未抽奖</Option>
                <Option :value="1" >已抽奖</Option>
            </Select>
          </div>  
          <span>产品码</span>
          <Input v-model='table.code' style="width:120px;"></Input>
          <span>批次</span>
          <Input v-model='table.batch' style="width:120px;"></Input>
          <Button @click='getData'>搜索</Button>
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
        productId:'',
        isUsed:-1,
        isPlay:-1,
        code:'',
        batch:null
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
          title: '产品码',
          key: 'productCode'
        },
        {
          title: '是否使用',
          key: 'isUsed',
          render: (h, params) => {
            let str = params.row.isUsed === 0 ? '未使用' : '已使用'
            return h('div', {}, str)
          }
        },
        {
          title: '是否抽奖',
          key: 'isPlay',
          render: (h, params) => {
            let str = params.row.isPlay === 0 ? '未抽奖' : '已抽奖'
            return h('div', {}, str)
          }
        },
        {
          title: '用户昵称',
          key: 'scanNickName'
        },
        {
          title: '扫码时间',
          key: 'scaned_at'
        },
        {
          title: '创建时间',
          key: 'createdAt'
        },
        // {
        //   title: '操作',
        //   width:'150',
        //   render: (h, params) => {
        //     let id = params.row.productId
        //     return h('ButtonGroup', [
        //       h(
        //         'Button',
        //         {
        //           props: {
        //             type: 'success'
        //           },
        //           on: {
        //             click: () => {
                      
        //             }
        //           }
        //         },
        //         '产品码生成'
        //       ),         
        //     ])
        //   }
        // }
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
    createCode(){
      this.$refs.createForm.resetFields();
      this.create.param.productId=this.$route.params.id;
      this.modal3=true;
    },
    createSubmit() {
      let param =this.create.param
      let url = 'api/product_code/create'
      util.ajax.post(url, param).then(
        res => {
          if (res.data.state === 1) {
            this.$Message.success('成功')
            this.modal3=false
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
    typeChange() {
      this.getData()
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
        .post('api/product_code/index', param)
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
    this.table.productId=this.$route.params.id
    this.getData()
  }
}
</script>